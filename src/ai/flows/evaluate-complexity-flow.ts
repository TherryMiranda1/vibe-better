"use server";
/**
 * @fileOverview A Genkit flow for evaluating coding task complexity based on a structured scoring system.
 *
 * - evaluateComplexity - A function that takes a prompt and returns a structured complexity assessment.
 * - EvaluateComplexityInput - The input type for the evaluateComplexity function.
 * - EvaluateComplexityOutput - The output type for the evaluateComplexity function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import type { TokenUsage } from "@/types/analysis";

const EvaluateComplexityInputSchema = z.object({
  prompt: z
    .string()
    .describe("The coding-related prompt to be evaluated for complexity."),
});
export type EvaluateComplexityInput = z.infer<
  typeof EvaluateComplexityInputSchema
>;

const ComplexityDimensionSchema = z.object({
  category: z
    .string()
    .describe(
      "Category of the dimension (e.g., Very Small, Common, Mainstream)."
    ),
  points: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe("Points assigned to this dimension (1–5)."),
  criteria: z
    .string()
    .describe(
      "Specific criterion that justifies the category and points for this dimension."
    ),
});

// This schema defines what the LLM should generate, NOT including the token usage.
const EvaluateComplexityLLMOutputSchema = z.object({
  dimension: ComplexityDimensionSchema.describe(
    "Evaluation of the implementation dimension (scale 1–5)."
  ),
  generality: ComplexityDimensionSchema.describe(
    "Evaluation of the implementation generality (scale 1–5)."
  ),
  dependencies: ComplexityDimensionSchema.describe(
    "Evaluation of dependency/library complexity (scale 1–5)."
  ),
  totalPoints: z
    .number()
    .int()
    .min(3)
    .max(15)
    .describe("Total sum of points across the three dimensions (scale 3–15)."),
  complexityLevel: z
    .string()
    .describe(
      "Resulting complexity level (Very Low, Low, Moderate, High, Very High) based on the 3–15 scale."
    ),
  levelDescription: z
    .string()
    .describe(
      "Brief description of the complexity level based on the 3–15 scale."
    ),
  feedback: z
    .string()
    .optional()
    .describe("Optional suggestions for the user based on the evaluation."),
});

// This is the actual output type of the flow, including the LLM's output AND the token usage.
export type EvaluateComplexityOutput = z.infer<
  typeof EvaluateComplexityLLMOutputSchema
> & { usage?: TokenUsage };

export async function evaluateComplexity(
  input: EvaluateComplexityInput
): Promise<EvaluateComplexityOutput> {
  return evaluateComplexityFlow(input);
}

const evaluateComplexityPrompt = ai.definePrompt({
  name: "evaluateComplexityPrompt",
  input: { schema: EvaluateComplexityInputSchema },
  output: { schema: EvaluateComplexityLLMOutputSchema }, // LLM generates this structure
  prompt: `You are an AI assistant specialized in evaluating the complexity of coding tasks using a detailed scoring system.  
  Your output MUST be a JSON object that adheres to the defined output schema. DO NOT include the ‘usage’ field in your JSON response; that will be handled separately.  
  You MUST detect the language of the original {{{prompt}}} and your output MUST be in that same language.
  
  First, evaluate the prompt against the following three dimensions, each on a 1–5 point scale:
  
  1. Implementation Dimension  
     Evaluate the functional and structural size of the requested task.  
     Category | Criterion | Points  
     Very Small | Style change, one color, adding text | 1  
     Small | Simple functional component, basic input validation | 2  
     Medium | Full forms, basic CRUD, conditional logic | 3  
     Large | Multiple connected components, external API integration | 4  
     Very Large | Complete application, multiple modules, complex architecture | 5  
  
  2. Implementation Generality  
     Evaluate whether the request is something common or highly specific (niche).  
     Category | Criterion | Points  
     Very Common | Repetitive patterns (buttons, forms, modals, tables) | 1  
     Common | Authentication, Stripe integration, dashboards | 2  
     Moderately Common | Standard combinations with tweaks | 3  
     Uncommon | Custom functions, unique business logic | 4  
     Very Specific | Custom algorithms, niche or innovative logic | 5  
  
  3. Dependency/Library Type  
     Evaluate how familiar the AI is likely to be with the requested tools.  
     Category | Criterion | Points  
     Mainstream | React, Tailwind, Express, Next.js, Bootstrap, Python stdlib, etc. | 1  
     Widely Known | Popular but non-essential libraries (e.g., Zustand, Framer Motion) | 2  
     Less Common | Moderately known libraries or with peculiar syntax | 3  
     Specific | Domain libraries, poorly documented SDKs | 4  
     Obscure or Proprietary | Internal libraries, private APIs, beta SDKs | 5  
  
  For each dimension (implementation, generality, dependencies), provide the category, the points (1–5), and a brief ‘criteria’ string explaining WHY that category/point was chosen for the given prompt.
  
  Next, compute \`totalPoints\` by summing the points from the three dimensions. This \`totalPoints\` will range from 3 to 15.
  
  Then, based on \`totalPoints\` (scale 3–15), determine the corresponding \`complexityLevel\` and \`levelDescription\` using the mapping below. Your output’s \`complexityLevel\` and \`levelDescription\` MUST correspond to this 3–15 scale.
  
  Mapping of \`totalPoints\` (3–15) to \`complexityLevel\` and \`levelDescription\`:  
  - If \`totalPoints\` is 3–5: \`complexityLevel\` is “Very Low”. Description: “Simple task, predictable.”  
  - If \`totalPoints\` is 6–8: \`complexityLevel\` is “Low”. Description: “Requires care, but standard.”  
  - If \`totalPoints\` is 9–11: \`complexityLevel\` is “Moderate”. Description: “Has combinations or depends on context.”  
  - If \`totalPoints\` is 12–13: \`complexityLevel\` is “High”. Description: “Involves several factors difficult to manage.”  
  - If \`totalPoints\` is 14–15: \`complexityLevel\` is “Very High”. Description: “Requires architecture, technical vision, and total precision.”
  
  Provide an optional \`feedback\` field if relevant.
  
  Automatically detect the language of the following prompt and respond in that same language.
  User Prompt to Evaluate:  
  {{{prompt}}}
  `,
});

const evaluateComplexityFlow = ai.defineFlow(
  {
    name: "evaluateComplexityFlow",
    inputSchema: EvaluateComplexityInputSchema,
    outputSchema: EvaluateComplexityLLMOutputSchema, // Flow's overall output structure will be this + usage
  },
  async (input): Promise<EvaluateComplexityOutput> => {
    const { output, usage } = await evaluateComplexityPrompt(input);
    if (!output) {
      throw new Error(
        "No se pudo obtener la evaluación de complejidad de la IA."
      );
    }
    return { ...output, usage };
  }
);
