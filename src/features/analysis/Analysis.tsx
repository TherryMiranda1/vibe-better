"use client";

import type { FormEvent } from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PromptEngineeringModeConfig,
  promptEngineeringModes,
} from "@/types/prompt-engineering";
import { Textarea } from "@/components/ui/textarea";
import {
  analysisConfig,
  analysisOrder,
  LOADING_EVENT_VALUE,
} from "@/config/analysis-config";
import type {
  AnalysisSections,
  AnalysisSectionKey,
  AnalysisUpdateEvent,
  TokenUsage,
} from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";
import { getUserCredits } from "@/lib/services/client/userCredits.service";
import { saveAnalysis as saveAnalysisToDb } from "@/lib/services/client/analysis.service";
import useUserStore from "@/context/store";
import AdvancedMode from "./components/advanced-mode";
import ActionsNav from "./components/actions-nav";
import AnalysisResults from "./components/analysis-results";
import ContextSelector from "./components/context-selector";
import { SignedIn } from "@clerk/nextjs";

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

const Analysis = () => {
  const updateUserCredits = useUserStore((state) => state.updateUserCredits);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [promptText, setPromptText] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisSections>(
    getInitialAnalysisState()
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [activeAnalyses, setActiveAnalyses] = useState<Set<AnalysisSectionKey>>(
    new Set([
      "suggestedPrompt",
      "score",
      "complexity",
      "dependencies",
      "features",
      "nextSteps",
    ])
  );
  const [temporaryActiveAnalyses, setTemporaryActiveAnalyses] = useState<
    Set<AnalysisSectionKey>
  >(new Set());
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState("");
  const [promptEngineeringMode, setPromptEngineeringMode] =
    useState<PromptEngineeringModeConfig>(promptEngineeringModes[0]);
  const analysisSaved = useRef<boolean>(false);

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

  const handleSaveAnalysis = async (rawResults: AnalysisSections) => {
    analysisSaved.current = true;
    const results = {
      complexity: rawResults.complexity.content,
      dependencies: rawResults.dependencies.content,
      features: rawResults.features.content,
      suggestedPrompt: rawResults.suggestedPrompt.content,
      nextSteps: rawResults.nextSteps.content,
      score: rawResults.score.content,
    };

    try {
      await saveAnalysisToDb({
        prompt: promptText,
        activeAnalyses: Array.from(activeAnalyses),
        resultsContent: results,
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
  };

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
    analysisSaved.current = false;
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

    // Combine the prompt text with selected contexts if any
    const promptWithContexts = selectedContexts
      ? `${selectedContexts}\n\n${promptText}`
      : promptText;

    const analysesQueryParam = Array.from(activeAnalyses).join(",");
    const url = `/api/analyze?prompt=${encodeURIComponent(promptWithContexts)}&analyses=${analysesQueryParam}&promptMode=${promptEngineeringMode.id}`;

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
            description:
              "An error occurred while processing the analysis data.",
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

    es.addEventListener("close", async () => {
      if (streamTerminatedHandledRef.current) {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        return;
      }
      streamTerminatedHandledRef.current = true;

      // Update the UI state
      setAnalysisResults((currentResults) => {
        const finalState = { ...currentResults };

        (Array.from(activeAnalyses) as AnalysisSectionKey[]).forEach((key) => {
          finalState[key].isLoading = false;
          if (!finalState[key].content && key !== "score") {
            finalState[key].content = "Analysis not completed or no data.";
          }
        });
        if (!analysisSaved.current) {
          handleSaveAnalysis(finalState);
        }

        return finalState;
      });

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

  const handlePromptEngineeringModeChange = (
    mode: PromptEngineeringModeConfig
  ) => {
    setPromptEngineeringMode(mode);
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
      <section id="analyze" className="w-full relative flex flex-col gap-4">
        <form
          onSubmit={handleOptimizePrompt}
          className="border border-primary bg-card rounded-xl"
        >
          <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-50">
            {promptText.length} / 10000
          </div>
          <Textarea
            placeholder="Enter your prompt and we will optimize it for you. Ej: I want to create a React component to display a list of users with pagination and filters..."
            value={promptText}
            rows={6}
            onChange={(e) => setPromptText(e.target.value)}
            className="p-4 pt-5 rounded-xl bg-card text-foreground"
            disabled={isAnalyzing}
            maxLength={10000}
          />
          <SignedIn>
            <ContextSelector onContextsChange={setSelectedContexts} />
          </SignedIn>

          <ActionsNav
            isAnalyzing={isAnalyzing}
            promptText={promptText}
            temporaryActiveAnalyses={temporaryActiveAnalyses}
            isSettingsMenuOpen={isSettingsMenuOpen}
            analysisOrder={analysisOrder}
            mandatoryKeys={mandatoryKeys}
            setTemporaryActiveAnalyses={setTemporaryActiveAnalyses}
            handleApplySettings={handleApplySettings}
            handleSettingsMenuOpenChange={handleSettingsMenuOpenChange}
          />
        </form>
        <AdvancedMode
          promptEngineeringModes={promptEngineeringModes}
          promptEngineeringMode={promptEngineeringMode}
          handlePromptEngineeringModeChange={handlePromptEngineeringModeChange}
          isAnalyzing={isAnalyzing}
        />
      </section>

      <AnalysisResults
        hasAnyActiveAnalysisStartedOrHasContent={
          hasAnyActiveAnalysisStartedOrHasContent
        }
        accordionSectionsToShow={accordionSectionsToShow}
        analysisOrder={analysisOrder}
        analysisResults={analysisResults}
        activeAnalyses={activeAnalyses}
        scoreData={scoreData}
        totalTokenUsage={totalTokenUsage}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default Analysis;
