import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { UserCredits } from "./user-credits";
import { Button } from "./ui/button";

export default function HeaderActions() {
  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-3">
          <UserCredits />
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
    </>
  );
}
