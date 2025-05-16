import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

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

          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignUpButton fallbackRedirectUrl="/">
              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 text-primary hover:text-[var(--color-primary-dark)] rounded-xl"
              >
                Sign In
              </Button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
