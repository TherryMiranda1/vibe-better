import { ai } from "@/ai/genkit";
import {
  analysisConfig,
  analysisOrder,
  LOADING_EVENT_VALUE,
} from "@/config/analysis-config";
import type { AnalysisSectionKey, AnalysisUpdateEvent } from "@/types/analysis";
import type { PromptEngineeringMode } from "@/types/prompt-engineering";
import { evaluateComplexity } from "@/ai/flows/evaluate-complexity-flow";
import { generateSuggestedPromptWithLinkedTags } from "@/ai/flows/generate-suggested-prompt-flow";
import { scorePrompt } from "@/ai/flows/score-prompt";
import { generateNextSteps } from "@/ai/flows/generate-next-steps-flow";
import { userCreditsService } from "@/lib/services/server/db/userCredits.service";
import { getCurrentUser } from "@/lib/auth";
import { logger } from "@/lib/logger/Logger";
import { NextRequest } from "next/server";
import { getUserSubscriptionInfo } from "@/lib/services/server/userSubscription.service";

export const dynamic = "force-dynamic"; // Ensures the route is not statically cached

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userPrompt = searchParams.get("prompt");
  const analysesParam = searchParams.get("analyses");
  const promptModeParam = searchParams.get(
    "promptMode"
  ) as PromptEngineeringMode | null;
  const operationCost = 1;

  if (!userPrompt) {
    logger.error("Prompt is required");
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (userPrompt.length > 10000) {
    logger.error("Prompt is too long");
    return new Response(JSON.stringify({ error: "Prompt is too long" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await getCurrentUser();

  if (!user) {
    logger.error("User not found");
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if the user has an active subscription
  const unlimitedPlan = await getUserSubscriptionInfo();

  // Check if user has unlimited plan (Plan User)
  const hasUnlimitedPlan = unlimitedPlan.plan !== null;

  // If the user has no active subscription, check their organization's credits
  const credits = hasUnlimitedPlan
    ? Infinity
    : await userCreditsService.getUserCredits(user.id);

  // Skip credit check for users with unlimited plan
  if (!hasUnlimitedPlan && credits < operationCost) {
    logger.error("Not enough credits");
    return new Response(JSON.stringify({ error: "Not enough credits" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  logger.info(
    `[API_ANALYZE_START] Received prompt: "${userPrompt.substring(
      0,
      50
    )}...", Analyses: ${analysesParam || "all"}`
  );

  let requestedKeys: Set<AnalysisSectionKey> | null = null;
  if (analysesParam) {
    requestedKeys = new Set(analysesParam.split(",") as AnalysisSectionKey[]);
  }

  const keysToProcess = requestedKeys
    ? analysisOrder.filter((key) => requestedKeys!.has(key))
    : analysisOrder;

  const isPreflight = request.headers.get("Accept") === "application/json";
  if (!isPreflight && !hasUnlimitedPlan) {
    await userCreditsService.deductUserCredits(user.id, operationCost);
  }

  try {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const sendEvent = (key: AnalysisSectionKey, value: string) => {
          const eventData: AnalysisUpdateEvent = { key, value };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`)
          );
        };

        for (const key of analysisOrder) {
          if (keysToProcess.includes(key)) {
            const config = analysisConfig[key];
            if (config) {
              logger.info(
                `[API_ANALYZE_SECTION_START] Processing section: ${key}`
              );
              sendEvent(key, LOADING_EVENT_VALUE);

              try {
                let payloadString: string;
                if (key === "complexity") {
                  const complexityResult = await evaluateComplexity({
                    prompt: userPrompt,
                  });
                  // complexityResultForRecommendations = complexityResult; // No longer needed for recommendations
                  payloadString = JSON.stringify(complexityResult);
                } else if (key === "suggestedPrompt") {
                  const suggestedPromptResult =
                    await generateSuggestedPromptWithLinkedTags({
                      originalPrompt: userPrompt,
                      promptMode: promptModeParam || "zero-shot",
                    });
                  payloadString = JSON.stringify(suggestedPromptResult);
                } else if (key === "score") {
                  const scoreResult = await scorePrompt({ prompt: userPrompt });
                  payloadString = JSON.stringify(scoreResult);
                } else if (key === "nextSteps") {
                  const nextStepsResult = await generateNextSteps({
                    prompt: userPrompt,
                  });
                  payloadString = JSON.stringify(nextStepsResult);
                } else {
                  // Generic cases: dependencies, features
                  const { text, usage } = await ai.generate({
                    prompt: `${config.instruction}:\n\n${userPrompt}`,
                  });
                  const textContent =
                    text?.trim() || "No se pudo obtener respuesta de la IA.";
                  payloadString = JSON.stringify({
                    content: textContent,
                    usage: usage,
                  });
                }

                logger.info(
                  `[API_ANALYZE_SECTION_END] Section: ${key}, Success: true`
                );
                sendEvent(key, payloadString);
              } catch (e) {
                logger.error(
                  `[API_ANALYZE_SECTION_END] Section: ${key}, Success: false`
                );
                const errorMessage =
                  e instanceof Error
                    ? e.message
                    : "Error desconocido procesando esta sección.";
                logger.error(
                  `[API_ANALYZE_SECTION_ERROR] Section: ${key}, Prompt: "${userPrompt.substring(
                    0,
                    50
                  )}...", Error: ${errorMessage}`,
                  e
                );
                const errorPayloadString = JSON.stringify({
                  error: `Ocurrió un error al analizar la sección '${
                    config.title
                  }': ${errorMessage.substring(0, 150)}`,
                  usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
                });
                sendEvent(key, errorPayloadString);
              }
            }
          }
        }

        logger.info(
          `[API_ANALYZE_STREAM_CLOSING] All requested sections processed. Sending close event.`
        );
        controller.enqueue(
          encoder.encode("event: close\ndata: Analysis complete\n\n")
        );
        controller.close();
      },
      cancel(reason) {
        logger.warn(
          `[API_ANALYZE_STREAM_CANCELLED] Analysis stream cancelled by client. Reason: ${reason}. Prompt: "${userPrompt.substring(
            0,
            30
          )}..."`
        );
      },
    });
    logger.info(`[API_ANALYZE_RESPONSE] Returning SSE stream response.`);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    let message =
      "An unexpected error occurred on the server while preparing the analysis stream.";
    if (error instanceof Error) {
      message = error.message;
    }
    logger.error(
      `[API_ANALYZE_GLOBAL_ERROR] Prompt: "${userPrompt.substring(
        0,
        50
      )}..." Details: ${message}`,
      error
    );
    return new Response(
      JSON.stringify({
        error: "Failed to start analysis stream.",
        details: message.substring(0, 200),
      }),
      { status: 500 }
    );
  }
}
