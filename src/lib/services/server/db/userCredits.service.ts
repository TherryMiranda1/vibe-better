import { UserCredit } from "@/models/userCredit.model";
import { Product } from "@/models/product.model";
import connectToDatabase from "@/lib/db";
import { logger } from "@/lib/logger/Logger";

/**
 * Updates user credits based on a product purchase
 * If the user doesn't have a credit record, it creates one
 * If the user already has credits, it adds the new credits to the existing amount
 */
const updateUserCredits = async (
  userId: string,
  productId: string
): Promise<{ success: boolean; message: string; credits?: number }> => {
  await connectToDatabase();

  try {
    // Get the product to check if it has credits metadata
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return {
        success: false,
        message: `Product with ID ${productId} not found`,
      };
    }

    // Check if the product has credits metadata
    const creditsStr = product.metadata?.get("credits");

    if (!creditsStr) {
      return {
        success: true,
        message: "Product doesn't provide credits",
        credits: 0,
      };
    }

    // Parse credits from metadata
    const creditsToAdd = parseInt(creditsStr, 10);
    if (isNaN(creditsToAdd)) {
      return {
        success: false,
        message: `Invalid credits value in product metadata: ${creditsStr}`,
      };
    }

    // Find or create user credit record
    const userCredit = await UserCredit.findOneAndUpdate(
      { userId },
      { $inc: { credits: creditsToAdd } },
      { upsert: true, new: true }
    );
    return {
      success: true,
      message: `Credits updated successfully. Added ${creditsToAdd} credits.`,
      credits: userCredit.credits,
    };
  } catch (error) {
    logger.error("Error updating user credits:", error);
    throw new Error(`User credits update failed: ${(error as Error).message}`);
  }
};

/**
 * Gets the current credits for a user
 */
const getUserCredits = async (userId: string): Promise<number> => {
  await connectToDatabase();

  try {
    const userCredit = await UserCredit.findOne({ userId });
    return userCredit?.credits || 0;
  } catch (error) {
    logger.error("Error getting user credits:", error);
    throw new Error(`Failed to get user credits: ${(error as Error).message}`);
  }
};

/**
 * Deducts credits from a user's balance
 * Returns true if successful, false if insufficient credits
 */
const deductUserCredits = async (
  userId: string,
  amount: number
): Promise<boolean> => {
  await connectToDatabase();

  try {
    // First check if user has enough credits
    const userCredit = await UserCredit.findOne({ userId });
    console.log({ userCredit });
    if (!userCredit || userCredit.credits < amount) {
      logger.error("Not enough credits");
      return false; // Insufficient credits
    }

    // Update the credits
    await UserCredit.updateOne({ userId }, { $inc: { credits: -amount } });

    logger.info("Credits deducted successfully");
    return true;
  } catch (error) {
    logger.error("Error deducting user credits:", error);
    throw new Error(
      `Failed to deduct user credits: ${(error as Error).message}`
    );
  }
};

export const userCreditsService = {
  updateUserCredits,
  getUserCredits,
  deductUserCredits,
};
