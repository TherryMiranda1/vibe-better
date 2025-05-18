import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { User } from "@/types/user";

async function fetchUserData(userId: string | null): Promise<User | null> {
  if (!userId) return null;
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export function useUser() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId || null),
    enabled: !!userId && isLoaded && isSignedIn,
  });
  
  return {
    user,
    isLoading: !isLoaded || isLoading,
    isSignedIn,
    error,
  };
}
