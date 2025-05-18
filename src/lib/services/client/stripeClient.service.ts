import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

type Price = any;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        ""
    );
  }

  return stripePromise;
};

export const createCheckoutSession = async ({
  price,
  redirectPath,
}: {
  price: Price;
  redirectPath: string;
}) => {
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price,
      redirectPath,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data || "Error al crear la sesión de checkout" };
  }

  if (!data.sessionId) {
    return { error: "No se recibió ID de sesión" };
  }

  return { data };
};

export const createPortalSession = async () => {
  const response = await fetch("/api/stripe/create-portal-session", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message || "Error al crear el portal de facturación" };
  }

  if (!data.url) {
    return { error: "No se recibió URL del portal" };
  }

  return { data: data.url };
};

export const stripeClientService = {
  getStripe,
  createCheckoutSession,
  createPortalSession,
};
