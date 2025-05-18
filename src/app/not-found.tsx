"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-md font-bold text-center min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl">404 - Página no encontrada</h1>
      <p className="text-lg mt-4">
        Lo siento, la página que estás buscando no existe.
      </p>
      <Link
        href="/"
        className="mt-12 bg-primary text-background border rounded-md px-4 py-2 hover:underline"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
