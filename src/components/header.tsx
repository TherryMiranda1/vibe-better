"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";

const DynamicHeaderActions = dynamic(() => import("./header-actions"), {
  ssr: false,
  loading: () => (
    <div className="w-12 h-6 rounded-md border animate-pulse bg-primary/5" />
  ),
});

export function AppHeader() {
  return (
    <header className="py-4 px-6 border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <h1 className="text-xl font-semibold cursor-pointer text-card-foreground hover:text-primary transition-colors">
            <Image
              src="https://res.cloudinary.com/dtlaxm8gi/image/upload/v1747421226/vibeBetter-16-9_xd9dwe.png"
              alt="Vibe Better"
              width={80}
              height={46}
            />
          </h1>
        </Link>
        <nav className="ml-auto flex items-center justify-center space-x-4">
          <Link href="/glossary">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:cursor-pointer hover:bg-primary/5 hover:text-[var(--color-primary-dark)]"
            >
              Glossario
            </Button>
          </Link>

          <Link href="/prompts">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:cursor-pointer hover:bg-primary/5 hover:text-[var(--color-primary-dark)]"
            >
              Prompts
            </Button>
          </Link>

          <DynamicHeaderActions />
        </nav>
      </div>
    </header>
  );
}
