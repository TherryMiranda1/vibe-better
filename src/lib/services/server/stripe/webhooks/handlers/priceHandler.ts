import { dbAdminService } from "../../../db/dbProducts.service";
import { WebhookHandlerContext } from "../types";
import Stripe from "stripe";

export async function handlePriceCreatedOrUpdated(
  { event, logger }: WebhookHandlerContext
) {
  const price = event.data.object as Stripe.Price;
  logger.info(`Actualizando precio en Supabase`, { 
    priceId: price.id, 
    productId: price.product,
    amount: price.unit_amount
  });
  
  await dbAdminService.upsertPriceRecord(price);
  logger.success(`Precio actualizado con éxito`, { priceId: price.id });
}

export async function handlePriceDeleted(
  { event, logger }: WebhookHandlerContext
) {
  const price = event.data.object as Stripe.Price;
  logger.info(`Eliminando precio en Supabase`, { priceId: price.id });
  
  await dbAdminService.deletePriceRecord(price);
  logger.success(`Precio eliminado con éxito`, { priceId: price.id });
} 