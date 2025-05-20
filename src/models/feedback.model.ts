import { model, models, Schema, Document } from "mongoose";
import { FeedbackCategory } from "../types/feedback";

export interface IFeedback extends Document {
  userId: string;
  rating: number;
  category: FeedbackCategory;
  message: string;
  name?: string;
  email?: string;
  allowPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: String,
      index: true,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: Object.values(FeedbackCategory),
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    allowPublic: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback =
  models.Feedback || model<IFeedback>("Feedback", FeedbackSchema);
