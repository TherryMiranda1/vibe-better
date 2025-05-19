'use server';
/**
 * @fileOverview This file defines a Genkit flow for improving user-provided prompts related to coding tasks.
 *
 * - improvePrompt - A function that takes a prompt as input and returns an improved version of the prompt.
 * - ImprovePromptInput - The input type for the improvePrompt function, which is a string representing the prompt to be improved.
 * - ImprovePromptOutput - The output type for the improvePrompt function, which is a string representing the improved prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be improved.'),
});
export type ImprovePromptInput = z.infer<typeof ImprovePromptInputSchema>;

const ImprovePromptOutputSchema = z.object({
  improvedPrompt: z.string().describe('The improved prompt.'),
});
export type ImprovePromptOutput = z.infer<typeof ImprovePromptOutputSchema>;

export async function improvePrompt(input: ImprovePromptInput): Promise<ImprovePromptOutput> {
  return improvePromptFlow(input);
}

const improvePromptPrompt = ai.definePrompt({
  name: 'improvePromptPrompt',
  input: {schema: ImprovePromptInputSchema},
  output: {schema: ImprovePromptOutputSchema},
  prompt: `You are an expert at refining prompts for coding-related tasks. Given the following prompt, suggest improvements to enhance its clarity, specificity, and overall effectiveness.
Always respond using the original prompt language.

Original Prompt: {{{prompt}}}

Improved Prompt:`, 
});

const improvePromptFlow = ai.defineFlow(
  {
    name: 'improvePromptFlow',
    inputSchema: ImprovePromptInputSchema,
    outputSchema: ImprovePromptOutputSchema,
  },
  async input => {
    const {output} = await improvePromptPrompt(input);
    return output!;
  }
);
