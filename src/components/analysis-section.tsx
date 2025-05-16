import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  StructuredComplexityResult,
  ComplexityDimensionScore,
  StructuredSuggestedPromptResult,
  TokenUsage,
  TechnicalTag,
} from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChevronRight,
  AlertTriangle,
  BookMarked,
  PencilLine,
  SparklesIcon,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { technicalTags } from "@/config/technical-tags";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Typewriter from "@/components/typewriter";

interface AnalysisSectionProps {
  itemKey: string;
  title: string;
  Icon: LucideIcon;
  content?: string;
  isLoading: boolean;
  usage?: TokenUsage;
}

function getComplexityColorClass(level: string): string {
  const normalizedLevel = level.toLowerCase();
  if (
    normalizedLevel.includes("muy baja") ||
    normalizedLevel.includes("baja")
  ) {
    return "text-[hsl(var(--complexity-low))]";
  }
  if (normalizedLevel.includes("moderada")) {
    return "text-[hsl(var(--complexity-medium))]";
  }
  if (
    normalizedLevel.includes("alta") ||
    normalizedLevel.includes("muy alta")
  ) {
    return "text-[hsl(var(--complexity-high))]";
  }
  return "text-foreground";
}

const DimensionDisplay: React.FC<{
  title: string;
  data: ComplexityDimensionScore;
}> = ({ title, data }) => (
  <div className="mb-3 p-3 border rounded-md bg-muted/50">
    <h4 className="font-semibold text-sm mb-1">
      {title}:{" "}
      <span className="font-normal">
        {data.category} ({data.points}/5 pts)
      </span>
    </h4>
    <p className="text-xs text-muted-foreground">{data.criteria}</p>
  </div>
);

const parseDependencies = (
  text: string
): Array<{ name: string; justification?: string }> => {
  const noDepsMessages = [
    "no se requieren dependencias externas para esta tarea",
    "se puede realizar con funcionalidades nativas del framework/navegador",
  ];
  const lowerText = text.toLowerCase().trim();

  if (
    noDepsMessages.some(
      (msg) =>
        lowerText.startsWith(msg.toLowerCase()) &&
        lowerText.length < msg.length + 30
    )
  ) {
    if (
      noDepsMessages.some(
        (msg) =>
          lowerText === msg.toLowerCase() ||
          lowerText === (msg + ".").toLowerCase()
      )
    ) {
      return [];
    }
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !noDepsMessages.some((msg) =>
          line.toLowerCase().startsWith(msg.toLowerCase())
        )
    )
    .map((line) => {
      const parts = line.split(/[:–-]/);
      if (parts.length > 1) {
        return {
          name: parts[0].trim(),
          justification: parts.slice(1).join(" ").trim(),
        };
      }
      return { name: line.trim() };
    });
};

const parseFeatures = (text: string): string[] => {
  if (text.includes("\n")) {
    return text
      .split("\n")
      .map((line) => line.trim().replace(/^- /, ""))
      .filter((line) => line.length > 0);
  }
  if (text.split(",").length > 1) {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (text.trim().length > 0 && !isContentError(text)) {
    return [text.trim()];
  }
  return [];
};

const findTagInGlossary = (tagNameOrId: string): TechnicalTag | undefined => {
  const normalizedTagName = tagNameOrId.toLowerCase().trim();
  return technicalTags.find(
    (glossaryTag) =>
      glossaryTag.name.toLowerCase() === normalizedTagName ||
      glossaryTag.id.toLowerCase() === normalizedTagName
  );
};

function stripMarkdown(markdown: string): string {
  if (!markdown) return "";
  let text = markdown;
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  text = text.replace(/~~(.*?)~~/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1");
  text = text.replace(/^```[a-zA-Z]*\n([\s\S]*?)\n```$/gm, "$1");
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/^\s*([-*+]|\d+\.)\s+/gm, "");
  text = text.replace(/^\s*(?:---|\*\*\*|___)\s*$/gm, "");
  text = text.replace(/^>\s+/gm, "");
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
  return text;
}

const isContentError = (text: string | undefined): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  const errorMessages = [
    "no se pudo obtener respuesta",
    "error en genkit",
    "ocurrió un error al analizar la sección",
    "error: no se pudo completar el análisis para",
    "análisis no completado o sin datos",
  ];

  if (errorMessages.some((msg) => lowerText.includes(msg))) {
    return true;
  }

  if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(text);
      return !!parsed.error;
    } catch (e) {
      // Not a valid JSON or not an error object, so not an error in this form
    }
  }
  return false;
};

export function AnalysisSection({
  itemKey,
  title,
  Icon,
  content,
  isLoading,
  usage,
}: AnalysisSectionProps) {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeGlossaryTag, setActiveGlossaryTag] =
    useState<TechnicalTag | null>(null);

  const handleGlossaryTagClick = (tag: TechnicalTag) => {
    setActiveGlossaryTag(tag);
  };
  console.log(content);
  const MarkdownLinkRenderer: React.FC<React.PropsWithChildren<any>> = ({
    node,
    ...props
  }) => {
    const tagName = props.children as string;
    console.log(props, node);
    console.log(technicalTags);
    if (tagName) {
      const tag = findTagInGlossary(tagName);
      console.log(tag);
      if (tag) {
        return (
          <span
            className="text-primary underline decoration-dotted hover:decoration-solid cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleGlossaryTagClick(tag);
            }}
          >
            {props.children}
          </span>
        );
      }
    }
    return <span>{props.children}</span>;
  };

  const handleCopyToClipboard = async (textToCopy: string, copyKey: string) => {
    if (!navigator.clipboard) {
      toast({
        title: "Error",
        description:
          "El portapapeles no está disponible en este navegador o la conexión no es segura.",
        variant: "destructive",
      });
      return;
    }
    try {
      const plainText = stripMarkdown(textToCopy);
      await navigator.clipboard.writeText(plainText);
      toast({
        title: "¡Éxito!",
        description: "Prompt copiado al portapapeles.",
      });
      setCopiedStates((prev) => ({ ...prev, [copyKey]: true }));
      setTimeout(
        () => setCopiedStates((prev) => ({ ...prev, [copyKey]: false })),
        2000
      );
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el prompt. Inténtalo manualmente.",
        variant: "destructive",
      });
    }
  };

  let structuredComplexityContent: StructuredComplexityResult | null = null;
  if (itemKey === "complexity" && content && !isLoading) {
    const trimmedContent = content.trim();
    if (trimmedContent.startsWith("{") && trimmedContent.endsWith("}")) {
      try {
        structuredComplexityContent = JSON.parse(
          content
        ) as StructuredComplexityResult;
      } catch (error) {
        // console.warn('Warning: Error parsing complexity content as JSON. Raw Content:', content, error);
      }
    }
  }

  let structuredSuggestedPrompt: StructuredSuggestedPromptResult | null = null;
  if (itemKey === "suggestedPrompt" && content && !isLoading) {
    const trimmedContent = content.trim();
    if (trimmedContent.startsWith("{") && trimmedContent.endsWith("}")) {
      try {
        structuredSuggestedPrompt = JSON.parse(
          content
        ) as StructuredSuggestedPromptResult;
      } catch (error) {
        // console.warn('Warning: Error parsing suggested prompt content as JSON. Raw Content:', content, error);
      }
    }
  }

  const contentIsErrorFlag = isContentError(content);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }

    if (!content) {
      return (
        <p className="text-sm text-muted-foreground mt-2">
          Análisis no disponible o pendiente.
        </p>
      );
    }

    if (contentIsErrorFlag) {
      let errorMessage = content;
      if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.error) {
            errorMessage = parsed.error;
          }
        } catch (e) {
          /* Ignore parsing error here, display raw content */
        }
      }
      return <p className="text-sm text-destructive mt-2">{errorMessage}</p>;
    }

    if (itemKey === "complexity") {
      if (structuredComplexityContent) {
        return (
          <div className="text-sm max-w-2xl text-foreground mt-2 space-y-3">
            <div className="p-3 border rounded-md bg-card shadow-sm">
              <h3
                className={`text-lg font-bold mb-1 ${getComplexityColorClass(
                  structuredComplexityContent.complexityLevel
                )}`}
              >
                {structuredComplexityContent.complexityLevel} -{" "}
                {structuredComplexityContent.totalPoints}/15 Puntos
              </h3>
              <p className="text-xs text-muted-foreground italic mb-3">
                {structuredComplexityContent.levelDescription}
              </p>
            </div>

            <DimensionDisplay
              title="Dimensión de Implementación"
              data={structuredComplexityContent.dimension}
            />
            <DimensionDisplay
              title="Generalidad de Implementación"
              data={structuredComplexityContent.generality}
            />
            <DimensionDisplay
              title="Tipo de Dependencias"
              data={structuredComplexityContent.dependencies}
            />

            {structuredComplexityContent.feedback && (
              <div className="mt-3 p-3 border border-yellow-500/50 rounded-md bg-yellow-500/10">
                <h4 className="font-semibold text-sm text-yellow-700 dark:text-yellow-400 mb-1">
                  Feedback Adicional:
                </h4>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  {structuredComplexityContent.feedback}
                </p>
              </div>
            )}
          </div>
        );
      } else if (content) {
        return (
          <div className="mt-2 p-3 border border-amber-500/50 rounded-md bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold">
                Formato de Análisis de Complejidad no reconocido
              </p>
              <p className="text-xs mt-1">
                El análisis se muestra como texto sin formato.
              </p>
              <pre className="text-sm text-foreground whitespace-pre-wrap mt-3 p-2 bg-background/50 rounded font-mono text-xs">
                {content}
              </pre>
            </div>
          </div>
        );
      }
    }

    if (itemKey === "suggestedPrompt") {
      if (structuredSuggestedPrompt) {
        return (
          <div className="mt-2 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-foreground flex items-center">
                  <PencilLine className="h-5 w-5 mr-2 text-primary" />
                  Sugerencia Concisa
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopyToClipboard(
                      structuredSuggestedPrompt.conciseSuggestedPrompt,
                      "concise"
                    )
                  }
                  className="px-2 py-1 h-auto text-xs"
                >
                  {copiedStates["concise"] ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copiedStates["concise"] ? "Copiado" : "Copiar"}
                </Button>
              </div>
              <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-2xl markdown-content p-3 border rounded-md bg-muted/30">
                <ReactMarkdown components={{ a: MarkdownLinkRenderer }}>
                  {structuredSuggestedPrompt.conciseSuggestedPrompt}
                </ReactMarkdown>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-foreground flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-accent" />
                  Sugerencia Elaborada (para Óptimos Resultados)
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopyToClipboard(
                      structuredSuggestedPrompt.elaboratedSuggestedPrompt,
                      "elaborated"
                    )
                  }
                  className="px-2 py-1 h-auto text-xs"
                >
                  {copiedStates["elaborated"] ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copiedStates["elaborated"] ? "Copiado" : "Copiar"}
                </Button>
              </div>
              <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-2xl markdown-content p-3 border rounded-md bg-muted/30">
                <ReactMarkdown components={{ a: MarkdownLinkRenderer }}>
                  {structuredSuggestedPrompt.elaboratedSuggestedPrompt}
                </ReactMarkdown>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <Link
                href="/glossary"
                className="text-primary hover:underline flex items-center py-2 px-3 rounded-md hover:bg-primary/10 transition-colors w-fit"
              >
                <BookMarked className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Consultar glosario de tags
              </Link>
            </div>
          </div>
        );
      } else if (content) {
        return (
          <div className="mt-2 p-3 border border-amber-500/50 rounded-md bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold">
                Formato de Prompt Sugerido no reconocido
              </p>
              <p className="text-xs mt-1">
                El prompt se muestra como texto sin formato.
              </p>
              <pre className="text-sm text-foreground whitespace-pre-wrap mt-3 p-2 bg-background/50 rounded font-mono text-xs">
                {content}
              </pre>
            </div>
          </div>
        );
      }
    }

    if (itemKey === "dependencies" && content) {
      const dependencies = parseDependencies(content);
      const noDepsMessages = [
        "no se requieren dependencias externas para esta tarea",
        "se puede realizar con funcionalidades nativas del framework/navegador",
      ];
      const lowerContent = content.toLowerCase().trim();
      const isNoDepsMessage = noDepsMessages.some(
        (msg) =>
          lowerContent === msg.toLowerCase() ||
          lowerContent === (msg + ".").toLowerCase()
      );

      if (isNoDepsMessage && dependencies.length === 0) {
        return (
          <p className="text-sm text-foreground whitespace-pre-wrap mt-2">
            {content}
          </p>
        );
      }

      if (dependencies.length === 0 && content.trim().length > 0) {
        return (
          <div className="mt-2 p-3 max-w-2xl border border-amber-500/50 rounded-md bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold">
                Formato de dependencias no reconocido
              </p>
              <p className="text-xs mt-1">
                El análisis se muestra como texto sin formato.
              </p>
              <pre className="text-sm text-foreground whitespace-pre-wrap mt-3 p-2 bg-background/50 rounded font-mono text-xs">
                {content}
              </pre>
            </div>
          </div>
        );
      }
      if (dependencies.length === 0) {
        return (
          <p className="text-sm text-foreground whitespace-pre-wrap mt-2">
            {content ||
              "No se identificaron dependencias específicas o la respuesta no tuvo el formato esperado."}
          </p>
        );
      }
      return (
        <div className="mt-2 space-y-3">
          {dependencies.map((dep, index) => (
            <div key={index} className="p-3 border rounded-md bg-muted/30">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary flex-shrink-0" />
                <Badge variant="secondary" className="text-sm">
                  {dep.name}
                </Badge>
              </div>
              {dep.justification && (
                <p className="text-xs text-muted-foreground mt-1.5 ml-7">
                  {dep.justification}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (itemKey === "features" && content) {
      const features = parseFeatures(content);
      if (features.length === 0 && content.trim().length > 0) {
        return (
          <div className="mt-2 p-3 border border-amber-500/50 max-w-2xl rounded-md bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold">
                Formato de funcionalidades no reconocido
              </p>
              <p className="text-xs mt-1">
                El análisis se muestra como texto sin formato.
              </p>
              <pre className="text-sm text-foreground whitespace-pre-wrap mt-3 p-2 bg-background/50 rounded font-mono text-xs">
                {content}
              </pre>
            </div>
          </div>
        );
      }
      if (features.length === 0) {
        return (
          <p className="text-sm text-foreground whitespace-pre-wrap mt-2">
            {content || "No se identificaron funcionalidades específicas."}
          </p>
        );
      }
      return (
        <ul className="mt-2 space-y-2 text-sm text-foreground list-none p-0">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start p-2 border-b border-border/50 last:border-b-0"
            >
              <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Fallback for any itemKey not explicitly handled above (e.g., if 'recommendations' was still active)
    // or for unrecognized content in general sections.
    if (content) {
      // For generic content that might be markdown, render it as such.
      return (
        <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-none markdown-content p-3 border rounded-md bg-muted mt-2">
          <ReactMarkdown components={{ a: MarkdownLinkRenderer }}>
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <p className="text-sm text-muted-foreground mt-2">
        No hay contenido para mostrar o la sección no se procesó.
      </p>
    );
  };

  return (
    <>
      <AccordionItem
        value={itemKey}
        className="bg-card border border-border rounded-lg shadow-md overflow-hidden"
      >
        <AccordionTrigger className="p-4 text-base font-medium hover:no-underline hover:bg-accent/10 transition-colors w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 min-w-0">
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-primary flex-shrink-0 animate-spin" />
              ) : contentIsErrorFlag ? (
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              ) : content ? (
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--complexity-low))] flex-shrink-0" />
              ) : (
                <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              )}
              <span className="flex-grow min-w-0 text-left truncate">
                <Typewriter text={title} />
              </span>
            </div>

            <div className="flex flex-col items-end text-right pl-2 flex-shrink-0">
              {itemKey === "complexity" &&
                structuredComplexityContent &&
                !isLoading && (
                  <span
                    className={`text-sm font-semibold ${getComplexityColorClass(
                      structuredComplexityContent.complexityLevel
                    )} whitespace-nowrap`}
                  >
                    {structuredComplexityContent.complexityLevel} (
                    {structuredComplexityContent.totalPoints}/15 pts)
                  </span>
                )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0">
          {renderContent()}
          {!isLoading &&
            usage &&
            (usage.inputTokens != null || usage.outputTokens != null) && (
              <div className="text-right text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">
                <Info className="inline h-3 w-3 mr-1 align-middle" />
                Tokens: Entrada {usage.inputTokens ?? "N/A"} / Salida{" "}
                {usage.outputTokens ?? "N/A"}
              </div>
            )}
        </AccordionContent>
      </AccordionItem>

      {activeGlossaryTag && (
        <AlertDialog
          open={!!activeGlossaryTag}
          onOpenChange={() => setActiveGlossaryTag(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{activeGlossaryTag.name}</AlertDialogTitle>
              <AlertDialogDescription>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Categoría:</strong> {activeGlossaryTag.category}
                </p>
                {activeGlossaryTag.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setActiveGlossaryTag(null)}>
                Cerrar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
