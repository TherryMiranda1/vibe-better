// use server'
"use server";
/**
 * @fileOverview This file defines a Genkit flow for scoring a prompt based on clarity,
 * specificity, tag usage, and its appropriateness for the task's apparent complexity.
 *
 * - scorePrompt - An async function that takes a prompt string as input and returns a score.
 * - ScorePromptInput - The input type for the scorePrompt function.
 * - ScorePromptOutput - The output type for the scorePrompt function, including token usage.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import type { TokenUsage } from "@/types/analysis";

const ScorePromptInputSchema = z.object({
  prompt: z.string().describe("The prompt to be scored."),
});
export type ScorePromptInput = z.infer<typeof ScorePromptInputSchema>;

// This schema defines what the LLM should generate
const ScorePromptLLMOutputSchema = z.object({
  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "A score from 0 to 100 representing the prompt quality based on clarity, specificity, and appropriateness for its apparent complexity."
    ),
  explanation: z
    .string()
    .describe(
      "Explanation of the assigned score, describing the prompt quality and how the score was determined, considering its complexity. In Spanish."
    ),
});

// This is the actual output type of the flow
export type ScorePromptOutput = z.infer<typeof ScorePromptLLMOutputSchema> & {
  usage?: TokenUsage;
};

export async function scorePrompt(
  input: ScorePromptInput
): Promise<ScorePromptOutput> {
  return scorePromptFlow(input);
}

const scorePromptPrompt = ai.definePrompt({
  name: "scorePromptPrompt",
  input: { schema: ScorePromptInputSchema },
  output: { schema: ScorePromptLLMOutputSchema }, // LLM generates this
  prompt: `You are an expert in evaluating AI prompts. You will receive a prompt and assign a score from 0 to 100 based on the clarity and specificity of the prompt.  
Your output MUST be a JSON object that adheres to the defined output schema (score, explanation). DO NOT include the 'usage' field in your JSON response.

When assigning the score, consider the effectiveness of the prompt *in relation to its apparent complexity*.
- A good prompt for a **simple** task should be clear and direct.
- A good prompt for a **complex** task should not only be clear and specific but also demonstrate an understanding of the task’s scope. This could be reflected in including sufficient details, suggesting an appropriate structure, or implicitly acknowledging the need for breakdown if the original prompt is too ambitious for a single step. A very short prompt for a clearly complex task might receive a lower score if it lacks the necessary detail for an AI to succeed. Conversely, an overly verbose prompt for a very simple task could also lose points for lack of conciseness and clarity.

Provide a detailed explanation for the score IN SPANISH, including how each factor (clarity, specificity, use of tags, appropriateness to task complexity) influenced the final score.

Prompt to evaluate:
{{{prompt}}}
`,
});

const scorePromptFlow = ai.defineFlow(
  {
    name: "scorePromptFlow",
    inputSchema: ScorePromptInputSchema,
    outputSchema: ScorePromptLLMOutputSchema, // Flow's overall output structure will be this + usage
  },
  async (input): Promise<ScorePromptOutput> => {
    const { output, usage } = await scorePromptPrompt(input);
    if (!output) {
      throw new Error("No se pudo obtener la puntuación del prompt de la IA.");
    }
    return { ...output, usage };
  }
);
