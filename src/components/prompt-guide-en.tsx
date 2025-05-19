'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import { Lightbulb } from 'lucide-react';

const guideContent = [
  {
    title: '1. Define the CODE OBJECTIVE',
    content: `
Ask yourself or indicate:

*   What do I want this code to do?
*   What is its ultimate purpose?

**Example prompt:**
> "I want a functional contact form that sends messages to an email using Node.js."
    `,
  },
  {
    title: '2. Specify the CONTEXT or ENVIRONMENT',
    content: `
This includes the language, framework, type of application, operating system, etc.

**Useful terms:** React, Next.js, Vue, Node.js, Python, Flask, mobile app, backend, microservice, REST API, etc.

**Example:**
> "In a web application with React and Tailwind, I want a component..."
    `,
  },
  {
    title: '3. Declare the FUNCTIONAL REQUIREMENTS',
    content: `
Detail exactly what it should do.

**Useful keywords:**
*   form validation
*   user authentication
*   database connection
*   file upload
*   pagination
*   real-time search

**Example:**
> "It must validate that the email is valid and display error messages if it's not."
    `,
  },
  {
    title: '4. Add QUALITY or ARCHITECTURE REQUIREMENTS',
    content: `
Guide the AI with terms that improve code quality.

**Use terms like:**
*   decoupled
*   modular
*   scalable
*   maintainable
*   reusable
*   clean
*   readable
*   production-optimized
*   robust
*   following SOLID principles

**Example:**
> "The function should be decoupled from the frontend, robust against errors, and written with SOLID principles."
    `,
  },
  {
    title: '5. Include DESIGN DETAILS (if applicable)',
    content: `
Ideal for UI/UX-related prompts.

**Useful terms:**
*   clean design
*   eye-catching design
*   responsive
*   user-friendly
*   experience-centered
*   accessible
*   with good UX-UI practices

**Example:**
> "The design should be responsive and user-friendly, with clearly differentiated fields and accessible colors."
    `,
  },
  {
    title: '6. Add EXTRA CONDITIONS (optional)',
    content: `
If you need:
*   No external dependencies
*   TypeScript compatible
*   Includes unit tests
*   Production-ready
*   Commented
*   With code explanation

**Example:**
> "I want the code to be in TypeScript, with unit tests and explanatory comments."
    `,
  },
  {
    title: '7. Use EXAMPLES or TEST DATA (if applicable)',
    content: `
Help the generated code have realistic cases.

**Example:**
> "Simulate 3 users with name, email, and role, and display their data in a responsive table."
    `,
  },
];

const finalTemplateContent = `
## **General template for effective prompts:**

> "Create \\\[component or function type] in \\\[technology], that \\\[explains what it does], with \\\[design type] design and \\\[quality adjectives] code. Make sure that \\\[extra conditions]."

**Complete example:**

> "Create a table component in React with Tailwind that displays a list of products. It should be responsive, reusable, and readable. The table should allow sorting by name or price. Use simulated test data. The design should be clean and mobile-friendly. Don't use external libraries."
`;

export function PromptGuideEN() {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-16 mb-12 shadow-xl border-primary/50">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-3">
            <Lightbulb className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
          Quick Guide for Effective Code Prompts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {guideContent.map((item, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <span className="text-primary font-bold mr-2">{item.title.split('.')[0]}.</span>
              {item.title.substring(item.title.indexOf(' ') + 1)}
            </h3>
            <div className="markdown-content prose prose-sm dark:prose-invert max-w-none pl-2 border-l-2 border-accent/30 ml-2">
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
            {index < guideContent.length -1 && <Separator className="my-8" />}
          </div>
        ))}
        <Separator className="my-10 border-dashed border-border" />
        <div>
            <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
                 <ReactMarkdown>{finalTemplateContent}</ReactMarkdown>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
