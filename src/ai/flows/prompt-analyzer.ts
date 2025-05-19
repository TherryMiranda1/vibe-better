// use server'
'use server';
/**
 * @fileOverview AI-powered prompt analyzer for coding-related tasks. It analyzes the prompt in multiple
 * aspects such as complexity, dependencies and missing tags, then returns structured recommendations and an improved prompt.
 *
 * - analyzePrompt - Analyzes a coding prompt and provides feedback.
 * - AnalyzePromptInput - The input type for the analyzePrompt function.
 * - AnalyzePromptOutput - The return type for the analyzePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePromptInputSchema = z.object({
  prompt: z.string().describe('The coding-related prompt to analyze.'),
});
export type AnalyzePromptInput = z.infer<typeof AnalyzePromptInputSchema>;

const AnalyzePromptOutputSchema = z.object({
  complexity: z.string().describe('Analysis of the prompt complexity.'),
  dependencies: z.string().describe('Identified dependencies for the task.'),
  features: z.string().describe('Key functionalities detected in the prompt.'),
  missingTags: z.string().describe('Important aspects missing in the prompt.'),
  suggestedTags: z.string().describe('Suggested tags for the task.'),
  recommendations: z.string().describe('Recommendations for improving the prompt.'),
  suggestedPrompt: z.string().describe('Improved prompt with suggested elements.'),
  score: z.string().describe('A score (0-100) based on clarity, specificity, and tag usage.'),
});
export type AnalyzePromptOutput = z.infer<typeof AnalyzePromptOutputSchema>;

export async function analyzePrompt(input: AnalyzePromptInput): Promise<AnalyzePromptOutput> {
  return analyzePromptFlow(input);
}

const analyzePromptFlow = ai.defineFlow(
  {
    name: 'analyzePromptFlow',
    inputSchema: AnalyzePromptInputSchema,
    outputSchema: AnalyzePromptOutputSchema,
  },
  async input => {
    // Helper function to get analysis from AI for a specific aspect
    async function getAnalysis(instruction: string): Promise<string> {
      const {text} = await ai.generate({
        prompt: `${instruction}: ${input.prompt}`,
      });
      return text;
    }

    // Run each analysis step
    const complexity = await getAnalysis('Analiza la complejidad de esta tarea');
    const dependencies = await getAnalysis('¿Qué librerías se usarían para esto?');
    const features = await getAnalysis('Detecta funcionalidades clave');
    const missingTags = await getAnalysis('¿Qué aspectos importantes faltan en este prompt?');
    const suggestedTags = await getAnalysis('Sugiere tags útiles para esta tarea');
    const recommendations = await getAnalysis('Recomienda mejoras para este prompt');
    const suggestedPrompt = await getAnalysis(
      'Mejora este prompt agregando los elementos sugeridos'
    );
    const score = await getAnalysis(
      'Asigna una puntuación del 0 al 100 según su buena elaboración, claridad y efectividad. Responde siempre en el idioma original del prompt.'
    );

    return {
      complexity,
      dependencies,
      features,
      missingTags,
      suggestedTags,
      recommendations,
      suggestedPrompt,
      score,
    };
  }
);
