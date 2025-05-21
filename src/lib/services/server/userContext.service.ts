import { connectToDatabase } from "../../db";
import { UserContext } from "../../../models/userContext.model";

export interface CreateUserContextParams {
  userId: string;
  content: string;
  category?: string;
  slug?: string;
}

export interface UserContextResult {
  id: string;
  userId: string;
  content: string;
  category?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveUserContext(
  contextData: CreateUserContextParams
): Promise<UserContextResult> {
  try {
    await connectToDatabase();

    const newContext = await UserContext.create(contextData);

    return {
      id: newContext._id.toString(),
      userId: newContext.userId,
      content: newContext.content,
      category: newContext.category,
      slug: newContext.slug,
      createdAt: newContext.createdAt,
      updatedAt: newContext.updatedAt,
    };
  } catch (error) {
    console.error("Error saving user context:", error);
    throw error;
  }
}

export async function getUserContextsByUserId(
  userId: string
): Promise<UserContextResult[]> {
  try {
    await connectToDatabase();

    const contexts = await UserContext.find({ userId }).sort({ createdAt: -1 });

    return contexts.map((context) => ({
      id: context._id.toString(),
      userId: context.userId,
      content: context.content,
      category: context.category,
      slug: context.slug,
      createdAt: context.createdAt,
      updatedAt: context.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching user contexts:", error);
    throw error;
  }
}

export async function getUserContextById(
  id: string
): Promise<UserContextResult | null> {
  try {
    await connectToDatabase();

    const context = await UserContext.findById(id);

    if (!context) return null;

    return {
      id: context._id.toString(),
      userId: context.userId,
      content: context.content,
      category: context.category,
      slug: context.slug,
      createdAt: context.createdAt,
      updatedAt: context.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching user context by ID:", error);
    throw error;
  }
}

export async function updateUserContext(
  id: string,
  userId: string,
  updateData: Partial<CreateUserContextParams>
): Promise<UserContextResult | null> {
  try {
    await connectToDatabase();

    const updatedContext = await UserContext.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedContext) return null;

    return {
      id: updatedContext._id.toString(),
      userId: updatedContext.userId,
      content: updatedContext.content,
      category: updatedContext.category,
      slug: updatedContext.slug,
      createdAt: updatedContext.createdAt,
      updatedAt: updatedContext.updatedAt,
    };
  } catch (error) {
    console.error("Error updating user context:", error);
    throw error;
  }
}

export async function deleteUserContext(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    await connectToDatabase();

    const result = await UserContext.deleteOne({ _id: id, userId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting user context:", error);
    throw error;
  }
}
