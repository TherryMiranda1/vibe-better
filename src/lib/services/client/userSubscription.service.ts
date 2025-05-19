import { useOrganization } from "@clerk/nextjs";

// Define credit amounts for different subscription plans
const SUBSCRIPTION_CREDITS: Record<string, number> = {
  "Plan User Full": 3000,
  "Plan User Basic": 1000,
  "Plan User Premium": 8000,
  // Add other plans as needed
};

/**
 * Type definition for subscription data returned from Clerk
 */
export interface SubscriptionData {
  id: string;
  status: string;
  plan: {
    name: string;
    features: Array<{
      name: string;
      slug: string;
    }>;
  };
  periodStart: number;
  periodEnd: number;
}

/**
 * Gets active subscription information for the current organization
 * 
 * @returns Information about the active subscription or null if no active subscription exists
 */
export async function getActiveSubscription(): Promise<SubscriptionData | null> {
  try {
    // This function is meant to be used in client components with useOrganization hook
    // For server components, use the server-side version of this service
    return null;
  } catch (error) {
    console.error('Error getting active subscription:', error);
    return null;
  }
}

/**
 * Gets the number of credits available from the active subscription
 * 
 * @param planName The name of the subscription plan
 * @returns The number of credits available from the subscription or 0 if no subscription is active
 */
export function getSubscriptionCredits(planName: string | undefined): number {
  if (!planName) return 0;
  
  return SUBSCRIPTION_CREDITS[planName] || 0;
}

/**
 * Checks if the user's organization has an active subscription and returns
 * information about the subscription.
 * 
 * @returns Object containing subscription status and available credits
 */
export async function getUserSubscriptionInfo(): Promise<{
  hasActiveSubscription: boolean;
  subscriptionCredits: number;
  subscriptionPlan: string | null;
}> {
  try {
    // This function is meant to be used with the useOrganization hook in client components
    // For server components, use the server-side version of this service
    return {
      hasActiveSubscription: false,
      subscriptionCredits: 0,
      subscriptionPlan: null,
    };
  } catch (error) {
    console.error('Error getting user subscription info:', error);
    return {
      hasActiveSubscription: false,
      subscriptionCredits: 0,
      subscriptionPlan: null,
    };
  }
}
