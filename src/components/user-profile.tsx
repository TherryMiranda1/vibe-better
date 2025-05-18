import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = [
    user.firstName?.[0] || "",
    user.lastName?.[0] || "",
  ].filter(Boolean).join("");

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.imageUrl} alt={user.firstName || "User"} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials || user.email[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email}
        </p>
        {user.firstName && user.lastName && (
          <p className="text-sm text-muted-foreground">{user.email}</p>
        )}
      </div>
    </div>
  );
}
