import { config } from "dotenv";
config();

import "@/ai/flows/improve-prompt.ts";
import "@/ai/flows/score-prompt.ts";
import "@/ai/flows/prompt-analyzer.ts";
import "@/ai/flows/evaluate-complexity-flow.ts";
import "@/ai/flows/generate-suggested-prompt-flow.ts";
