import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  appInfo: {
    name: "Vibe Better",
    version: "0.1.0",
  },
});

type Product = any;
type Price = any;

interface ExtendedProduct extends Omit<Product, "id"> {
  tax_code?: string;
  shippable?: boolean;
  statement_descriptor?: string;
  unit_label?: string;
}

export const stripeAdminService = {
  async createProduct(product: ExtendedProduct) {
    try {
      const stripeProduct = await stripe.products.create({
        name: product.name || "",
        description: product.description || "",
        images: product.image ? [product.image] : [],
        metadata: (product.metadata as Stripe.MetadataParam) || {},
        active: product.active === null ? undefined : product.active,
        tax_code: product.tax_code,
        shippable: product.shippable,
        statement_descriptor: product.statement_descriptor,
        unit_label: product.unit_label,
      });

      return stripeProduct;
    } catch (error) {
      console.error("Error creating Stripe product:", error);
      throw error;
    }
  },

  async updateProduct(id: string, product: Partial<ExtendedProduct>) {
    try {
      const stripeProduct = await stripe.products.update(id, {
        name: product.name || undefined,
        description: product.description || undefined,
        images: product.image ? [product.image] : undefined,
        metadata: product.metadata as Stripe.MetadataParam | undefined,
        active: product.active === null ? undefined : product.active,
        tax_code: product.tax_code,
        shippable: product.shippable,
        statement_descriptor: product.statement_descriptor,
        unit_label: product.unit_label,
      });

      return stripeProduct;
    } catch (error) {
      console.error("Error updating Stripe product:", error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      await stripe.products.del(id);
    } catch (error) {
      console.error("Error deleting Stripe product:", error);
      throw error;
    }
  },

  async createPrice(price: Omit<Price, "id">) {
    try {
      // Definir los parámetros base
      const createParams: Stripe.PriceCreateParams = {
        product: price.product_id || "",
        unit_amount: price.unit_amount || 0,
        currency: price.currency || "usd",
        active: price.active === null ? undefined : price.active,
      };

      // Agregar parámetros para precios recurrentes si es necesario
      if (price.type === "recurring" && price.interval) {
        createParams.recurring = {
          interval: price.interval,
          interval_count: price.interval_count || 1,
        };

        if (price.trial_period_days) {
          createParams.recurring.trial_period_days = price.trial_period_days;
        }
      }

      const stripePrice = await stripe.prices.create(createParams);

      return {
        ...stripePrice,
        type: price.type, // Agregamos el tipo manualmente ya que no está en la respuesta de Stripe
      };
    } catch (error) {
      console.error("Error creating Stripe price:", error);
      throw error;
    }
  },

  async updatePrice(id: string, price: Partial<Price>) {
    try {
      const stripePrice = await stripe.prices.update(id, {
        active: price.active === null ? undefined : price.active,
      });

      return stripePrice;
    } catch (error) {
      console.error("Error updating Stripe price:", error);
      throw error;
    }
  },

  async deletePrice(id: string) {
    try {
      await stripe.prices.update(id, { active: false });
    } catch (error) {
      console.error("Error deleting Stripe price:", error);
      throw error;
    }
  },
};
