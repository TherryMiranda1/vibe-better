import { dbAdminService } from "../../../db/dbProducts.service";
import { WebhookHandlerContext } from "../types";
import Stripe from "stripe";

export async function handleProductCreatedOrUpdated(
  { event, logger }: WebhookHandlerContext
) {
  const product = event.data.object as Stripe.Product;
  logger.info(`Actualizando producto en Supabase`, { 
    productId: product.id, 
    name: product.name 
  });
  
  await dbAdminService.upsertProductRecord(product);
  logger.success(`Producto actualizado con éxito`, { productId: product.id });
}

export async function handleProductDeleted(
  { event, logger }: WebhookHandlerContext
) {
  const product = event.data.object as Stripe.Product;
  logger.info(`Eliminando producto en Supabase`, { productId: product.id });
  
  await dbAdminService.deleteProductRecord(product);
  logger.success(`Producto eliminado con éxito`, { productId: product.id });
} 