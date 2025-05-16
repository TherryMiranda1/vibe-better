
// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for scoring a prompt based on clarity,
 * specificity, tag usage, and its appropriateness for the task's apparent complexity.
 *
 * - scorePrompt - An async function that takes a prompt string as input and returns a score.
 * - ScorePromptInput - The input type for the scorePrompt function.
 * - ScorePromptOutput - The output type for the scorePrompt function, including token usage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {TokenUsage} from '@/types/analysis';

const ScorePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be scored.'),
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
      'A score from 0 to 100 representing the prompt quality based on clarity, specificity, and appropriateness for its apparent complexity.'
    ),
  explanation: z
    .string()
    .describe(
      'Explanation of the assigned score, describing the prompt quality and how the score was determined, considering its complexity. In Spanish.'
    ),
});

// This is the actual output type of the flow
export type ScorePromptOutput = z.infer<typeof ScorePromptLLMOutputSchema> & { usage?: TokenUsage };


export async function scorePrompt(input: ScorePromptInput): Promise<ScorePromptOutput> {
  return scorePromptFlow(input);
}

const scorePromptPrompt = ai.definePrompt({
  name: 'scorePromptPrompt',
  input: {schema: ScorePromptInputSchema},
  output: {schema: ScorePromptLLMOutputSchema}, // LLM generates this
  prompt: `Eres un experto en calificar prompts de IA. Recibirás un prompt y asignarás una puntuación del 0 al 100 basada en la claridad y especificidad del prompt.
Tu salida DEBE ser un objeto JSON que se adhiera al esquema de salida definido (score, explanation). NO incluyas el campo 'usage' en tu respuesta JSON.

Al asignar la puntuación, considera la efectividad del prompt *en relación a su complejidad aparente*.
- Un buen prompt para una tarea **sencilla** debe ser claro y directo.
- Un buen prompt para una tarea **compleja** no solo debe ser claro y específico, sino también demostrar una comprensión del alcance de la tarea. Esto podría reflejarse incluyendo suficientes detalles, sugiriendo una estructura adecuada, o reconociendo implícitamente la necesidad de un desglose si el prompt original es demasiado ambicioso para un solo paso. Un prompt muy corto para una tarea claramente compleja podría obtener una puntuación menor si carece de los detalles necesarios para que una IA tenga éxito. Por el contrario, un prompt excesivamente verboso para una tarea muy simple también podría perder puntos en concisión y claridad.

Proporciona una explicación detallada para la puntuación EN ESPAÑOL, incluyendo cómo cada factor (claridad, especificidad, uso de tags, adecuación a la complejidad) influyó en la puntuación final.

Prompt a calificar:
{{{prompt}}}`,
});

const scorePromptFlow = ai.defineFlow(
  {
    name: 'scorePromptFlow',
    inputSchema: ScorePromptInputSchema,
    outputSchema: ScorePromptLLMOutputSchema, // Flow's overall output structure will be this + usage
  },
  async (input): Promise<ScorePromptOutput> => {
    const { output, usage } = await scorePromptPrompt(input);
    if (!output) {
        throw new Error('No se pudo obtener la puntuación del prompt de la IA.');
    }
    return { ...output, usage };
  }
);

