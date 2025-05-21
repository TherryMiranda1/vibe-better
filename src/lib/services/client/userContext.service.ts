import { UserContextResult } from "../server/userContext.service";

export interface CreateUserContextParams {
  content: string;
  slug: string;
  category?: string;
}

export interface UpdateUserContextParams
  extends Partial<CreateUserContextParams> {}

export async function createUserContext(
  contextData: CreateUserContextParams
): Promise<UserContextResult> {
  const response = await fetch("/api/userContexts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contextData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create user context");
  }

  return response.json();
}

export async function getUserContexts(): Promise<UserContextResult[]> {
  const response = await fetch("/api/userContexts");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user contexts");
  }

  return response.json();
}

export async function getUserContextById(
  id: string
): Promise<UserContextResult> {
  const response = await fetch(`/api/userContexts/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user context");
  }

  return response.json();
}

export async function updateUserContext(
  id: string,
  updateData: UpdateUserContextParams
): Promise<UserContextResult> {
  const response = await fetch(`/api/userContexts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user context");
  }

  return response.json();
}

export async function deleteUserContext(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/userContexts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete user context");
  }

  return response.json();
}
