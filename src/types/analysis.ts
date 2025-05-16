import type { LucideIcon } from "lucide-react";

export interface TokenUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export type AnalysisSectionKey =
  | "complexity"
  | "dependencies"
  | "features"
  // | 'recommendations' // Removed
  | "suggestedPrompt"
  | "score";

export interface AnalysisSectionData {
  title: string;
  Icon: LucideIcon;
  instruction: string;
  content?: string;
  isLoading: boolean;
  usage?: TokenUsage;
}

export type AnalysisSections = Record<AnalysisSectionKey, AnalysisSectionData>;

export interface AnalysisUpdateEvent {
  key: AnalysisSectionKey;
  value: string;
}

// Types for Structured Complexity Result (as parsed from content string)
export interface ComplexityDimensionScore {
  category: string;
  points: number;
  criteria: string;
}

export interface StructuredComplexityResult {
  dimension: ComplexityDimensionScore;
  generality: ComplexityDimensionScore;
  dependencies: ComplexityDimensionScore;
  totalPoints: number;
  complexityLevel: string;
  levelDescription: string;
  feedback?: string;
  // `usage` is part of the flow's overall output, not LLM generated for this specific schema
}

// Types for Structured Suggested Prompt Result (as parsed from content string)
export interface StructuredSuggestedPromptResult {
  conciseSuggestedPrompt: string;
  elaboratedSuggestedPrompt: string;
  // `usage` is part of the flow's overall output
}

// Types for Score Prompt Result (as parsed from content string)
export interface StructuredScoreResult {
  score: number;
  explanation: string;
  // `usage` is part of the flow's overall output
}

// Stored History Types
export interface StoredAnalysisSectionResult {
  content?: string;
}

export interface HistoryEntry {
  id: string;
  prompt: string;
  timestamp: number;
  activeAnalyses: AnalysisSectionKey[];
  resultsContent: Record<string, string | undefined>;
}

export interface TechnicalTag {
  id: string;
  name: string;
  description: string;
  category: string;
}
