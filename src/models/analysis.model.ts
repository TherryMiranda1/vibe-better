import mongoose, { Schema, Document } from "mongoose";
import { AnalysisSectionKey } from "../types/analysis";

export interface IAnalysis extends Document {
  userId: string;
  prompt: string;
  timestamp: Date;
  activeAnalyses: AnalysisSectionKey[];
  resultsContent: Record<string, string>;
  title?: string;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    activeAnalyses: [{
      type: String,
      enum: ["complexity", "dependencies", "features", "nextSteps", "suggestedPrompt", "score"],
    }],
    resultsContent: {
      type: Map,
      of: String,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Analysis = mongoose.models.Analysis || mongoose.model<IAnalysis>("Analysis", AnalysisSchema);
