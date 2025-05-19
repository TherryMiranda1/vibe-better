import { auth, clerkClient } from "@clerk/nextjs/server";

// Define credit amounts for different subscription plans
const SUBSCRIPTION_CREDITS: Record<string, number> = {
  "Plan User Full": 3000,
  "Plan User Basic": 1000,
  "Plan User Premium": 8000,
  "Plan User": Infinity, // Unlimited analyses
  // Add other plans as needed
};

/**
 * Validates if the user has an active subscription and returns the number of credits
 * associated with that subscription plan.
 *
 * @returns The number of credits available from the subscription or 0 if no subscription is active
 */
export async function validateUserSubscription(): Promise<number> {
  try {
    const { userId, orgId } = await auth();

    if (!orgId) {
      return 0; // No organization, so no subscription
    }

    // Get the organization
    const clerk = await clerkClient();
    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId,
    });
    if (!organization) {
      return 0;
    }

    // Get the organization's subscriptions
    const memberships = await clerk.organizations.getOrganizationMembershipList(
      { organizationId: orgId }
    );
    if (!memberships.data.length) {
      return 0;
    }

    // We already have the organization from above, no need to fetch it again

    // Check if the organization has any subscription metadata
    const planName = organization.publicMetadata?.planName as string;
    if (!planName) {
      return 0;
    }

    // Return credits based on the plan name
    return SUBSCRIPTION_CREDITS[planName] || 0;
  } catch (error) {
    console.error("Error validating user subscription:", error);
    return 0;
  }
}

/**
 * Checks if the user's organization has an active subscription and returns
 * information about the subscription.
 *
 * @returns Object containing subscription status and available credits
 */
export async function getUserSubscriptionInfo(): Promise<{
  plan: string | null;
}> {
  try {
    const { has } = await auth();

    const hasPlanUser = has({ plan: "plan_user" });
    const hasPlanOrganization = has({ plan: "plan_organization" });

    if (!hasPlanUser && !hasPlanOrganization) {
      return {
        plan: null,
      };
    }

    if (hasPlanUser) {
      return {
        plan: "plan_user",
      };
    }

    return {
      plan: "plan_organization",
    };
  } catch (error) {
    console.error("Error getting user subscription info:", error);
    return {
      plan: null,
    };
  }
}
