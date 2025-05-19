import { AnalysisSectionKey } from "@/types/analysis";

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

export interface SaveAnalysisParams {
  prompt: string;
  activeAnalyses: AnalysisSectionKey[];
  resultsContent: Record<string, string | undefined>;
  title?: string;
}

export async function saveAnalysis(
  params: SaveAnalysisParams
): Promise<AnalysisResult> {
  try {
    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save analysis");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
}

export async function getUserAnalyses(): Promise<AnalysisResult[]> {
  try {
    const response = await fetch("/api/analysis");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch analyses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analyses:", error);
    throw error;
  }
}

export async function getAnalysisById(id: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(`/api/analysis/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch analysis");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analysis:", error);
    throw error;
  }
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/analysis/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete analysis");
    }

    return true;
  } catch (error) {
    console.error("Error deleting analysis:", error);
    throw error;
  }
}
