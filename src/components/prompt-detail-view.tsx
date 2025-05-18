"use client";

import { useState, useEffect } from "react";
import { PromptDetailViewProps } from "@/types/prompts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Code, Copy, Info, Lightbulb, Tag } from "lucide-react";

export function PromptDetailView({
  prompt,
  isOpen,
  onClose,
  onCopy,
}: PromptDetailViewProps) {
  // State to track placeholder values
  const [placeholderValues, setPlaceholderValues] = useState<
    Record<string, string>
  >({});
  const [modifiedTemplate, setModifiedTemplate] = useState<string>(
    prompt.template
  );
  // Update the modified template whenever placeholder values change
  useEffect(() => {
    let newTemplate = prompt.template;

    // Replace each placeholder with its value or keep the placeholder if no value
    Object.entries(placeholderValues).forEach(([placeholder, value]) => {
      if (value.trim()) {
        // Replace all occurrences of the placeholder
        const regex = new RegExp(`\{${placeholder}\}`, "g");
        newTemplate = newTemplate.replace(regex, value);
      }
    });

    setModifiedTemplate(newTemplate);
  }, [placeholderValues, prompt.template]);

  // Initialize placeholder values when prompt changes
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    prompt.placeholders.forEach((placeholder) => {
      initialValues[placeholder] = "";
    });
    setPlaceholderValues(initialValues);
    setModifiedTemplate(prompt.template);
  }, [prompt]);

  // Handle input change for a placeholder
  const handlePlaceholderChange = (placeholder: string, value: string) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Prompt #{prompt.id}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={() => onCopy(prompt.template)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </DialogTitle>

          <div className="flex flex-wrap gap-2 mt-2">
            {prompt.nivel.split(" | ").map((level) => (
              <Badge key={level} variant="secondary">
                {level}
              </Badge>
            ))}
            {prompt.etapa.split(" | ").map((etapa) => (
              <Badge
                key={etapa}
                className="bg-primary/20 text-primary border-primary/20"
              >
                {etapa}
              </Badge>
            ))}
            {prompt.categoría.split(" | ").map((category) => (
              <Badge key={category} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Tabs defaultValue="template" className="mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="template">
              <Code className="h-4 w-4 mr-2" />
              Template
            </TabsTrigger>
            <TabsTrigger value="instructions">
              <BookOpen className="h-4 w-4 mr-2" />
              Instrucciones
            </TabsTrigger>
            <TabsTrigger value="notes">
              <Lightbulb className="h-4 w-4 mr-2" />
              Notas de uso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="mt-4">
            <div className="bg-card rounded-md p-4 border">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Template del Prompt</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(modifiedTemplate)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copiar
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md overflow-x-auto">
                {modifiedTemplate}
              </pre>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                Editar Placeholders ({prompt.placeholders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {prompt.placeholders.map((placeholder) => (
                  <Input
                    key={placeholder}
                    id={`placeholder-${placeholder}`}
                    value={placeholderValues[placeholder] || ""}
                    onChange={(e) =>
                      handlePlaceholderChange(placeholder, e.target.value)
                    }
                    placeholder={`Añade ${placeholder}`}
                    className="bg-muted/50 rounded-md p-2 w-full"
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="mt-4">
            <div className="bg-card rounded-md p-4 border">
              <h3 className="font-medium mb-2">Instrucciones de uso</h3>
              <p className="text-sm whitespace-pre-wrap">
                {prompt.instrucciones}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="bg-card rounded-md p-4 border">
              <h3 className="font-medium mb-2">Notas para el uso</h3>
              <p className="text-sm">{prompt.notas_para_el_uso}</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
