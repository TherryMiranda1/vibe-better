import { stripe } from "@/lib/services/server/stripe/stripeAdmin.service";

import {
  relevantEvents,
  RelevantEventType,
  RELEVANT_EVENTS,
} from "@/lib/services/server/stripe/webhooks/types";
import { logger } from "@/lib/logger/Logger";
import {
  handleProductCreatedOrUpdated,
  handleProductDeleted,
} from "@/lib/services/server/stripe/webhooks/handlers/productHandler";
import {
  handlePriceCreatedOrUpdated,
  handlePriceDeleted,
} from "@/lib/services/server/stripe/webhooks/handlers/priceHandler";
import { handleSubscriptionChange } from "@/lib/services/server/stripe/webhooks/handlers/subscriptionHandler";
import { handleCheckoutCompleted } from "@/lib/services/server/stripe/webhooks/handlers/checkoutHandler";
import Stripe from "stripe";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error(
      "Configuración de webhook incompleta: STRIPE_WEBHOOK_SECRET no definido"
    );
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
 
  let event: Stripe.Event;
  try {
    logger.info("Procesando cuerpo de la solicitud webhook");

    if (!signature) {
      logger.error("Solicitud webhook sin firma de Stripe");
      return new Response("Webhook signature missing", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    logger.success(`Evento verificado: [${event.id}] tipo: ${event.type}`);
  } catch (error: any) {
    logger.error("Error al verificar webhook de Stripe", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Verificar que el evento sea relevante
  if (!relevantEvents.has(event.type as RelevantEventType)) {
    logger.info(`Evento ignorado por ser no relevante: ${event.type}`, {
      eventId: event.id,
    });
    return new Response("Received", { status: 200 });
  }

  // Manejar eventos relevantes
  try {
    logger.info(`Procesando evento ${event.type}`, { eventId: event.id });
    const context = { event, logger: logger };

    switch (event.type as RelevantEventType) {
      case RELEVANT_EVENTS.PRODUCT.CREATED:
      case RELEVANT_EVENTS.PRODUCT.UPDATED:
        await handleProductCreatedOrUpdated(context);
        break;

      case RELEVANT_EVENTS.PRODUCT.DELETED:
        await handleProductDeleted(context);
        break;

      case RELEVANT_EVENTS.PRICE.CREATED:
      case RELEVANT_EVENTS.PRICE.UPDATED:
        await handlePriceCreatedOrUpdated(context);
        break;

      case RELEVANT_EVENTS.PRICE.DELETED:
        await handlePriceDeleted(context);
        break;

      case RELEVANT_EVENTS.SUBSCRIPTION.CREATED:
      case RELEVANT_EVENTS.SUBSCRIPTION.UPDATED:
      case RELEVANT_EVENTS.SUBSCRIPTION.DELETED:
        await handleSubscriptionChange(context);
        break;

      case RELEVANT_EVENTS.CHECKOUT.COMPLETED:
        await handleCheckoutCompleted(context);
        break;

      default:
        throw new Error(`Evento no manejado: ${event.type}`);
    }
  } catch (error: any) {
    logger.error(`Error al procesar webhook [${event.type}]`, error);
    return new Response("Webhook handler failed", { status: 400 });
  }

  logger.success(`Webhook procesado correctamente [${event.type}]`, {
    eventId: event.id,
  });
  return new Response("Received", { status: 200 });
}
