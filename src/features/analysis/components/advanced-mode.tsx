import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PromptEngineeringModeConfig } from "@/types/prompt-engineering";

export default function AdvancedMode({
  promptEngineeringModes,
  promptEngineeringMode,
  handlePromptEngineeringModeChange,
  isAnalyzing,
}: {
  promptEngineeringModes: PromptEngineeringModeConfig[];
  promptEngineeringMode: PromptEngineeringModeConfig;
  handlePromptEngineeringModeChange: (
    mode: PromptEngineeringModeConfig
  ) => void;
  isAnalyzing: boolean;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced-mode">
        <AccordionTrigger className="w-full flex items-center justify-between rounded-xl px-4 py-2 hover:bg-muted text-muted-foreground">
          <span className="font-semibold text-sm">Advanced mode</span>
        </AccordionTrigger>
        <AccordionContent className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
          {promptEngineeringModes.map((mode) => {
            const Icon = mode.icon;
            const selected = promptEngineeringMode.id === mode.id;
            return (
              <button
                type="button"
                key={mode.id}
                onClick={() => handlePromptEngineeringModeChange(mode)}
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
  );
}
