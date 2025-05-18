import { connectToDatabase } from "../db";
import { User } from "../../models/user.model";
import { CreateUserParams, UpdateUserParams, User as UserType } from "../../types/user";

export async function createUser(userData: CreateUserParams): Promise<UserType> {
  try {
    await connectToDatabase();
    
    const userExists = await User.findOne({ 
      $or: [
        { clerkId: userData.clerkId },
        { email: userData.email }
      ]
    });

    if (userExists) {
      throw new Error("User already exists");
    }

    const newUser = await User.create(userData);
    
    return {
      id: newUser._id.toString(),
      clerkId: newUser.clerkId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      imageUrl: newUser.imageUrl,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ clerkId });
    
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    throw error;
  }
}

export async function updateUser(clerkId: string, userData: UpdateUserParams): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: userData },
      { new: true }
    );
    
    if (!updatedUser) return null;
    
    return {
      id: updatedUser._id.toString(),
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      imageUrl: updatedUser.imageUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(clerkId: string): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const result = await User.deleteOne({ clerkId });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
