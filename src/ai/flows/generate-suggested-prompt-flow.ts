
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

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {technicalTags, type TechnicalTag} from '@/config/technical-tags'; // Importar el glosario
import type {TokenUsage} from '@/types/analysis';

const GenerateSuggestedPromptInputSchema = z.object({
  originalPrompt: z.string().describe('El prompt original a mejorar.'),
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
      'Un prompt altamente elaborado y cuidadosamente diseñado para lograr los mejores resultados posibles, siguiendo una estructura profesional de ingeniería de prompts (Contexto/Rol, Tarea específica, Detalles y requisitos, Formato de salida, Restricciones, Ejemplos). Esta versión debe usar términos del glosario de forma natural en "Detalles y requisitos" pero SIN enlaces Markdown. También debe considerar la complejidad implícita de la tarea original para guiar al usuario, sugiriendo descomposición si la tarea es muy compleja. Debe estar en español.'
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
  input: {schema: GenerateSuggestedPromptInputSchema},
  output: {schema: GenerateSuggestedPromptLLMOutputSchema}, // LLM generates this
  prompt: `Eres un experto en refinar prompts para tareas relacionadas con la codificación. Tu objetivo es mejorar el prompt original del usuario para que sea significativamente más efectivo para un asistente de codificación de IA. Generarás DOS versiones del prompt mejorado, ambas en ESPAÑOL: un "Prompt Sugerido Conciso" y un "Prompt Sugerido Elaborado".
Tu salida DEBE ser un objeto JSON que se adhiera al esquema de salida definido (conciseSuggestedPrompt, elaboratedSuggestedPrompt). NO incluyas el campo 'usage' en tu respuesta JSON.

Aquí tienes un glosario de atributos técnicos de calidad. Revísalos cuidadosamente.

Glosario Técnico:
{{#each technicalTags}}
- ID: {{this.id}}, Nombre: "{{this.name}}", Descripción: "{{this.description}}" (Categoría: {{this.category}})
{{/each}}

Prompt Original del Usuario:
{{{originalPrompt}}}

Ahora, proporciona las dos versiones del prompt mejorado en ESPAÑOL, basadas en el prompt original de arriba:

1.  **Prompt Sugerido Conciso (en ESPAÑOL)**:
    Reescribe el prompt original para que sea más claro, específico y directamente accionable. Enfócate en la concisión.
    Al generar esta versión concisa, considera activamente qué atributos del Glosario Técnico mejorarían la solicitud original e incorpóralos estratégicamente donde sea apropiado para añadir claridad y especificar expectativas de calidad. El objetivo es producir un prompt que, si fuera evaluado por un sistema de puntuación de prompts (0-100 basado en claridad, especificidad y uso efectivo de tags), obtendría una alta puntuación. Quizás reflejando sutilmente la complejidad (por ejemplo, incluyendo más tags técnicos si la tarea es compleja y se beneficiaría de ellos).
    Si utilizas un término en este prompt conciso que corresponda directamente a un 'nombre' del Glosario Técnico (o una variación muy cercana que mantenga el mismo significado), DEBES formatear ese término como un enlace Markdown: \`[ElTérminoComoSeUsa](glossary://el_id_del_tag)\`. Por ejemplo, si 'diseño adaptable' (id: 'responsive') es relevante y se usa, escríbelo como \`[diseño adaptable](glossary://responsive)\`.

2.  **Prompt Sugerido Elaborado (en ESPAÑOL)**:
    Crea una versión altamente detallada y cuidadosamente elaborada del prompt siguiendo principios profesionales de ingeniería de prompts. Esta versión debe estar estructurada en secciones claras usando encabezados Markdown:
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
    # 6. Ejemplo de uso (Opcional, si aplica)
    (Muestra “input → output” para guiar al modelo, si es relevante)

    Al generar esta **Sugerencia Elaborada**, considera la complejidad implícita de la tarea descrita en el prompt original.
    - Si la tarea parece **sencilla o de muy baja complejidad**, la sugerencia elaborada puede ser muy breve, enfocándose solo en las secciones más críticas o incluso indicando que la "Sugerencia Concisa" podría ser suficiente. El objetivo es no abrumar con un prompt extenso para una tarea trivial.
    - Si la tarea parece de **baja complejidad**, la sugerencia elaborada debe ser completa pero concisa, cubriendo las 6 secciones de forma esencial.
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
    const { output, usage } = await generateSuggestedPromptGenkitPrompt({
      originalPrompt: input.originalPrompt,
      // @ts-ignore - Passing extra context for Handlebars
      technicalTags: glossaryForPrompt,
    });
    if (!output) {
      throw new Error('No se pudieron obtener los prompts sugeridos de la IA.');
    }
    return { ...output, usage };
  }
);

