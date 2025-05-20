import { connectToDatabase } from "../../db";
import { FeedbackCategory } from "@/types/feedback";
import { Feedback } from "@/models/feedback.model";

export interface CreateFeedbackParams {
  userId?: string;
  rating: number;
  category: FeedbackCategory;
  message: string;
  name?: string | null;
  email?: string | null;
  allowPublic: boolean;
}

export interface FeedbackResult {
  id: string;
  userId?: string | null;
  rating: number;
  category: FeedbackCategory;
  message: string;
  name?: string | null;
  email?: string | null;
  allowPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveFeedback(
  feedbackData: CreateFeedbackParams
): Promise<FeedbackResult> {
  try {
    await connectToDatabase();

    const newFeedback = await Feedback.create(feedbackData);

    return {
      id: newFeedback._id.toString(),
      userId: newFeedback.userId || null,
      rating: newFeedback.rating,
      category: newFeedback.category,
      message: newFeedback.message,
      name: newFeedback.name || null,
      email: newFeedback.email || null,
      allowPublic: newFeedback.allowPublic,
      createdAt: newFeedback.createdAt,
      updatedAt: newFeedback.updatedAt,
    };
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }
}

export async function getFeedbackByUserId(
  userId: string
): Promise<FeedbackResult[]> {
  try {
    await connectToDatabase();

    const feedbacks = await Feedback.find({ userId }).sort({
      createdAt: -1,
    });

    return feedbacks.map((feedback) => ({
      id: feedback._id.toString(),
      userId: feedback.userId || null,
      rating: feedback.rating,
      category: feedback.category,
      message: feedback.message,
      name: feedback.name || null,
      email: feedback.email || null,
      allowPublic: feedback.allowPublic,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    throw error;
  }
}

export async function getFeedbackById(
  id: string
): Promise<FeedbackResult | null> {
  try {
    await connectToDatabase();

    const feedback = await Feedback.findById(id);

    if (!feedback) return null;

    return {
      id: feedback._id.toString(),
      userId: feedback.userId || null,
      rating: feedback.rating,
      category: feedback.category,
      message: feedback.message,
      name: feedback.name || null,
      email: feedback.email || null,
      allowPublic: feedback.allowPublic,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    throw error;
  }
}

export async function getPublicFeedback(): Promise<FeedbackResult[]> {
  try {
    await connectToDatabase();

    const feedbacks = await Feedback.find({ allowPublic: true })
      .sort({ createdAt: -1 })
      .limit(20);

    return feedbacks.map((feedback) => ({
      id: feedback._id.toString(),
      userId: feedback.userId || null,
      rating: feedback.rating,
      category: feedback.category,
      message: feedback.message,
      name: feedback.name || null,
      email: feedback.email || null,
      allowPublic: feedback.allowPublic,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching public feedback:", error);
    throw error;
  }
}
