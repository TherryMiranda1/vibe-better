import Stripe from "stripe";
import { formatDate } from "date-fns";
import { stripe } from "../stripe/stripeAdmin.service";
import { toDateTime } from "../../../utils";
import { Product, IProduct } from "@/models/product.model";
import { Price, IPrice } from "@/models/price.model";
import { Customer } from "@/models/customer.model";
import { Purchase } from "@/models/purchase.model";
import { Subscriber } from "@/models/subscriber.model";
import connectToDatabase from "@/lib/db";
import { userCreditsService } from "./userCredits.service";

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

const upsertProductRecord = async (product: Stripe.Product) => {
  await connectToDatabase();

  const productData: IProduct = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
    created_at: formatDate(product.created * 1000, "yyyy-MM-dd HH:mm:ss"),
    updated_at: formatDate(product.updated * 1000, "yyyy-MM-dd HH:mm:ss"),
  } as IProduct;

  try {
    // Using findOneAndUpdate with upsert:true for an atomic operation
    await Product.findOneAndUpdate({ id: product.id }, productData, {
      upsert: true,
      new: true,
    });
    console.info(`Product inserted/updated: ${product.id}`);
  } catch (error) {
    throw new Error(
      `Product insert/update failed: ${(error as Error).message}`
    );
  }
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  await connectToDatabase();

  const priceData: IPrice = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    created_at: formatDate(price.created * 1000, "yyyy-MM-dd HH:mm:ss"),
    updated_at: formatDate(new Date().getTime(), "yyyy-MM-dd HH:mm:ss"),
    metadata: price.metadata,
    description: price.nickname ?? null,
  } as IPrice;

  try {
    // First check if the associated product exists
    const productExists = await Product.findOne({ id: priceData.product_id });

    if (!productExists && retryCount < maxRetries) {
      // If product doesn't exist yet, wait and retry
      console.info(
        `Product not found, retry attempt ${retryCount + 1} for price ID: ${price.id}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await upsertPriceRecord(price, retryCount + 1, maxRetries);
    }

    if (!productExists && retryCount >= maxRetries) {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: Product with ID ${priceData.product_id} not found`
      );
    }

    // Using findOneAndUpdate with upsert:true for an atomic operation
    await Price.findOneAndUpdate({ id: price.id }, priceData, {
      upsert: true,
      new: true,
    });

    console.info(`Price inserted/updated: ${price.id}`);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("not found") &&
      retryCount < maxRetries
    ) {
      console.info(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await upsertPriceRecord(price, retryCount + 1, maxRetries);
    }
    throw new Error(`Price insert/update failed: ${(error as Error).message}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  await connectToDatabase();

  try {
    // First delete all prices associated with this product (to maintain referential integrity)
    await Price.deleteMany({ product_id: product.id });

    // Then delete the product
    const result = await Product.deleteOne({ id: product.id });

    if (result.deletedCount === 0) {
      throw new Error(`Product not found: ${product.id}`);
    }

    console.info(`Product deleted: ${product.id}`);
  } catch (error) {
    throw new Error(`Product deletion failed: ${(error as Error).message}`);
  }
};

const deletePriceRecord = async (price: Stripe.Price) => {
  await connectToDatabase();

  try {
    const result = await Price.deleteOne({ id: price.id });

    if (result.deletedCount === 0) {
      throw new Error(`Price not found: ${price.id}`);
    }

    console.info(`Price deleted: ${price.id}`);
  } catch (error) {
    throw new Error(`Price deletion failed: ${(error as Error).message}`);
  }
};

const upsertCustomerToMongoDB = async (uuid: string, customerId: string) => {
  await connectToDatabase();

  try {
    await Customer.findOneAndUpdate(
      { id: uuid },
      { id: uuid, stripe_customer_id: customerId },
      { upsert: true, new: true }
    );

    return customerId;
  } catch (error) {
    throw new Error(
      `MongoDB customer record creation failed: ${(error as Error).message}`
    );
  }
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { mongoDBUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  await connectToDatabase();

  try {
    // Check if the customer already exists in MongoDB
    const existingCustomer = await Customer.findOne({ id: uuid });

    // Retrieve the Stripe customer ID using the MongoDB customer ID, with email fallback
    let stripeCustomerId: string | undefined;
    if (existingCustomer?.stripe_customer_id) {
      const existingStripeCustomer = await stripe.customers.retrieve(
        existingCustomer.stripe_customer_id
      );
      stripeCustomerId = existingStripeCustomer.id;
    } else {
      // If Stripe ID is missing from MongoDB, try to retrieve Stripe customer ID by email
      const stripeCustomers = await stripe.customers.list({ email: email });
      stripeCustomerId =
        stripeCustomers.data.length > 0
          ? stripeCustomers.data[0].id
          : undefined;
    }

    // If still no stripeCustomerId, create a new customer in Stripe
    const stripeIdToInsert = stripeCustomerId
      ? stripeCustomerId
      : await createCustomerInStripe(uuid, email);
    if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

    if (existingCustomer && stripeCustomerId) {
      // If MongoDB has a record but doesn't match Stripe, update MongoDB record
      if (existingCustomer.stripe_customer_id !== stripeCustomerId) {
        await Customer.updateOne(
          { id: uuid },
          { stripe_customer_id: stripeCustomerId }
        );

        console.warn(
          `MongoDB customer record mismatched Stripe ID. MongoDB record updated.`
        );
      }
      // If MongoDB has a record and matches Stripe, return Stripe customer ID
      return stripeCustomerId;
    } else {
      console.warn(
        `MongoDB customer record was missing. A new record was created.`
      );

      // If MongoDB has no record, create a new record and return Stripe customer ID
      const upsertedStripeCustomer = await upsertCustomerToMongoDB(
        uuid,
        stripeIdToInsert
      );
      if (!upsertedStripeCustomer) {
        throw new Error("MongoDB customer record creation failed.");
      }
      return upsertedStripeCustomer;
    }
  } catch (error) {
    throw new Error(
      `Customer lookup/creation failed: ${(error as Error).message}`
    );
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  await connectToDatabase();

  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name && !phone && !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });

  try {
    // Update user in MongoDB with billing details
    await Customer.updateOne(
      { id: uuid },
      {
        $set: {
          billing_address: { ...address },
          payment_method: { ...payment_method[payment_method.type] },
        },
      }
    );
  } catch (error) {
    throw new Error(`Customer update failed: ${(error as Error).message}`);
  }
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  await connectToDatabase();

  try {
    // Get customer's UUID from mapping table
    const customerData = await Customer.findOne({
      stripe_customer_id: customerId,
    });

    if (!customerData) {
      throw new Error(
        `Customer lookup failed for Stripe customer: ${customerId}`
      );
    }

    const { id: uuid } = customerData;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    // Access subscription data safely with type assertions
    const subscriptionData = {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        (subscription as any).current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        (subscription as any).current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
    };

    // Define a schema for subscriptions if it doesn't exist yet
    const mongooseInstance = await connectToDatabase();

    if (!mongooseInstance.models.Subscription) {
      const SubscriptionSchema = new mongooseInstance.Schema({
        id: { type: String, required: true, unique: true },
        user_id: { type: String, required: true, index: true },
        metadata: { type: Map, of: String },
        status: { type: String, required: true },
        price_id: { type: String, required: true },
        quantity: { type: Number },
        cancel_at_period_end: { type: Boolean },
        cancel_at: { type: String, default: null },
        canceled_at: { type: String, default: null },
        current_period_start: { type: String, required: true },
        current_period_end: { type: String, required: true },
        created: { type: String, required: true },
        ended_at: { type: String, default: null },
        trial_start: { type: String, default: null },
        trial_end: { type: String, default: null },
      });

      mongooseInstance.model("Subscription", SubscriptionSchema);
    }

    const Subscription = mongooseInstance.models.Subscription;

    // Upsert the subscription data
    await Subscription.findOneAndUpdate(
      { id: subscription.id },
      subscriptionData,
      { upsert: true, new: true }
    );

    console.info(
      `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
    );

    // For a new subscription copy the billing details to the customer object.
    // NOTE: This is a costly operation and should happen at the very end.
    if (createAction && subscription.default_payment_method && uuid) {
      await copyBillingDetailsToCustomer(
        uuid,
        subscription.default_payment_method as Stripe.PaymentMethod
      );
    }
  } catch (error) {
    throw new Error(
      `Subscription management failed: ${(error as Error).message}`
    );
  }
};

// Function to register product purchases
const registerPurchase = async (
  userId: string,
  productId: string,
  priceId: string,
  paymentIntentId: string,
  sessionId: string
) => {
  await connectToDatabase();

  try {
    const purchaseData = {
      userId,
      productId,
      priceId,
      paymentIntentId,
      sessionId,
      status: "complete",
    };

    await Purchase.create(purchaseData);

    console.info(
      `Purchase registered for user [${userId}] - product [${productId}]`
    );

    return {
      success: true,
      message: "Purchase registered successfully",
    };
  } catch (error) {
    console.error("Error registering purchase:", error);
    throw new Error(
      `Purchase registration failed: ${(error as Error).message}`
    );
  }
};

// Function to check existing purchases (by paymentIntentId)
// Note: This function is maintained for compatibility with legacy code
const checkExistingPurchase = async (paymentIntentId: string) => {
  await connectToDatabase();

  try {
    const purchase = await Purchase.findOne({ paymentIntentId }).lean();
    if (!purchase) return null;

    // Safely handle MongoDB document conversion
    const purchaseObj = purchase as any;
    return { id: purchaseObj._id.toString(), ...purchaseObj };
  } catch (error) {
    console.error("Error checking existing purchase:", error);
    return null;
  }
};

// Function to check existing purchases by sessionId (main method)
const checkExistingPurchaseBySession = async (sessionId: string) => {
  await connectToDatabase();

  try {
    const purchase = await Purchase.findOne({ sessionId }).lean();
    if (!purchase) return null;

    // Safely handle MongoDB document conversion
    const purchaseObj = purchase as any;
    return { id: purchaseObj._id.toString(), ...purchaseObj };
  } catch (error) {
    console.error("Error checking existing purchase by session:", error);
    return null;
  }
};

// Function to get the user ID from a Stripe customer ID
const getUserIdFromCustomerId = async (stripeCustomerId: string) => {
  await connectToDatabase();

  try {
    const customer = await Customer.findOne({
      stripe_customer_id: stripeCustomerId,
    }).lean();
    if (!customer) return null;

    // Safely handle MongoDB document conversion
    const customerObj = customer as any;
    return customerObj.id || null;
  } catch (error) {
    console.error("Error getting user ID from customer ID:", error);
    return null;
  }
};

const downloadDigitalAsset = async (storagePath: string) => {
  // This function would need to be implemented with a MongoDB GridFS or another storage solution
  // For now, we'll throw an error indicating this needs to be implemented
  throw new Error(
    "Digital asset download not implemented for MongoDB. Please implement using GridFS or another storage solution."
  );
};

// Function to save subscribers for free resources
const saveSubscriber = async (
  email: string,
  name: string,
  source: string = "free-resources"
) => {
  await connectToDatabase();

  try {
    // Check if the email already exists
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    // If it already exists, update the date and return
    if (existingSubscriber) {
      console.info(
        `Subscriber with email ${email} already exists. Updating data.`
      );

      await Subscriber.updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            name,
            subscribed: true,
            updatedAt: new Date(),
            metadata: {
              last_activity: new Date().toISOString(),
              last_resource_requested: source,
            },
          },
        }
      );

      // Safely handle MongoDB document conversion
      const subscriberObj = existingSubscriber as any;
      return { id: subscriberObj._id.toString(), isNew: false };
    } else {
      // If it doesn't exist, create a new subscriber
      const newSubscriber = await Subscriber.create({
        email: email.toLowerCase(),
        name,
        source,
        subscribed: true,
        metadata: {
          signup_date: new Date().toISOString(),
          resource_requested: source,
        },
      });

      // Safely handle MongoDB document conversion
      const subscriberObj = newSubscriber as any;
      return { id: subscriberObj._id.toString(), isNew: true };
    }
  } catch (error) {
    console.error("Error managing subscriber:", error);
    throw new Error(
      `Subscriber management failed: ${(error as Error).message}`
    );
  }
};

async function getPriceById(priceId: string) {
  await connectToDatabase();
  return Price.findOne({ id: priceId }).lean();
}

async function checkExistingPurchaseByUserProduct(
  userId: string,
  productId: string
) {
  await connectToDatabase();
  return Purchase.findOne({ userId, productId }).lean();
}

export const dbAdminService = {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  registerPurchase,
  checkExistingPurchase,
  checkExistingPurchaseBySession,
  getUserIdFromCustomerId,
  downloadDigitalAsset,
  saveSubscriber,
  getPriceById,
  checkExistingPurchaseByUserProduct,
  userCredits: userCreditsService,
};
