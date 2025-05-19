"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

type Subscription = {
  id: string;
  status: string;
  plan: {
    name: string;
  };
};

export function UserSubscription() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganization();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!organization) {
        setLoading(false);
        return;
      }

      try {
        const subs = await organization.getSubscriptions();
        setSubscriptions(subs.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [organization]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted"></div>
        <span className="text-muted-foreground">Loading subscription...</span>
      </div>
    );
  }

  // Only show active subscriptions
  const activeSubscription = subscriptions?.find(
    (sub) => sub.status === "active"
  );

  if (!activeSubscription) {
    return null; // Don't show anything if no active subscription
  }

  return (
    <Badge
      variant="outline"
      className="flex items-center gap-2 bg-primary/10 text-xs px-4 py-2 font-medium rounded-xl"
    >
      <Zap className="h-4 w-4 text-primary" />
      {activeSubscription.plan.name}
    </Badge>
  );
}
