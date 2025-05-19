
'use server';
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

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { technicalTags } from '@/config/technical-tags'; // Importar el glosario
import type { TokenUsage } from '@/types/analysis';
import type { PromptEngineeringMode } from '@/types/prompt-engineering';

const GenerateSuggestedPromptInputSchema = z.object({
  originalPrompt: z.string().describe('El prompt original a mejorar.'),
  promptMode: z.enum(['chain-of-thought', 'few-shot', 'retrieval-augmented', 'zero-shot', 'self-consistency', 'tree-of-thoughts', 'auto-prompting']).describe('El modo de prompt engineering a aplicar.').default('zero-shot'),
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
  technicalTags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
  })),
});
export type GenerateSuggestedPromptInput = z.infer<typeof GenerateSuggestedPromptInputSchema>;

// This schema defines what the LLM should generate
const GenerateSuggestedPromptLLMOutputSchema = z.object({
  conciseSuggestedPrompt: z
    .string()
    .describe(
      'Una versión concisa y mejorada del prompt, con términos técnicos relevantes del glosario formateados como enlaces Markdown (ej., [término](glossary://tag-id)). Enfocarse en la directividad y claridad. Debe estar en español.'
    ),
  elaboratedSuggestedPrompt: z
    .string()
    .describe(
      'Un prompt altamente elaborado y cuidadosamente diseñado para lograr los mejores resultados posibles, siguiendo una estructura profesional de ingeniería de prompts (Contexto/Rol, Tarea específica, Detalles y requisitos, Formato de salida, Restricciones). Esta versión debe usar términos del glosario de forma natural en "Detalles y requisitos" pero SIN enlaces Markdown. También debe considerar la complejidad implícita de la tarea original para guiar al usuario, sugiriendo descomposición si la tarea es muy compleja. Debe estar en español.'
    ),
});

// This is the actual output type of the flow
export type GenerateSuggestedPromptOutput = z.infer<typeof GenerateSuggestedPromptLLMOutputSchema> & { usage?: TokenUsage };

export async function generateSuggestedPromptWithLinkedTags(
  input: GenerateSuggestedPromptInput
): Promise<GenerateSuggestedPromptOutput> {
  return generateSuggestedPromptFlow(input);
}

// Preparar los datos del glosario para la plantilla del prompt
const glossaryForPrompt = technicalTags.map(tag => ({
  id: tag.id,
  name: tag.name,
  description: tag.description,
  category: tag.category,
}));

const generateSuggestedPromptGenkitPrompt = ai.definePrompt({
  name: 'generateSuggestedPromptWithLinkedTagsPrompt',
  input: {schema: InternalPromptInputSchema}, // Usar el esquema interno
  output: {schema: GenerateSuggestedPromptLLMOutputSchema}, // LLM generates this
  prompt: `Eres ingeniero de prompts, experto en refinar prompts para tareas relacionadas con la codificación. Eres detallista y analisas detenidamente con el objetivo de mejorar el prompt original del usuario para que sea significativamente más efectivo para un asistente de codificación de IA. Generarás DOS versiones del prompt mejorado, ambas en ESPAÑOL: un "Prompt Sugerido Conciso" y un "Prompt Sugerido Elaborado".

Modo de Prompt Engineering seleccionado: {{promptMode}}

{{#if isChainOfThoughtMode}}
# Instrucciones específicas para Chain-of-Thought (CoT)
Aplica la técnica de Chain-of-Thought (CoT) en ambas versiones del prompt. Esto significa que debes inducir al modelo a exponer paso a paso su razonamiento antes de dar una respuesta final. Incluye frases como "Pensemos paso a paso" o "Analicemos esto por etapas" para guiar al modelo a través de un proceso de razonamiento explícito.
{{/if}}

{{#if isFewShotMode}}
# Instrucciones específicas para Few-Shot Prompting
Aplica la técnica de Few-Shot Prompting en ambas versiones del prompt. Esto implica proporcionar varios ejemplos ("shots") de input-output dentro del prompt para que el modelo aprenda el formato, estilo y lógica de la tarea. Incluye 2-3 ejemplos concretos que muestren el tipo de respuesta esperada.
{{/if}}

{{#if isRetrievalAugmentedMode}}
# Instrucciones específicas para Retrieval-Augmented Generation (RAG)
Aplica la técnica de Retrieval-Augmented Generation (RAG) en ambas versiones del prompt. Esto implica incorporar fragmentos relevantes de conocimiento (como documentación, especificaciones o mejores prácticas) directamente en el prompt para proporcionar contexto adicional y mejorar la precisión de la respuesta.
{{/if}}

{{#if isZeroShotMode}}
# Instrucciones específicas para Zero-Shot Prompting
Aplica la técnica de Zero-Shot Prompting en ambas versiones del prompt. Esto significa crear instrucciones claras y directas sin ejemplos previos, confiando en la capacidad del modelo para comprender y ejecutar la tarea basándose únicamente en la instrucción proporcionada.
{{/if}}

{{#if isSelfConsistencyMode}}
# Instrucciones específicas para Self-Consistency Prompting
Aplica la técnica de Self-Consistency Prompting en ambas versiones del prompt. Esto implica generar múltiples cadenas de razonamiento (vías de pensamiento) y seleccionar la respuesta más consistente. Incluye instrucciones para que el modelo considere diferentes enfoques para resolver el problema y luego converja en la solución más robusta.
{{/if}}

{{#if isTreeOfThoughtsMode}}
# Instrucciones específicas para Tree-of-Thoughts (ToT)
Aplica la técnica de Tree-of-Thoughts (ToT) en ambas versiones del prompt. Esto implica estructurar el razonamiento como un árbol donde en cada nodo se generan varias "ideas" (pensamientos), se evalúan y se exploran las ramas más prometedoras. Incluye instrucciones para que el modelo considere múltiples caminos de solución, evalúe cada uno y seleccione el más adecuado.
{{/if}}

{{#if isAutoPromptingMode}}
# Instrucciones específicas para Auto-Prompting
Aplica la técnica de Auto-Prompting en ambas versiones del prompt. Esto implica generar y evaluar automáticamente múltiples versiones de prompts optimizados para la tarea. Incluye instrucciones para que el modelo reformule el prompt original de diferentes maneras y seleccione la versión que probablemente produzca los mejores resultados.
{{/if}}
Tu salida DEBE ser un objeto JSON que se adhiera al esquema de salida definido (conciseSuggestedPrompt, elaboratedSuggestedPrompt). NO incluyas el campo 'usage' en tu respuesta JSON.
DEBES detectar en que idioma esta el {{{prompt}}} original y Tu salida DEBE ser en ese idioma


Aquí tienes un glosario de atributos técnicos de calidad. Revísalos cuidadosamente.

Glosario Técnico:
{{#each technicalTags}}
- ID: {{this.id}}, Nombre: "{{this.name}}", Descripción: "{{this.description}}" (Categoría: {{this.category}})
{{/each}}

Prompt Original del Usuario:
{{{originalPrompt}}}

Ahora, proporciona las dos versiones del prompt mejorado en ESPAÑOL, basadas en el prompt original de arriba:

1.  **Prompt Sugerido Conciso (en el idioma del prompt)**:
    Mejora el prompt original para que sea más efectivo, específico y directamente accionable. Enfócate en obtener los mejores resultados.
    Al generar esta versión concisa, considera activamente qué atributos del Glosario Técnico mejorarían la solicitud original e incorpóralos estratégicamente donde sea apropiado para añadir claridad y especificar expectativas de calidad. El objetivo es producir un prompt que, si fuera evaluado por un sistema de puntuación de prompts (0-100 basado en su probabilidad de exito, especificidad y uso efectivo de tags), obtendría una alta puntuación. Quizás reflejando sutilmente la complejidad (por ejemplo, incluyendo más tags técnicos si la tarea es compleja y se beneficiaría de ellos).
    Si utilizas un término en este prompt conciso que corresponda directamente a un 'nombre' del Glosario Técnico (o una variación muy cercana que mantenga el mismo significado), DEBES formatear ese término como un enlace Markdown: \`[ElTérminoComoSeUsa](glossary://el_id_del_tag)\`. Por ejemplo, si 'diseño adaptable' (id: 'responsive') es relevante y se usa, escríbelo como \`[diseño adaptable](glossary://responsive)\`.

2.  **Prompt Sugerido Elaborado (en el idioma del prompt)**:
    Crea una versión altamente detallada y cuidadosamente elaborada del prompt siguiendo principios profesionales de ingeniería de prompts. Esta versión debe estar estructurada en secciones claras y ser analizada detalladamente para buscar la máxima efectividad, puedes usar Markdown:
    # 1. Contexto / Rol
    (Define al modelo quién es y cuál es su objetivo)
    # 2. Tarea específica
    (Explica de forma clara qué quieres que haga)
    # 3. Detalles y requisitos
    (Añade datos técnicos, lenguajes, frameworks, criterios de calidad, etc. En esta sección, DEBERÍAS incorporar estratégicamente atributos técnicos de calidad relevantes del Glosario Técnico para especificar expectativas. Sin embargo, para ESTE prompt elaborado, NO uses el formato de enlace Markdown \`[Término](glossary://tag_id)\`. Simplemente usa los términos de forma natural como parte de tus requisitos detallados.)
    # 4. Formato de salida
    (Especifica cómo quieres recibir la respuesta: JSON, lista, código, texto con secciones…)
    # 5. Restricciones
    (Limita la extensión, el tono, el estilo, o cualquier otro aspecto)
    # 6. Ejemplo de uso
    (Si no aplica, no añadas esta sección)

    Al generar esta **Sugerencia Elaborada**, considera la complejidad implícita de la tarea descrita en el prompt original.
    - Si la tarea parece **sencilla o de muy baja complejidad**, la sugerencia elaborada puede ser muy breve, enfocándose solo en las secciones más críticas o incluso indicando que la "Sugerencia Concisa" podría ser suficiente.
    - Si la tarea parece de **baja complejidad**, la sugerencia elaborada debe ser completa pero concisa, cubriendo las secciones de forma esencial.
    - Si la tarea parece de **complejidad moderada**, la sugerencia elaborada debe ser más detallada, especialmente en "Detalles y requisitos" y "Ejemplos". Asegúrate de que los "Detalles y requisitos" incorporen conceptos clave del glosario de forma natural.
    - Si la tarea parece **muy compleja o extensa**, la sugerencia elaborada debería enfocarse en guiar al usuario sobre cómo descomponer la solicitud original en una secuencia de prompts más pequeños y manejables. Puede incluso delinear cuáles podrían ser estos sub-prompts, sugiriendo un enfoque paso a paso. En este caso, la "Sugerencia Elaborada" se convierte en una especie de "meta-prompt" que aconseja sobre la estrategia de prompting para tareas complejas.

    El objetivo para este prompt elaborado es producir un prompt autocontenido y altamente efectivo que un usuario podría copiar y pegar para obtener los mejores resultados posibles de un asistente de codificación de IA, o guiarlo en cómo abordar tareas muy grandes. Puede ser más largo y prescriptivo que la versión concisa.
`,
});

const generateSuggestedPromptFlow = ai.defineFlow(
  {
    name: 'generateSuggestedPromptFlow',
    inputSchema: GenerateSuggestedPromptInputSchema,
    outputSchema: GenerateSuggestedPromptLLMOutputSchema, // LLM generates this
  },
  async (input: GenerateSuggestedPromptInput): Promise<GenerateSuggestedPromptOutput> => {
    const promptInternalInput = {
      originalPrompt: input.originalPrompt,
      promptMode: input.promptMode,
      isChainOfThoughtMode: input.promptMode === 'chain-of-thought',
      isFewShotMode: input.promptMode === 'few-shot',
      isRetrievalAugmentedMode: input.promptMode === 'retrieval-augmented',
      isZeroShotMode: input.promptMode === 'zero-shot',
      isSelfConsistencyMode: input.promptMode === 'self-consistency',
      isTreeOfThoughtsMode: input.promptMode === 'tree-of-thoughts',
      isAutoPromptingMode: input.promptMode === 'auto-prompting',
      technicalTags: glossaryForPrompt,
    };

    const { output, usage } = await generateSuggestedPromptGenkitPrompt(promptInternalInput);
    if (!output) {
      throw new Error('No se pudieron obtener los prompts sugeridos de la IA.');
    }
    return { ...output, usage };
  }
);

