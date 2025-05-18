import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  id: string;
  stripe_customer_id: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    stripe_customer_id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster lookups
CustomerSchema.index({ stripe_customer_id: 1 });

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
