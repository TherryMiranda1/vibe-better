"use client";

import type { FormEvent } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  promptEngineeringModes,
  type PromptEngineeringMode,
} from "@/types/prompt-engineering";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
import { Loader2, Settings, Zap } from "lucide-react";
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
import { getUserCredits } from "@/lib/services/client/userCredits.service";
import { saveAnalysis as saveAnalysisToDb } from "@/lib/services/client/analysis.service";
import useUserStore from "@/context/store";
import AnalysisSection from "@/components/analysis-section";

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

const Analysis = () => {
  const updateUserCredits = useUserStore((state) => state.updateUserCredits);
  const searchParams = useSearchParams();
  const router = useRouter();

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
  const [promptEngineeringMode, setPromptEngineeringMode] =
    useState<PromptEngineeringMode>("zero-shot");
  const [isPromptEngineeringMenuOpen, setIsPromptEngineeringMenuOpen] =
    useState(false);

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

  // Recuperar el prompt de la URL al cargar el componente
  useEffect(() => {
    const savedPrompt = searchParams.get("prompt");
    if (savedPrompt) {
      try {
        const decodedPrompt = decodeURIComponent(savedPrompt);
        setPromptText(decodedPrompt);
        // Limpiar la URL después de recuperar el prompt
        const url = new URL(window.location.href);
        url.searchParams.delete("prompt");
        router.replace(url.pathname + url.search);
      } catch (error) {
        console.error("Error al decodificar el prompt de la URL:", error);
      }
    }
  }, [searchParams, router]);

  const updateUser = async () => {
    const userCredits = await getUserCredits();
    updateUserCredits(userCredits);
  };

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
    const url = `/api/analyze?prompt=${encodeURIComponent(promptText)}&analyses=${analysesQueryParam}&promptMode=${promptEngineeringMode}`;

    let preflight: Response;
    try {
      preflight = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
    } catch (networkError) {
      toast({
        title: "Error de Red",
        description: "No se pudo conectar al servidor. Revisa tu conexión.",
        variant: "destructive",
      });
      return;
    }

    if (!preflight.ok) {
      let errBody: { error?: string; details?: string };
      try {
        errBody = await preflight.json();
      } catch {
        errBody = { error: "Error desconocido del servidor." };
      }
      toast({
        title: `Error ${preflight.status}`,
        description: errBody.error ?? "Ocurrió un error inesperado.",
        variant: "default",
      });
      return;
    }

    const es = new EventSource(url);
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
            title: "Error processing analysis data",
            description: "An error occurred while processing the analysis data.",
            variant: "destructive",
          });
        }
      }
    };

    es.onerror = (error) => {
      setTimeout(() => {
        if (streamTerminatedHandledRef.current) {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          return;
        }
        streamTerminatedHandledRef.current = true;

        toast({
          title: "Error with Server Connection",
          description:
            "The analysis could not be completed due to a connection problem. Please check your connection or try again later.",
          variant: "destructive",
        });

        setAnalysisResults((prevResults) => {
          const finalState = { ...prevResults };
          (Object.keys(finalState) as AnalysisSectionKey[]).forEach((key) => {
            if (activeAnalyses.has(key) && finalState[key].isLoading) {
              finalState[key].isLoading = false;
              if (!finalState[key].content) {
                finalState[key].content =
                  `Error: Analysis could not be completed for "${analysisConfig[key].title}".`;
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

    es.addEventListener("close", async (event) => {
      if (streamTerminatedHandledRef.current) {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        return;
      }
      streamTerminatedHandledRef.current = true;

      // Get the current analysis results directly from state
      // This ensures we have the most up-to-date values
      const resultsToSave: Record<string, string | undefined> = {};
      let allMandatoryComplete = true;

      // Check for mandatory sections and populate results to save
      analysisOrder.forEach((key) => {
        if (activeAnalyses.has(key) && analysisResults[key]?.content) {
          resultsToSave[key] = analysisResults[key].content;
        } else if (
          mandatoryKeys.has(key) &&
          activeAnalyses.has(key) &&
          !analysisResults[key]?.content
        ) {
          allMandatoryComplete = false;
        }
      });

      // Update the UI state
      setAnalysisResults((currentResults) => {
        const finalState = { ...currentResults };

        (Array.from(activeAnalyses) as AnalysisSectionKey[]).forEach((key) => {
          finalState[key].isLoading = false;
          if (!finalState[key].content && key !== "score") {
            finalState[key].content = "Analysis not completed or no data.";
          }
        });

        return finalState;
      });

      if (activeAnalyses.has("score") && analysisResults.score?.content) {
        resultsToSave["score"] = analysisResults.score.content;
      } else {
        resultsToSave["score"] = "";
      }

      console.log({allMandatoryComplete, promptText})

      if (allMandatoryComplete && promptText.trim()) {
        try {
          await saveAnalysisToDb({
            prompt: promptText,
            activeAnalyses: Array.from(activeAnalyses),
            resultsContent: resultsToSave,
            title: `Analysis ${new Date().toLocaleString()}`,
          });
        } catch (error) {
          console.error("Error saving analysis to database:", error);
          toast({
            title: "Error saving analysis",
            description: "The analysis could not be saved to the database.",
            variant: "default",
          });
        }
      } else if (!allMandatoryComplete && !hasSavedThisStreamRef.current) {
        if (promptText.trim()) {
          toast({
            title: "Analysis Incomplete",
            description:
              "Some sections were not completed, it will not be saved in the history.",
            variant: "default",
          });
        }
      }
      updateUser();
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

  const handlePromptEngineeringModeChange = (mode: PromptEngineeringMode) => {
    setPromptEngineeringMode(mode);
    setIsPromptEngineeringMenuOpen(false);
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
    <div className="flex z-20 flex-col max-w-2xl w-full items-center mx-auto text-left">
      <section className="w-full relative mb-4 flex flex-col gap-4">
        <div>
          <form onSubmit={handleOptimizePrompt} className="space-y-6">
            <div className="relative">
              <div className="absolute top-1 right-1 text-xs text-muted-foreground opacity-50">
                {promptText.length} / 10000
              </div>
              <Textarea
                placeholder="Enter your prompt and we will optimize it for you. Ej: I want to create a React component to display a list of users with pagination and filters..."
                value={promptText}
                rows={6}
                onChange={(e) => setPromptText(e.target.value)}
                className="p-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground placeholder:text-xs border-primary/20"
                disabled={isAnalyzing}
                maxLength={10000}
              />

              <Accordion type="single" collapsible className="w-full mt-4 ">
                <AccordionItem value="advanced-mode">
                  <AccordionTrigger className="w-full flex items-center justify-between rounded-xl px-4 py-2 hover:bg-muted text-muted-foreground">
                    <span className="font-semibold text-sm">Advanced mode</span>
                  </AccordionTrigger>
                  <AccordionContent className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                    {promptEngineeringModes.map((mode) => {
                      const Icon = mode.icon;
                      const selected = promptEngineeringMode === mode.id;
                      return (
                        <button
                          type="button"
                          key={mode.id}
                          onClick={() =>
                            handlePromptEngineeringModeChange(mode.id)
                          }
                          disabled={isAnalyzing}
                          className={`group flex flex-col items-start gap-2 p-4 rounded-xl border transition-colors w-full h-full shadow-sm
                            ${selected ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border bg-card hover:bg-primary/10"}
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                        >
                          <div
                            className={`flex items-center justify-center rounded-full p-2 mb-1 ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} transition-colors`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className={`font-semibold text-xs ${selected ? "text-primary" : "text-foreground"}`}
                          >
                            {mode.name}
                          </span>
                          <span className="text-xs text-muted-foreground text-left">
                            {mode.description}
                          </span>
                        </button>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <nav className="flex justify-center items-center gap-2">
              <SignedIn>
                <button
                  type="submit"
                  className="flex items-center bg-white  justify-center gap-2 text-background border border px-6 py-2 w-full text-lg rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  disabled={isAnalyzing || !promptText.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" /> Improving your
                      prompt...
                    </>
                  ) : (
                    <>
                      Optimize
                      <Zap className="w-5 h-5 text-primary" />
                    </>
                  )}
                </button>
              </SignedIn>
              <SignedOut>
                <SignInButton
                  mode="modal"
                  fallbackRedirectUrl={
                    promptText.trim()
                      ? `/?prompt=${encodeURIComponent(promptText)}`
                      : "/"
                  }
                >
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-center gap-2 bg-white text-background border border px-6 py-2 w-full text-lg rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    Optimizar <Zap />
                  </button>
                </SignInButton>
              </SignedOut>
              <DropdownMenu
                open={isSettingsMenuOpen}
                onOpenChange={handleSettingsMenuOpenChange}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 hover:bg-primary/10 py-5  rounded-xl"
                    disabled={isAnalyzing}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="sr-only">Analysis Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Analysis Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {analysisOrder.map((key) => {
                    const config = analysisConfig[key];
                    const isMandatory = mandatoryKeys.has(key);
                    return (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={
                          isMandatory || temporaryActiveAnalyses.has(key)
                        }
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
            </nav>
          </form>
        </div>
      </section>

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
        <div className="w-full max-w-2xl text-right text-xs text-muted-foreground">
          Tokens: Input {totalTokenUsage.inputTokens?.toLocaleString() || 0} /
          Output {totalTokenUsage.outputTokens?.toLocaleString() || 0}
        </div>
      )}
    </div>
  );
};

export default Analysis;
