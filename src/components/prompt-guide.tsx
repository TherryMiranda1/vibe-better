
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import { Lightbulb } from 'lucide-react';

const guideContent = [
  {
    title: '1. Define el OBJETIVO del código',
    content: `
Pregúntate o indica:

*   ¿Qué quiero que haga este código?
*   ¿Cuál es su propósito final?

**Ejemplo de prompt:**
> “Quiero un formulario de contacto funcional que envíe mensajes a un correo electrónico usando Node.js.”
    `,
  },
  {
    title: '2. Especifica el CONTEXTO o ENTORNO',
    content: `
Esto incluye el lenguaje, framework, tipo de aplicación, sistema operativo, etc.

**Términos útiles:** React, Next.js, Vue, Node.js, Python, Flask, mobile app, backend, microservicio, API REST, etc.

**Ejemplo:**
> “En una aplicación web con React y Tailwind, quiero un componente...”
    `,
  },
  {
    title: '3. Declara los REQUISITOS FUNCIONALES',
    content: `
Detalla qué debe hacer exactamente.

**Palabras clave útiles:**
*   validación de formulario
*   autenticación de usuarios
*   conexión a base de datos
*   subida de archivos
*   paginación
*   búsqueda en tiempo real

**Ejemplo:**
> “Debe validar que el email sea válido y mostrar mensajes de error si no lo es.”
    `,
  },
  {
    title: '4. Añade REQUISITOS DE CALIDAD o ARQUITECTURA',
    content: `
Guía a la IA con términos que mejoran la calidad del código.

**Usa términos como:**
*   desacoplado
*   modular
*   escalable
*   mantenible
*   reutilizable
*   limpio
*   legible
*   optimizado para producción
*   robusto
*   siguiendo principios SOLID

**Ejemplo:**
> “La función debe estar desacoplada del frontend, ser robusta ante errores y escrita con principios SOLID.”
    `,
  },
  {
    title: '5. Incluye DETALLES DE DISEÑO (si aplica)',
    content: `
Ideal para prompts relacionados con UI/UX.

**Términos útiles:**
*   diseño limpio
*   diseño llamativo
*   responsive
*   amigable con el usuario
*   centrado en la experiencia
*   accesible
*   con buenas prácticas UX-UI

**Ejemplo:**
> “El diseño debe ser responsive y amigable, con campos claramente diferenciados y colores accesibles.”
    `,
  },
  {
    title: '6. Agrega CONDICIONES EXTRA (opcional)',
    content: `
Si necesitas:
*   Sin dependencias externas
*   Compatible con TypeScript
*   Incluye pruebas unitarias
*   Listo para producción
*   Comentado
*   Con explicación del código

**Ejemplo:**
> “Quiero que el código esté en TypeScript, con tests unitarios y comentarios explicativos.”
    `,
  },
  {
    title: '7. Usa EJEMPLOS o DATOS DE PRUEBA (si aplica)',
    content: `
Ayuda a que el código generado tenga casos realistas.

**Ejemplo:**
> “Simula 3 usuarios con nombre, email y rol, y muestra sus datos en una tabla responsive.”
    `,
  },
];

const finalTemplateContent = `
## **Plantilla general de prompt efectivo:**

> “Crea \\\[tipo de componente o función] en \\\[tecnología], que \\\[explica qué hace], con diseño \\\[tipo de diseño] y código \\\[adjetivos de calidad]. Asegúrate de que \\\[condiciones extras].”

**Ejemplo completo:**

> “Crea un componente de tabla en React con Tailwind que muestre una lista de productos. Debe ser responsive, reutilizable y legible. La tabla debe permitir ordenar por nombre o precio. Usa datos de prueba simulados. El diseño debe ser limpio y amigable para móviles. No uses librerías externas.”
`;

export function PromptGuide() {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-16 mb-12 shadow-xl border-primary/50">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-3">
            <Lightbulb className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
          Guía Rápida para Prompts de Código Efectivos
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
