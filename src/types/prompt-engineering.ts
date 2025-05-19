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
    description: 'Leads the model to expose its step-by-step reasoning before the final answer, emulating how we break down complex problems.',
    icon: BrainCog
  },
  {
    id: 'few-shot',
    name: 'Few-Shot Prompting',
    description: 'Provides several input-output examples ("shots") within the prompt so the model learns the format, style, and logic of the task.',
    icon: ListChecks
  },
  {
    id: 'retrieval-augmented',
    name: 'Retrieval-Augmented Generation (RAG)',
    description: 'Retrieves snippets from an external knowledge base (docs, API, internal wiki) and includes them in the prompt for more accurate and up-to-date answers.',
    icon: Search
  },
  {
    id: 'zero-shot',
    name: 'Zero-Shot Prompting',
    description: 'Asks the model to perform the task without examples, relying only on a clear instruction.',
    icon: CircleDot
  },
  {
    id: 'self-consistency',
    name: 'Self-Consistency Prompting',
    description: 'Generates multiple CoT chains (reasoning paths) and votes for the most frequent answer to strengthen the solution.',
    icon: RefreshCw
  },
  {
    id: 'tree-of-thoughts',
    name: 'Tree-of-Thoughts (ToT)',
    description: 'Structures reasoning as a tree: at each node, generates several "ideas" (thoughts), evaluates them, and explores promising branches, with the possibility to backtrack.',
    icon: GitBranch
  },
  {
    id: 'auto-prompting',
    name: 'Auto-Prompting',
    description: 'Uses another LLM to automatically generate and evaluate multiple versions of prompts optimized for the task, using metrics such as accuracy or style.',
    icon: Wand2
  }
];
