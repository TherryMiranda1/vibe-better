"use client";

import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export interface UserCreditsProps {
  userCredits: number | null;
  isLoading: boolean;
}

export function UserCredits({ userCredits, isLoading }: UserCreditsProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-12 h-6 rounded-md border animate-pulse bg-primary/5" />
    );
  }

  if (userCredits === null) {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/pricing")}
      className="flex items-center gap-1 px-3 py-1 bg-primary/5 rounded-lg text-primary"
    >
      <Zap size={16} className="text-primary" />
      <span className="font-medium">{userCredits}</span>
    </button>
  );
}
