"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductWithPrice } from "@/lib/services/server/db/getProducts.service";
import { createCheckoutSession } from "@/lib/services/client/stripeClient.service";

interface PricingCardProps {
  product: ProductWithPrice;
  price: {
    id: string;
    currency: string;
    unit_amount: number | null;
    interval: string | null;
    interval_count: number | null;
    type: string;
    description: string | null;
  };
}

export default function PricingCard({ product, price }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Format the price for display
  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price.unit_amount || 0) / 100);

  // Check if this is a featured product
  const isFeatured = product.metadata?.featured === "true";

  // Get the number of credits from metadata or use a default
  const credits = product.metadata?.credits || "100";

  // Handle the purchase
  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const result = await createCheckoutSession({
        price: {
          id: price.id,
          product_id: product.id,
          type: price.type,
        },
        redirectPath: "/pricing",
      });

      if (result.error) {
        console.error("Error creating checkout session:", result.error);
        alert(
          "Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo."
        );
      } else {
        // Redirect to Stripe Checkout
        const stripe = await import("@stripe/stripe-js").then((mod) =>
          mod.loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ||
              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
              ""
          )
        );
        const stripeInstance = await stripe;
        await stripeInstance?.redirectToCheckout({
          sessionId: result.data.sessionId,
        });
      }
    } catch (error) {
      console.error("Error in checkout process:", error);
      alert(
        "Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-primary ${
        isFeatured ? "border-primary shadow-primary" : "border-foreground/40"
      } shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl ${
        isFeatured ? "transform hover:-translate-y-1" : ""
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-primary text-black px-4 py-1 rounded-bl-lg text-sm font-medium flex items-center">
          <Sparkles className="h-4 w-4 mr-1" />
          Recomendado
        </div>
      )}

      <div className={`px-6 py-10 ${isFeatured ? "bg-primary/10" : "bg-card"}`}>
        <h3 className="text-md font-bold text-primary">{product.name}</h3>
        <p className="mt-2 text-muted-foreground">{product.description}</p>

        <div className="">
          <span className="text-4xl font-bold text-foreground">
            {formattedPrice}
          </span>
          {price.interval && (
            <span className="text-muted-foreground ml-2">
              /{price.interval}
              {price.interval_count && price.interval_count > 1
                ? ` (${price.interval_count} meses)`
                : ""}
            </span>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center text-primary">
            <span className="text-3xl font-bold text-foreground">
              {credits}
            </span>
            <span className="ml-2 text-muted-foreground">créditos</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {price.description || "Para analizar y optimizar tus prompts"}
          </p>
        </div>
      </div>

      <div className="border-t border-foreground/10 p-6">
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border border-primary font-medium ${
            isFeatured
              ? "bg-primary hover:bg-primary/80 text-black"
              : "bg-card hover:bg-card/80"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isFeatured ? "focus:ring-primary" : "focus:ring-foreground"
          } transition-colors duration-200`}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Comprar ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
