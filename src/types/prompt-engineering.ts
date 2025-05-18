export type PromptEngineeringMode = 
  | 'chain-of-thought'
  | 'few-shot'
  | 'retrieval-augmented'
  | 'zero-shot'
  | 'self-consistency'
  | 'tree-of-thoughts'
  | 'auto-prompting';

import { LucideIcon, BrainCog, ListChecks, Search, CircleDot, RefreshCw, GitBranch, Wand2 } from 'lucide-react';

export interface PromptEngineeringModeConfig {
  id: PromptEngineeringMode;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const promptEngineeringModes: PromptEngineeringModeConfig[] = [
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought (CoT)',
    description: 'Induce al modelo a exponer paso a paso su razonamiento antes de la respuesta final, emulando cómo descomponemos problemas complejos.',
    icon: BrainCog
  },
  {
    id: 'few-shot',
    name: 'Few-Shot Prompting',
    description: 'Proporciona varios ejemplos ("shots") de input-output dentro del prompt para que el modelo aprenda el formato, estilo y lógica de la tarea.',
    icon: ListChecks
  },
  {
    id: 'retrieval-augmented',
    name: 'Retrieval-Augmented Generation (RAG)',
    description: 'Recupera fragmentos de una base de conocimiento externa (docs, API, wiki interna) y los incluye en el prompt, para respuestas más precisas y actualizadas.',
    icon: Search
  },
  {
    id: 'zero-shot',
    name: 'Zero-Shot Prompting',
    description: 'Pide al modelo realizar la tarea sin ejemplos, basándose sólo en la instrucción clara.',
    icon: CircleDot
  },
  {
    id: 'self-consistency',
    name: 'Self-Consistency Prompting',
    description: 'Genera múltiples cadenas de CoT (vías de razonamiento) y vota la respuesta más frecuente para robustecer la solución.',
    icon: RefreshCw
  },
  {
    id: 'tree-of-thoughts',
    name: 'Tree-of-Thoughts (ToT)',
    description: 'Estructura el razonamiento como un árbol: en cada nodo genera varias "ideas" (pensamientos), las evalúa y explora ramas promisorias, con posibilidad de retroceder.',
    icon: GitBranch
  },
  {
    id: 'auto-prompting',
    name: 'Auto-Prompting',
    description: 'Emplea otro LLM para generar y evaluar automáticamente múltiples versiones de prompts optimizados para la tarea, con métricas como precisión o estilo.',
    icon: Wand2
  }
];
