"use client";

import { HeroBanner } from "@/features/landing/hero-banner";
import { HoverSurface } from "@/features/landing/hover-surface";
import dynamic from "next/dynamic";

const DynamicAnalysis = dynamic(() => import("@/features/analysis/Analysis"), {
  ssr: false,
});
const DynamicLandingSections = dynamic(
  () => import("@/features/landing-sections/landing-sections"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    ),
  }
);

export default function LandingPage() {
  return (
    <div className="display-flex flex-col min-h-screen mx-auto bg-background text-foreground">
      {/* Hero Section - Replaced with HeroBanner component */}
      <HoverSurface>
        <HeroBanner>
          <DynamicAnalysis />
        </HeroBanner>
      </HoverSurface>

      <DynamicLandingSections />
    </div>
  );
}
