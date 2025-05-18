"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserCredits } from "@/lib/services/client/userCredits.service";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/context/store";

export function UserCredits() {
  const { user, isLoaded } = useUser();
  const userCredits = useUserStore((state) => state.userCredits);
  const updateUserCredits = useUserStore((state) => state.updateUserCredits);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCredits() {
      if (isLoaded && user) {
        try {
          setIsLoading(true);
          const userCredits = await getUserCredits();
          updateUserCredits(userCredits);
        } catch (error) {
          console.error("Error fetching user credits:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchCredits();
  }, [user, isLoaded]);

  if (!isLoaded || !user || isLoading) {
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
