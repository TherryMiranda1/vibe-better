
export interface TechnicalTag {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const technicalTags: TechnicalTag[] = [
  { id: 'responsive', name: 'responsive', category: 'UI/UX', description: 'Se adapta bien a distintos tamaños de pantalla' },
  { id: 'accesible', name: 'accesible', category: 'UI/UX', description: 'Cumple buenas prácticas de accesibilidad (A11Y, lectores, navegación)' },
  { id: 'ux-ui', name: 'UX/UI', category: 'UI/UX', description: 'Orientado a una experiencia clara, usable, visualmente correcta' },
  { id: 'mantenible', name: 'mantenible', category: 'Arquitectura', description: 'Fácil de modificar, escalar y entender con el tiempo' },
  { id: 'escalable', name: 'escalable', category: 'Arquitectura', description: 'Soporta aumento de usuarios, tráfico o lógica sin romperse' },
  { id: 'robusto', name: 'robusto', category: 'Arquitectura', description: 'Resiste errores, inputs inesperados y casos límite' },
  { id: 'desacoplado', name: 'desacoplado', category: 'Arquitectura', description: 'Separación clara entre componentes/lógicas' },
  { id: 'reusable', name: 'reusable', category: 'Arquitectura', description: 'Componentes o funciones que pueden ser reaprovechadas' },
  { id: 'optimizado-para-produccion', name: 'optimizado para producción', category: 'Rendimiento', description: 'Tiene optimizaciones activadas: tree-shaking, lazy loading, compresión' },
  { id: 'optimizado-para-performance', name: 'optimizado para performance', category: 'Rendimiento', description: 'Minimiza renderizados, carga, tamaño del bundle, uso de memoria' },
  { id: 'con-buen-rendimiento', name: 'con buen rendimiento', category: 'Rendimiento', description: 'Fluido en tiempo de respuesta, sin lags perceptibles' },
  { id: 'lazy-loading', name: 'lazy loading', category: 'Rendimiento', description: 'Carga diferida de componentes o recursos pesados' },
  { id: 'code-splitting', name: 'code splitting', category: 'Rendimiento', description: 'Divide el código en bloques para mejorar carga inicial' },
  { id: 'pre-fetching', name: 'pre-fetching', category: 'Rendimiento', description: 'Carga anticipada de datos o recursos clave' },
  { id: 'secure-seguro', name: 'secure / seguro', category: 'Seguridad', description: 'Incluye protección ante ataques, roles, inputs maliciosos' },
  { id: 'proteccion-de-rutas', name: 'protección de rutas', category: 'Seguridad', description: 'Rutas privadas correctamente protegidas' },
  { id: 'autenticado', name: 'autenticado', category: 'Seguridad', description: 'Solo accesible con login/autenticación adecuada' },
  { id: 'persistencia-de-sesion', name: 'persistencia de sesión', category: 'Seguridad / Datos', description: 'Mantiene sesión iniciada, tokens gestionados' },
  { id: 'manejo-de-errores', name: 'manejo de errores', category: 'Comportamiento', description: 'Feedback adecuado ante fallos o problemas' },
  { id: 'retry-automatico', name: 'retry automático', category: 'Network / Comportamiento', description: 'Reintenta peticiones fallidas de forma controlada' },
  { id: 'validacion-de-datos', name: 'validación de datos', category: 'Datos', description: 'Verifica inputs del usuario antes de procesar' },
  { id: 'tipo-safe', name: 'tipo-safe', category: 'Código / Robustez', description: 'Uso de tipado fuerte (TypeScript, schemas, etc.)' },
  { id: 'testable', name: 'testable', category: 'Testing', description: 'Estructurado para permitir tests (unitarios, integración, E2E)' },
  { id: 'con-tests-incluidos', name: 'con tests incluidos', category: 'Testing', description: 'Contiene pruebas que aseguran funcionamiento' },
  { id: 'orientado-a-componentes', name: 'orientado a componentes', category: 'Diseño modular', description: 'Estructura basada en componentes reutilizables' },
  { id: 'estructura-modular', name: 'estructura modular', category: 'Arquitectura', description: 'División clara por responsabilidades, rutas, funciones' },
  { id: 'soporte-multilenguaje', name: 'soporte multilenguaje', category: 'Internacionalización', description: 'Capacidad de mostrar contenido en varios idiomas' },
  { id: 'internacionalizable', name: 'internacionalizable', category: 'Internacionalización', description: 'Preparado para ser traducido fácilmente' },
  { id: 'documentado', name: 'documentado', category: 'Código / Comunicación', description: 'Incluye comentarios, README o instrucciones claras' },
  { id: 'con-dependencias-conocidas', name: 'con dependencias conocidas', category: 'IA-Friendly', description: 'Uso de librerías estándar o conocidas para evitar confusión' },
  { id: 'sin-dependencias-externas', name: 'sin dependencias externas', category: 'IA-Friendly', description: 'Solución autónoma, sin librerías adicionales' },
  { id: 'optimizado-para-seo', name: 'optimizado para SEO', category: 'SEO / Frontend', description: 'Mejora posicionamiento: metadatos, estructura HTML, accesibilidad' },
  { id: 'con-ssr-o-ssg', name: 'con SSR o SSG', category: 'Performance / SEO', description: 'Usa server-side rendering o static-site generation' },
  { id: 'con-hooks-personalizados', name: 'con hooks personalizados', category: 'React / Arquitectura', description: 'Uso de lógica encapsulada en hooks reutilizables' },
  { id: 'con-logica-separada-de-ui', name: 'con lógica separada de UI', category: 'Arquitectura', description: 'Aplicación del patrón presentación/contendedor' },
  { id: 'event-driven', name: 'event-driven', category: 'Arquitectura avanzada', description: 'Arquitectura basada en eventos (útil en microservicios, socket, etc.)' },
];
