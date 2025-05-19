import { Metadata } from "next";
import { getActiveProductsWithPrices } from "@/lib/services/server/db/getProducts.service";
import PricingSection from "../../components/components/PricingSection";
import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Vibe Code Better",
  description:
    "Credit packages to improve and optimize your prompts for LLMs",
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
              Plans for organizations
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose the credit package that best fits your needs to optimize your prompts and achieve outstanding results. Invite as many members as you want from your organization.
            </p>
            {!orgId && (
              <Link
                href="/organizations"
                className="text-lg text-background bg-primary px-6 py-4 font-semibold my-6 rounded-lg max-w-3xl mx-auto"
              >
                Create an organization
              </Link>
            )}
          </div>
          <PricingTable forOrganizations />
        </div>
      </section>
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            Credit Packages
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the credit package that best fits your needs to optimize your prompts and achieve outstanding results.
          </p>
        </div>

        <PricingSection products={products} />
      </div>
    </main>
  );
}
