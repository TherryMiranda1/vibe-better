"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { CheckoutSuccessModal } from "./checkout-success-modal";

const DynamicHeaderActions = dynamic(() => import("./header-actions"), {
  ssr: false,
  loading: () => (
    <div className="w-12 h-6 rounded-md border animate-pulse bg-primary/5" />
  ),
});

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { href: "/glossary", label: "Tags" },
    { href: "/prompts", label: "Prompts" },
    { href: "/packs", label: "Packs" },
  ];

  return (
    <header className="px-4 sticky top-4 z-50">
      {/* Modal de confirmación de compra exitosa */}
      <CheckoutSuccessModal />
      
      <div className="max-w-6xl px-4 py-2 mx-auto border-primary/10 border rounded-xl bg-card/90 backdrop-blur-sm flex justify-between items-center">
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

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center justify-center space-x-4">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:cursor-pointer hover:bg-primary/5 hover:text-[var(--color-primary-dark)]"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <DynamicHeaderActions />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <DynamicHeaderActions />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5 text-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <SheetTitle>Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:cursor-pointer hover:bg-primary/5 hover:text-[var(--color-primary-dark)]"
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
