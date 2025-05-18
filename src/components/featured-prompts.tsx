"use client";

import { useState } from "react";
import Link from "next/link";
import { prompts } from "@/constants/prompts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Tag, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FeaturedPrompts() {
  // Select a few featured prompts (you can customize this selection logic)
  const featuredPromptIds = [1, 6, 8, 10, 12]; // IDs of prompts to feature
  const featuredPrompts = prompts.filter(prompt => featuredPromptIds.includes(prompt.id));
  
  // Function to copy prompt to clipboard
  const copyPromptToClipboard = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Prompts Destacados</h2>
          <p className="text-muted-foreground max-w-2xl">
            Descubre nuestra selección de prompts optimizados para mejorar tus interacciones con LLMs y generar código de alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPrompts.map((prompt) => (
            <Card key={prompt.id} className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">ID: {prompt.id}</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyPromptToClipboard(prompt.template)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copiar prompt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {prompt.template.substring(0, 60)}...
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {prompt.nivel.split(" | ").map((level) => (
                    <Badge key={level} variant="secondary" className="text-xs">
                      {level}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                  {prompt.notas_para_el_uso}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {prompt.categoría.split(" | ").map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Link href={`/prompts?id=${prompt.id}`} className="w-full">
                  <Button variant="ghost" className="w-full">
                    Ver detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/prompts">
            <Button className="group">
              Ver todos los prompts
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
