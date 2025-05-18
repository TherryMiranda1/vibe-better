import Stripe from "stripe";
import { stripe } from "@/lib/services/server/stripe/stripeAdmin.service";

import { WebhookHandlerContext } from "../types";
import { emailService } from "@/lib/services/server/email/emailService";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { dbAdminService } from "../../../db/dbProducts.service";
import { userCreditsService } from "../../../db/userCredits.service";

async function handleSubscriptionCheckout(
  checkoutSession: Stripe.Checkout.Session,
  logger: typeof import("@/lib/logger/Logger").logger
) {
  const subscriptionId = checkoutSession.subscription;
  logger.info(`Procesando suscripción de checkout`, {
    subscriptionId: subscriptionId as string,
  });

  await dbAdminService.manageSubscriptionStatusChange(
    subscriptionId as string,
    checkoutSession.customer as string,
    true
  );

  logger.success(`Suscripción de checkout procesada`, { subscriptionId });

  // Enviar correo de confirmación simple para suscripción
  try {
    await sendSimpleConfirmationEmail(checkoutSession, true, logger);
  } catch (emailError) {
    logger.error(
      `Error al enviar email de confirmación de suscripción`,
      emailError
    );
  }
}

async function handlePaymentWithIntent(
  checkoutSession: Stripe.Checkout.Session,
  logger: typeof import("@/lib/logger/Logger").logger
) {
  logger.info(`Recuperando payment intent`, {
    paymentIntentId: checkoutSession.payment_intent as string,
  });

  const paymentIntent = await stripe.paymentIntents.retrieve(
    checkoutSession.payment_intent as string
  );

  if (
    !paymentIntent.metadata?.user_id ||
    !paymentIntent.metadata?.price_id ||
    !paymentIntent.metadata?.product_id
  ) {
    logger.warn(`Payment intent sin metadata requerida`, {
      paymentIntentId: paymentIntent.id,
      metadata: paymentIntent.metadata,
    });
    return;
  }

  logger.info(`Registrando compra con payment intent`, {
    userId: paymentIntent.metadata.user_id,
    productId: paymentIntent.metadata.product_id,
  });

  await dbAdminService.registerPurchase(
    paymentIntent.metadata.user_id,
    paymentIntent.metadata.product_id,
    paymentIntent.metadata.price_id,
    paymentIntent.id,
    checkoutSession.id
  );

  // Update user credits based on product metadata
  try {
    const creditsResult = await userCreditsService.updateUserCredits(
      paymentIntent.metadata.user_id,
      paymentIntent.metadata.product_id
    );
    
    if (creditsResult.success && creditsResult.credits) {
      logger.info(`Créditos de usuario actualizados`, {
        userId: paymentIntent.metadata.user_id,
        creditsAdded: creditsResult.credits,
      });
    }
  } catch (creditsError) {
    logger.error(`Error al actualizar créditos de usuario`, creditsError);
  }

  logger.success(`Compra registrada con éxito`, {
    userId: paymentIntent.metadata.user_id,
    productId: paymentIntent.metadata.product_id,
    sessionId: checkoutSession.id,
  });

  // Enviar correo de confirmación simple para compra
  try {
    await sendSimpleConfirmationEmail(checkoutSession, false, logger);
  } catch (emailError) {
    logger.error(`Error al enviar email de confirmación de compra`, emailError);
  }
}

async function handleFreePayment(
  checkoutSession: Stripe.Checkout.Session,
  logger: typeof import("@/lib/logger/Logger").logger
) {
  if (!checkoutSession.customer) {
    logger.error(
      `Datos insuficientes en la sesión de checkout para procesar compra gratuita`,
      {
        hasCustomer: false,
      }
    );
    return;
  }

  logger.info(`Recuperando datos completos de la sesión de checkout`);
  const session = await stripe.checkout.sessions.retrieve(checkoutSession.id, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  if (!session.line_items?.data?.length) {
    logger.error(`No se encontraron line_items en la sesión`, {
      sessionId: checkoutSession.id,
    });
    return;
  }

  const lineItem = session.line_items.data[0];
  const priceId = lineItem.price?.id;
  const productId =
    typeof lineItem.price?.product === "object"
      ? lineItem.price.product.id
      : lineItem.price?.product;

  if (!priceId || !productId) {
    logger.error(`Información incompleta del producto en line_items`, {
      lineItem,
    });
    return;
  }

  logger.info(`Datos de producto obtenidos para compra gratuita`, {
    priceId,
    productId,
    customerId: checkoutSession.customer as string,
  });

  const supabaseUserId = await dbAdminService.getUserIdFromCustomerId(
    checkoutSession.customer as string
  );

  if (!supabaseUserId) {
    logger.error(`No se pudo encontrar el usuario para el customer de Stripe`, {
      stripeCustomerId: checkoutSession.customer,
    });
    return;
  }

  await dbAdminService.registerPurchase(
    supabaseUserId,
    productId as string,
    priceId,
    "", // Campo vacío para payment_intent_id en compras con cupón
    checkoutSession.id
  );

  // Update user credits based on product metadata
  try {
    const creditsResult = await userCreditsService.updateUserCredits(
      supabaseUserId,
      productId as string
    );
    
    if (creditsResult.success && creditsResult.credits) {
      logger.info(`Créditos de usuario actualizados`, {
        userId: supabaseUserId,
        creditsAdded: creditsResult.credits,
      });
    }
  } catch (creditsError) {
    logger.error(`Error al actualizar créditos de usuario`, creditsError);
  }

  logger.success(`Compra gratuita registrada con éxito`, {
    userId: supabaseUserId,
    productId: productId as string,
    sessionId: checkoutSession.id,
  });

  // Enviar correo de confirmación simple para compra gratuita
  try {
    await sendSimpleConfirmationEmail(checkoutSession, false, logger);
  } catch (emailError) {
    logger.error(
      `Error al enviar email de confirmación de compra gratuita`,
      emailError
    );
  }
}

/**
 * Función auxiliar simplificada para enviar emails de confirmación de compra
 * sin incluir enlaces de descarga directa, solo confirmación de la transacción
 */
async function sendSimpleConfirmationEmail(
  checkoutSession: Stripe.Checkout.Session,
  isSubscription: boolean,
  logger: typeof import("@/lib/logger/Logger").logger
) {
  // Recuperar solo los datos básicos necesarios
  const session = await stripe.checkout.sessions.retrieve(checkoutSession.id, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  // Verificar que exista el email del cliente
  if (!session.customer_details?.email) {
    logger.error("No se encontró email del cliente en la sesión", {
      sessionId: session.id,
    });
    return;
  }

  // Datos básicos
  const customerEmail = session.customer_details.email;
  const customerName = session.customer_details.name || "";

  // Obtener datos del producto si están disponibles
  let productName = "Producto 10xDev";
  if (session.line_items?.data?.length) {
    const lineItem = session.line_items.data[0];
    const product = lineItem.price?.product;

    if (product && typeof product === "object" && !("deleted" in product)) {
      productName = product.name || productName;
    }
  }

  // Formatear el precio para mostrar
  const total = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: session.currency || "EUR",
  }).format(session.amount_total ? session.amount_total / 100 : 0);

  // Fecha formateada
  const purchaseDate = formatDate(new Date(), "dd MMMM yyyy, HH:mm", {
    locale: es,
  });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vibebetter.xyz";

  // Enviar el email con los datos básicos
  logger.info(`Enviando email de confirmación a ${customerEmail}`);

  await emailService.sendCheckoutConfirmationEmail(customerEmail, {
    name: customerName,
    productName,
    orderNumber: (session.payment_intent as string) || session.id.slice(-8),
    purchaseDate,
    total,
    accessUrl: `${baseUrl}/account`,
    baseUrl,
    isSubscription,
  });

  logger.success(`Email de confirmación enviado a ${customerEmail}`);
}

export async function handleCheckoutCompleted({
  event,
  logger,
}: WebhookHandlerContext) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  logger.info(`Procesando sesión de checkout completada`, {
    sessionId: checkoutSession.id,
    mode: checkoutSession.mode,
    customerId: checkoutSession.customer as string,
    paymentStatus: checkoutSession.payment_status,
    amountTotal: checkoutSession.amount_total,
  });

  // Primero verificamos si ya existe una compra con esta session_id
  logger.info(`Verificando si existe compra previa por session_id`, {
    sessionId: checkoutSession.id,
  });

  const existingSessionPurchase =
    await dbAdminService.checkExistingPurchaseBySession(checkoutSession.id);

  if (existingSessionPurchase?.data) {
    logger.warn(`Compra duplicada por session_id evitada`, {
      sessionId: checkoutSession.id,
    });
    return;
  }

  try {
    if (checkoutSession.mode === "subscription") {
      await handleSubscriptionCheckout(checkoutSession, logger);
    } else if (checkoutSession.mode === "payment") {
      if (checkoutSession.payment_intent) {
        await handlePaymentWithIntent(checkoutSession, logger);
      } else {
        await handleFreePayment(checkoutSession, logger);
      }
    }
  } catch (error: any) {
    logger.error(`Error al procesar checkout`, error);
    throw error;
  }
}
