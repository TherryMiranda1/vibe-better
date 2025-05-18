import mongoose, { Schema, Document } from "mongoose";

export interface IPurchase extends Document {
  userId: string;
  productId: string;
  priceId: string;
  paymentIntentId: string;
  sessionId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    priceId: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["complete", "pending", "failed"],
      default: "complete",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for faster lookups
PurchaseSchema.index({ userId: 1, productId: 1 });
PurchaseSchema.index({ sessionId: 1 });
PurchaseSchema.index({ paymentIntentId: 1 });

export const Purchase = mongoose.models.Purchase || mongoose.model<IPurchase>("Purchase", PurchaseSchema);
