'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Brain } from 'lucide-react';

const explanationContent = `
Most people believe that Artificial Intelligence will give them exactly what they want, as if it could read their mind.
But AI doesn't "understand" like a human, nor does it "know" what you want. What it does is more technical, but also more powerful if you know how to use it well.

### The truth: AI is a statistical model, not a mind reader.
Models like ChatGPT work by predicting the most likely response based on the text you give them.
That means if your prompt is too generic, the model will try to give you a common or superficial answer that has statistically worked before for similar prompts.

### The key: the prompt is the exam, and you decide how easy or difficult it is to pass.
When you create a prompt, you're launching a "challenge" that the model must solve.
The more specific your challenge, the narrower the path it has to follow.

A generic prompt has an easy validator to beat: any half-decent response will seem valid.

A precise prompt has a demanding validator: the AI has to work harder to get it right, and fine-tune its response much more.

---

### Comparative Example

**Generic prompt:**
> "Make me a login in React."

**Likely result:**
> A basic component, with few details, no validation, no careful design, no real security.

**Specific prompt:**
> "Create a React login form with Tailwind, email and password validation, responsive design, decoupled structure, error handling, and production-ready code."

**Likely result:**
> A well-structured component, more useful and directly applicable in a real project.

---

The more specific you are, the more you reduce ambiguity.
And there lies the power: when you reduce ambiguity, AI behaves like a serious technical collaborator.
It returns more professional, more useful code that's better aligned with what you really need.
`;

export function PromptingExplanationEN() {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-16 mb-12 shadow-xl border-accent/30">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-3">
            <Brain className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-accent">
          Why Be Specific When Requesting Code with AI?
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{explanationContent}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
