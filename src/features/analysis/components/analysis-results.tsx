import { AnalysisSectionData, AnalysisSectionKey } from "@/types/analysis";
import { AnalysisSections } from "@/types/analysis";
import { TokenUsage } from "@/types/analysis";

import { Accordion } from "@/components/ui/accordion";
import AnalysisSection from "@/components/analysis-section";
import { ScoreDisplay } from "@/components/score-display";

export default function AnalysisResults({
  hasAnyActiveAnalysisStartedOrHasContent,
  accordionSectionsToShow,
  analysisOrder,
  analysisResults,
  activeAnalyses,
  scoreData,
  totalTokenUsage,
  isAnalyzing,
}: {
  hasAnyActiveAnalysisStartedOrHasContent: boolean;
  accordionSectionsToShow: AnalysisSectionKey[];
  analysisOrder: AnalysisSectionKey[];
  analysisResults: AnalysisSections;
  activeAnalyses: Set<AnalysisSectionKey>;
  scoreData?: AnalysisSectionData | null;
  totalTokenUsage: TokenUsage | null;
  isAnalyzing: boolean;
}) {
  return (
    <>
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
          Tokens: Input {totalTokenUsage?.inputTokens?.toLocaleString() || 0} /
          Output {totalTokenUsage?.outputTokens?.toLocaleString() || 0}
        </div>
      )}
    </>
  );
}
