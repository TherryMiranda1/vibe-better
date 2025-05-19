"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-md font-bold text-center min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl">404 - Page Not Found</h1>
      <p className="text-lg mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-12 bg-primary text-background border rounded-md px-4 py-2 hover:underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
