import type { AnalysisSectionKey } from "@/types/analysis";
import {
  Puzzle,
  Boxes,
  SlidersHorizontal,
  FilePenLine,
  Award,
  type LucideIcon,
} from "lucide-react";

const createAnalysisConfig = <
  T extends Record<
    AnalysisSectionKey,
    { title: string; Icon: LucideIcon; instruction: string }
  >,
>(
  config: T
): T => config;

export const LOADING_EVENT_VALUE = "__ANALYSIS_SECTION_LOADING__";

export const analysisConfig = createAnalysisConfig({
  complexity: {
    title: "Complexity Analysis",
    Icon: Puzzle,
    instruction:
      "You're an AI assistant specialized in evaluating the complexity of coding tasks based on a detailed scoring system...",
  },
  dependencies: {
    title: "Dependencies Analysis",
    Icon: Boxes,
    instruction:
      "Analyze whether external dependencies are required for the requested task. First, consider whether the functionality can be achieved using native browser APIs, built-in framework features, or simple custom code. Suggest external dependencies ONLY if the functionality is impossible without them or if implementing it from scratch would be excessively complex or redundant (e.g., for advanced date manipulation, complex global state management, or UI component libraries for established frameworks). If no crucial external dependencies are needed or they don't provide significant benefit, your ENTIRE AND ONLY RESPONSE MUST BE: 'No external dependencies are required for this task.' Or, if applicable: 'This can be done with native framework/browser features.' DO NOT ADD ANYTHING ELSE TO THIS RESPONSE. If you suggest dependencies, list each one on a new line (MAXIMUM 15), using the format: 'LibraryName: VERY BRIEF justification (e.g., 3–7 words)'. Be concise in the justifications.",
  },
  features: {
    title: "Features Analysis",
    Icon: SlidersHorizontal,
    instruction:
      'Detect and list the key functionalities described or implied in the prompt. Each functionality should be on a new line, ideally starting with a dash or list identifier (e.g., "- Functionality X").',
  },
  suggestedPrompt: {
    title: "Suggested Prompt",
    Icon: FilePenLine,
    instruction:
      "This prompt is used in a specialized flow. Rewrite the original prompt to improve it. Generate a concise version and an elaborated version.",
  },
  score: {
    title: "Global Score",
    Icon: Award,
    instruction:
      'Assign a score from 0 to 100 evaluating the clarity, specificity, completeness, and effective use of technical tags/concepts from the original prompt, considering its apparent complexity. Briefly justify the score. Your response format MUST be "SCORE/100: Concise justification." Example: "85/100: The prompt is clear and specific, but could benefit from more detail on X. In the prompt Language"',
  },
});

// Order matters for API processing if one depends on another
export const analysisOrder: AnalysisSectionKey[] = [
  "complexity",
  "dependencies",
  "features",
  // 'recommendations', // Removed
  "suggestedPrompt",
  "score",
];
