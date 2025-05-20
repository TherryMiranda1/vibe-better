import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LoaderPinwheel, Settings, Zap } from "lucide-react";
import type { AnalysisSectionKey } from "@/types/analysis";
import { analysisConfig } from "@/config/analysis-config";
import { Dispatch, SetStateAction } from "react";

export default function ActionsNav({
  isAnalyzing,
  promptText,
  temporaryActiveAnalyses,
  isSettingsMenuOpen,
  analysisOrder,
  mandatoryKeys,
  setTemporaryActiveAnalyses,
  handleApplySettings,
  handleSettingsMenuOpenChange,
}: {
  isAnalyzing: boolean;
  promptText: string;
  temporaryActiveAnalyses: Set<AnalysisSectionKey>;
  isSettingsMenuOpen: boolean;
  analysisOrder: AnalysisSectionKey[];
  mandatoryKeys: Set<AnalysisSectionKey>;
  setTemporaryActiveAnalyses: Dispatch<SetStateAction<Set<AnalysisSectionKey>>>;
  handleApplySettings: () => void;
  handleSettingsMenuOpenChange: (open: boolean) => void;
}) {
  return (
    <nav className="flex justify-center items-center gap-2 p-2">
      <SignedIn>
        <button
          type="submit"
          className="flex items-center bg-white  justify-center gap-2 text-background border border px-6 py-2 w-full text-lg rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          disabled={isAnalyzing || !promptText.trim()}
        >
          {isAnalyzing ? (
            <>
              <LoaderPinwheel className="animate-spin text-primary" /> Improving
              your prompt...
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
            Optimize <Zap />
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
              Apply
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
