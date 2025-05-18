import { Metadata } from "next";
import { getActiveProductsWithPrices } from "@/lib/services/server/db/getProducts.service";
import PricingSection from "../../components/components/PricingSection";

export const metadata: Metadata = {
  title: "Precios | Vibe Code Better",
  description:
    "Paquetes de créditos para mejorar y optimizar tus prompts para LLMs",
};

export default async function PricingPage() {
  const products = await getActiveProductsWithPrices();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Planes de Créditos
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el paquete de créditos que mejor se adapte a tus necesidades
            para optimizar tus prompts y obtener resultados excepcionales.
          </p>
        </div>

        <PricingSection products={products} />
      </div>
    </main>
  );
}
