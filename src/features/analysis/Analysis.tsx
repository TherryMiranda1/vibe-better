"use client";

import type { FormEvent } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { AnalysisSection } from "@/components/analysis-section";
import { ScoreDisplay } from "@/components/score-display";
import {
  analysisConfig,
  analysisOrder,
  LOADING_EVENT_VALUE,
} from "@/config/analysis-config";
import type {
  AnalysisSections,
  AnalysisSectionKey,
  HistoryEntry,
  AnalysisUpdateEvent,
  TokenUsage,
} from "@/types/analysis";
import { Sparkles, Settings, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

function getInitialAnalysisState(): AnalysisSections {
  const initialState = {} as Partial<AnalysisSections>;
  for (const key of analysisOrder) {
    initialState[key] = {
      ...analysisConfig[key],
      isLoading: false,
      content: undefined,
      usage: undefined,
    };
  }
  return initialState as AnalysisSections;
}

const allAnalysisKeys = new Set(analysisOrder);
const mandatoryKeys: Set<AnalysisSectionKey> = new Set([
  "suggestedPrompt",
  "score",
]);
const MAX_HISTORY_ENTRIES = 10;

export const Analysis = () => {
  const [promptText, setPromptText] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisSections>(
    getInitialAnalysisState()
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [activeAnalyses, setActiveAnalyses] =
    useState<Set<AnalysisSectionKey>>(allAnalysisKeys);
  const [temporaryActiveAnalyses, setTemporaryActiveAnalyses] =
    useState<Set<AnalysisSectionKey>>(allAnalysisKeys);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    "analysisHistory",
    []
  );
  const [totalTokenUsage, setTotalTokenUsage] = useState<TokenUsage>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const hasSavedThisStreamRef = useRef<boolean>(false);
  const streamTerminatedHandledRef = useRef<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const saveToHistory = useCallback(
    (
      currentPromptText: string,
      currentActiveAnalyses: Set<AnalysisSectionKey>,
      currentResultsToStore: Record<string, string | undefined>
    ) => {
      if (!currentPromptText.trim() || hasSavedThisStreamRef.current) return;

      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        prompt: currentPromptText,
        timestamp: Date.now(),
        activeAnalyses: Array.from(currentActiveAnalyses),
        resultsContent: currentResultsToStore,
      };

      setHistory((prevHistory) =>
        [newEntry, ...prevHistory].slice(0, MAX_HISTORY_ENTRIES)
      );
      hasSavedThisStreamRef.current = true;
    },
    [setHistory]
  );

  const handleOptimizePrompt = async (e: FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      toast({
        title: "Entrada vacía",
        description: "Por favor, escribe un prompt para analizar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    hasSavedThisStreamRef.current = false;
    streamTerminatedHandledRef.current = false;

    const initialProcessingState = {} as Partial<AnalysisSections>;
    for (const key of analysisOrder) {
      initialProcessingState[key] = {
        ...analysisConfig[key],
        isLoading: false,
        content: undefined,
        usage: undefined,
      };
    }
    setAnalysisResults(initialProcessingState as AnalysisSections);
    setTotalTokenUsage({ inputTokens: 0, outputTokens: 0, totalTokens: 0 });

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const analysesQueryParam = Array.from(activeAnalyses).join(",");
    const es = new EventSource(
      `/api/analyze?prompt=${encodeURIComponent(
        promptText
      )}&analyses=${analysesQueryParam}`
    );
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const sseEventData: AnalysisUpdateEvent = JSON.parse(event.data);

        if (
          sseEventData.key &&
          analysisConfig[sseEventData.key] &&
          activeAnalyses.has(sseEventData.key)
        ) {
          setAnalysisResults((prevResults) => {
            const newResults = { ...prevResults };
            const sectionKey = sseEventData.key;

            if (sseEventData.value === LOADING_EVENT_VALUE) {
              newResults[sectionKey] = {
                ...prevResults[sectionKey],
                isLoading: true,
                content: undefined,
                usage: undefined,
              };
            } else {
              // sseEventData.value is ALWAYS a JSON string of the section's payload
              const sectionPayload = JSON.parse(sseEventData.value);

              if (sectionPayload.error) {
                newResults[sectionKey] = {
                  ...prevResults[sectionKey],
                  isLoading: false,
                  content: sectionPayload.error,
                  usage: sectionPayload.usage,
                };
              } else {
                let contentForState: string;
                let usageForState: TokenUsage | undefined = undefined;

                // For specific flows, content is the full payload string, usage is at top level of payload
                // For generic flows, content is in payload.content, usage is in payload.usage
                if (
                  sectionKey === "dependencies" ||
                  sectionKey === "features"
                ) {
                  contentForState = sectionPayload.content as string; // For recommendations, this is a stringified array
                  usageForState = sectionPayload.usage as TokenUsage;
                } else {
                  // complexity, suggestedPrompt, score
                  contentForState = sseEventData.value; // The entire stringified payload
                  usageForState = sectionPayload.usage as TokenUsage; // Usage is top-level in the parsed payload
                }

                newResults[sectionKey] = {
                  ...prevResults[sectionKey],
                  isLoading: false,
                  content: contentForState,
                  usage: usageForState,
                };

                if (
                  usageForState &&
                  (usageForState.inputTokens != null ||
                    usageForState.outputTokens != null)
                ) {
                  setTotalTokenUsage((prevTotal) => ({
                    inputTokens:
                      (prevTotal.inputTokens || 0) +
                      (usageForState.inputTokens || 0),
                    outputTokens:
                      (prevTotal.outputTokens || 0) +
                      (usageForState.outputTokens || 0),
                    totalTokens:
                      (prevTotal.totalTokens || 0) +
                      (usageForState.inputTokens || 0) +
                      (usageForState.outputTokens || 0),
                  }));
                }
              }
            }
            return newResults;
          });
        }
      } catch (error) {
        console.error(
          "Error parsing SSE data:",
          error,
          "Raw data:",
          event.data
        );
        if (!streamTerminatedHandledRef.current) {
          toast({
            title: "Error de Análisis",
            description: "Ocurrió un error al procesar los datos del análisis.",
            variant: "destructive",
          });
        }
      }
    };

    es.onerror = () => {
      setTimeout(() => {
        if (streamTerminatedHandledRef.current) {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          return;
        }
        streamTerminatedHandledRef.current = true;

        console.error("EventSource failed.");
        toast({
          title: "Error de Conexión con el Servidor",
          description:
            "No se pudo completar el análisis debido a un problema de conexión. Por favor, revisa tu conexión o inténtalo más tarde.",
          variant: "destructive",
        });

        setAnalysisResults((prevResults) => {
          const finalState = { ...prevResults };
          (Object.keys(finalState) as AnalysisSectionKey[]).forEach((key) => {
            if (activeAnalyses.has(key) && finalState[key].isLoading) {
              finalState[key].isLoading = false;
              if (!finalState[key].content) {
                finalState[
                  key
                ].content = `Error: No se pudo completar el análisis para "${analysisConfig[key].title}".`;
              }
            }
          });
          return finalState;
        });
        setIsAnalyzing(false);

        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      }, 100);
    };

    es.addEventListener("close", (event) => {
      if (streamTerminatedHandledRef.current) {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        return;
      }
      streamTerminatedHandledRef.current = true;

      const currentResultsForHistory: Record<string, string | undefined> = {};
      let allMandatoryDoneForHistory = true;

      setAnalysisResults((currentResults) => {
        const finalState = { ...currentResults };

        mandatoryKeys.forEach((mKey) => {
          if (!finalState[mKey]?.content && activeAnalyses.has(mKey)) {
            allMandatoryDoneForHistory = false;
          }
        });

        (Array.from(activeAnalyses) as AnalysisSectionKey[]).forEach((key) => {
          if (finalState[key] && finalState[key].content) {
            currentResultsForHistory[key] = finalState[key].content;
          }
          finalState[key].isLoading = false;
          if (!finalState[key].content && key !== "score") {
            finalState[key].content = "Análisis no completado o sin datos.";
          }
        });

        if (activeAnalyses.has("score") && finalState.score?.content) {
          currentResultsForHistory["score"] = finalState.score.content;
        } else if (activeAnalyses.has("score") && !finalState.score?.content) {
          allMandatoryDoneForHistory = false;
        }

        return finalState;
      });

      if (allMandatoryDoneForHistory && promptText.trim()) {
        saveToHistory(promptText, activeAnalyses, currentResultsForHistory);
      } else if (
        !allMandatoryDoneForHistory &&
        !hasSavedThisStreamRef.current
      ) {
        if (promptText.trim()) {
          toast({
            title: "Análisis Incompleto",
            description:
              "Algunas secciones no se completaron, no se guardará en el historial.",
            variant: "destructive",
          });
        }
      }

      setIsAnalyzing(false);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    });
  };

  const handleSettingsMenuOpenChange = (open: boolean) => {
    if (open) {
      setTemporaryActiveAnalyses(new Set(activeAnalyses));
    }
    setIsSettingsMenuOpen(open);
  };

  const handleApplySettings = () => {
    setActiveAnalyses(new Set(temporaryActiveAnalyses));
    setIsSettingsMenuOpen(false);
  };

  const accordionSectionsToShow = analysisOrder.filter(
    (key) =>
      key !== "score" &&
      activeAnalyses.has(key) &&
      (analysisResults[key].isLoading || analysisResults[key].content)
  );
  const scoreData = activeAnalyses.has("score")
    ? analysisResults.score
    : undefined;
  const hasAnyActiveAnalysisStartedOrHasContent = analysisOrder.some(
    (key) =>
      activeAnalyses.has(key) &&
      (analysisResults[key].isLoading || analysisResults[key].content)
  );

  return (
    <div className="flex z-20 flex-col max-w-4xl w-full items-center p-4 sm:p-8 mx-auto text-left">
      <Card className="w-full shadow-2xl relative bg-card backdrop-blur-sm mb-4">
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu
            open={isSettingsMenuOpen}
            onOpenChange={handleSettingsMenuOpenChange}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isAnalyzing}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurar Análisis</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Seleccionar Análisis</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {analysisOrder.map((key) => {
                const config = analysisConfig[key];
                const isMandatory = mandatoryKeys.has(key);
                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={isMandatory || temporaryActiveAnalyses.has(key)}
                    disabled={isMandatory || isAnalyzing}
                    onCheckedChange={(checked) => {
                      if (!isMandatory) {
                        setTemporaryActiveAnalyses((prev) => {
                          const newSet = new Set(prev);
                          if (checked) {
                            newSet.add(key);
                          } else {
                            newSet.delete(key);
                          }
                          return newSet;
                        });
                      }
                    }}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {config.title}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <div className="p-1">
                <Button
                  onClick={handleApplySettings}
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  Aplicar
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardHeader className="text-center">
          <CardDescription className="text-lg">
            Ingresa tu prompt de código y lo optimizaremos por ti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOptimizePrompt} className="space-y-6">
            <Textarea
              placeholder="Ej: Quiero crear un componente de React para mostrar una lista de usuarios con paginación y filtros..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="min-h-[150px] p-4 rounded-lg shadow-inner focus:ring-1 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
              disabled={isAnalyzing}
            />
            <SignedIn>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 text-primary border border px-6 py-2 w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                disabled={isAnalyzing || !promptText.trim()}
              >
                {isAnalyzing ? "Analizando..." : "Optimizar Prompt"} <Zap />
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center justify-center gap-2 text-primary border border px-6 py-2 w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  Optimizar Prompt
                </button>
              </SignInButton>
            </SignedOut>
          </form>
        </CardContent>
      </Card>

      {hasAnyActiveAnalysisStartedOrHasContent &&
        accordionSectionsToShow.length > 0 && (
          <div className="w-full mt-12">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {analysisOrder.map((key) => {
                if (!accordionSectionsToShow.includes(key)) return null;
                const section = analysisResults[key];
                if (!section || !activeAnalyses.has(key)) return null;
                return (
                  <AnalysisSection
                    key={key}
                    itemKey={key}
                    title={section.title}
                    Icon={section.Icon}
                    content={section.content}
                    isLoading={section.isLoading}
                    usage={section.usage}
                  />
                );
              })}
            </Accordion>
          </div>
        )}

      {scoreData && !scoreData.isLoading && scoreData.content && (
        <ScoreDisplay
          scoreContent={scoreData.content}
          isLoading={scoreData.isLoading}
          usage={scoreData.usage}
        />
      )}

      {!isAnalyzing && Number(totalTokenUsage?.totalTokens) > 0 && (
        <div className="w-full max-w-2xl mt-4 text-right text-xs text-muted-foreground">
          Tokens totales: Entrada{" "}
          {totalTokenUsage.inputTokens?.toLocaleString() || 0} / Salida{" "}
          {totalTokenUsage.outputTokens?.toLocaleString() || 0}
        </div>
      )}
    </div>
  );
};
