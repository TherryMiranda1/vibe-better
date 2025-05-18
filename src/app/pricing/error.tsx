"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function PricingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Pricing page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Ha ocurrido un error al cargar los planes
        </h2>
        <p className="mt-2 text-gray-500">
          Lo sentimos, no se pudieron cargar los planes de precios. Por favor, inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
