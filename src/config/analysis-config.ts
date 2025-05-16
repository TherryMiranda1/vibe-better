
import type { AnalysisSections, AnalysisSectionKey } from '@/types/analysis';
import {
  Puzzle,
  Boxes,
  SlidersHorizontal,
  FilePenLine,
  Award,
  type LucideIcon,
} from 'lucide-react';

const createAnalysisConfig = <T extends Record<AnalysisSectionKey, { title: string; Icon: LucideIcon; instruction: string }>>(config: T): T => config;

export const LOADING_EVENT_VALUE = "__ANALYSIS_SECTION_LOADING__";

export const analysisConfig = createAnalysisConfig({
  complexity: {
    title: 'Análisis de Complejidad',
    Icon: Puzzle,
    instruction: 'Eres un asistente de IA especializado en evaluar la complejidad de tareas de codificación basándote en un sistema de puntuación detallado y DEBES responder en ESPAÑOL...',
  },
  dependencies: {
    title: 'Análisis de Dependencias',
    Icon: Boxes,
    instruction: "Analiza si se requieren dependencias externas para la tarea solicitada. Considera primero si la funcionalidad se puede lograr con APIs nativas del navegador, características incorporadas del framework o código personalizado simple. Sugiere dependencias externas SOLO si la funcionalidad es imposible sin ellas, o si implementarla desde cero sería excesivamente complejo o redundante (ej. para manipulación avanzada de fechas, gestión de estado global compleja, librerías de componentes UI para frameworks establecidos). Si no se necesitan dependencias externas cruciales o que aporten un beneficio significativo, tu RESPUESTA COMPLETA Y ÚNICA DEBE SER: 'No se requieren dependencias externas para esta tarea.' O, si es aplicable: 'Se puede realizar con funcionalidades nativas del framework/navegador.'. NO AÑADAS NADA MÁS A ESTA RESPUESTA. Si sugieres dependencias, lista cada una en una nueva línea (MÁXIMO 15), con el formato: 'NombreLibreria: Justificación MUY BREVE (ej: 3-7 palabras)'. Sé conciso en las justificaciones. Responde en ESPAÑOL.",
  },
  features: {
    title: 'Análisis de Funcionalidades',
    Icon: SlidersHorizontal,
    instruction: 'Detecta y lista las funcionalidades clave descritas o implícitas en el prompt. Cada funcionalidad debe estar en una nueva línea, idealmente comenzando con un guion o un identificador de lista (ej: "- Funcionalidad X"). Responde en ESPAÑOL.',
  },
  suggestedPrompt: {
    title: 'Prompt Sugerido',
    Icon: FilePenLine,
    instruction: 'Este prompt se usa en un flujo especializado. Reescribe el prompt original mejorándolo. Genera una versión concisa y una elaborada. Ambas en ESPAÑOL.',
  },
  score: {
    title: 'Puntuación Global',
    Icon: Award,
    instruction: 'Asigna una puntuación del 0 al 100 evaluando la claridad, especificidad, completitud y uso efectivo de tags/conceptos técnicos del prompt original, considerando su complejidad aparente. Justifica brevemente la puntuación EN ESPAÑOL. El formato de tu respuesta DEBE ser "PUNTUACIÓN/100: Justificación concisa.". Ejemplo: "85/100: El prompt es claro y específico, pero podría detallar más sobre X."',
  },
});

// Order matters for API processing if one depends on another
export const analysisOrder: AnalysisSectionKey[] = [
  'complexity',
  'dependencies',
  'features',
  // 'recommendations', // Removed
  'suggestedPrompt',
  'score',
];
