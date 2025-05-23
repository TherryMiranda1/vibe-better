"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
} from "@clerk/nextjs";

const DynamicHeaderActions = dynamic(() => import("./header-actions"), {
  ssr: false,
  loading: () => (
    <div className="w-12 h-6 rounded-md border animate-pulse bg-primary/5" />
  ),
});

const DynamicCheckoutSuccessModal = dynamic(
  () => import("./checkout-success-modal"),
  {
    ssr: false,
  }
);

export function AppHeader() {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { href: "/prompts", label: "Prompts" },
    { href: "/glossary", label: "Tags" },
    { href: "/pricing", label: "Pricing" },
    { href: "/prompt-guide", label: "Prompting" },
    ...(userId
      ? [
          { href: "/my-analysis", label: "My Analyses" },
          { href: "/organizations", label: "Orgs" },
        ]
      : []),
  ];

  const onlyMobileNavigationLinks = [
    ...navigationLinks,
    { href: "/feedback", label: "Feedback" },
  ];

  return (
    <header className="px-2 sticky top-4 z-20">
      {/* Modal de confirmación de compra exitosa */}
      <DynamicCheckoutSuccessModal />

      <div className="max-w-7xl px-2 py-2 mx-auto border-primary/10 border rounded-xl bg-card/90 backdrop-blur-sm flex justify-between items-center">
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
        <nav className="ml-auto hidden md:flex items-center justify-center space-x-2">
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
            <SheetContent
              side="right"
              className="w-[240px] sm:w-[300px] flex flex-col space-between"
            >
              <SheetTitle>Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8 h-full">
                {onlyMobileNavigationLinks.map((link) => (
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
              <SignedIn>
                <SheetFooter>
                  <SignOutButton>
                    <Button
                      size="default"
                      variant="outline"
                      className="border-primary/30  hover:bg-primary/5 text-primary hover:text-[var(--color-primary-dark)] rounded-xl"
                    >
                      Sign Out
                    </Button>
                  </SignOutButton>
                </SheetFooter>
              </SignedIn>
              <SignedOut>
                <SheetFooter>
                  <SignInButton>
                    <Button
                      size="default"
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/5 text-primary hover:text-[var(--color-primary-dark)] rounded-xl"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </SheetFooter>
              </SignedOut>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
