// src/app/landing/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
  Lightbulb,
  FilePenLine,
  BarChart2,
  ShieldCheck,
  Rocket,
  BookOpen,
  Settings2,
  History,
  Users,
  Brain,
  Gauge,
  Share2,
  ThumbsUp,
  Edit3,
  Copy,
} from "lucide-react";
import Image from "next/image";
import { FeaturedPrompts } from "@/components/featured-prompts";
import TechniqueComparison from "@/components/technique-comparison";

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/30 transition-shadow duration-300">
    <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
      <div className="bg-primary/10 p-3 rounded-full text-primary">{icon}</div>
      <CardTitle className="text-xl font-semibold pt-1">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const BenefitItem: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1 text-primary">{icon}</div>
    <span className="text-foreground/90">{text}</span>
  </li>
);

export default function LandingSections() {
  return (
    <div>
      {/* Problema Section */}
      <section
        id="problema"
        className="py-16 md:py-24 bg-gradient-to-br from-black/80 to-card"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Could Your Interaction with AI for Code Be Improved?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Many developers face the same challenges when using LLMs to generate
            code.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-md">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lost Hours</h3>
              <p className="text-muted-foreground">
                Do you spend hours refining your prompt to get a decent result?
              </p>
            </Card>
            <Card className="text-center p-6 shadow-md">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Costs</h3>
              <p className="text-muted-foreground">
                Do you pay hundreds of dollars in AI credits for endless
                iterations?
              </p>
            </Card>
            <Card className="text-center p-6 shadow-md">
              <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Inconsistent Quality
              </h3>
              <p className="text-muted-foreground">
                Frustrated because the generated code does not meet your quality
                standards and best practices?
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our Solution:{" "}
              <span className="text-primary">Clarity and Efficiency</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Vibe Code Better instantly analyzes your prompt and guides you
              step by step, offering:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gauge className="h-7 w-7" />}
              title="Complexity Evaluation"
              description="We detect if your request is trivial or requires advanced details."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-7 w-7" />}
              title="Key Omissions Detection"
              description="Responsiveness, accessibility, maintainability, security…"
            />
            <FeatureCard
              icon={<Lightbulb className="h-7 w-7" />}
              title="Smart Recommendations"
              description="Only suggests what truly makes a difference."
            />
            <FeatureCard
              icon={<FilePenLine className="h-7 w-7" />}
              title="Optimized Prompts"
              description="Two ready-to-use versions: one compact and one for prompt engineers."
            />
          </div>
        </div>
      </section>

      {/* Beneficios Clave Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Key Benefits of Using Vibe Code Better
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Transform the way you interact with AI for code generation and
                experience tangible improvements.
              </p>
              <ul className="space-y-5 text-lg">
                <BenefitItem
                  icon={<Clock className="h-6 w-6" />}
                  text="Save hours of trial and error when creating prompts."
                />
                <BenefitItem
                  icon={<DollarSign className="h-6 w-6" />}
                  text="Significantly reduce API consumption costs for AI."
                />
                <BenefitItem
                  icon={<Rocket className="h-6 w-6" />}
                  text="Get immediate quality: maintainable, decoupled code with refined UX/UI."
                />
                <BenefitItem
                  icon={<BarChart2 className="h-6 w-6" />}
                  text="Continuous improvement with prompt history, scores, and metrics."
                />
              </ul>
            </div>
            <div className="mt-10 lg:mt-0">
              <Image
                src="https://res.cloudinary.com/dtlaxm8gi/image/upload/v1747482862/image_tlzkkg.png"
                alt="Developer working efficiently"
                width={600}
                height={450}
                className="rounded-xl shadow-xl mx-auto"
                data-ai-hint="developer productivity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section id="como-funciona" className=" py-16 md:py-24 bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Simple, Fast and Effective
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 text-center">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Edit3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Describe your Idea
              </h3>
              <p className="text-muted-foreground">
                Write your idea in the main textarea.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Optimize</h3>
              <p className="text-muted-foreground">
                Click on “Optimize prompt”.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Insights</h3>
              <p className="text-muted-foreground">
                See real-time feedback: Complexity, dependencies, etc.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Copy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                4. Copy your Prompt
              </h3>
              <p className="text-muted-foreground">Compact or professional.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5. Generate Code</h3>
              <p className="text-muted-foreground">
                Paste it into your AI and get flawless code.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                6. Save time and money
              </h3>
              <p className="text-muted-foreground">
                Get the most out of AI with every request.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Technique Comparison Section */}
      <TechniqueComparison />

      {/* Características Destacadas Section */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Share2 className="h-7 w-7" />}
              title="Live Analysis"
              description="Breakdown by information blocks in real time."
            />
            <FeatureCard
              icon={<BookOpen className="h-7 w-7" />}
              title="Integrated Technical Glossary"
              description="Understand and apply key terms with clear, accessible definitions."
            />
            <FeatureCard
              icon={<Zap className="h-7 w-7" />}
              title="Instant Results"
              description="See analyses as they are generated, without interrupting your flow."
            />
            <FeatureCard
              icon={<Gauge className="h-7 w-7" />}
              title="Overall Prompt Score"
              description="Receive an objective rating of your original prompt's quality."
            />
            <FeatureCard
              icon={<History className="h-7 w-7" />}
              title="Analysis History"
              description="Save and review your previous prompts and their analysis results."
            />
            <FeatureCard
              icon={<Settings2 className="h-7 w-7" />}
              title="Customizable Analysis"
              description="Select which aspects of your prompt you want to analyze for tailored feedback."
            />
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      <FeaturedPrompts />

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card p-6 shadow-xl">
              <CardContent className="pt-4">
                <Users className="h-10 w-10 text-accent mb-4" />
                <p className="text-lg text-foreground/90 mb-4 italic">
                  “I went from 5 to 1 iteration per prompt and my team is
                  grateful. A before and after!”
                </p>
                <p className="font-semibold">Laura M., Front-end Lead</p>
                <p className="text-sm text-muted-foreground">
                  Tech Solutions Inc.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card p-6 shadow-xl">
              <CardContent className="pt-4">
                <ThumbsUp className="h-10 w-10 text-accent mb-4" />
                <p className="text-lg text-foreground/90 mb-4 italic">
                  “My GPT costs dropped by 60%. Now my prompts are clear and
                  effective.”
                </p>
                <p className="font-semibold">Javier R., CTO</p>
                <p className="text-sm text-muted-foreground">
                  StartupX Innovate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Turn Your Prompts Into Your Best Development Tool
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join for free and start generating higher quality code, faster and
            at lower cost.
          </p>
          <Button
            size="lg"
            className="text-lg py-3 px-8 shadow-lg text-background hover:shadow-primary/50 transition-shadow duration-300"
            asChild
          >
            <Link href="/">
              Start Now <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t border-border text-center bg-card">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vibe Code Better. All rights
            reserved.
            <br />
            <Link href="/" className="hover:text-primary">
              Go to Analyzer
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
