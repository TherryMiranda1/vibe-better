
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Info } from 'lucide-react'; 
import { Skeleton } from '@/components/ui/skeleton';
import type { TokenUsage } from '@/types/analysis';

interface ScoreDisplayProps {
  scoreContent: string | undefined; 
  isLoading?: boolean; 
  usage?: TokenUsage; // Added usage prop
}

interface ParsedScore {
  score: number | null;
  explanation: string;
}

const parseScoreContent = (content: string): ParsedScore => {
  try {
    // Assuming content is a JSON string from the score flow: { score: number, explanation: string, usage?: ... }
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed.score === 'number' && typeof parsed.explanation === 'string') {
      return {
        score: parsed.score,
        explanation: parsed.explanation,
      };
    }
  } catch (e) {
    // Fallback for old format or plain text error
    const match = content.match(/(\d+)\s*\/\s*100\s*[:\-\s]*(.*)/i);
    if (match && match[1] !== undefined && match[2] !== undefined) {
      const score = parseInt(match[1], 10);
      if (!isNaN(score)) {
        return {
          score: score,
          explanation: match[2].trim(),
        };
      }
    }
  }
  return { score: null, explanation: content };
};

interface EmotionalFeedback {
  text: string;
  variant: 'default' | 'secondary' | 'destructive'; 
  className?: string;
}

const getEmotionalFeedback = (score: number | null): EmotionalFeedback => {
  if (score === null) {
    return { text: 'Puntuación no disponible', variant: 'secondary', className: 'bg-muted text-muted-foreground' };
  }
  if (score >= 90) {
    return { text: '¡Excelente!', variant: 'default', className: 'bg-green-500 hover:bg-green-600 text-white' };
  }
  if (score >= 70) {
    return { text: '¡Muy Bien!', variant: 'default', className: 'bg-primary hover:bg-primary/90 text-primary-foreground' };
  }
  if (score >= 50) {
    return { text: '¡Buen Comienzo!', variant: 'default', className: 'bg-yellow-400 hover:bg-yellow-500 text-black' };
  }
  return { text: 'Necesita Mejoras', variant: 'destructive', className: 'bg-red-600 hover:bg-red-700 text-white' };
};

export function ScoreDisplay({ scoreContent, isLoading, usage }: ScoreDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mt-8 mb-12 shadow-xl border-muted border-2 animate-pulse">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center items-center mb-2">
            <Award className="w-10 h-10 text-muted" />
          </div>
          <Skeleton className="h-7 w-3/5 mx-auto" />
        </CardHeader>
        <CardContent className="text-center">
          <div className="my-4">
            <Skeleton className="h-20 w-32 mx-auto" />
          </div>
          <Skeleton className="h-8 w-1/3 mx-auto mb-1" />
          <Skeleton className="h-4 w-4/5 mx-auto mt-4" />
          <Skeleton className="h-4 w-3/5 mx-auto mt-1" />
          <Skeleton className="h-3 w-1/4 mx-auto mt-3" />
        </CardContent>
      </Card>
    );
  }

  if (!scoreContent) {
    return null; 
  }

  const { score, explanation } = parseScoreContent(scoreContent);
  const feedback = getEmotionalFeedback(score);

  return (
    <Card className="w-full max-w-2xl mt-8 mb-12 shadow-xl border-primary border-2">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center items-center mb-2">
          <Award className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-primary">Puntuación Global del Prompt</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {score !== null ? (
          <div className="my-4">
            <span className="text-7xl font-bold text-foreground">{score}</span>
            <span className="text-3xl text-muted-foreground">/100</span>
          </div>
        ) : (
          <p className="text-muted-foreground my-4 py-8">No se pudo determinar la puntuación numérica.</p>
        )}
        <Badge variant={feedback.variant} className={`text-lg px-6 py-3 rounded-md ${feedback.className || ''}`}>
          {feedback.text}
        </Badge>
        {explanation && (
          <CardDescription className="mt-6 text-base text-foreground/80 px-4 leading-relaxed">
            {explanation}
          </CardDescription>
        )}
         {usage && (usage.inputTokens != null || usage.outputTokens != null) && (
          <div className="mt-4 text-xs text-muted-foreground">
            <Info className="inline h-3 w-3 mr-1" />
            Tokens para esta puntuación: Entrada {usage.inputTokens ?? 'N/A'} / Salida {usage.outputTokens ?? 'N/A'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
