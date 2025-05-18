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
import { HeroBanner } from "@/features/landing/hero-banner";
import { HoverSurface } from "@/features/landing/hover-surface";
import { FeaturedPrompts } from "@/components/featured-prompts";
import TechniqueComparison from "@/components/technique-comparison";
import dynamic from "next/dynamic";

const DynamicAnalysis = dynamic(() => import("@/features/analysis/Analysis"), {
  ssr: false,
});

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

export default function LandingPage() {
  return (
    <div className="display-flex flex-col min-h-screen mx-auto bg-background text-foreground">
      {/* Hero Section - Replaced with HeroBanner component */}
      <HoverSurface>
        <HeroBanner>
          <DynamicAnalysis />
        </HeroBanner>
      </HoverSurface>

      {/* Problema Section */}
      <section
        id="problema"
        className="py-16 md:py-24 bg-gradient-to-br from-black/80 to-card"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            ¿Tu Interacción con IA para Código Podría Mejorar?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Muchos desarrolladores enfrentan los mismos desafíos al usar LLMs
            para generar código.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-md">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Horas Perdidas</h3>
              <p className="text-muted-foreground">
                ¿Dedicas horas afinando tu prompt para obtener un resultado
                decente?
              </p>
            </Card>
            <Card className="text-center p-6 shadow-md">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Costos Elevados</h3>
              <p className="text-muted-foreground">
                ¿Pagas cientos de dólares en créditos de IA por iteraciones
                infinitas?
              </p>
            </Card>
            <Card className="text-center p-6 shadow-md">
              <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Calidad Inconsistente
              </h3>
              <p className="text-muted-foreground">
                ¿Frustrado porque el código generado no cumple tus estándares de
                calidad y buenas prácticas?
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Nuestra Solución Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Nuestra Solución:{" "}
              <span className="text-primary">Claridad y Eficiencia</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Vibe Code Better analiza tu prompt al instante y te guía paso a
              paso, ofreciendo:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gauge className="h-7 w-7" />}
              title="Evaluación de Complejidad"
              description="Detectamos si tu petición es trivial o requiere detalles avanzados."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-7 w-7" />}
              title="Detección de Omisiones Clave"
              description="Responsive, accesibilidad, mantenibilidad, seguridad…"
            />
            <FeatureCard
              icon={<Lightbulb className="h-7 w-7" />}
              title="Recomendaciones Inteligentes"
              description="Solo sugiere lo imprescindible que marca la diferencia."
            />
            <FeatureCard
              icon={<FilePenLine className="h-7 w-7" />}
              title="Prompts Optimizados"
              description="Dos versiones listas para usar: una compacta y otra de 'prompt engineer'."
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
                Beneficios Clave de Usar Vibe Code Better
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Transforma tu manera de interactuar con la IA para la generación
                de código y experimenta mejoras tangibles.
              </p>
              <ul className="space-y-5 text-lg">
                <BenefitItem
                  icon={<Clock className="h-6 w-6" />}
                  text="Ahorra horas de prueba y error en la creación de prompts."
                />
                <BenefitItem
                  icon={<DollarSign className="h-6 w-6" />}
                  text="Reduce significativamente los costes de consumo de API de IA."
                />
                <BenefitItem
                  icon={<Rocket className="h-6 w-6" />}
                  text="Obtén calidad inmediata: código mantenible, desacoplado y con UX/UI cuidadas."
                />
                <BenefitItem
                  icon={<BarChart2 className="h-6 w-6" />}
                  text="Mejora continua con historial de prompts, puntuaciones y métricas."
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
            Simple, Rápido y Efectivo
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 text-center">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Edit3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Describe tu Idea
              </h3>
              <p className="text-muted-foreground">
                Escribe tu idea en el textarea central.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Optimiza</h3>
              <p className="text-muted-foreground">
                Haz click en “Optimizar prompt”.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Recibe Insights</h3>
              <p className="text-muted-foreground">
                Observa en tiempo real: Complejidad, dependencias, etc.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Copy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Copia tu Prompt</h3>
              <p className="text-muted-foreground">Compacto o profesional.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5. Genera Código</h3>
              <p className="text-muted-foreground">
                Pégalo en tu IA y obtén código impecable.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                6. Ahorra tiempo y dinero
              </h3>
              <p className="text-muted-foreground">
                Sacando el maximo de la IA en cada petición.
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
            Características Destacadas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Share2 className="h-7 w-7" />}
              title="Análisis en Vivo"
              description="Desglose por bloques de información en tiempo real."
            />
            <FeatureCard
              icon={<BookOpen className="h-7 w-7" />}
              title="Glosario Técnico Integrado"
              description="Entiende y aplica términos clave con definiciones claras y accesibles."
            />
            <FeatureCard
              icon={<Zap className="h-7 w-7" />}
              title="Resultados Instantáneos"
              description="Visualiza los análisis a medida que se generan, sin interrumpir tu flujo."
            />
            <FeatureCard
              icon={<Gauge className="h-7 w-7" />}
              title="Puntuación Global de Prompt"
              description="Recibe una calificación objetiva de la calidad de tu prompt original."
            />
            <FeatureCard
              icon={<History className="h-7 w-7" />}
              title="Historial de Análisis"
              description="Guarda y revisa tus prompts anteriores y los resultados de sus análisis."
            />
            <FeatureCard
              icon={<Settings2 className="h-7 w-7" />}
              title="Análisis Personalizable"
              description="Selecciona qué aspectos de tu prompt deseas analizar para un feedback a medida."
            />
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      <FeaturedPrompts />

      {/* Testimonios Section */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Lo que Dicen Nuestros Usuarios
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card p-6 shadow-xl">
              <CardContent className="pt-4">
                <Users className="h-10 w-10 text-accent mb-4" />
                <p className="text-lg text-foreground/90 mb-4 italic">
                  “Pasé de 5 a 1 iteración por prompt y mi equipo lo agradece.
                  ¡Un antes y después!”
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
                  “Mis costes de GPT se redujeron un 60%. Ahora mis prompts son
                  claros y efectivos.”
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

      {/* Llamada a la Acción Section */}
      <section className="max-w-7xl mx-auto py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Convierte tus Prompts en tu Mejor Herramienta de Desarrollo
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Únete gratis y empieza a generar código de mayor calidad, más rápido
            y con menos costes.
          </p>
          <Button
            size="lg"
            className="text-lg py-3 px-8 shadow-lg text-background hover:shadow-primary/50 transition-shadow duration-300"
            asChild
          >
            <Link href="/">
              Comienza Ahora <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t border-border text-center bg-card">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vibe Code Better. Todos los
            derechos reservados.
            <br />
            <Link href="/" className="hover:text-primary">
              Ir al Analizador
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
