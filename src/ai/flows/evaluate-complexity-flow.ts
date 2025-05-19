
'use server';
/**
 * @fileOverview A Genkit flow for evaluating coding task complexity based on a structured scoring system.
 *
 * - evaluateComplexity - A function that takes a prompt and returns a structured complexity assessment.
 * - EvaluateComplexityInput - The input type for the evaluateComplexity function.
 * - EvaluateComplexityOutput - The output type for the evaluateComplexity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {TokenUsage} from '@/types/analysis';

const EvaluateComplexityInputSchema = z.object({
  prompt: z.string().describe('El prompt relacionado con codificación a evaluar en cuanto a complejidad.'),
});
export type EvaluateComplexityInput = z.infer<typeof EvaluateComplexityInputSchema>;

const ComplexityDimensionSchema = z.object({
  category: z.string().describe('Categoría de la dimensión (e.g., Muy pequeña, Común, Mainstream).'),
  points: z.number().int().min(1).max(5).describe('Puntos asignados a esta dimensión (1-5).'),
  criteria: z.string().describe('Criterio específico que justifica la categoría y los puntos para esta dimensión.'),
});

// This schema defines what the LLM should generate, NOT including the token usage.
const EvaluateComplexityLLMOutputSchema = z.object({
  dimension: ComplexityDimensionSchema.describe('Evaluación de la dimensión de la implementación (escala 1-5).'),
  generality: ComplexityDimensionSchema.describe('Evaluación de la generalidad de la implementación (escala 1-5).'),
  dependencies: ComplexityDimensionSchema.describe('Evaluación del tipo de dependencias/librerías (escala 1-5).'),
  totalPoints: z.number().int().min(3).max(15).describe('Suma total de los puntos de las tres dimensiones (escala 3-15).'),
  complexityLevel: z.string().describe('Nivel de complejidad resultante (Muy baja, Baja, Moderada, Alta, Muy alta) basado en la escala 3-15.'),
  levelDescription: z.string().describe('Descripción breve del nivel de complejidad basado en la escala 3-15.'),
  feedback: z.string().optional().describe('Sugerencias opcionales para el usuario basadas en la evaluación.'),
});

// This is the actual output type of the flow, including the LLM's output AND the token usage.
export type EvaluateComplexityOutput = z.infer<typeof EvaluateComplexityLLMOutputSchema> & { usage?: TokenUsage };


export async function evaluateComplexity(input: EvaluateComplexityInput): Promise<EvaluateComplexityOutput> {
  return evaluateComplexityFlow(input);
}

const evaluateComplexityPrompt = ai.definePrompt({
  name: 'evaluateComplexityPrompt',
  input: {schema: EvaluateComplexityInputSchema},
  output: {schema: EvaluateComplexityLLMOutputSchema}, // LLM generates this structure
  prompt: `Eres un asistente de IA especializado en evaluar la complejidad de tareas de codificación basándote en un sistema de puntuación detallado.
Tu salida DEBE ser un objeto JSON que se adhiera al esquema de salida definido. NO incluyas el campo 'usage' en tu respuesta JSON, eso se gestionará aparte.
DEBES detectar en que idioma esta el {{{prompt}}} original y Tu salida DEBE ser en el idioma


Primero, evalúa el prompt contra las siguientes tres dimensiones, cada una en una escala de 1-5 puntos:

1. Dimensión de la implementación
Evalúa el tamaño funcional y estructural de la tarea solicitada.
Categoría	Criterio	Puntos
Muy pequeña	Cambio de estilo, un color, añadir un texto	1
Pequeña	Componente funcional simple, validación de input básica	2
Media	Formularios completos, CRUD básico, lógica condicional	3
Grande	Varios componentes conectados, integración con API externa	4
Muy grande	Aplicación completa, múltiples módulos, arquitectura compleja	5

2. Generalidad de la implementación
Evalúa si lo que se pide es algo común o altamente específico (nicho).
Categoría	Criterio	Puntos
Muy común	Patrones repetitivos (botones, forms, modales, tablas)	1
Común	Autenticación, integración con Stripe, dashboards	2
Moderadamente común	Combinaciones estándar con ajustes	3
Poco común	Funciones personalizadas, lógica de negocio única	4
Muy específica	Algoritmos personalizados, lógica nicho o innovadora	5

3. Tipo de dependencias / librerías
Evalúa el grado de familiaridad que puede tener la IA con las herramientas solicitadas.
Categoría	Criterio	Puntos
Mainstream	React, Tailwind, Express, Next.js, Bootstrap, Python stdlib, etc.	1
Ampliamente conocidas	Librerías populares pero no esenciales (e.g., Zustand, Framer Motion)	2
Menos comunes	Librerías medianamente conocidas o con sintaxis peculiar	3
Específicas	Librerías de dominio, SDKs poco documentados	4
Obscuras o propietarias	Librerías internas, APIs privadas, SDKs beta	5

Para cada dimensión (dimensión, generalidad, dependencias), proporciona la categoría, los puntos (1-5) y una breve cadena 'criteria' explicando POR QUÉ se eligió esa categoría/puntos para el prompt dado.

Luego, calcula \`totalPoints\` sumando los puntos de las tres dimensiones. Este \`totalPoints\` variará de 3 a 15.

Después, basándote en \`totalPoints\` (escala 3-15), determina el \`complexityLevel\` y \`levelDescription\` correspondientes, usando el mapeo detallado abajo. El \`complexityLevel\` y \`levelDescription\` en tu salida DEBEN corresponder a esta escala de 3-15.

Mapeo de \`totalPoints\` (3-15) a \`complexityLevel\` y \`levelDescription\`:
- Si \`totalPoints\` es 3-5: \`complexityLevel\` es "Muy baja". Descripción: "Tarea sencilla y predecible."
- Si \`totalPoints\` es 6-8: \`complexityLevel\` es "Baja". Descripción: "Requiere cuidado, pero es estándar."
- Si \`totalPoints\` es 9-11: \`complexityLevel\` es "Moderada". Descripción: "Tiene combinaciones o depende de contexto."
- Si \`totalPoints\` es 12-13: \`complexityLevel\` es "Alta". Descripción: "Involucra varios factores difíciles de manejar."
- Si \`totalPoints\` es 14-15: \`complexityLevel\` es "Muy alta". Descripción: "Requiere arquitectura, visión técnica y precisión total."

Proporciona 'feedback' opcional si es relevante.

Prompt del Usuario a Evaluar:
{{{prompt}}}
`,
});

const evaluateComplexityFlow = ai.defineFlow(
  {
    name: 'evaluateComplexityFlow',
    inputSchema: EvaluateComplexityInputSchema,
    outputSchema: EvaluateComplexityLLMOutputSchema, // Flow's overall output structure will be this + usage
  },
  async (input): Promise<EvaluateComplexityOutput> => {
    const { output, usage } = await evaluateComplexityPrompt(input);
    if (!output) {
      throw new Error('No se pudo obtener la evaluación de complejidad de la IA.');
    }
    return { ...output, usage };
  }
);

