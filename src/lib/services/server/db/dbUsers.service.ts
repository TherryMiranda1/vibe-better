import { Purchase } from "@/models/purchase.model";
import { connectToDatabase } from "@/lib/db";

const getUserPurchases = async (userId: string) => {
  await connectToDatabase();

  try {
    const purchases = await Purchase.find({ userId }).lean();
    return purchases;
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return [];
  }
};

export const dbUserService = {
  getUserPurchases,
};
