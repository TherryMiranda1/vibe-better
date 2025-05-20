import { UserPromptResult } from "../server/userPrompt.service";

export interface CreateUserPromptParams {
  template: string;
  placeholders: string[];
  nivel: string;
  etapa: string;
  categoría: string;
  instrucciones: string;
  notas_para_el_uso: string;
  title: string;
}

export interface UpdateUserPromptParams extends Partial<CreateUserPromptParams> {}

export async function createUserPrompt(
  promptData: CreateUserPromptParams
): Promise<UserPromptResult> {
  const response = await fetch("/api/prompts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promptData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create user prompt");
  }

  return response.json();
}

export async function getUserPrompts(): Promise<UserPromptResult[]> {
  const response = await fetch("/api/prompts");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user prompts");
  }

  return response.json();
}

export async function getUserPromptById(id: string): Promise<UserPromptResult> {
  const response = await fetch(`/api/prompts/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user prompt");
  }

  return response.json();
}

export async function updateUserPrompt(
  id: string,
  updateData: UpdateUserPromptParams
): Promise<UserPromptResult> {
  const response = await fetch(`/api/prompts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user prompt");
  }

  return response.json();
}

export async function deleteUserPrompt(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/prompts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete user prompt");
  }

  return response.json();
}
