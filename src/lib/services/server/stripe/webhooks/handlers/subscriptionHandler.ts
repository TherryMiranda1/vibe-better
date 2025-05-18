import { dbAdminService } from "../../../db/dbProducts.service";
import { WebhookHandlerContext } from "../types";
import Stripe from "stripe";

export async function handleSubscriptionChange(
  { event, logger }: WebhookHandlerContext
) {
  const subscription = event.data.object as Stripe.Subscription;
  const isNew = event.type === "customer.subscription.created";
  
  logger.info(`Procesando cambio de suscripción`, { 
    subscriptionId: subscription.id, 
    customerId: subscription.customer as string,
    status: subscription.status,
    isNew
  });
  
  await dbAdminService.manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    isNew,
  );
  
  logger.success(`Suscripción actualizada con éxito`, { 
    subscriptionId: subscription.id 
  });
} 