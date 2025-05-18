import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  email: string;
  name: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
