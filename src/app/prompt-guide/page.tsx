"use client";

import { PromptingExplanationEN } from "@/components/prompting-explanation-en";
import { PromptGuideEN } from "@/components/prompt-guide-en";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Lightbulb, Brain } from "lucide-react";

export default function PromptGuidePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="text-center mb-16">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-accent" />
          <Lightbulb className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Effective AI Prompting Guide
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
          Learn how to craft effective prompts to get the most out of
          AI-generated code and solutions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16">
        <section id="why-be-specific">
          <PromptingExplanationEN />
        </section>

        <Separator className="my-8" />

        <section id="prompt-guide">
          <PromptGuideEN />
        </section>

        <section
          id="additional-resources"
          className="mt-16 bg-muted/30 p-8 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-cyan-500" />
            <h2 className="text-2xl font-bold text-cyan-500">
              Additional Resources
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Technique Comparison
              </h3>
              <p className="text-muted-foreground mb-4">
                Explore different AI prompting techniques and their
                effectiveness for various use cases.
              </p>
              <Link href="/#techniques">
                <Button variant="outline" className="w-full font-semibold">
                  View Techniques
                </Button>
              </Link>
            </div>

            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Try It Yourself</h3>
              <p className="text-muted-foreground mb-4">
                Put your new prompting skills to the test and see how they
                improve your AI-generated results.
              </p>
              <Link href="/#analyze">
                <Button className="w-full text-background font-semibold">Try Prompt Analysis</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
