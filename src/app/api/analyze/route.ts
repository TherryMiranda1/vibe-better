import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/ai/genkit";
import {
  analysisConfig,
  analysisOrder,
  LOADING_EVENT_VALUE,
} from "@/config/analysis-config";
import type { AnalysisSectionKey, AnalysisUpdateEvent } from "@/types/analysis";
import { evaluateComplexity } from "@/ai/flows/evaluate-complexity-flow";
import { generateSuggestedPromptWithLinkedTags } from "@/ai/flows/generate-suggested-prompt-flow";
import { scorePrompt } from "@/ai/flows/score-prompt";

export const dynamic = "force-dynamic"; // Ensures the route is not statically cached

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userPrompt = searchParams.get("prompt");
  const analysesParam = searchParams.get("analyses");

  if (!userPrompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
  console.log(
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

  // let complexityResultForRecommendations: StructuredComplexityResult | null = null; // No longer needed

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
              console.log(
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
                    });
                  payloadString = JSON.stringify(suggestedPromptResult);
                } else if (key === "score") {
                  const scoreResult = await scorePrompt({ prompt: userPrompt });
                  payloadString = JSON.stringify(scoreResult);
                  // } else if (key === 'recommendations') {  // This block is removed
                  //   // Logic for generateContextualRecommendations was here
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
                console.log(
                  `[API_ANALYZE_SECTION_END] Section: ${key}, Success: true`
                );
                sendEvent(key, payloadString);
              } catch (e) {
                console.log(
                  `[API_ANALYZE_SECTION_END] Section: ${key}, Success: false`
                );
                const errorMessage =
                  e instanceof Error
                    ? e.message
                    : "Error desconocido procesando esta sección.";
                console.error(
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

        console.log(
          `[API_ANALYZE_STREAM_CLOSING] All requested sections processed. Sending close event.`
        );
        controller.enqueue(
          encoder.encode("event: close\ndata: Analysis complete\n\n")
        );
        controller.close();
      },
      cancel(reason) {
        console.warn(
          `[API_ANALYZE_STREAM_CANCELLED] Analysis stream cancelled by client. Reason: ${reason}. Prompt: "${userPrompt.substring(
            0,
            30
          )}..."`
        );
      },
    });

    console.log(`[API_ANALYZE_RESPONSE] Returning SSE stream response.`);
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
    console.error(
      `[API_ANALYZE_GLOBAL_ERROR] Prompt: "${userPrompt.substring(
        0,
        50
      )}..." Details: ${message}`,
      error
    );
    return NextResponse.json(
      {
        error: "Failed to start analysis stream.",
        details: message.substring(0, 200),
      },
      { status: 500 }
    );
  }
}
