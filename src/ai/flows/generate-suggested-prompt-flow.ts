"use server";
/**
 * @fileOverview Este archivo define un flujo de Genkit para generar un prompt de usuario mejorado.
 * Genera dos versiones:
 * 1. Una versión concisa con términos relevantes del glosario técnico formateados como enlaces Markdown.
 * 2. Un prompt altamente elaborado y estructurado profesionalmente siguiendo las mejores prácticas de ingeniería de prompts,
 *    utilizando términos del glosario de forma natural dentro de su sección "Detalles y requisitos" sin enlaces Markdown.
 *    Esta versión también considerará la complejidad de la tarea para guiar al usuario, sugiriendo descomposición si es muy compleja.
 *
 * - generateSuggestedPromptWithLinkedTags - Una función que toma un prompt original y devuelve una versión mejorada
 *   con términos del glosario enlazados.
 * - GenerateSuggestedPromptInput - El tipo de entrada para la función.
 * - GenerateSuggestedPromptOutput - El tipo de salida para la función, conteniendo prompts concisos y elaborados, más el uso de tokens.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { technicalTags } from "@/config/technical-tags"; // Importar el glosario
import type { TokenUsage } from "@/types/analysis";

const GenerateSuggestedPromptInputSchema = z.object({
  originalPrompt: z.string().describe("El prompt original a mejorar."),
  promptMode: z
    .enum([
      "chain-of-thought",
      "few-shot",
      "retrieval-augmented",
      "zero-shot",
      "self-consistency",
      "tree-of-thoughts",
      "auto-prompting",
    ])
    .describe("El modo de prompt engineering a aplicar.")
    .default("zero-shot"),
});

// Esquema interno para la plantilla del prompt, incluyendo flags de modo y technicalTags
const InternalPromptInputSchema = GenerateSuggestedPromptInputSchema.extend({
  isChainOfThoughtMode: z.boolean(),
  isFewShotMode: z.boolean(),
  isRetrievalAugmentedMode: z.boolean(),
  isZeroShotMode: z.boolean(),
  isSelfConsistencyMode: z.boolean(),
  isTreeOfThoughtsMode: z.boolean(),
  isAutoPromptingMode: z.boolean(),
  technicalTags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.string(),
    })
  ),
});
export type GenerateSuggestedPromptInput = z.infer<
  typeof GenerateSuggestedPromptInputSchema
>;

// This schema defines what the LLM should generate
const GenerateSuggestedPromptLLMOutputSchema = z.object({
  conciseSuggestedPrompt: z
    .string()
    .describe(
      "A concise and improved version of the prompt, with relevant technical terms from the glossary formatted as Markdown links (e.g., [term](glossary://tag-id)). Focus on directness and clarity."
    ),
  elaboratedSuggestedPrompt: z
    .string()
    .describe(
      'A highly refined and carefully crafted prompt designed to achieve the best possible results, following—if appropriate—a professional prompt engineering structure (Context/Role, Specific Task, Details and Requirements, Output Format, Constraints). This version should use glossary terms naturally within the "Details and Requirements" section but WITHOUT Markdown links. It MUST also account for the implicit complexity of the original task to guide the user. It is IMPORTANT to suggest decomposition if the task is overly complex.'
    ),
});

// This is the actual output type of the flow
export type GenerateSuggestedPromptOutput = z.infer<
  typeof GenerateSuggestedPromptLLMOutputSchema
> & { usage?: TokenUsage };

export async function generateSuggestedPromptWithLinkedTags(
  input: GenerateSuggestedPromptInput
): Promise<GenerateSuggestedPromptOutput> {
  return generateSuggestedPromptFlow(input);
}

// Preparar los datos del glosario para la plantilla del prompt
const glossaryForPrompt = technicalTags.map((tag) => ({
  id: tag.id,
  name: tag.name,
  description: tag.description,
  category: tag.category,
}));

const generateSuggestedPromptGenkitPrompt = ai.definePrompt({
  name: "generateSuggestedPromptWithLinkedTagsPrompt",
  input: { schema: InternalPromptInputSchema }, // Usar el esquema interno
  output: { schema: GenerateSuggestedPromptLLMOutputSchema }, // LLM generates this
  prompt: `You are a prompt engineer, expert in refining prompts for coding-related tasks. You are detail-oriented and will analyze carefully with the goal of improving the user’s original prompt so that it becomes significantly more effective for an AI coding assistant. You will generate TWO versions of the improved prompt: a “Concise Suggested Prompt” and a “Elaborated Suggested Prompt.”

Selected Prompt Engineering Mode: {{promptMode}}

{{#if isChainOfThoughtMode}}
# Specific Instructions for Chain-of-Thought (CoT)
Apply the Chain-of-Thought (CoT) technique in both prompt versions. This means you must induce the model to expose its reasoning step by step before giving a final answer. Include phrases like “Let’s think step by step” or “Let’s analyze this in stages” to guide the model through an explicit reasoning process.
{{/if}}

{{#if isFewShotMode}}
# Specific Instructions for Few-Shot Prompting
Apply the Few-Shot Prompting technique in both prompt versions. This involves providing several input–output examples (“shots”) within the prompt so that the model learns the expected format, style, and logic of the task. Include 2–3 concrete examples that show the type of response expected.
{{/if}}

{{#if isRetrievalAugmentedMode}}
# Specific Instructions for Retrieval-Augmented Generation (RAG)
Apply the Retrieval-Augmented Generation (RAG) technique in both prompt versions. This involves incorporating relevant knowledge snippets (such as documentation, specifications, or best practices) directly into the prompt to provide additional context and improve response accuracy.
{{/if}}

{{#if isZeroShotMode}}
# Specific Instructions for Zero-Shot Prompting
Apply the Zero-Shot Prompting technique in both prompt versions. This means creating clear and direct instructions without prior examples, relying on the model’s ability to understand and execute the task based solely on the instruction provided.
{{/if}}

{{#if isSelfConsistencyMode}}
# Specific Instructions for Self-Consistency Prompting
Apply the Self-Consistency Prompting technique in both prompt versions. This involves generating multiple chains of reasoning (thought paths) and selecting the most consistent answer. Include instructions for the model to consider different approaches to solve the problem and then converge on the most robust solution.
{{/if}}

{{#if isTreeOfThoughtsMode}}
# Specific Instructions for Tree-of-Thoughts (ToT)
Apply the Tree-of-Thoughts (ToT) technique in both prompt versions. This involves structuring reasoning as a tree where at each node several “ideas” (thoughts) are generated, evaluated, and the most promising branches explored. Include instructions for the model to consider multiple solution paths, evaluate each one, and select the most suitable.
{{/if}}

{{#if isAutoPromptingMode}}
# Specific Instructions for Auto-Prompting
Apply the Auto-Prompting technique in both prompt versions. This involves automatically generating and evaluating multiple optimized prompt versions for the task. Include instructions for the model to reformulate the original prompt in different ways and select the version most likely to produce the best results.
{{/if}}

Your output MUST be a JSON object adhering to the defined schema (conciseSuggestedPrompt, elaboratedSuggestedPrompt). DO NOT include the ‘usage’ field in your JSON response.  

Here is a technical quality attributes glossary. Review it carefully.

Technical Glossary:  
{{#each technicalTags}}  
- ID: {{this.id}}, Name: “{{this.name}}”, Description: “{{this.description}}” (Category: {{this.category}})  
{{/each}}

Automatically detect the language of the following prompt and respond in that same language.
User’s Original Prompt:  
{{{originalPrompt}}}

Now, provide the two improved prompt versions in the language of the original prompt, based on the user’s original prompt above:

1. **Concise Suggested Prompt (in the prompt’s language):**  
   Improve the original prompt to make it more effective, specific, and directly actionable. Focus on achieving the best results.  
   When generating this concise version, actively consider which attributes from the Technical Glossary would enhance the original request and incorporate them strategically where appropriate to add clarity and specify quality expectations. The goal is to produce a prompt that, if evaluated by a prompt-scoring system (0–100 based on success likelihood, specificity, and effective use of tags), would achieve a high score—perhaps subtly reflecting complexity (for example, by including more technical tags if the task is complex and would benefit from them).  
   If you use a term in this concise prompt that directly matches a 'name' in the Technical Glossary (or a very close variation retaining the same meaning), YOU MUST format that term as a Markdown link: \`[TermAsUsed](glossary://tag-id)\`. For example, if “responsive design” (id: “responsive”) is relevant and used, write it as \`[responsive design](glossary://responsive)\`.

2. **Elaborated Suggested Prompt (in the prompt’s language):**  
   Create a highly detailed and carefully crafted version of the prompt following professional prompt engineering principles. This version must be structured into clear sections and thoroughly analyzed to maximize effectiveness, you may use Markdown:  
   # 1. Context / Role  
   (Define who the model is and its objective)  
   # 2. Specific Task  
   (Clearly explain what you want it to do)  
   # 3. Details and Requirements  
   (Add technical data, languages, frameworks, quality criteria, etc. In this section, you SHOULD strategically incorporate relevant technical quality attributes from the Glossary to specify expectations. However, for THIS elaborated prompt, DO NOT use Markdown link format \`[Term](glossary://tag_id)\`. Simply use the terms naturally as part of your detailed requirements.)  
   # 4. Output Format  
   (Specify how you want to receive the response: JSON, list, code, text with sections…)  
   # 5. Constraints  
   (Limit length, tone, style, or any other aspect)  
   # 6. Usage Example  
   (If not applicable, do not include this section)

   When generating this **Elaborated Suggestion**, consider the implicit complexity of the task described in the original prompt.  
   - If the task seems **very low complexity or trivial**, the elaborated suggestion can be very brief, focusing only on the most critical sections or even indicating that the “Concise Suggestion” may suffice.  
   - If the task seems **low complexity**, the elaborated suggestion should be complete but concise, covering the sections essentially.  
   - If the task seems **moderately complex**, the elaborated suggestion should be more detailed, especially in “Details and Requirements” and “Examples.” Ensure the “Details and Requirements” incorporate key glossary concepts naturally.  
   - If the task seems **very complex or extensive**, the elaborated suggestion should focus on guiding the user on how to decompose the original request into a sequence of smaller, manageable prompts. It may even outline what those sub-prompts could be, suggesting a step-by-step approach. In this case, the “Elaborated Suggestion” becomes a sort of “meta-prompt” advising on prompting strategy for complex tasks.

   The goal for this elaborated prompt is to produce a self-contained, highly effective prompt that a user could copy and paste to get the best possible results from an AI coding assistant or guide them on how to tackle very large tasks. It may be longer and more prescriptive than the concise version.
`,
});

const generateSuggestedPromptFlow = ai.defineFlow(
  {
    name: "generateSuggestedPromptFlow",
    inputSchema: GenerateSuggestedPromptInputSchema,
    outputSchema: GenerateSuggestedPromptLLMOutputSchema, // LLM generates this
  },
  async (
    input: GenerateSuggestedPromptInput
  ): Promise<GenerateSuggestedPromptOutput> => {
    const promptInternalInput = {
      originalPrompt: input.originalPrompt,
      promptMode: input.promptMode,
      isChainOfThoughtMode: input.promptMode === "chain-of-thought",
      isFewShotMode: input.promptMode === "few-shot",
      isRetrievalAugmentedMode: input.promptMode === "retrieval-augmented",
      isZeroShotMode: input.promptMode === "zero-shot",
      isSelfConsistencyMode: input.promptMode === "self-consistency",
      isTreeOfThoughtsMode: input.promptMode === "tree-of-thoughts",
      isAutoPromptingMode: input.promptMode === "auto-prompting",
      technicalTags: glossaryForPrompt,
    };

    const { output, usage } =
      await generateSuggestedPromptGenkitPrompt(promptInternalInput);
    if (!output) {
      throw new Error("No se pudieron obtener los prompts sugeridos de la IA.");
    }
    return { ...output, usage };
  }
);
