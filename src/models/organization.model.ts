import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  clerkId: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Organization = mongoose.models.Organization || mongoose.model<IOrganization>("Organization", OrganizationSchema);
