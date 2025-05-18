import { Metadata } from "next";
import { getActiveProductsWithPrices } from "@/lib/services/server/db/getProducts.service";
import PricingSection from "../../components/components/PricingSection";
import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Precios | Vibe Code Better",
  description:
    "Paquetes de créditos para mejorar y optimizar tus prompts para LLMs",
};

export default async function PricingPage() {
  const { orgId } = await auth();

  const products = await getActiveProductsWithPrices();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 z-1">
          <div className="text-center flex flex-col items-center gap-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Planes para organizaciones
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Elige el paquete de créditos que mejor se adapte a tus necesidades
              para optimizar tus prompts y obtener resultados excepcionales.
              Invita a tantos miembros como quieras de tu organizacion.
            </p>
            {!orgId && (
              <Link
                href="/organizations"
                className="text-lg text-background bg-primary px-6 py-4 font-semibold my-6 rounded-lg max-w-3xl mx-auto"
              >
                Crea una organizacion
              </Link>
            )}
          </div>
          <PricingTable forOrganizations />
        </div>
      </section>
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            Paquetes de Créditos
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
