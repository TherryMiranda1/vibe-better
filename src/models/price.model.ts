import mongoose, { Schema, Document } from "mongoose";

export interface IPrice extends Document {
  id: string;
  product_id: string;
  active: boolean;
  currency: string;
  type: string;
  unit_amount: number | null;
  interval: string | null;
  interval_count: number | null;
  trial_period_days: number | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, string>;
  description: string | null;
}

const PriceSchema = new Schema<IPrice>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    unit_amount: {
      type: Number,
      default: null,
    },
    interval: {
      type: String,
      default: null,
    },
    interval_count: {
      type: Number,
      default: null,
    },
    trial_period_days: {
      type: Number,
      default: null,
    },
    created_at: {
      type: String,
      required: true,
    },
    updated_at: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: false, // We'll handle timestamps manually to match Stripe's format
  }
);

// Create index for faster lookups
PriceSchema.index({ product_id: 1 });

export const Price = mongoose.models.Price || mongoose.model<IPrice>("Price", PriceSchema);
