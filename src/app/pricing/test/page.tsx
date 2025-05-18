import { Metadata } from "next";
import PricingSection from "../components/PricingSection";
import { ProductWithPrice } from "@/lib/services/server/db/getProducts.service";

export const metadata: Metadata = {
  title: "Test de Precios | Vibe Code Better",
  description: "Página de prueba para los paquetes de créditos",
};

// Mock data for testing the pricing UI
const mockProducts: ProductWithPrice[] = [
  {
    id: "prod_basic",
    name: "Paquete Básico",
    description: "Ideal para comenzar a optimizar tus prompts",
    image: null,
    metadata: { type: "credit", credits: "100", featured: "false" },
    prices: [
      {
        id: "price_basic_monthly",
        currency: "EUR",
        unit_amount: 1990,
        interval: "month",
        interval_count: 1,
        type: "recurring",
        description: "Acceso a todas las funcionalidades básicas"
      },
      {
        id: "price_basic_yearly",
        currency: "EUR",
        unit_amount: 19900,
        interval: "year",
        interval_count: 1,
        type: "recurring",
        description: "Acceso a todas las funcionalidades básicas (ahorra 20%)"
      }
    ]
  },
  {
    id: "prod_pro",
    name: "Paquete Pro",
    description: "Para usuarios que necesitan optimización regular",
    image: null,
    metadata: { type: "credit", credits: "500", featured: "true" },
    prices: [
      {
        id: "price_pro_monthly",
        currency: "EUR",
        unit_amount: 4990,
        interval: "month",
        interval_count: 1,
        type: "recurring",
        description: "Acceso a todas las funcionalidades avanzadas"
      },
      {
        id: "price_pro_yearly",
        currency: "EUR",
        unit_amount: 49900,
        interval: "year",
        interval_count: 1,
        type: "recurring",
        description: "Acceso a todas las funcionalidades avanzadas (ahorra 20%)"
      }
    ]
  },
  {
    id: "prod_enterprise",
    name: "Paquete Empresarial",
    description: "Para equipos y uso intensivo",
    image: null,
    metadata: { type: "credit", credits: "2000", featured: "false" },
    prices: [
      {
        id: "price_enterprise_monthly",
        currency: "EUR",
        unit_amount: 9990,
        interval: "month",
        interval_count: 1,
        type: "recurring",
        description: "Acceso a todas las funcionalidades premium"
      },
      {
        id: "price_enterprise_yearly",
        currency: "EUR",
        unit_amount: 99900,
        interval: "year",
        interval_count: 1,
        type: "recurring",
        description: "Acceso a todas las funcionalidades premium (ahorra 20%)"
      }
    ]
  },
  {
    id: "prod_onetime",
    name: "Paquete Único",
    description: "Pago único para 1000 créditos",
    image: null,
    metadata: { type: "credit", credits: "1000", featured: "false" },
    prices: [
      {
        id: "price_onetime",
        currency: "EUR",
        unit_amount: 29900,
        interval: null,
        interval_count: null,
        type: "one_time",
        description: "Pago único sin suscripción"
      }
    ]
  }
];

export default function PricingTestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Planes de Créditos (Test)
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Esta es una página de prueba para visualizar los planes de créditos con datos de ejemplo.
          </p>
        </div>
        
        <PricingSection products={mockProducts} />
      </div>
    </main>
  );
}
