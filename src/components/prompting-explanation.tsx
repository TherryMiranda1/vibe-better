
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import { HelpCircle, Brain } from 'lucide-react';

const explanationContent = `
La mayoría de las personas cree que la Inteligencia Artificial les va a entregar exactamente lo que quieren, como si leyera su mente.
Pero la IA no “entiende” como un humano, ni “sabe” lo que tú quieres. Lo que hace es algo más técnico, pero también más poderoso si sabes usarlo bien.

### La verdad: la IA es un modelo estadístico, no un adivino.
Los modelos como ChatGPT funcionan prediciendo la respuesta más probable según el texto que les das.
Eso significa que si tu prompt es demasiado genérico, el modelo va a intentar darte una respuesta común o superficial que estadísticamente le haya funcionado antes para prompts similares.

### La clave: el prompt es el examen, y tú decides cuán fácil o difícil es pasar.
Cuando haces un prompt, estás lanzando un "desafío" que el modelo debe resolver.
Mientras más específico sea tu desafío, más estrecho es el camino que tiene que seguir.

Un prompt genérico tiene un validador muy fácil de vencer: cualquier respuesta medio decente parecerá válida.

Un prompt preciso tiene un validador exigente: la IA tiene que esforzarse más para acertar, y afinar mucho más su respuesta.

---

### Ejemplo comparativo

**Prompt genérico:**
> “Hazme un login en React.”

**Resultado probable:**
> Un componente básico, con pocos detalles, sin validación, sin diseño cuidado, sin seguridad real.

**Prompt específico:**
> “Haz un formulario de login en React con Tailwind, validación de email y contraseña, diseño responsive, estructura desacoplada, control de errores y pensado para producción.”

**Resultado probable:**
> Un componente bien estructurado, más útil y aplicable directamente en un proyecto real.

---

Cuanto más específico seas, más se reduce la ambigüedad.
Y ahí está el poder: cuando reduces la ambigüedad, la IA se comporta como un colaborador técnico serio.
Te devuelve código más profesional, más útil, más alineado con lo que de verdad necesitas.
`;

export function PromptingExplanation() {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-16 mb-12 shadow-xl border-accent/30">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-3">
            <Brain className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-accent">
          ¿Por qué ser específico al pedir código con IA?
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
