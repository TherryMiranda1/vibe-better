import mongoose, { Schema, Document } from "mongoose";

export interface IUserContext extends Document {
  userId: string;
  content: string;
  category?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserContextSchema = new Schema<IUserContext>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserContext =
  mongoose.models.UserContext ||
  mongoose.model<IUserContext>("UserContext", UserContextSchema);
