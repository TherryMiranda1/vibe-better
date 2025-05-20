import { FeedbackCategory } from "@/types/feedback";

export interface FeedbackResult {
  id: string;
  userId: string;
  rating: number;
  category: FeedbackCategory;
  message: string;
  name?: string | null;
  email?: string | null;
  allowPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedbackParams {
  rating: number;
  category: FeedbackCategory;
  message: string;
  name?: string | null;
  email?: string | null;
  allowPublic: boolean;
}

export async function createFeedback(
  feedbackData: CreateFeedbackParams
): Promise<FeedbackResult> {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit feedback");
  }

  return response.json();
}

export async function getUserFeedback(): Promise<FeedbackResult[]> {
  const response = await fetch("/api/feedback");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user feedback");
  }

  return response.json();
}

export async function getFeedbackById(id: string): Promise<FeedbackResult> {
  const response = await fetch(`/api/feedback/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch feedback");
  }

  return response.json();
}
