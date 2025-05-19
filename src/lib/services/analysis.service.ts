import { connectToDatabase } from "../db";
import { Analysis } from "../../models/analysis.model";
import { AnalysisSectionKey } from "../../types/analysis";

export interface CreateAnalysisParams {
  userId: string;
  prompt: string;
  activeAnalyses: AnalysisSectionKey[];
  resultsContent: Record<string, string | undefined>;
  title?: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  prompt: string;
  timestamp: Date;
  activeAnalyses: AnalysisSectionKey[];
  resultsContent: Record<string, string>;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveAnalysis(
  analysisData: CreateAnalysisParams
): Promise<AnalysisResult> {
  try {
    await connectToDatabase();

    // Filter out undefined values from resultsContent
    const cleanResultsContent: Record<string, string> = {};
    Object.entries(analysisData.resultsContent).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanResultsContent[key] = value;
      }
    });

    const newAnalysis = await Analysis.create({
      ...analysisData,
      resultsContent: cleanResultsContent,
      timestamp: new Date(),
    });
    return {
      id: newAnalysis._id.toString(),
      userId: newAnalysis.userId,
      prompt: newAnalysis.prompt,
      timestamp: newAnalysis.timestamp,
      activeAnalyses: newAnalysis.activeAnalyses,
      resultsContent: Object.fromEntries(newAnalysis.resultsContent),
      title: newAnalysis.title,
      createdAt: newAnalysis.createdAt,
      updatedAt: newAnalysis.updatedAt,
    };
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
}

export async function getAnalysesByUserId(
  userId: string
): Promise<AnalysisResult[]> {
  try {
    await connectToDatabase();

    const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 });

    return analyses.map((analysis) => ({
      id: analysis._id.toString(),
      userId: analysis.userId,
      prompt: analysis.prompt,
      timestamp: analysis.timestamp,
      activeAnalyses: analysis.activeAnalyses,
      resultsContent: Object.fromEntries(analysis.resultsContent),
      title: analysis.title,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching analyses:", error);
    throw error;
  }
}

export async function getAnalysisById(
  id: string
): Promise<AnalysisResult | null> {
  try {
    await connectToDatabase();

    const analysis = await Analysis.findById(id);

    if (!analysis) return null;

    return {
      id: analysis._id.toString(),
      userId: analysis.userId,
      prompt: analysis.prompt,
      timestamp: analysis.timestamp,
      activeAnalyses: analysis.activeAnalyses,
      resultsContent: Object.fromEntries(analysis.resultsContent),
      title: analysis.title,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching analysis by ID:", error);
    throw error;
  }
}

export async function deleteAnalysis(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    await connectToDatabase();

    const result = await Analysis.deleteOne({ _id: id, userId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting analysis:", error);
    throw error;
  }
}
