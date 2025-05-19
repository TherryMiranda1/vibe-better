"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import type { StructuredNextStepsResult, TokenUsage } from "@/types/analysis";

// Zod Schema for Input
const GenerateNextStepsInputSchema = z.object({
  prompt: z.string().describe("The user prompt to generate next steps for."),
});
export type GenerateNextStepsInput = z.infer<typeof GenerateNextStepsInputSchema>;

// Zod Schema for individual step item (part of LLM output)
const NextStepItemSchema = z.object({
  title: z.string().describe("Brief, action-oriented title for the step."),
  description: z.string().describe("Detailed explanation of what needs to be done for this step."),
  priority: z.enum(["high", "medium", "low"]).describe("Priority of the step."),
  estimatedEffort: z.string().optional().describe("Rough time estimate (e.g., '2-4 hours', '1 day')."),
  technicalConsiderations: z.array(z.string()).optional().describe("List of technical points to consider for this step."),
});

// Zod Schema for what the LLM is expected to generate
const GenerateNextStepsLLMOutputSchema = z.object({
  steps: z.array(NextStepItemSchema).describe("A list of structured next steps for implementation."),
});

// Define the Genkit Prompt
const generateNextStepsGenkitPrompt = ai.definePrompt({
  name: "generateNextStepsPrompt",
  input: { schema: GenerateNextStepsInputSchema },
  output: { schema: GenerateNextStepsLLMOutputSchema },
  prompt: `You are a senior software architect tasked with breaking down implementation steps for a development task. 
Analyze the following prompt and provide a structured list of next steps for implementation:

{{{prompt}}}

Your output MUST be a JSON object adhering to the defined output schema. 
DO NOT include a 'usage' field in your JSON response; that will be handled separately.

Provide a JSON response following this structure (ensure keys and values are double-quoted):
{
  "steps": [
    {
      "title": "Brief, action-oriented title",
      "description": "Detailed explanation of what needs to be done",
      "priority": "high|medium|low",
      "estimatedEffort": "Rough time estimate (e.g., '2-4 hours', '1 day')",
      "technicalConsiderations": ["List of technical points to consider"]
    }
    // ... more steps if necessary
  ]
}

Focus on concrete, actionable steps that move the implementation forward. Order steps by priority. 
Include any setup, configuration, or dependency management tasks needed. Be thorough. Max 5 steps.`,
});

// Define the Genkit Flow
const generateNextStepsFlow = ai.defineFlow(
  {
    name: "generateNextStepsFlow",
    inputSchema: GenerateNextStepsInputSchema,
    outputSchema: GenerateNextStepsLLMOutputSchema, // The flow will add 'usage' later
  },
  async (input: GenerateNextStepsInput): Promise<StructuredNextStepsResult> => {
    const { output, usage } = await generateNextStepsGenkitPrompt(input);

    if (!output) {
      throw new Error("Failed to get valid structured next steps from AI.");
    }

    // The 'output' here matches GenerateNextStepsLLMOutputSchema (just 'steps')
    // We combine it with 'usage' to match StructuredNextStepsResult
    return {
      ...output, // Contains 'steps'
      usage: usage as TokenUsage, // Cast usage to TokenUsage if necessary, Genkit usage might be slightly different
    };
  }
);

// Exported function to be called by the API route
export async function generateNextSteps(
  params: GenerateNextStepsInput
): Promise<StructuredNextStepsResult> {
  try {
    return await generateNextStepsFlow(params);
  } catch (error) {
    console.error("[generateNextStepsFlow] Error:", error);
    // Return a structured error that AnalysisSection can parse if needed
    // Or rethrow a more specific error to be caught by the API route
    throw new Error(
      `Error generating next steps: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
