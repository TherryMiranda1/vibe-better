import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "./services/user.service";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }
    
    const user = await getUserByClerkId(clerkUser.id);
    
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
