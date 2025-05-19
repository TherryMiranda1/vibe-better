"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ProductWithPrice } from "@/lib/services/server/db/getProducts.service";
import PricingCard from "./PricingCard";

interface PricingSectionProps {
  products: ProductWithPrice[];
}

export default function PricingSection({ products }: PricingSectionProps) {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month"
  );

  // Filter products based on their metadata to separate them into different tiers
  const creditPackages = products.filter(
    (product) => product.metadata?.type === "credit" || !product.metadata?.type
  );

  return (
    <div className="space-y-12">
      {/* Billing interval toggle - only show if we have subscription products */}
      {products.some((product) =>
        product.prices.some((price) => price.interval)
      ) && (
        <div className="flex justify-center w-full items-center">
          <div className="relative self-center rounded-lg bg-card p-1 flex">
            <button
              onClick={() => setBillingInterval("month")}
              className={`${
                billingInterval === "month"
                  ? "bg-white border shadow-sm text-foreground"
                  : "text-foreground"
              } relative w-28 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-1 focus:z-10 sm:w-auto sm:px-8`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingInterval("year")}
              className={`${
                billingInterval === "year"
                  ? "bg-card border shadow-sm text-foreground"
                  : "text-foreground"
              } relative w-28 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-1 focus:z-10 sm:w-auto sm:px-8`}
            >
              Anual
            </button>
          </div>
        </div>
      )}

      {/* Credit packages */}
      <div className="flex flex-wrap justify-center gap-6 mx-auto">
        {creditPackages.map((product) => {
          // Find the appropriate price based on the billing interval
          const price =
            product.prices.find(
              (p) =>
                p.interval === billingInterval ||
                (!p.interval && billingInterval === "month")
            ) || product.prices[0];

          if (!price) return null;

          return (
            <PricingCard key={product.id} product={product} price={price} />
          );
        })}
      </div>

      {/* Features comparison */}
      <div className="mt-16 bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-foreground">
            All features included
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-muted-foreground">
            All our credit packages include access to all platform features.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Detailed prompt analysis",
              "Custom optimization suggestions",
              "Effective prompt examples library",
              "Prompt history",
            ].map((feature) => (
              <div key={feature} className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <p className="ml-3 text-base text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
