"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserAnalyses,
  deleteAnalysis,
  AnalysisResult,
} from "@/lib/services/client/analysis.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { analysisConfig } from "@/config/analysis-config";
import {
  Loader2,
  Trash2,
  ArrowLeft,
  ExternalLink,
  PencilLine,
  ListChecks,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { ScoreDisplay } from "@/components/score-display";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import type {
  StructuredComplexityResult,
  StructuredSuggestedPromptResult,
  StructuredNextStepsResult,
} from "@/types/analysis";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/seo/PageHeader";
import Loader from "@/components/loader/loader";

// Helper functions for formatting analysis content
const getComplexityColorClass = (level: string): string => {
  switch (level.toLowerCase()) {
    case "basic":
      return "text-green-500";
    case "intermediate":
      return "text-yellow-500";
    case "advanced":
      return "text-orange-500";
    case "complex":
      return "text-red-500";
    default:
      return "text-primary";
  }
};

const DimensionDisplay = ({
  title,
  data,
}: {
  title: string;
  data: { category: string; points: number; criteria: string };
}) => (
  <div className="p-3 border rounded-md bg-muted/30">
    <h4 className="text-sm font-semibold mb-1">{title}</h4>
    <div className="flex justify-between items-center">
      <span className="text-sm">{data.category}</span>
      <Badge variant="secondary" className="text-xs">
        {data.points} points
      </Badge>
    </div>
    <p className="text-xs text-muted-foreground mt-1">{data.criteria}</p>
  </div>
);

const MyAnalysis = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getUserAnalyses();
        setAnalyses(data);
      } catch (error) {
        console.error("Error fetching analyses:", error);
        toast({
          title: "Error",
          description: "Unable to load your analyses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id));
      toast({
        title: "Analysis deleted",
        description: "The analysis has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error",
        description: "Unable to delete the analysis. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Analyses", href: "/my-analysis" },
        ]}
      />
      <PageHeader
        title="My Analyses"
        description="Manage your analyses and view the results"
      />

      <SignedIn>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader size="large" />
          </div>
        ) : analyses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-xl">
                    {analysis.title ||
                      `Analysis ${new Date(analysis.createdAt).toLocaleDateString()}`}
                  </CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(new Date(analysis.createdAt), {
                      addSuffix: true,
                      locale: enUS,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Original prompt:
                    </h3>
                    <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                      {analysis.prompt}
                    </div>
                  </div>

                  <Accordion type="single" collapsible className=" space-y-2">
                    {analysis.activeAnalyses
                      .filter(
                        (key) => key !== "score" && analysis.resultsContent[key]
                      )
                      .map((key) => {
                        const section = analysisConfig[key];
                        return (
                          <AccordionItem key={key} value={key}>
                            <AccordionTrigger className="py-4 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-2">
                                {section.Icon && (
                                  <section.Icon className="h-5 w-5" />
                                )}
                                <span>{section.title}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex justify-center pt-4 px-4">
                              {key === "complexity" &&
                                analysis.resultsContent[key] &&
                                (() => {
                                  try {
                                    const complexityData = JSON.parse(
                                      analysis.resultsContent[key]
                                    ) as StructuredComplexityResult;
                                    return (
                                      <div className="text-sm max-w-2xl text-foreground mt-2 space-y-3">
                                        <div className="p-3 border rounded-md bg-card shadow-sm">
                                          <h3
                                            className={`text-lg font-bold mb-1 ${getComplexityColorClass(
                                              complexityData.complexityLevel
                                            )}`}
                                          >
                                            {complexityData.complexityLevel} -{" "}
                                            {complexityData.totalPoints}/15
                                            Points
                                          </h3>
                                          <p className="text-xs text-muted-foreground italic mb-3">
                                            {complexityData.levelDescription}
                                          </p>
                                        </div>

                                        <DimensionDisplay
                                          title="Implementation Dimension"
                                          data={complexityData.dimension}
                                        />
                                        <DimensionDisplay
                                          title="Implementation Generality"
                                          data={complexityData.generality}
                                        />
                                        <DimensionDisplay
                                          title="Dependency Type"
                                          data={complexityData.dependencies}
                                        />

                                        {complexityData.feedback && (
                                          <div className="mt-3 p-3 border border-yellow-500/50 rounded-md bg-yellow-500/10">
                                            <h4 className="font-semibold text-sm text-yellow-700 dark:text-yellow-400 mb-1">
                                              Additional Feedback:
                                            </h4>
                                            <p className="text-xs text-yellow-600 dark:text-yellow-300">
                                              {complexityData.feedback}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  } catch {
                                    return (
                                      <div className="whitespace-pre-wrap">
                                        {analysis.resultsContent[key]}
                                      </div>
                                    );
                                  }
                                })()}

                              {key === "suggestedPrompt" &&
                                analysis.resultsContent[key] &&
                                (() => {
                                  try {
                                    const promptData = JSON.parse(
                                      analysis.resultsContent[key]
                                    ) as StructuredSuggestedPromptResult;
                                    return (
                                      <div className="mt-2 space-y-6">
                                        <div>
                                          <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-md font-semibold text-foreground flex items-center">
                                              <PencilLine className="h-5 w-5 mr-2 text-primary" />
                                              Concise Suggestion
                                            </h4>
                                          </div>
                                          <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-2xl markdown-content p-3 border rounded-md bg-muted/30">
                                            <ReactMarkdown>
                                              {
                                                promptData.conciseSuggestedPrompt
                                              }
                                            </ReactMarkdown>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-md font-semibold text-foreground flex items-center">
                                              <PencilLine className="h-5 w-5 mr-2 text-primary" />
                                              Elaborated Suggestion (for Optimal
                                              Results)
                                            </h4>
                                          </div>
                                          <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-2xl markdown-content p-3 border rounded-md bg-muted/30">
                                            <ReactMarkdown>
                                              {
                                                promptData.elaboratedSuggestedPrompt
                                              }
                                            </ReactMarkdown>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } catch {
                                    return (
                                      <div className="whitespace-pre-wrap">
                                        {analysis.resultsContent[key]}
                                      </div>
                                    );
                                  }
                                })()}

                              {key === "nextSteps" &&
                                analysis.resultsContent[key] &&
                                (() => {
                                  try {
                                    const nextStepsData = JSON.parse(
                                      analysis.resultsContent[key]
                                    ) as StructuredNextStepsResult;

                                    if (
                                      !nextStepsData.steps ||
                                      nextStepsData.steps.length === 0
                                    ) {
                                      return (
                                        <p className="text-sm text-muted-foreground mt-2">
                                          No next steps were identified or the
                                          data format was unexpected.
                                        </p>
                                      );
                                    }

                                    const getPriorityBadgeClass = (
                                      priority: "high" | "medium" | "low"
                                    ) => {
                                      switch (priority.toLowerCase()) {
                                        case "high":
                                          return "bg-card text-red-700 hover:bg-red-200";
                                        case "medium":
                                          return "bg-card text-yellow-700 hover:bg-yellow-200";
                                        case "low":
                                          return "bg-card text-green-700 hover:bg-green-200";
                                        default:
                                          return "bg-card text-gray-700 hover:bg-gray-200";
                                      }
                                    };

                                    return (
                                      <div className="mt-3 space-y-4">
                                        {nextStepsData.steps.map(
                                          (step, index) => (
                                            <div
                                              key={index}
                                              className="p-4 border rounded-lg bg-muted/30"
                                            >
                                              <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-md text-primary flex items-center">
                                                  <ListChecks className="w-5 h-5 mr-2 flex-shrink-0" />
                                                  {step.title}
                                                </h4>
                                                <Badge
                                                  variant="outline"
                                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityBadgeClass(step.priority)}`}
                                                >
                                                  Priority:{" "}
                                                  {step.priority
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    step.priority.slice(1)}
                                                </Badge>
                                              </div>
                                              <p className="text-sm text-muted-foreground mb-2 ml-7 leading-relaxed">
                                                {step.description}
                                              </p>
                                              {step.estimatedEffort && (
                                                <p className="text-xs text-muted-foreground mb-1 ml-7">
                                                  <strong>
                                                    Estimated Effort:
                                                  </strong>{" "}
                                                  {step.estimatedEffort}
                                                </p>
                                              )}
                                              {step.technicalConsiderations &&
                                                step.technicalConsiderations
                                                  .length > 0 && (
                                                  <div className="ml-7 mt-2">
                                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                      Technical Considerations:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                      {step.technicalConsiderations.map(
                                                        (
                                                          consideration,
                                                          cIndex
                                                        ) => (
                                                          <li
                                                            key={cIndex}
                                                            className="text-xs text-muted-foreground"
                                                          >
                                                            {consideration}
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  </div>
                                                )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    );
                                  } catch {
                                    return (
                                      <div className="whitespace-pre-wrap">
                                        {analysis.resultsContent[key]}
                                      </div>
                                    );
                                  }
                                })()}

                              {key !== "complexity" &&
                                key !== "suggestedPrompt" &&
                                key !== "nextSteps" && (
                                  <div className="whitespace-pre-wrap">
                                    {analysis.resultsContent[key]}
                                  </div>
                                )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    {analysis.resultsContent.score && (
                      <AccordionItem value="score">
                        <AccordionTrigger className="py-4 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span>Score</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex justify-center pt-4 px-4">
                          <ScoreDisplay
                            scoreContent={analysis.resultsContent.score}
                            isLoading={false}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/20 pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(analysis.id)}
                    disabled={deleting === analysis.id}
                  >
                    {deleting === analysis.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(
                        `/?prompt=${encodeURIComponent(analysis.prompt)}`
                      );
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Reuse
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Don't have any analysis yet
            </h2>
            <p className="text-muted-foreground mb-6">
              When you analyze prompts, they will be automatically saved here.
            </p>
            <Button
              className="text-foreground font-bold"
              onClick={() => router.push("/")}
            >
              Create a new analysis
            </Button>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div className="text-center py-12 bg-muted/20 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">
            Sign in to view your analyses
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to sign in to access your saved analyses.
          </p>
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default MyAnalysis;
