import { Readable } from "stream";
import Stripe from "stripe";

export const RELEVANT_EVENTS = {
  PRODUCT: {
    CREATED: "product.created",
    UPDATED: "product.updated",
    DELETED: "product.deleted"
  },
  PRICE: {
    CREATED: "price.created",
    UPDATED: "price.updated",
    DELETED: "price.deleted"
  },
  CHECKOUT: {
    COMPLETED: "checkout.session.completed"
  },
  SUBSCRIPTION: {
    CREATED: "customer.subscription.created",
    UPDATED: "customer.subscription.updated",
    DELETED: "customer.subscription.deleted"
  }
} as const;

export type RelevantEventType = typeof RELEVANT_EVENTS[keyof typeof RELEVANT_EVENTS][keyof typeof RELEVANT_EVENTS[keyof typeof RELEVANT_EVENTS]];

export const relevantEvents = new Set(Object.values(RELEVANT_EVENTS).flatMap(Object.values)) as Set<RelevantEventType>;

export async function buffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk)
    );
  }

  return Buffer.concat(chunks as unknown as readonly Uint8Array[]);
}

export interface WebhookHandlerContext {
  event: Stripe.Event;
  logger: typeof import('@/lib/logger/Logger').logger;
} 