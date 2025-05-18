export const categories = [
  "API",
  "Algoritmos",
  "Arquitectura",
  "Backend",
  "Bases de Datos",
  "Calidad",
  "Data Science",
  "DevOps",
  "Frontend",
  "General",
  "Gestión de Proyectos",
  "No-Code",
  "Performance",
  "Productividad",
  "Productividad asistida por IA",
  "Seguridad",
  "Serverless",
  "Testing",
];

export const stages = [
  "Análisis",
  "Análisis de Datos",
  "Bases de Datos",
  "Configuración",
  "Debugging",
  "DevOps",
  "Diseño",
  "Documentación",
  "Implementación",
  "Investigación",
  "Monitoreo",
  "Planificación",
  "Refactorización",
  "Revisión de Código",
  "Seguridad",
  "Testing",
];

export const levels = ["Avanzado", "Intermedio", "Principiante"];

export const prompts = [
  {
    id: 1,
    template:
      "Actúa como un experto en {entorno_IA} y ayúdame a {objetivo} en un proyecto desarrollado con {tecnología_principal}. Asegúrate de {criterio_clave} y proporciona el resultado en formato {formato}.",
    placeholders: [
      "entorno_IA",
      "objetivo",
      "tecnología_principal",
      "criterio_clave",
      "formato",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA: Nombre de la herramienta asistida por IA (ej: Cursor, Windsurf, V0). objetivo: Tarea específica a realizar (ej: refactorizar un componente, generar tests unitarios). tecnología_principal: Lenguaje o framework principal del proyecto (ej: React, Python, Node.js). criterio_clave: Aspecto importante a considerar (ej: optimizar para rendimiento, mantener la legibilidad). formato: Formato deseado para la respuesta (ej: fragmento de código, lista de pasos, explicación detallada).",
    notas_para_el_uso:
      "Ideal para usar en plataformas como Cursor, Windsurf o Firebase Studio, donde puedes aprovechar el copiloto para tareas específicas.",
  },
  {
    id: 2,
    template:
      "Como desarrollador {nivel_experiencia} en {lenguaje_programacion}, necesito generar código para {funcionalidad_especifica}. El código debe incluir {requisito_1} y {requisito_2}. Prioriza {aspecto_prioritario} y comenta las secciones complejas.",
    placeholders: [
      "nivel_experiencia",
      "lenguaje_programacion",
      "funcionalidad_especifica",
      "requisito_1",
      "requisito_2",
      "aspecto_prioritario",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Backend | Frontend",
    instrucciones:
      "nivel_experiencia: Junior, Semi-Senior, Senior. lenguaje_programacion: Ej: Python, JavaScript, Java. funcionalidad_especifica: Descripción clara de la tarea (ej: 'una función que valide un formulario de email y contraseña', 'un componente UI para mostrar una lista de usuarios'). requisito_1, requisito_2: Condiciones específicas (ej: 'manejo de errores específico', 'uso de una librería particular'). aspecto_prioritario: Ej: 'eficiencia', 'claridad del código', 'seguridad'.",
    notas_para_el_uso:
      "Prompt general para generación de código con especificaciones claras.",
  },
  {
    id: 3,
    template:
      'Estoy depurando un error en mi código {lenguaje_programacion}. El error es: "{mensaje_error}". El fragmento de código relevante es:\n```\n{codigo_con_error}\n```\nAyúdame a identificar la causa raíz y sugiere una solución.',
    placeholders: [
      "lenguaje_programacion",
      "mensaje_error",
      "codigo_con_error",
    ],
    nivel: "Intermedio",
    etapa: "Debugging",
    categoría: "General",
    instrucciones:
      "lenguaje_programacion: Lenguaje del código. mensaje_error: El mensaje de error exacto que se muestra. codigo_con_error: El fragmento de código donde ocurre el error.",
    notas_para_el_uso:
      "Proporcionar el contexto y el error exacto es crucial para obtener ayuda útil.",
  },
  {
    id: 4,
    template:
      "Necesito optimizar la siguiente función/clase en {lenguaje_programacion} para {objetivo_optimizacion} (ej: rendimiento, uso de memoria, legibilidad):\n```\n{codigo_a_optimizar}\n```\nExplica los cambios propuestos y por qué mejoran el código.",
    placeholders: [
      "lenguaje_programacion",
      "objetivo_optimizacion",
      "codigo_a_optimizar",
    ],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "General",
    instrucciones:
      "lenguaje_programacion: Lenguaje del código. objetivo_optimizacion: Qué se busca mejorar (ej: 'reducir latencia', 'minimizar asignaciones de memoria', 'hacerlo más mantenible'). codigo_a_optimizar: El código que necesita optimización.",
    notas_para_el_uso:
      "Muy útil para refactorizar código existente y aprender técnicas de optimización.",
  },
  {
    id: 5,
    template:
      "Genera documentación en formato {formato_documentacion} (ej: Markdown, JSDoc, Sphinx) para la siguiente función/clase en {lenguaje_programacion}:\n```\n{codigo_a_documentar}\n```\nIncluye descripción de parámetros, valor de retorno y un ejemplo de uso.",
    placeholders: [
      "formato_documentacion",
      "lenguaje_programacion",
      "codigo_a_documentar",
    ],
    nivel: "Intermedio",
    etapa: "Documentación",
    categoría: "General",
    instrucciones:
      "formato_documentacion: Estilo de documentación (ej: 'comentarios JSDoc', 'docstrings Python estilo Google', 'Markdown'). lenguaje_programacion: Lenguaje del código. codigo_a_documentar: El código para el cual se generará la documentación.",
    notas_para_el_uso: "Ahorra tiempo en la tarea de documentar código.",
  },
  {
    id: 6,
    template:
      "Estoy diseñando la arquitectura para una aplicación {tipo_aplicacion} (ej: e-commerce, red social) usando {tecnologias_principales}. Describe los componentes principales, sus responsabilidades y cómo interactuarían. Sugiere patrones de diseño relevantes.",
    placeholders: ["tipo_aplicacion", "tecnologias_principales"],
    nivel: "Avanzado",
    etapa: "Diseño",
    categoría: "Arquitectura",
    instrucciones:
      "tipo_aplicacion: El dominio de la aplicación. tecnologias_principales: Stack tecnológico principal (ej: 'React, Node.js, MongoDB', 'Django, PostgreSQL, AWS').",
    notas_para_el_uso:
      "Para obtener una visión de alto nivel y discutir decisiones arquitectónicas.",
  },
  {
    id: 7,
    template:
      "Como asistente experto en {tecnología}, genera una solución paso a paso para {problema}, incluyendo {detalles_adicionales}. Usa un enfoque educativo y comenta el código.",
    placeholders: ["tecnología", "problema", "detalles_adicionales"],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Backend | Frontend",
    instrucciones:
      "tecnología: Puede ser Node.js, Django, React, Angular, etc. problema: El reto a resolver (ej: 'implementar autenticación JWT', 'crear un carrusel de imágenes'). detalles_adicionales: Requisitos o limitaciones (ej: 'sin librerías externas', 'con soporte para internacionalización').",
    notas_para_el_uso:
      "Útil en entornos como Cursor o Firebase Studio cuando se busca generar código con explicación didáctica.",
  },
  {
    id: 8,
    template:
      "Quiero escribir tests unitarios/de integración para la siguiente función/módulo en {lenguaje_programacion} usando el framework {framework_testing}:\n```\n{codigo_a_testear}\n```\nGenera los casos de prueba cubriendo escenarios comunes y casos límite. Proporciona el código de los tests.",
    placeholders: [
      "lenguaje_programacion",
      "framework_testing",
      "codigo_a_testear",
    ],
    nivel: "Intermedio",
    etapa: "Testing",
    categoría: "Testing",
    instrucciones:
      "lenguaje_programacion: Lenguaje del código. framework_testing: Ej: Jest, PyTest, JUnit, Mocha. codigo_a_testear: El código para el cual se generarán los tests.",
    notas_para_el_uso:
      "Ideal para acelerar la creación de una suite de tests robusta.",
  },
  {
    id: 9,
    template:
      "Traduce el siguiente fragmento de código de {lenguaje_origen} a {lenguaje_destino}:\n```\n{codigo_a_traducir}\n```\nConserva la funcionalidad y comenta cualquier diferencia idiomática importante o cambio de paradigma.",
    placeholders: ["lenguaje_origen", "lenguaje_destino", "codigo_a_traducir"],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "General",
    instrucciones:
      "lenguaje_origen: Lenguaje original del código. lenguaje_destino: Lenguaje al que se traducirá. codigo_a_traducir: El código a convertir.",
    notas_para_el_uso:
      "Útil para migrar funcionalidades entre lenguajes o aprender las equivalencias.",
  },
  {
    id: 10,
    template:
      "Explica el concepto de {concepto_tecnico} en el contexto de {ambito_aplicacion} como si se lo estuvieras explicando a un {publico_objetivo} (ej: manager no técnico, desarrollador junior). Utiliza analogías si es posible.",
    placeholders: ["concepto_tecnico", "ambito_aplicacion", "publico_objetivo"],
    nivel: "Todos",
    etapa: "Análisis",
    categoría: "General",
    instrucciones:
      "concepto_tecnico: Ej: 'Programación Reactiva', 'Microservicios', 'Inyección de Dependencias'. ambito_aplicacion: Ej: 'desarrollo web', 'bases de datos', 'inteligencia artificial'. publico_objetivo: A quién va dirigida la explicación.",
    notas_para_el_uso:
      "Para clarificar conceptos complejos o preparar explicaciones para diferentes audiencias.",
  },
  {
    id: 11,
    template:
      "Estoy usando {plataforma_IA} (ej: V0.dev, Lovable). Describe una interfaz de usuario para {proposito_UI} (ej: 'un panel de administración de usuarios', 'una landing page para una app móvil'). Especifica los componentes clave, su disposición y el flujo de interacción deseado. Genera el código o la descripción para la plataforma.",
    placeholders: ["plataforma_IA", "proposito_UI"],
    nivel: "Intermedio",
    etapa: "Diseño | Implementación",
    categoría: "No-Code | Frontend",
    instrucciones:
      "plataforma_IA: La herramienta específica de generación de UI o código. proposito_UI: El objetivo de la interfaz a diseñar.",
    notas_para_el_uso:
      "Para herramientas como V0.dev, donde describes la UI y obtienes código. Para Lovable, podría ser más sobre la estructura.",
  },
  {
    id: 12,
    template:
      "En {plataforma_IA} (ej: Cursor), analiza el siguiente código {lenguaje_programacion} y sugiere refactorizaciones para mejorar {aspecto_a_mejorar} (ej: mantenibilidad, eficiencia, seguridad). Aplica los cambios directamente si es posible o proporciona el código modificado.",
    placeholders: [
      "plataforma_IA",
      "lenguaje_programacion",
      "aspecto_a_mejorar",
    ],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "plataforma_IA: Herramienta con capacidad de análisis y modificación de código. lenguaje_programacion: El lenguaje del código a analizar. aspecto_a_mejorar: El objetivo de la refactorización.",
    notas_para_el_uso:
      "Aprovecha las capacidades de herramientas como Cursor para realizar cambios en el código directamente en el editor.",
  },
  {
    id: 13,
    template:
      "Usando {entorno_IA} como Firebase Studio, genera una Cloud Function en {lenguaje_runtime} (ej: Node.js, Python) que {accion_funcion} cuando {trigger_evento} (ej: 'un nuevo documento es creado en la colección X', 'un archivo es subido a Storage'). Asegúrate de manejar {caso_especial}.",
    placeholders: [
      "entorno_IA",
      "lenguaje_runtime",
      "accion_funcion",
      "trigger_evento",
      "caso_especial",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Backend | Serverless",
    instrucciones:
      "entorno_IA: Firebase Studio u similar. lenguaje_runtime: Runtime de la función serverless. accion_funcion: Lo que debe hacer la función. trigger_evento: El evento que dispara la función. caso_especial: Algún manejo de error o condición particular.",
    notas_para_el_uso:
      "Específico para plataformas BaaS con asistentes IA como Firebase Studio.",
  },
  {
    id: 14,
    template:
      "Actúa como un experto en DevOps. Necesito un script de {tipo_script} (ej: Bash, Python, PowerShell) para automatizar {tarea_devops} (ej: 'el despliegue de una aplicación Node.js a un servidor EC2', 'la creación de backups de una base de datos PostgreSQL'). El script debe ser parametrizable para {parametros_configurables}.",
    placeholders: ["tipo_script", "tarea_devops", "parametros_configurables"],
    nivel: "Avanzado",
    etapa: "DevOps",
    categoría: "DevOps",
    instrucciones:
      "tipo_script: Lenguaje del script. tarea_devops: La tarea a automatizar. parametros_configurables: Variables que el script debería aceptar (ej: 'IP del servidor', 'nombre de la base de datos').",
    notas_para_el_uso:
      "Para generar scripts de automatización de tareas comunes de DevOps.",
  },
  {
    id: 15,
    template:
      "Revisa este fragmento de código en {lenguaje_programacion} en busca de vulnerabilidades de seguridad comunes (ej: XSS, SQL Injection, CSRF). Explica las vulnerabilidades encontradas y cómo mitigarlas.\n```\n{codigo_a_revisar}\n```",
    placeholders: ["lenguaje_programacion", "codigo_a_revisar"],
    nivel: "Avanzado",
    etapa: "Testing | Seguridad",
    categoría: "Seguridad",
    instrucciones:
      "lenguaje_programacion: Lenguaje del código. codigo_a_revisar: El código a analizar por seguridad.",
    notas_para_el_uso: "Importante para un enfoque de seguridad proactivo.",
  },
  {
    id: 16,
    template:
      'Estoy aprendiendo {nueva_tecnologia}. Proporciona un "roadmap" de aprendizaje para un desarrollador con experiencia en {tecnologia_conocida}. Incluye conceptos clave, recursos recomendados (tutoriales, documentación, proyectos de ejemplo) y un pequeño proyecto inicial para practicar.',
    placeholders: ["nueva_tecnologia", "tecnologia_conocida"],
    nivel: "Intermedio",
    etapa: "Análisis",
    categoría: "General",
    instrucciones:
      "nueva_tecnologia: La tecnología que se quiere aprender. tecnologia_conocida: La base tecnológica del usuario para contextualizar el aprendizaje.",
    notas_para_el_uso:
      "Útil para planificar el aprendizaje de nuevas herramientas o lenguajes.",
  },
  {
    id: 17,
    template:
      "Genera una expresión regular (regex) en {sabor_regex} (ej: PCRE, JavaScript, Python) que valide {patron_a_validar}. Proporciona una explicación de cómo funciona la regex y algunos ejemplos de cadenas que coinciden y no coinciden.",
    placeholders: ["sabor_regex", "patron_a_validar"],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "General",
    instrucciones:
      "sabor_regex: El motor de regex específico si es relevante. patron_a_validar: Descripción del patrón (ej: 'un email', 'una URL', 'una contraseña con ciertos requisitos').",
    notas_para_el_uso:
      "Las regex pueden ser complejas; este prompt ayuda a generarlas y entenderlas.",
  },
  {
    id: 18,
    template:
      "Necesito configurar un pipeline de CI/CD para mi proyecto {tipo_proyecto} alojado en {plataforma_vcs} (ej: GitHub, GitLab) usando {herramienta_cicd} (ej: GitHub Actions, Jenkins, GitLab CI). Describe los pasos principales del pipeline (build, test, deploy) y proporciona un archivo de configuración de ejemplo.",
    placeholders: ["tipo_proyecto", "plataforma_vcs", "herramienta_cicd"],
    nivel: "Avanzado",
    etapa: "DevOps",
    categoría: "DevOps",
    instrucciones:
      "tipo_proyecto: Naturaleza del proyecto (ej: 'aplicación web React', 'API en Python'). plataforma_vcs: Dónde está el código fuente. herramienta_cicd: La herramienta de CI/CD a utilizar.",
    notas_para_el_uso: "Para arrancar con la configuración de CI/CD.",
  },
  {
    id: 19,
    template:
      "Compara {tecnologia_1} y {tecnologia_2} para {proposito_comparacion} (ej: 'desarrollo de API REST', 'manejo de estado en frontend', 'bases de datos NoSQL'). Considera aspectos como {criterio_1}, {criterio_2}, y {criterio_3}. Presenta el resultado en una tabla.",
    placeholders: [
      "tecnologia_1",
      "tecnologia_2",
      "proposito_comparacion",
      "criterio_1",
      "criterio_2",
      "criterio_3",
    ],
    nivel: "Intermedio",
    etapa: "Diseño | Análisis",
    categoría: "Arquitectura",
    instrucciones:
      "tecnologia_1, tecnologia_2: Las tecnologías a comparar. proposito_comparacion: El contexto de la comparación. criterio_1, criterio_2, criterio_3: Factores relevantes para la decisión (ej: 'rendimiento', 'curva de aprendizaje', 'comunidad', 'costo').",
    notas_para_el_uso:
      "Ayuda a tomar decisiones informadas sobre qué tecnología utilizar.",
  },
  {
    id: 20,
    template:
      "Estoy trabajando en {entorno_IA} (ej: Bold, Windsurf) y necesito integrar la API de {servicio_externo} (ej: Stripe, Twilio, OpenAI) en mi aplicación {tecnologia_principal}. Genera el código para autenticar y realizar una {accion_api_ejemplo} (ej: 'crear un pago', 'enviar un SMS', 'hacer una completación de texto').",
    placeholders: [
      "entorno_IA",
      "servicio_externo",
      "tecnologia_principal",
      "accion_api_ejemplo",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Backend | Productividad asistida por IA",
    instrucciones:
      "entorno_IA: La herramienta IA que se está usando. servicio_externo: El servicio cuya API se va a consumir. tecnologia_principal: Lenguaje/framework de la aplicación. accion_api_ejemplo: Una operación representativa de la API.",
    notas_para_el_uso:
      "Para asistentes de código que pueden ayudar a generar clientes API o interactuar con servicios.",
  },
  {
    id: 21,
    template:
      "Quiero diseñar una base de datos {tipo_db} (ej: relacional SQL, NoSQL documental) para {proposito_aplicacion}. Identifica las entidades principales, sus atributos y las relaciones entre ellas. Genera el esquema en formato {formato_esquema} (ej: DDL SQL, JSON para NoSQL).",
    placeholders: ["tipo_db", "proposito_aplicacion", "formato_esquema"],
    nivel: "Intermedio",
    etapa: "Diseño",
    categoría: "Bases de Datos | Backend",
    instrucciones:
      "tipo_db: Tipo de base de datos. proposito_aplicacion: Para qué se usará la base de datos (ej: 'una tienda online', 'un blog'). formato_esquema: Cómo se debe presentar el esquema.",
    notas_para_el_uso: "Ayuda a modelar datos y generar el esquema inicial.",
  },
  {
    id: 22,
    template:
      "Actúa como un ingeniero QA. Dada la siguiente descripción de funcionalidad: '{descripcion_funcionalidad}', genera un conjunto de casos de prueba (IDs, descripción, pasos, datos de prueba, resultado esperado) para asegurar su calidad. Cubre casos positivos, negativos y de borde.",
    placeholders: ["descripcion_funcionalidad"],
    nivel: "Intermedio",
    etapa: "Testing",
    categoría: "Testing",
    instrucciones:
      "descripcion_funcionalidad: Una descripción detallada de la característica a probar (ej: 'El login de usuario con email y password, con opción de recordar contraseña y enlace a recuperación').",
    notas_para_el_uso:
      "Útil para generar planes de prueba a partir de especificaciones.",
  },
  {
    id: 23,
    template:
      "Mi aplicación {tecnologia_app} está experimentando {problema_rendimiento} (ej: 'carga lenta de páginas', 'alto uso de CPU'). ¿Qué herramientas y técnicas puedo usar para diagnosticar la causa raíz? Sugiere un plan de acción.",
    placeholders: ["tecnologia_app", "problema_rendimiento"],
    nivel: "Avanzado",
    etapa: "Debugging",
    categoría: "Performance",
    instrucciones:
      "tecnologia_app: El stack de la aplicación. problema_rendimiento: Descripción del problema de rendimiento observado.",
    notas_para_el_uso:
      "Para obtener orientación sobre cómo abordar problemas de rendimiento.",
  },
  {
    id: 24,
    template:
      "Dentro de mi IDE con un asistente IA tipo Cursor, tengo seleccionado un bloque de código {lenguaje}. Quiero que lo expliques línea por línea, detallando su propósito y cualquier construcción compleja o idiomática.",
    placeholders: ["lenguaje"],
    nivel: "Intermedio",
    etapa: "Debugging",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "lenguaje: El lenguaje de programación del código seleccionado. Asegúrate de tener el código seleccionado en tu IDE para que el asistente pueda acceder a él.",
    notas_para_el_uso:
      "Ideal para entender código existente o aprender nuevas sintaxis con ayuda contextual.",
  },
  {
    id: 25,
    template:
      "Estás operando dentro de {plataforma_IA}. Optimiza el flujo de {accion} utilizando {framework_o_tecnología} con enfoque en {objetivo_específico}. Devuélvelo como pasos accionables para implementar directamente en el editor.",
    placeholders: [
      "plataforma_IA",
      "accion",
      "framework_o_tecnología",
      "objetivo_específico",
    ],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "plataforma_IA: Puede ser Cursor, Windsurf, Lovable, etc. acción: Lo que se quiere hacer (ej: 'refactorizar un servicio para usar inyección de dependencias', 'generar tests de integración para un controlador API'). framework_o_tecnología: La base del proyecto (ej: 'Spring Boot', 'Angular'). objetivo_específico: El resultado deseado (ej: 'mejorar la testeabilidad', 'reducir acoplamiento').",
    notas_para_el_uso:
      "Ideal para entornos tipo Cursor donde el modelo puede generar y aplicar cambios directamente sobre el código en tiempo real.",
  },
  {
    id: 26,
    template:
      "Necesito escribir una User Story para la funcionalidad de {funcionalidad_usuario} en mi proyecto {nombre_proyecto}. Sigue el formato 'Como {tipo_usuario}, quiero {accion_usuario} para que {beneficio_usuario}'. Incluye criterios de aceptación.",
    placeholders: [
      "funcionalidad_usuario",
      "nombre_proyecto",
      "tipo_usuario",
      "accion_usuario",
      "beneficio_usuario",
    ],
    nivel: "Intermedio",
    etapa: "Diseño | Planificación",
    categoría: "Gestión de Proyectos",
    instrucciones:
      "funcionalidad_usuario: La característica desde la perspectiva del usuario (ej: 'poder filtrar productos por categoría'). nombre_proyecto: Contexto del proyecto. tipo_usuario: Rol del usuario. accion_usuario: Lo que el usuario quiere hacer. beneficio_usuario: El valor que obtiene el usuario.",
    notas_para_el_uso:
      "Para redactar user stories claras y efectivas para metodologías ágiles.",
  },
  {
    id: 27,
    template:
      "En {plataforma_IA_UI} (ej: V0.dev), genera el código (HTML/CSS/JS o para el framework {framework_frontend}) para un componente de {nombre_componente} que tenga las siguientes características: {caracteristica_1}, {caracteristica_2}, {caracteristica_3}. El estilo debe ser {estilo_visual}.",
    placeholders: [
      "plataforma_IA_UI",
      "framework_frontend",
      "nombre_componente",
      "caracteristica_1",
      "caracteristica_2",
      "caracteristica_3",
      "estilo_visual",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Frontend | No-Code",
    instrucciones:
      "plataforma_IA_UI: Herramienta de generación de UI. framework_frontend: Ej: React, Vue, TailwindCSS. nombre_componente: Ej: 'Tarjeta de producto', 'Modal de confirmación'. caracteristica_1,2,3: Elementos o comportamientos del componente. estilo_visual: Ej: 'minimalista', 'moderno con sombras suaves', 'corporativo'.",
    notas_para_el_uso:
      "Específico para la generación rápida de UI con herramientas IA.",
  },
  {
    id: 28,
    template:
      "Estoy usando Firebase Studio. Ayúdame a escribir reglas de seguridad para Firestore para la colección '{nombre_coleccion}' que permitan {permiso_lectura} para lectura y {permiso_escritura} para escritura, basándose en {condicion_autenticacion_o_rol}.",
    placeholders: [
      "nombre_coleccion",
      "permiso_lectura",
      "permiso_escritura",
      "condicion_autenticacion_o_rol",
    ],
    nivel: "Intermedio",
    etapa: "Seguridad | Implementación",
    categoría: "Backend",
    instrucciones:
      "nombre_coleccion: Nombre de la colección en Firestore. permiso_lectura: Quién puede leer (ej: 'cualquier usuario autenticado', 'solo el propietario del documento'). permiso_escritura: Quién puede escribir/actualizar/borrar. condicion_autenticacion_o_rol: Lógica de la regla (ej: 'request.auth.uid == resource.data.userId', 'get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == \"admin\"').",
    notas_para_el_uso:
      "Para generar reglas de seguridad de Firestore con la ayuda del asistente de Firebase Studio.",
  },
  {
    id: 29,
    template:
      "Actúa como un ingeniero de software experimentado. Revisa mi plan de proyecto para desarrollar {tipo_proyecto_software}. El plan actual es: {descripcion_plan}. ¿Identificas algún riesgo potencial, omisión o área de mejora en términos de {aspecto_a_evaluar} (ej: 'estimación de tiempos', 'asignación de recursos', 'estrategia tecnológica')?",
    placeholders: [
      "tipo_proyecto_software",
      "descripcion_plan",
      "aspecto_a_evaluar",
    ],
    nivel: "Avanzado",
    etapa: "Planificación",
    categoría: "Gestión de Proyectos | Arquitectura",
    instrucciones:
      "tipo_proyecto_software: Naturaleza del software a desarrollar. descripcion_plan: Resumen del plan actual. aspecto_a_evaluar: Área específica de feedback deseada.",
    notas_para_el_uso:
      "Para obtener una segunda opinión experta sobre planes de proyecto.",
  },
  {
    id: 30,
    template:
      "Explica cómo implementar el patrón de diseño {nombre_patron} (ej: Singleton, Factory, Observer) en {lenguaje_programacion}. Proporciona un ejemplo de código conceptual y discute sus ventajas y desventajas en este contexto.",
    placeholders: ["nombre_patron", "lenguaje_programacion"],
    nivel: "Intermedio",
    etapa: "Análisis",
    categoría: "Arquitectura",
    instrucciones:
      "nombre_patron: El patrón de diseño a explicar. lenguaje_programacion: El lenguaje para el ejemplo de código.",
    notas_para_el_uso:
      "Para aprender o repasar patrones de diseño con ejemplos prácticos.",
  },
  {
    id: 31,
    template:
      "Usando una herramienta IA como Windsurf o un code agent, investiga y resume las 3 mejores librerías/frameworks de {lenguaje_programacion} para {proposito_libreria} (ej: 'crear APIs GraphQL', 'visualización de datos interactiva', 'testing de UI'). Compara brevemente sus características principales, popularidad y facilidad de uso.",
    placeholders: ["lenguaje_programacion", "proposito_libreria"],
    nivel: "Intermedio",
    etapa: "Investigación",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "lenguaje_programacion: Lenguaje para el cual se buscan librerías. proposito_libreria: La tarea que deben cumplir las librerías.",
    notas_para_el_uso:
      "Aprovecha la capacidad de agentes IA para investigar y sintetizar información.",
  },
  {
    id: 32,
    template:
      "Necesito un Dockerfile para una aplicación {tecnologia_aplicacion} (ej: Node.js, Python Flask, Java Spring Boot). La aplicación escucha en el puerto {puerto_app} y requiere {dependencias_sistema_op} (ej: 'libssl-dev', 'build-essential'). Optimiza la imagen para {objetivo_opt_imagen} (ej: 'tamaño reducido', 'rapidez de build').",
    placeholders: [
      "tecnologia_aplicacion",
      "puerto_app",
      "dependencias_sistema_op",
      "objetivo_opt_imagen",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "DevOps",
    instrucciones:
      "tecnologia_aplicacion: Framework/lenguaje de la app. puerto_app: Puerto que expone la aplicación. dependencias_sistema_op: Paquetes necesarios a nivel de SO. objetivo_opt_imagen: Criterio de optimización para la imagen Docker.",
    notas_para_el_uso: "Para generar Dockerfiles optimizados.",
  },
  {
    id: 33,
    template:
      "Actúa como un experto en UI/UX. Dada la siguiente descripción de una pantalla de aplicación: '{descripcion_pantalla_app}', sugiere mejoras en términos de usabilidad, accesibilidad y flujo de usuario. Considera {heuristica_ux_1} y {heuristica_ux_2}.",
    placeholders: [
      "descripcion_pantalla_app",
      "heuristica_ux_1",
      "heuristica_ux_2",
    ],
    nivel: "Intermedio",
    etapa: "Diseño",
    categoría: "Frontend",
    instrucciones:
      "descripcion_pantalla_app: Detalles de la pantalla, sus elementos y propósito. heuristica_ux_1, heuristica_ux_2: Principios de UX a considerar (ej: 'consistencia', 'feedback al usuario', 'prevención de errores').",
    notas_para_el_uso:
      "Para obtener feedback sobre el diseño de interfaces desde una perspectiva de UX.",
  },
  {
    id: 34,
    template:
      "Estoy usando {entorno_IA} (ej: Cursor, Copilot) y quiero refactorizar la función/clase seleccionada actualmente en mi editor. El objetivo es aplicar el principio {principio_solid} (ej: SRP, OCP, LSP). Explica los cambios y cómo se alinean con el principio.",
    placeholders: ["entorno_IA", "principio_solid"],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA | Arquitectura",
    instrucciones:
      "entorno_IA: Herramienta IA integrada en el IDE. principio_solid: Principio SOLID específico a aplicar. Asegúrate de tener el código relevante seleccionado.",
    notas_para_el_uso:
      "Para refactorizaciones guiadas por principios de diseño con ayuda de IA.",
  },
  {
    id: 35,
    template:
      "Genera un archivo `docker-compose.yml` para levantar un entorno de desarrollo con los siguientes servicios: {servicio_1_nombre} (imagen: {servicio_1_imagen}, puertos: {servicio_1_puertos}), {servicio_2_nombre} (imagen: {servicio_2_imagen}, volumenes: {servicio_2_volumenes}), y {servicio_3_nombre} (basado en un Dockerfile local en {servicio_3_dockerfile_path}, depende de: {servicio_3_dependencias}).",
    placeholders: [
      "servicio_1_nombre",
      "servicio_1_imagen",
      "servicio_1_puertos",
      "servicio_2_nombre",
      "servicio_2_imagen",
      "servicio_2_volumenes",
      "servicio_3_nombre",
      "servicio_3_dockerfile_path",
      "servicio_3_dependencias",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "DevOps",
    instrucciones:
      "Proporciona los detalles de cada servicio que formará parte del entorno Docker Compose: nombre, imagen (o path al Dockerfile), puertos expuestos, volúmenes y dependencias entre servicios.",
    notas_para_el_uso:
      "Útil para configurar rápidamente entornos de desarrollo multicontenedor.",
  },
  {
    id: 36,
    template:
      "Con la ayuda de una herramienta IA como Lovable o Bold, analiza la estructura de este proyecto {lenguaje_o_framework} (puedes dar una URL a un repo público si es posible: {url_repo}) e identifica los principales módulos/componentes y sus interdependencias. Genera un diagrama o una descripción textual clara de la arquitectura.",
    placeholders: ["lenguaje_o_framework", "url_repo"],
    nivel: "Intermedio",
    etapa: "Análisis | Documentación",
    categoría: "Productividad asistida por IA | Arquitectura",
    instrucciones:
      "lenguaje_o_framework: Tecnología del proyecto. url_repo: (Opcional) Enlace al repositorio para un análisis más profundo si la herramienta lo permite.",
    notas_para_el_uso:
      "Para herramientas IA que pueden analizar bases de código y extraer información estructural.",
  },
  {
    id: 37,
    template:
      "Estoy trabajando con {plataforma_IA_serverless} (ej: Firebase Studio, AWS Lambda con CodeWhisperer). Necesito una función serverless en {runtime} que reciba un {parametro_entrada} vía {metodo_trigger} (ej: HTTP GET, evento de Pub/Sub) y devuelva {tipo_salida} tras procesar {logica_funcion}. Asegúrate de incluir logging básico y manejo de errores.",
    placeholders: [
      "plataforma_IA_serverless",
      "runtime",
      "parametro_entrada",
      "metodo_trigger",
      "tipo_salida",
      "logica_funcion",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Serverless | Productividad asistida por IA",
    instrucciones:
      "plataforma_IA_serverless: Plataforma y asistente IA. runtime: Ej: Node.js, Python. parametro_entrada: Datos que espera la función. metodo_trigger: Cómo se invoca la función. tipo_salida: Formato de la respuesta. logica_funcion: Descripción del procesamiento a realizar.",
    notas_para_el_uso:
      "Facilita la creación de funciones serverless con ayuda contextual de IA.",
  },
  {
    id: 38,
    template:
      "Actúa como un analista de datos. Tengo un conjunto de datos con las siguientes columnas: {columnas_dataset}. Quiero realizar un análisis para {objetivo_analisis} (ej: 'identificar tendencias de ventas', 'segmentar clientes', 'predecir X'). Sugiere los pasos, posibles algoritmos de {tipo_algoritmo} (ej: 'clustering', 'regresión') y visualizaciones útiles. Si es posible, genera un script en {lenguaje_analisis} (ej: Python con Pandas/Scikit-learn, R) para un análisis exploratorio básico.",
    placeholders: [
      "columnas_dataset",
      "objetivo_analisis",
      "tipo_algoritmo",
      "lenguaje_analisis",
    ],
    nivel: "Avanzado",
    etapa: "Análisis de Datos",
    categoría: "Data Science",
    instrucciones:
      "columnas_dataset: Lista de nombres de columnas o descripción de los datos. objetivo_analisis: Pregunta de negocio o investigación a responder. tipo_algoritmo: Categoría de algoritmos a considerar. lenguaje_analisis: Lenguaje para el script de ejemplo.",
    notas_para_el_uso:
      "Para obtener una guía inicial en proyectos de análisis de datos.",
  },
  {
    id: 39,
    template:
      "Quiero crear una API RESTful usando {framework_backend} (ej: Express.js, Django REST framework, Spring Boot) para gestionar recursos de tipo '{nombre_recurso}'. Define los endpoints CRUD (Crear, Leer, Actualizar, Borrar), sus métodos HTTP, formato de request/response (JSON) y códigos de estado esperados. Genera el código base para el controlador/router.",
    placeholders: ["framework_backend", "nombre_recurso"],
    nivel: "Intermedio",
    etapa: "Diseño | Implementación",
    categoría: "Backend",
    instrucciones:
      "framework_backend: El framework a utilizar. nombre_recurso: El tipo de entidad que manejará la API (ej: 'usuarios', 'productos', 'artículos').",
    notas_para_el_uso:
      "Para un inicio rápido en el diseño e implementación de APIs REST.",
  },
  {
    id: 40,
    template:
      "Estoy utilizando {entorno_IA} para generar código. Necesito una clase en {lenguaje} que represente un {concepto_del_mundo_real} con atributos {lista_de_atributos_con_tipos} y métodos {lista_de_metodos_con_descripcion_breve}. Aplica encapsulamiento y proporciona constructores adecuados.",
    placeholders: [
      "entorno_IA",
      "lenguaje",
      "concepto_del_mundo_real",
      "lista_de_atributos_con_tipos",
      "lista_de_metodos_con_descripcion_breve",
    ],
    nivel: "Principiante",
    etapa: "Implementación",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA: Ej: Cursor, GitHub Copilot. lenguaje: Ej: Java, C#, Python. concepto_del_mundo_real: Ej: 'Coche', 'CuentaBancaria'. lista_de_atributos_con_tipos: Ej: 'marca (String), modelo (String), año (int)'. lista_de_metodos_con_descripcion_breve: Ej: 'arrancar() - enciende el motor', 'saldo() - devuelve el saldo actual'.",
    notas_para_el_uso:
      "Útil para generar la estructura básica de clases en programación orientada a objetos.",
  },
  {
    id: 41,
    template:
      "Explica las diferencias clave, ventajas y desventajas entre usar {tecnologia_A} y {tecnologia_B} para la tarea de {tarea_especifica_desarrollo} (ej: 'manejo de estado global en React: Redux vs Zustand', 'orquestación de contenedores: Kubernetes vs Docker Swarm'). ¿En qué escenarios recomendarías cada una?",
    placeholders: [
      "tecnologia_A",
      "tecnologia_B",
      "tarea_especifica_desarrollo",
    ],
    nivel: "Intermedio",
    etapa: "Diseño",
    categoría: "Arquitectura",
    instrucciones:
      "tecnologia_A, tecnologia_B: Las dos opciones a comparar. tarea_especifica_desarrollo: El problema o funcionalidad para la que se comparan.",
    notas_para_el_uso: "Ayuda a tomar decisiones tecnológicas fundamentadas.",
  },
  {
    id: 42,
    template:
      "En una herramienta como V0.dev, describe una sección de 'Características' para una página de producto de software. Debe tener un título, un subtitulo, y {numero_items} ítems, cada uno con un icono (sugiere nombres de iconos de FontAwesome o similar), un título corto y una descripción de 2-3 líneas. El layout debe ser {descripcion_layout} (ej: 'una cuadrícula de 3 columnas', 'una lista vertical con iconos a la izquierda'). Genera el HTML y Tailwind CSS.",
    placeholders: ["numero_items", "descripcion_layout"],
    nivel: "Principiante",
    etapa: "Diseño | Implementación",
    categoría: "Frontend | No-Code",
    instrucciones:
      "numero_items: Cantidad de características a mostrar. descripcion_layout: Cómo se deben organizar visualmente.",
    notas_para_el_uso:
      "Específico para V0.dev u otras herramientas de generación de UI a partir de descripciones.",
  },
  {
    id: 43,
    template:
      "Actúa como un Scrum Master. Mi equipo está enfrentando {problema_agile} (ej: 'dificultad para estimar historias', 'poca participación en retrospectivas', 'impedimentos recurrentes no resueltos'). Sugiere {numero_sugerencias} técnicas o dinámicas para abordar este problema y mejorar nuestro proceso Scrum.",
    placeholders: ["problema_agile", "numero_sugerencias"],
    nivel: "Intermedio",
    etapa: "Planificación",
    categoría: "Gestión de Proyectos",
    instrucciones:
      "problema_agile: El desafío específico dentro del marco Scrum. numero_sugerencias: Cuántas soluciones o ideas se esperan.",
    notas_para_el_uso:
      "Para obtener consejos sobre cómo mejorar la implementación de metodologías ágiles.",
  },
  {
    id: 44,
    template:
      "Necesito escribir un script de migración de base de datos usando {herramienta_migracion} (ej: Alembic para Python/SQLAlchemy, Flyway para Java, TypeORM migrations para Node.js). La migración debe {descripcion_cambio_db} (ej: 'añadir una nueva columna llamada `is_active` a la tabla `users`', 'crear una nueva tabla `orders` con campos X, Y, Z'). Genera el código de la migración.",
    placeholders: ["herramienta_migracion", "descripcion_cambio_db"],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Backend | Bases de Datos",
    instrucciones:
      "herramienta_migracion: El sistema de migraciones que se está utilizando. descripcion_cambio_db: Los cambios específicos a aplicar al esquema de la base de datos.",
    notas_para_el_uso:
      "Acelera la escritura de scripts de migración de base de datos.",
  },
  {
    id: 45,
    template:
      "Con {plataforma_IA} (ej: Cursor), tengo un código {lenguaje} que realiza {descripcion_tarea_codigo}. Quiero añadir manejo de errores robusto. Identifica los puntos críticos donde pueden ocurrir excepciones y modifica el código para incluir bloques try-catch (o equivalentes) apropiados, logging de errores y, si es pertinente, estrategias de reintento o valores por defecto.",
    placeholders: ["plataforma_IA", "lenguaje", "descripcion_tarea_codigo"],
    nivel: "Intermedio",
    etapa: "Implementación | Debugging",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "plataforma_IA: Herramienta IA de asistencia al código. lenguaje: Lenguaje de programación. descripcion_tarea_codigo: Qué hace el código actual. Asegúrate de tener el código accesible para la IA (ej: seleccionado en el editor).",
    notas_para_el_uso: "Para mejorar la robustez del código con ayuda de IA.",
  },
  {
    id: 46,
    template:
      "Genera un README.md para un proyecto de software llamado '{nombre_proyecto}' desarrollado en {tecnologias_usadas}. Debe incluir secciones como: Descripción del Proyecto, Características Principales, Tecnologías Utilizadas, Requisitos Previos, Instalación, Uso, Contribuir y Licencia ({tipo_licencia}).",
    placeholders: ["nombre_proyecto", "tecnologias_usadas", "tipo_licencia"],
    nivel: "Principiante",
    etapa: "Documentación",
    categoría: "General",
    instrucciones:
      "nombre_proyecto: Nombre del proyecto. tecnologias_usadas: Stack tecnológico principal. tipo_licencia: Ej: MIT, Apache 2.0, GPL.",
    notas_para_el_uso:
      "Para crear rápidamente un README completo y bien estructurado.",
  },
  {
    id: 47,
    template:
      "Estoy diseñando un flujo de autenticación para una aplicación {tipo_aplicacion} (ej: web, móvil) que usará {proveedor_identidad} (ej: Auth0, Firebase Authentication, Keycloak, OAuth2 propio). Describe los pasos del flujo de {tipo_flujo_auth} (ej: 'inicio de sesión con email/password', 'registro de nuevo usuario', 'recuperación de contraseña', 'login con Google'). Considera la seguridad y la experiencia de usuario.",
    placeholders: ["tipo_aplicacion", "proveedor_identidad", "tipo_flujo_auth"],
    nivel: "Avanzado",
    etapa: "Diseño | Seguridad",
    categoría: "Arquitectura | Seguridad | Backend",
    instrucciones:
      "tipo_aplicacion: Contexto de la aplicación. proveedor_identidad: Sistema de gestión de identidades. tipo_flujo_auth: El flujo específico a diseñar.",
    notas_para_el_uso:
      "Para planificar flujos de autenticación complejos y seguros.",
  },
  {
    id: 48,
    template:
      "Utilizando {entorno_IA_testing} (ej: Cursor con integración de tests, o un agente IA), genera tests de comportamiento (BDD) usando Gherkin (Given/When/Then) para la siguiente User Story: '{user_story_texto}'. Luego, si es posible, genera el código 'stub' o 'esqueleto' para los step definitions en {lenguaje_step_definitions} (ej: JavaScript con Cucumber.js, Python con Behave).",
    placeholders: [
      "entorno_IA_testing",
      "user_story_texto",
      "lenguaje_step_definitions",
    ],
    nivel: "Avanzado",
    etapa: "Testing",
    categoría: "Testing | Productividad asistida por IA",
    instrucciones:
      "entorno_IA_testing: Herramienta IA que asiste en la generación de tests. user_story_texto: La User Story completa. lenguaje_step_definitions: Lenguaje para implementar los pasos de Gherkin.",
    notas_para_el_uso:
      "Acelera la creación de tests BDD, desde la especificación hasta el esqueleto del código.",
  },
  {
    id: 49,
    template:
      "Explica el concepto de '{concepto_devops}' (ej: Infraestructura como Código, GitOps, Monitoreo Continuo) y cómo se aplicaría en un proyecto {tipo_proyecto_ejemplo} usando herramientas como {herramientas_ejemplo_devops}. ¿Cuáles son los beneficios principales?",
    placeholders: [
      "concepto_devops",
      "tipo_proyecto_ejemplo",
      "herramientas_ejemplo_devops",
    ],
    nivel: "Intermedio",
    etapa: "Análisis",
    categoría: "DevOps",
    instrucciones:
      "concepto_devops: El principio o práctica de DevOps a explicar. tipo_proyecto_ejemplo: Un contexto de aplicación. herramientas_ejemplo_devops: Ej: Terraform, ArgoCD, Prometheus.",
    notas_para_el_uso:
      "Para entender conceptos de DevOps y su aplicación práctica.",
  },
  {
    id: 50,
    template:
      "Quiero implementar una caché en mi aplicación {lenguaje_app} para {proposito_cache} (ej: 'reducir la carga en la base de datos al obtener datos de productos', 'acelerar respuestas de API para datos frecuentemente accedidos'). ¿Qué estrategias de caché (ej: {estrategia_cache_1}, {estrategia_cache_2}) y herramientas (ej: {herramienta_cache_1}, {herramienta_cache_2}) debería considerar? Dame un ejemplo de implementación básica para {datos_a_cachear}.",
    placeholders: [
      "lenguaje_app",
      "proposito_cache",
      "estrategia_cache_1",
      "estrategia_cache_2",
      "herramienta_cache_1",
      "herramienta_cache_2",
      "datos_a_cachear",
    ],
    nivel: "Avanzado",
    etapa: "Implementación",
    categoría: "Backend",
    instrucciones:
      "lenguaje_app: Lenguaje de la aplicación. proposito_cache: Razón para implementar la caché. estrategia_cache_1,2: Ej: 'write-through', 'read-aside', 'TTL'. herramienta_cache_1,2: Ej: 'Redis', 'Memcached', 'caché en memoria'. datos_a_cachear: Qué información específica se va a cachear.",
    notas_para_el_uso:
      "Para tomar decisiones informadas sobre estrategias y herramientas de caché.",
  },
  {
    id: 51,
    template:
      "Actúa como un experto en {tecnologia_nube} (ej: AWS, Azure, GCP). Necesito diseñar una solución para {problema_a_resolver_nube} (ej: 'alojar una aplicación web escalable', 'procesar grandes volúmenes de datos en batch', 'crear un data lake'). Sugiere los servicios principales a utilizar, cómo se conectarían y una estimación de alto nivel de los costos si es posible.",
    placeholders: ["tecnologia_nube", "problema_a_resolver_nube"],
    nivel: "Avanzado",
    etapa: "Diseño",
    categoría: "Arquitectura",
    instrucciones:
      "tecnologia_nube: Proveedor cloud específico. problema_a_resolver_nube: El caso de uso o problema de negocio.",
    notas_para_el_uso: "Para obtener borradores de arquitecturas cloud.",
  },
  {
    id: 52,
    template:
      "Con {entorno_IA_codigo} (ej: GitHub Copilot en VS Code), estoy escribiendo una función en {lenguaje} para {proposito_funcion}. Ya he escrito la siguiente parte: \n```\n{codigo_parcial}\n```\nAyúdame a completarla, asegurando que {requisito_adicional_1} y {requisito_adicional_2}.",
    placeholders: [
      "entorno_IA_codigo",
      "lenguaje",
      "proposito_funcion",
      "codigo_parcial",
      "requisito_adicional_1",
      "requisito_adicional_2",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA_codigo: Herramienta de autocompletado IA. lenguaje: Lenguaje de programación. proposito_funcion: Qué debe hacer la función completa. codigo_parcial: El código ya escrito. requisito_adicional_1,2: Condiciones extra para la IA.",
    notas_para_el_uso:
      "Para usar la capacidad de completado inteligente de herramientas como Copilot.",
  },
  {
    id: 53,
    template:
      "Estoy usando {plataforma_low_code_o_ia} (ej: Retool, Appsmith, o un agente IA como Windsurf para scripting). Necesito construir una pequeña aplicación interna para {proposito_app_interna} (ej: 'gestionar inventario básico', 'aprobar solicitudes de vacaciones'). Describe los componentes de UI principales (tablas, formularios, botones) y la lógica de negocio básica para las acciones {accion_1} y {accion_2}. Genera un plan o los pasos para crearlo en la plataforma.",
    placeholders: [
      "plataforma_low_code_o_ia",
      "proposito_app_interna",
      "accion_1",
      "accion_2",
    ],
    nivel: "Intermedio",
    etapa: "Diseño | Implementación",
    categoría: "No-Code | Productividad asistida por IA",
    instrucciones:
      "plataforma_low_code_o_ia: Herramienta específica. proposito_app_interna: Objetivo de la app. accion_1, accion_2: Funcionalidades clave.",
    notas_para_el_uso:
      "Para el desarrollo rápido de herramientas internas con plataformas low-code o ayuda de IA.",
  },
  {
    id: 54,
    template:
      "Genera un script en {lenguaje_scripting} (ej: Python, Bash) que monitoree {metrica_a_monitorear} (ej: 'el uso de CPU de un proceso', 'el espacio libre en disco', 'la respuesta de un endpoint HTTP') y envíe una alerta (ej: 'por email', 'a un canal de Slack vía webhook') si {condicion_alerta}.",
    placeholders: [
      "lenguaje_scripting",
      "metrica_a_monitorear",
      "condicion_alerta",
    ],
    nivel: "Avanzado",
    etapa: "Monitoreo",
    categoría: "DevOps",
    instrucciones:
      "lenguaje_scripting: Lenguaje para el script de monitoreo. metrica_a_monitorear: Qué se va a vigilar. condicion_alerta: Cuándo se debe disparar la alerta.",
    notas_para_el_uso: "Para crear scripts de monitoreo personalizados.",
  },
  {
    id: 55,
    template:
      "Estoy configurando mi entorno de desarrollo local para un proyecto {tecnologia_proyecto}. Necesito instalar {herramienta_1}, {herramienta_2} y {libreria_3} en mi sistema operativo {sistema_operativo}. Proporciona los comandos y los pasos necesarios, incluyendo cómo verificar que la instalación fue exitosa.",
    placeholders: [
      "tecnologia_proyecto",
      "herramienta_1",
      "herramienta_2",
      "libreria_3",
      "sistema_operativo",
    ],
    nivel: "Principiante",
    etapa: "Configuración",
    categoría: "General",
    instrucciones:
      "tecnologia_proyecto: Ej: 'Node.js con React'. herramienta_1,2, libreria_3: Software específico a instalar. sistema_operativo: Ej: 'Ubuntu 22.04', 'macOS Sonoma', 'Windows 11 con WSL2'.",
    notas_para_el_uso:
      "Ayuda a principiantes a configurar sus entornos de desarrollo.",
  },
  {
    id: 56,
    template:
      "En {entorno_IA_cursor_like}, tengo la siguiente interfaz/tipo en {lenguaje_o_typescript}: \n```\n{definicion_interfaz_tipo}\n```\nGenera código mock o de ejemplo que implemente esta interfaz o satisfaga este tipo, incluyendo datos ficticios realistas para todos sus campos.",
    placeholders: [
      "entorno_IA_cursor_like",
      "lenguaje_o_typescript",
      "definicion_interfaz_tipo",
    ],
    nivel: "Intermedio",
    etapa: "Testing | Implementación",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA_cursor_like: Herramienta tipo Cursor. lenguaje_o_typescript: Lenguaje, especificando TypeScript si aplica. definicion_interfaz_tipo: El código de la interfaz o tipo.",
    notas_para_el_uso:
      "Muy útil para generar datos de prueba o stubs para desarrollo y testing.",
  },
  {
    id: 57,
    template:
      "Quiero implementar un sistema de logging centralizado para mi aplicación distribuida (componentes: {componente_1_tecnologia}, {componente_2_tecnologia}). Sugiere una arquitectura usando {tecnologia_logging_stack} (ej: ELK Stack, Grafana Loki, AWS CloudWatch Logs). Describe cómo los logs serían recolectados, procesados, almacenados y visualizados.",
    placeholders: [
      "componente_1_tecnologia",
      "componente_2_tecnologia",
      "tecnologia_logging_stack",
    ],
    nivel: "Avanzado",
    etapa: "Diseño",
    categoría: "DevOps | Arquitectura",
    instrucciones:
      "componente_1_tecnologia, componente_2_tecnologia: Partes de la aplicación y sus tecnologías. tecnologia_logging_stack: El stack de logging a considerar.",
    notas_para_el_uso:
      "Para diseñar soluciones de logging efectivas en sistemas complejos.",
  },
  {
    id: 58,
    template:
      "Actúa como un revisor de código senior. Revisa el siguiente fragmento de código {lenguaje} para {objetivo_revision} (ej: 'buenas prácticas de POO', 'uso correcto de asincronía', 'eficiencia algorítmica'). Proporciona feedback constructivo y sugerencias de mejora.\n```\n{codigo_para_revisar}\n```",
    placeholders: ["lenguaje", "objetivo_revision", "codigo_para_revisar"],
    nivel: "Avanzado",
    etapa: "Revisión de Código",
    categoría: "Calidad",
    instrucciones:
      "lenguaje: Lenguaje del código. objetivo_revision: Aspecto específico a evaluar. codigo_para_revisar: El fragmento de código.",
    notas_para_el_uso:
      "Para obtener revisiones de código detalladas y de alta calidad.",
  },
  {
    id: 59,
    template:
      "Estoy usando {plataforma_IA_V0_like} para generar una UI. Necesito una sección de 'Testimonios de Clientes' para una landing page. Debe tener un título, {numero_testimonios} tarjetas de testimonio (cada una con avatar, nombre del cliente, empresa y el texto del testimonio). El diseño debe ser {estilo_diseño_testimonios} y responsive. Genera el código HTML y {framework_css_preferido}.",
    placeholders: [
      "plataforma_IA_V0_like",
      "numero_testimonios",
      "estilo_diseño_testimonios",
      "framework_css_preferido",
    ],
    nivel: "Intermedio",
    etapa: "Implementación | Diseño",
    categoría: "Frontend | No-Code",
    instrucciones:
      "plataforma_IA_V0_like: Ej: V0.dev, u otra herramienta similar. numero_testimonios: Cantidad de testimonios a mostrar. estilo_diseño_testimonios: Ej: 'carrusel', 'cuadrícula', 'columnas alternadas'. framework_css_preferido: Ej: TailwindCSS, Bootstrap.",
    notas_para_el_uso:
      "Específico para generar componentes de UI comunes con herramientas IA.",
  },
  {
    id: 60,
    template:
      "En Firebase Studio, quiero configurar reglas de seguridad para Firebase Storage. Para los archivos en la ruta '{ruta_storage}', quiero permitir la subida (write) solo si {condicion_subida} (ej: 'el usuario está autenticado y el tamaño del archivo es menor a 5MB') y la lectura (read) solo si {condicion_lectura} (ej: 'el usuario es el propietario del archivo o es un administrador').",
    placeholders: ["ruta_storage", "condicion_subida", "condicion_lectura"],
    nivel: "Avanzado",
    etapa: "Seguridad | Implementación",
    categoría: "Backend | Productividad asistida por IA",
    instrucciones:
      "ruta_storage: Path dentro de Firebase Storage (ej: 'user_avatars/{userId}/'). condicion_subida: Lógica para permitir escrituras. condicion_lectura: Lógica para permitir lecturas.",
    notas_para_el_uso:
      "Específico para Firebase Studio y la configuración de reglas de Storage.",
  },
  {
    id: 61,
    template:
      "Necesito entender el flujo de ejecución del siguiente código {lenguaje_programacion}. Explícalo paso a paso, indicando el valor de las variables importantes en cada etapa. Considera la entrada: {entrada_ejemplo}.\n```\n{codigo_a_explicar_flujo}\n```",
    placeholders: [
      "lenguaje_programacion",
      "entrada_ejemplo",
      "codigo_a_explicar_flujo",
    ],
    nivel: "Avanzado",
    etapa: "Análisis",
    categoría: "General",
    instrucciones:
      "lenguaje_programacion: Lenguaje del código. entrada_ejemplo: Un valor o conjunto de valores de entrada para trazar la ejecución. codigo_a_explicar_flujo: El código cuyo flujo se quiere entender.",
    notas_para_el_uso:
      "Muy útil para 'dry runs' mentales o para entender algoritmos complejos.",
  },
  {
    id: 62,
    template:
      "Actúa como un Product Owner. Dada la visión del producto '{vision_producto}', y el objetivo de sprint actual '{objetivo_sprint}', ayúdame a priorizar el siguiente backlog de PBI (Product Backlog Items): {lista_PBI_con_estimaciones_opcionales}. Justifica la priorización usando {criterio_priorizacion_1} y {criterio_priorizacion_2} (ej: valor de negocio, urgencia, riesgo, dependencia).",
    placeholders: [
      "vision_producto",
      "objetivo_sprint",
      "lista_PBI_con_estimaciones_opcionales",
      "criterio_priorizacion_1",
      "criterio_priorizacion_2",
    ],
    nivel: "Avanzado",
    etapa: "Planificación",
    categoría: "Gestión de Proyectos",
    instrucciones:
      "vision_producto: Dirección general del producto. objetivo_sprint: Meta del sprint actual. lista_PBI_con_estimaciones_opcionales: PBIs a priorizar. criterio_priorizacion_1,2: Factores para decidir el orden.",
    notas_para_el_uso:
      "Para obtener ayuda en la toma de decisiones de priorización de backlog.",
  },
  {
    id: 63,
    template:
      "Con una herramienta como Lovable o Windsurf, realiza un análisis de sentimiento del siguiente conjunto de comentarios de usuarios sobre {producto_o_servicio}: \n'''\n{texto_comentarios_usuarios}\n'''\nClasifica los comentarios en positivos, negativos y neutros. Identifica los temas recurrentes y las sugerencias principales. Presenta un resumen.",
    placeholders: ["producto_o_servicio", "texto_comentarios_usuarios"],
    nivel: "Intermedio",
    etapa: "Análisis",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "producto_o_servicio: Sobre qué son los comentarios. texto_comentarios_usuarios: El conjunto de comentarios, separados por líneas o párrafos.",
    notas_para_el_uso:
      "Utiliza IA para procesar feedback de usuarios y extraer insights.",
  },
  {
    id: 64,
    template:
      "Estoy depurando un problema de concurrencia en mi código {lenguaje_programacion} que usa {mecanismo_concurrencia} (ej: 'threads y locks', 'async/await', 'goroutines y channels'). El problema es {descripcion_problema_concurrencia} (ej: 'un deadlock bajo ciertas condiciones', 'una race condition al acceder a X'). Aquí está el código relevante:\n```\n{codigo_concurrente}\n```\nAyúdame a identificar la causa y sugiere cómo solucionarlo.",
    placeholders: [
      "lenguaje_programacion",
      "mecanismo_concurrencia",
      "descripcion_problema_concurrencia",
      "codigo_concurrente",
    ],
    nivel: "Avanzado",
    etapa: "Debugging",
    categoría: "Backend",
    instrucciones:
      "lenguaje_programacion: Lenguaje. mecanismo_concurrencia: Cómo se maneja la concurrencia. descripcion_problema_concurrencia: Síntomas del problema. codigo_concurrente: Fragmento de código donde ocurre el problema.",
    notas_para_el_uso:
      "La depuración de concurrencia es compleja; este prompt busca orientación experta.",
  },
  {
    id: 65,
    template:
      "Genera un archivo de configuración para {herramienta_linting_formateo} (ej: ESLint con Prettier, Pylint, Checkstyle) para un proyecto {lenguaje_o_framework}. Quiero que siga las guías de estilo de {guia_estilo_referencia} (ej: 'Airbnb JavaScript Style Guide', 'Google Python Style Guide', 'PSR-12 para PHP') y que incluya reglas para {regla_especifica_1} y {regla_especifica_2}.",
    placeholders: [
      "herramienta_linting_formateo",
      "lenguaje_o_framework",
      "guia_estilo_referencia",
      "regla_especifica_1",
      "regla_especifica_2",
    ],
    nivel: "Intermedio",
    etapa: "Configuración",
    categoría: "DevOps",
    instrucciones:
      "herramienta_linting_formateo: Linter o formateador. lenguaje_o_framework: Contexto del proyecto. guia_estilo_referencia: Estándar a seguir. regla_especifica_1,2: Personalizaciones deseadas.",
    notas_para_el_uso: "Para establecer consistencia de código en el equipo.",
  },
  {
    id: 66,
    template:
      "Usando {entorno_IA_cursor_like}, tengo seleccionada una función en {lenguaje} que es muy larga y compleja. Ayúdame a refactorizarla extrayendo sub-funciones más pequeñas y cohesivas. Asegúrate de que la funcionalidad general se mantenga y que los nombres de las nuevas funciones sean descriptivos.",
    placeholders: ["entorno_IA_cursor_like", "lenguaje"],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA_cursor_like: Herramienta IA integrada en IDE. lenguaje: Lenguaje de la función. El código debe estar seleccionado en el editor.",
    notas_para_el_uso:
      "Para aplicar la técnica de 'Extract Method' con ayuda de IA.",
  },
  {
    id: 67,
    template:
      "Quiero crear un 'boilerplate' o plantilla de proyecto para {tipo_proyecto_boilerplate} (ej: 'una API Node.js con Express y TypeScript', 'una aplicación frontend React con Vite y Redux Toolkit', 'un microservicio Python con FastAPI y Docker'). ¿Qué estructura de carpetas, archivos de configuración esenciales (ej: package.json, tsconfig.json, requirements.txt) y scripts básicos (ej: dev, build, test) debería incluir? Proporciona un árbol de directorios y el contenido de los archivos clave.",
    placeholders: ["tipo_proyecto_boilerplate"],
    nivel: "Avanzado",
    etapa: "Diseño",
    categoría: "Arquitectura | DevOps",
    instrucciones:
      "tipo_proyecto_boilerplate: La tecnología y el propósito del boilerplate.",
    notas_para_el_uso: "Para estandarizar el inicio de nuevos proyectos.",
  },
  {
    id: 68,
    template:
      "Estoy evaluando usar {nombre_base_datos_novedosa_o_especifica} (ej: SurrealDB, EdgeDB, TimescaleDB) para mi proyecto {descripcion_proyecto_uso_db}. ¿Cuáles son sus principales casos de uso, ventajas en comparación con {alternativa_db_comun} (ej: PostgreSQL, MongoDB) y posibles desventajas o limitaciones a considerar para mi caso?",
    placeholders: [
      "nombre_base_datos_novedosa_o_especifica",
      "descripcion_proyecto_uso_db",
      "alternativa_db_comun",
    ],
    nivel: "Avanzado",
    etapa: "Análisis",
    categoría: "Bases de Datos",
    instrucciones:
      "nombre_base_datos_novedosa_o_especifica: La BD a evaluar. descripcion_proyecto_uso_db: Contexto del proyecto. alternativa_db_comun: Una BD más tradicional para comparar.",
    notas_para_el_uso:
      "Para investigar tecnologías de bases de datos emergentes o de nicho.",
  },
  {
    id: 69,
    template:
      "En {plataforma_IA_UI_V0_like}, genera una barra de navegación (navbar) para un sitio web {tipo_sitio_web} (ej: 'e-commerce', 'blog', 'portfolio'). Debe incluir un logo a la izquierda, los siguientes enlaces: {enlace_1}, {enlace_2}, {enlace_3}, y un {elemento_derecha} (ej: 'botón de login', 'icono de carrito de compras') a la derecha. Debe ser responsive y colapsar en un menú hamburguesa en móviles. Usa {framework_css_opcional} si es posible.",
    placeholders: [
      "plataforma_IA_UI_V0_like",
      "tipo_sitio_web",
      "enlace_1",
      "enlace_2",
      "enlace_3",
      "elemento_derecha",
      "framework_css_opcional",
    ],
    nivel: "Intermedio",
    etapa: "Implementación | Diseño",
    categoría: "Frontend | No-Code",
    instrucciones:
      "plataforma_IA_UI_V0_like: Ej: V0.dev. tipo_sitio_web: Contexto. enlace_1,2,3: Items del menú. elemento_derecha: Elemento adicional. framework_css_opcional: Ej: TailwindCSS.",
    notas_para_el_uso:
      "Para generar rápidamente componentes UI estándar con herramientas IA.",
  },
  {
    id: 70,
    template:
      "Con Firebase Studio, necesito una regla de validación para Firestore en la colección `{nombre_coleccion}` que asegure que el campo `{nombre_campo}` solo acepte valores de tipo `{tipo_dato_esperado}` y que {condicion_adicional_campo} (ej: 'sea un email válido', 'no esté vacío', 'sea un número entre X e Y').",
    placeholders: [
      "nombre_coleccion",
      "nombre_campo",
      "tipo_dato_esperado",
      "condicion_adicional_campo",
    ],
    nivel: "Intermedio",
    etapa: "Seguridad | Implementación",
    categoría: "Backend | Productividad asistida por IA",
    instrucciones:
      "nombre_coleccion: Colección de Firestore. nombre_campo: Campo a validar. tipo_dato_esperado: Ej: 'string', 'number', 'boolean'. condicion_adicional_campo: Restricción extra para el valor del campo.",
    notas_para_el_uso:
      "Para generar reglas de validación de datos en Firestore usando Firebase Studio.",
  },
  {
    id: 71,
    template:
      "Define una estrategia de branching y merging en Git para un equipo de {numero_desarrolladores} desarrolladores trabajando en un proyecto {tipo_proyecto_git} (ej: 'con releases mensuales', 'de desarrollo continuo y rápido'). Considera ramas como `main`/`master`, `develop`, `feature/*`, `release/*`, `hotfix/*`. Explica el flujo de trabajo.",
    placeholders: ["numero_desarrolladores", "tipo_proyecto_git"],
    nivel: "Avanzado",
    etapa: "Configuración",
    categoría: "DevOps | Gestión de Proyectos",
    instrucciones:
      "numero_desarrolladores: Tamaño del equipo. tipo_proyecto_git: Contexto que influye en la estrategia (ej: frecuencia de releases).",
    notas_para_el_uso:
      "Para establecer un flujo de trabajo Git claro y eficiente.",
  },
  {
    id: 72,
    template:
      "Quiero implementar WebSockets en mi aplicación {framework_backend} para la funcionalidad de {funcionalidad_realtime} (ej: 'notificaciones en tiempo real', 'un chat multiusuario', 'actualización de dashboards en vivo'). Describe la arquitectura básica, cómo manejar conexiones, enviar/recibir mensajes y consideraciones de escalabilidad.",
    placeholders: ["framework_backend", "funcionalidad_realtime"],
    nivel: "Avanzado",
    etapa: "Diseño | Implementación",
    categoría: "Backend",
    instrucciones:
      "framework_backend: Ej: Node.js con Socket.IO, Spring WebFlux, Django Channels. funcionalidad_realtime: El caso de uso para WebSockets.",
    notas_para_el_uso:
      "Para planificar la implementación de comunicación en tiempo real.",
  },
  {
    id: 73,
    template:
      "Actúa como un Ethical Hacker. He desarrollado una API en {tecnologia_api} con los siguientes endpoints públicos: {lista_endpoints_descripcion}. ¿Qué tipo de pruebas de penetración básicas podría realizar para identificar vulnerabilidades comunes (ej: OWASP Top 10)? Sugiere herramientas y técnicas.",
    placeholders: ["tecnologia_api", "lista_endpoints_descripcion"],
    nivel: "Avanzado",
    etapa: "Testing",
    categoría: "Seguridad",
    instrucciones:
      "tecnologia_api: Stack de la API. lista_endpoints_descripcion: Endpoints expuestos y qué hacen.",
    notas_para_el_uso:
      "Para obtener una perspectiva de 'atacante' y planificar pruebas de seguridad.",
  },
  {
    id: 74,
    template:
      "Usando {entorno_IA_codigo} (ej: Cursor), tengo un fragmento de código {lenguaje} que es difícil de entender debido a {razon_complejidad} (ej: 'nombres de variables poco claros', 'lógica anidada profundamente', 'uso de abreviaturas'). Sugiere y aplica (si es posible) cambios para mejorar su legibilidad y mantenibilidad sin alterar su funcionalidad.",
    placeholders: ["entorno_IA_codigo", "lenguaje", "razon_complejidad"],
    nivel: "Intermedio",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA_codigo: Herramienta IA. lenguaje: Lenguaje del código. razon_complejidad: Por qué el código es difícil de leer. El código debe estar accesible (seleccionado).",
    notas_para_el_uso: "Para mejorar la calidad del código con ayuda de IA.",
  },
  {
    id: 75,
    template:
      "Necesito una query SQL para {proposito_query} (ej: 'obtener los 10 clientes con más compras en el último mes', 'calcular el promedio de edad de usuarios por ciudad', 'encontrar productos sin stock'). Las tablas relevantes son: {tabla1_nombre} (columnas: {tabla1_columnas}), {tabla2_nombre} (columnas: {tabla2_columnas}). La relación es {descripcion_relacion_tablas}. Considera {condicion_especial_query}.",
    placeholders: [
      "proposito_query",
      "tabla1_nombre",
      "tabla1_columnas",
      "tabla2_nombre",
      "tabla2_columnas",
      "descripcion_relacion_tablas",
      "condicion_especial_query",
    ],
    nivel: "Intermedio | Avanzado",
    etapa: "Implementación | Bases de Datos",
    categoría: "Bases de Datos | Backend",
    instrucciones:
      "proposito_query: Lo que se quiere obtener. tabla1_nombre, tabla1_columnas, etc.: Descripción del esquema relevante. descripcion_relacion_tablas: Cómo se unen las tablas (ej: 'tabla1.foreign_key_id = tabla2.id'). condicion_especial_query: Filtros o lógicas adicionales.",
    notas_para_el_uso: "Para generar consultas SQL complejas.",
  },
  {
    id: 76,
    template:
      "Estoy considerando migrar mi aplicación monolítica en {tecnologia_monolito} a una arquitectura de microservicios. ¿Cuáles serían los primeros {numero_servicios} servicios que podría identificar y extraer? ¿Qué estrategias de descomposición (ej: {estrategia_descomposicion_1}, {estrategia_descomposicion_2}) podría aplicar? ¿Qué desafíos debo anticipar?",
    placeholders: [
      "tecnologia_monolito",
      "numero_servicios",
      "estrategia_descomposicion_1",
      "estrategia_descomposicion_2",
    ],
    nivel: "Avanzado",
    etapa: "Diseño",
    categoría: "Arquitectura",
    instrucciones:
      "tecnologia_monolito: Stack del monolito actual. numero_servicios: Cuántos servicios iniciales se buscan. estrategia_descomposicion_1,2: Ej: 'por capacidad de negocio', 'por subdominio DDD'.",
    notas_para_el_uso:
      "Para planificar la transición de monolito a microservicios.",
  },
  {
    id: 77,
    template:
      "Para una herramienta IA como Bold o Windsurf que puede interactuar con APIs: Dada la documentación de la API de {nombre_api_externa} (puedes pegar un resumen o URL: {url_documentacion_api}), genera un script en {lenguaje_script_cliente} que consuma el endpoint '{endpoint_objetivo}' con los parámetros {parametros_endpoint} para lograr {objetivo_interaccion_api}.",
    placeholders: [
      "nombre_api_externa",
      "url_documentacion_api",
      "lenguaje_script_cliente",
      "endpoint_objetivo",
      "parametros_endpoint",
      "objetivo_interaccion_api",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Productividad asistida por IA | Backend",
    instrucciones:
      "nombre_api_externa: API a consumir. url_documentacion_api: Enlace a la doc de la API. lenguaje_script_cliente: Ej: Python con requests, JavaScript con fetch. endpoint_objetivo: Endpoint específico. parametros_endpoint: Datos para la request. objetivo_interaccion_api: Qué se quiere lograr.",
    notas_para_el_uso:
      "Para agentes IA que pueden generar código cliente para APIs.",
  },
  {
    id: 78,
    template:
      "Necesito implementar internacionalización (i18n) y localización (l10n) en mi aplicación {tecnologia_aplicacion_i18n} (ej: React, Angular, Django). ¿Qué librerías o enfoques recomiendas? ¿Cómo debería estructurar mis archivos de traducción para los idiomas {idioma_1} y {idioma_2}? Proporciona un ejemplo básico de cómo consumir una cadena traducida en un componente/plantilla.",
    placeholders: ["tecnologia_aplicacion_i18n", "idioma_1", "idioma_2"],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Frontend | Backend",
    instrucciones:
      "tecnologia_aplicacion_i18n: Framework o lenguaje de la app. idioma_1, idioma_2: Idiomas a soportar (ej: 'español', 'inglés').",
    notas_para_el_uso:
      "Guía para añadir soporte multi-idioma a las aplicaciones.",
  },
  {
    id: 79,
    template:
      "En {plataforma_IA_V0_like}, quiero generar un pie de página (footer) para un sitio web. Debe incluir {numero_columnas} columnas. La primera con {contenido_col1_footer}, la segunda con {contenido_col2_footer}, etc. También debe tener una sección inferior con {texto_copyright} y enlaces a {red_social_1} y {red_social_2}. Debe ser responsive. Genera el código (HTML y {framework_css_footer}).",
    placeholders: [
      "plataforma_IA_V0_like",
      "numero_columnas",
      "contenido_col1_footer",
      "contenido_col2_footer",
      "texto_copyright",
      "red_social_1",
      "red_social_2",
      "framework_css_footer",
    ],
    nivel: "Principiante",
    etapa: "Implementación | Diseño",
    categoría: "Frontend | No-Code",
    instrucciones:
      "plataforma_IA_V0_like: Ej: V0.dev. numero_columnas: Cantidad de secciones principales del footer. contenido_col1_footer, etc.: Enlaces o texto para cada columna. texto_copyright: Texto de derechos de autor. red_social_1,2: Enlaces a redes. framework_css_footer: Ej: TailwindCSS.",
    notas_para_el_uso:
      "Para generar footers de sitios web con herramientas IA.",
  },
  {
    id: 80,
    template:
      "Actúa como un Solution Architect. Una startup quiere construir {descripcion_plataforma_startup} con un presupuesto limitado y necesidad de escalar rápidamente. ¿Qué stack tecnológico (frontend, backend, base de datos, hosting/cloud) recomendarías y por qué? Considera factores como {factor_1_startup}, {factor_2_startup} y {factor_3_startup} (ej: 'costo inicial', 'curva de aprendizaje del equipo', 'ecosistema y comunidad', 'velocidad de desarrollo').",
    placeholders: [
      "descripcion_plataforma_startup",
      "factor_1_startup",
      "factor_2_startup",
      "factor_3_startup",
    ],
    nivel: "Avanzado",
    etapa: "Diseño",
    categoría: "Arquitectura",
    instrucciones:
      "descripcion_plataforma_startup: Qué tipo de plataforma es. factor_1,2,3_startup: Restricciones o prioridades de la startup.",
    notas_para_el_uso:
      "Para obtener recomendaciones de stack tecnológico para nuevos proyectos.",
  },
  {
    id: 81,
    template:
      "Con Firebase Studio, estoy intentando depurar una Cloud Function en {runtime_funcion_firebase} que {comportamiento_esperado_funcion} pero está {problema_actual_funcion}. Revisa los logs (si te los proporciono) o sugiere pasos comunes de depuración para funciones en Firebase, incluyendo cómo verificar {aspecto_a_verificar_1} y {aspecto_a_verificar_2} (ej: 'permisos IAM', 'variables de entorno', 'triggers correctos').",
    placeholders: [
      "runtime_funcion_firebase",
      "comportamiento_esperado_funcion",
      "problema_actual_funcion",
      "aspecto_a_verificar_1",
      "aspecto_a_verificar_2",
    ],
    nivel: "Intermedio",
    etapa: "Debugging",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "runtime_funcion_firebase: Ej: Node.js, Python. comportamiento_esperado_funcion: Qué debería hacer. problema_actual_funcion: Qué está fallando. aspecto_a_verificar_1,2: Puntos clave para la depuración.",
    notas_para_el_uso:
      "Para depurar Cloud Functions con la ayuda del asistente de Firebase Studio.",
  },
  {
    id: 82,
    template:
      "Necesito un algoritmo en {lenguaje_programacion} para resolver el problema de {nombre_problema_algoritmico} (ej: 'Encontrar el camino más corto en un grafo ponderado', 'Ordenar una lista de N elementos eficientemente', 'Buscar un elemento en un árbol binario'). Describe el algoritmo (ej: Dijkstra, MergeSort, BFS), su complejidad temporal y espacial, y proporciona una implementación.",
    placeholders: ["lenguaje_programacion", "nombre_problema_algoritmico"],
    nivel: "Intermedio | Avanzado",
    etapa: "Implementación",
    categoría: "Algoritmos",
    instrucciones:
      "lenguaje_programacion: Lenguaje para la implementación. nombre_problema_algoritmico: Problema algorítmico clásico o descripción del mismo.",
    notas_para_el_uso:
      "Para obtener implementaciones de algoritmos y entender su funcionamiento.",
  },
  {
    id: 83,
    template:
      "En mi IDE con asistente IA (tipo Cursor), tengo código {lenguaje} que usa una librería obsoleta {libreria_obsoleta} para {proposito_libreria_obsoleta}. Quiero migrarlo para usar la librería moderna {libreria_moderna}. Analiza el uso actual y sugiere/aplica los cambios necesarios para la migración. El código relevante está seleccionado/es el siguiente:\n```\n{codigo_con_libreria_obsoleta}\n```",
    placeholders: [
      "lenguaje",
      "libreria_obsoleta",
      "proposito_libreria_obsoleta",
      "libreria_moderna",
      "codigo_con_libreria_obsoleta",
    ],
    nivel: "Avanzado",
    etapa: "Implementación | Refactorización",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "lenguaje: Lenguaje del código. libreria_obsoleta: Nombre de la librería antigua. proposito_libreria_obsoleta: Para qué se usaba. libreria_moderna: Alternativa actual. codigo_con_libreria_obsoleta: El código a migrar (o indicar que está seleccionado).",
    notas_para_el_uso:
      "Para tareas de migración de dependencias con ayuda de IA.",
  },
  {
    id: 84,
    template:
      "Estoy planificando un sprint de {duracion_sprint} semanas. El objetivo del sprint es {objetivo_del_sprint}. Tenemos una capacidad de equipo de {capacidad_equipo_storypoints} story points. Ayúdame a seleccionar las User Stories del backlog para este sprint, considerando sus prioridades y estimaciones (si disponibles): {lista_user_stories_backlog_con_prioridad_estimacion}. Justifica la selección.",
    placeholders: [
      "duracion_sprint",
      "objetivo_del_sprint",
      "capacidad_equipo_storypoints",
      "lista_user_stories_backlog_con_prioridad_estimacion",
    ],
    nivel: "Intermedio",
    etapa: "Planificación",
    categoría: "Gestión de Proyectos",
    instrucciones:
      "duracion_sprint: Longitud del sprint. objetivo_del_sprint: Meta principal. capacidad_equipo_storypoints: Puntos que el equipo puede abordar. lista_user_stories_backlog_con_prioridad_estimacion: Items del backlog con su info.",
    notas_para_el_uso:
      "Para planificar el contenido de un sprint de forma efectiva.",
  },
  {
    id: 85,
    template:
      "Con {plataforma_IA_prototipado_rapido} (ej: Lovable, Bold, o incluso V0 para UI), quiero crear un prototipo rápido para validar la idea de {idea_de_producto_o_feature}. Describe los flujos de usuario clave ({flujo_1_descripcion}, {flujo_2_descripcion}) y las pantallas/componentes principales necesarios. Genera un plan o el código/descripción para la plataforma.",
    placeholders: [
      "plataforma_IA_prototipado_rapido",
      "idea_de_producto_o_feature",
      "flujo_1_descripcion",
      "flujo_2_descripcion",
    ],
    nivel: "Intermedio",
    etapa: "Diseño",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "plataforma_IA_prototipado_rapido: Herramienta IA para prototipado. idea_de_producto_o_feature: Concepto a validar. flujo_1_descripcion, flujo_2_descripcion: Interacciones principales del usuario.",
    notas_para_el_uso:
      "Para acelerar la creación de prototipos con herramientas IA.",
  },
  {
    id: 86,
    template:
      "Actúa como un experto en performance web. Mi sitio web hecho con {tecnologia_frontend_web} está obteniendo una puntuación baja en {metrica_web_vitals} (ej: LCP, FID, CLS) según {herramienta_medicion_web} (ej: PageSpeed Insights, Lighthouse). ¿Cuáles son las causas comunes y qué optimizaciones específicas (ej: {optimizacion_1}, {optimizacion_2}) puedo aplicar en mi código o configuración para mejorarla?",
    placeholders: [
      "tecnologia_frontend_web",
      "metrica_web_vitals",
      "herramienta_medicion_web",
      "optimizacion_1",
      "optimizacion_2",
    ],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "Frontend",
    instrucciones:
      "tecnologia_frontend_web: Framework/librería principal. metrica_web_vitals: Métrica específica a mejorar. herramienta_medicion_web: De dónde viene la medición. optimizacion_1,2: Ejemplos de optimizaciones que se podrían considerar (ej: 'optimizar imágenes', 'reducir JavaScript no utilizado').",
    notas_para_el_uso:
      "Para obtener consejos específicos sobre cómo mejorar los Core Web Vitals.",
  },
  {
    id: 87,
    template:
      "Quiero configurar un entorno de desarrollo serverless local para mi proyecto {framework_serverless} (ej: AWS SAM, Serverless Framework) en {lenguaje_runtime_serverless}. ¿Qué herramientas necesito (ej: Docker, emuladores específicos) y cuáles son los pasos para invocar y depurar funciones localmente antes de desplegarlas?",
    placeholders: ["framework_serverless", "lenguaje_runtime_serverless"],
    nivel: "Intermedio",
    etapa: "Debugging",
    categoría: "DevOps",
    instrucciones:
      "framework_serverless: El framework que se usa para definir la app serverless. lenguaje_runtime_serverless: Ej: Node.js, Python.",
    notas_para_el_uso:
      "Guía para el desarrollo y prueba local de aplicaciones serverless.",
  },
  {
    id: 88,
    template:
      "Genera un 'Code of Conduct' (Código de Conducta) para un proyecto open source llamado {nombre_proyecto_os}. Debe basarse en {plantilla_coc_referencia} (ej: Contributor Covenant, Citizen Code of Conduct) e incluir secciones sobre {seccion_importante_1_coc} y {seccion_importante_2_coc} (ej: 'Comportamiento esperado', 'Proceso de reporte y cumplimiento').",
    placeholders: [
      "nombre_proyecto_os",
      "plantilla_coc_referencia",
      "seccion_importante_1_coc",
      "seccion_importante_2_coc",
    ],
    nivel: "Intermedio",
    etapa: "Documentación",
    categoría: "Gestión de Proyectos",
    instrucciones:
      "nombre_proyecto_os: Nombre del proyecto. plantilla_coc_referencia: Estándar en el que basarse. seccion_importante_1_coc, seccion_importante_2_coc: Puntos clave a cubrir.",
    notas_para_el_uso:
      "Para establecer directrices de comportamiento en comunidades open source.",
  },
  {
    id: 89,
    template:
      "Con {entorno_IA_cursor_like}, tengo una función en {lenguaje} que toma {numero_parametros} parámetros, algunos de los cuales son opcionales o están relacionados. Refactoriza esta función para usar un objeto de opciones (options object) o un patrón de constructor (builder pattern) para mejorar la claridad y flexibilidad al llamarla. El código actual es (o está seleccionado):\n```\n{codigo_funcion_parametros}\n```",
    placeholders: [
      "entorno_IA_cursor_like",
      "lenguaje",
      "numero_parametros",
      "codigo_funcion_parametros",
    ],
    nivel: "Intermedio",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA",
    instrucciones:
      "entorno_IA_cursor_like: Herramienta IA. lenguaje: Lenguaje del código. numero_parametros: Número de parámetros actuales. codigo_funcion_parametros: La firma o cuerpo de la función (o indicar que está seleccionada).",
    notas_para_el_uso:
      "Para refactorizar funciones con muchos parámetros usando patrones comunes con ayuda de IA.",
  },
  {
    id: 90,
    template:
      "Estoy diseñando una API GraphQL usando {libreria_graphql_backend} (ej: Apollo Server, Graphene-Python, Hot Chocolate para .NET). Define el schema para un tipo `{nombre_tipo_graphql}` con los campos `{campo1_graphql (tipo)}`, `{campo2_graphql (tipo)}`. También define una query para obtener `{nombre_tipo_graphql}` por `{criterio_busqueda_graphql}` y una mutación para `{accion_mutacion_graphql}` (ej: 'crear un nuevo {nombre_tipo_graphql}', 'actualizar {nombre_tipo_graphql}').",
    placeholders: [
      "libreria_graphql_backend",
      "nombre_tipo_graphql",
      "campo1_graphql (tipo)",
      "campo2_graphql (tipo)",
      "criterio_busqueda_graphql",
      "accion_mutacion_graphql",
    ],
    nivel: "Intermedio",
    etapa: "Diseño | Implementación",
    categoría: "Backend | API",
    instrucciones:
      "libreria_graphql_backend: Librería para el servidor GraphQL. nombre_tipo_graphql: Nombre del objeto en el schema. campo1_graphql (tipo), campo2_graphql (tipo): Campos con sus tipos GraphQL. criterio_busqueda_graphql: Cómo se buscará el objeto. accion_mutacion_graphql: Operación de modificación.",
    notas_para_el_uso:
      "Para diseñar y empezar a implementar schemas de GraphQL.",
  },
  {
    id: 91,
    template:
      "En {plataforma_IA_V0_like}, genera un formulario de contacto con los siguientes campos: {campo_form_1} (tipo: {tipo_campo_1}), {campo_form_2} (tipo: {tipo_campo_2}), {campo_form_3} (tipo: {tipo_campo_3}, ej: textarea), y un botón de 'Enviar'. Incluye validación básica del lado del cliente (ej: campos requeridos, formato de email). El estilo debe ser {estilo_formulario}. Genera el código HTML y {framework_css_formulario}.",
    placeholders: [
      "plataforma_IA_V0_like",
      "campo_form_1",
      "tipo_campo_1",
      "campo_form_2",
      "tipo_campo_2",
      "campo_form_3",
      "tipo_campo_3",
      "estilo_formulario",
      "framework_css_formulario",
    ],
    nivel: "Principiante",
    etapa: "Implementación | Diseño",
    categoría: "Frontend | No-Code",
    instrucciones:
      "plataforma_IA_V0_like: Ej: V0.dev. campo_form_1, tipo_campo_1, etc.: Definición de los campos del formulario. estilo_formulario: Apariencia deseada (ej: 'limpio y moderno', 'con etiquetas flotantes'). framework_css_formulario: Ej: TailwindCSS, Bootstrap.",
    notas_para_el_uso:
      "Para generar rápidamente formularios web con herramientas IA.",
  },
  {
    id: 92,
    template:
      "Usando Firebase Studio, quiero escribir una Cloud Function (en {runtime_cf_firebase}) que se active mediante un callable HTTPS. La función debe recibir {parametro_callable_1} y {parametro_callable_2}, realizar {logica_callable_funcion} y devolver {resultado_callable_funcion}. Asegúrate de que solo usuarios autenticados puedan llamarla.",
    placeholders: [
      "runtime_cf_firebase",
      "parametro_callable_1",
      "parametro_callable_2",
      "logica_callable_funcion",
      "resultado_callable_funcion",
    ],
    nivel: "Intermedio",
    etapa: "Implementación",
    categoría: "Serverless | Productividad asistida por IA",
    instrucciones:
      "runtime_cf_firebase: Ej: Node.js, Python. parametro_callable_1,2: Datos que espera la función desde el cliente. logica_callable_funcion: Procesamiento a realizar. resultado_callable_funcion: Lo que debe devolver la función al cliente.",
    notas_para_el_uso:
      "Específico para Firebase Studio y la creación de Cloud Functions callable.",
  },
  {
    id: 93,
    template:
      "Necesito crear un diagrama de secuencia UML para ilustrar la interacción entre los siguientes componentes/actores ({actor_1}, {componente_1}, {componente_2}, {base_de_datos}) durante el proceso de {proceso_a_diagramar} (ej: 'realizar un pedido online', 'autenticar un usuario'). Describe los mensajes intercambiados y su orden. Puedes generar el diagrama en formato PlantUML o Mermaid.",
    placeholders: [
      "actor_1",
      "componente_1",
      "componente_2",
      "base_de_datos",
      "proceso_a_diagramar",
    ],
    nivel: "Intermedio",
    etapa: "Diseño | Documentación",
    categoría: "Arquitectura",
    instrucciones:
      "Define los participantes y el flujo de interacción que quieres diagramar. Especifica el formato de salida si tienes preferencia (PlantUML, Mermaid).",
    notas_para_el_uso:
      "Para visualizar y documentar interacciones complejas en un sistema.",
  },
  {
    id: 94,
    template:
      "Actúa como un ingeniero de confiabilidad de sitio (SRE). Mi servicio {nombre_servicio} (tecnología: {tecnologia_servicio}) tiene un SLO de {slo_descripcion} (ej: '99.9% de disponibilidad mensual', 'latencia p95 por debajo de 200ms'). ¿Qué SLIs (Service Level Indicators) clave debería monitorear? ¿Cómo podría calcular el presupuesto de error (error budget) y qué acciones tomar cuando se consume?",
    placeholders: ["nombre_servicio", "tecnologia_servicio", "slo_descripcion"],
    nivel: "Avanzado",
    etapa: "Monitoreo",
    categoría: "DevOps",
    instrucciones:
      "nombre_servicio, tecnologia_servicio: Contexto del servicio. slo_descripcion: El objetivo de nivel de servicio definido.",
    notas_para_el_uso:
      "Para aplicar principios SRE al monitoreo y gestión de servicios.",
  },
  {
    id: 95,
    template:
      "Con una herramienta como Windsurf o un agente IA, investiga las implicaciones de seguridad de usar {tecnologia_o_patron_especifico} (ej: 'JWT para sesiones web', 'almacenar secretos en variables de entorno en Kubernetes', 'permitir subida de archivos de cualquier tipo'). Enumera las {numero_principales_amenazas} principales amenazas y las mejores prácticas para mitigarlas.",
    placeholders: [
      "tecnologia_o_patron_especifico",
      "numero_principales_amenazas",
    ],
    nivel: "Intermedio",
    etapa: "Investigación",
    categoría: "Seguridad | Productividad asistida por IA",
    instrucciones:
      "tecnologia_o_patron_especifico: El elemento cuya seguridad se quiere analizar. numero_principales_amenazas: Cuántas amenazas clave se esperan.",
    notas_para_el_uso:
      "Utiliza IA para investigar proactivamente riesgos de seguridad.",
  },
  {
    id: 96,
    template:
      "Estoy implementando un worker en {lenguaje_worker} (ej: Node.js, Python con Celery) que consume tareas de una cola {sistema_colas} (ej: RabbitMQ, Redis, Kafka). La tarea consiste en {descripcion_tarea_worker}. Escribe el código del worker para conectarse a la cola, procesar un mensaje (incluyendo deserialización si es necesario), manejar errores durante el procesamiento y confirmar el mensaje (ack/nack).",
    placeholders: [
      "lenguaje_worker",
      "sistema_colas",
      "descripcion_tarea_worker",
    ],
    nivel: "Avanzado",
    etapa: "Implementación",
    categoría: "Backend",
    instrucciones:
      "lenguaje_worker: Lenguaje y framework del worker. sistema_colas: Sistema de mensajería utilizado. descripcion_tarea_worker: Lo que hace cada tarea.",
    notas_para_el_uso: "Para desarrollar consumidores de colas de mensajes.",
  },
  {
    id: 97,
    template:
      "En {entorno_IA_cursor_like}, tengo una clase {nombre_clase_original} en {lenguaje} que ha crecido demasiado y viola el Principio de Responsabilidad Única. Identifica al menos dos responsabilidades distintas que podrían extraerse a nuevas clases ({nombre_clase_nueva_1}, {nombre_clase_nueva_2}). Refactoriza el código (o proporciónalo modificado) para realizar esta separación, asegurando que la colaboración entre las clases mantenga la funcionalidad original.",
    placeholders: [
      "entorno_IA_cursor_like",
      "nombre_clase_original",
      "lenguaje",
      "nombre_clase_nueva_1",
      "nombre_clase_nueva_2",
    ],
    nivel: "Avanzado",
    etapa: "Refactorización",
    categoría: "Productividad asistida por IA | Arquitectura",
    instrucciones:
      "entorno_IA_cursor_like: Herramienta IA. nombre_clase_original: Clase a refactorizar. lenguaje: Lenguaje del código. nombre_clase_nueva_1,2: Nombres sugeridos para las nuevas clases. El código debe estar accesible (seleccionado).",
    notas_para_el_uso:
      "Para aplicar el SRP con ayuda de IA, mejorando la cohesión y reduciendo el acoplamiento.",
  },
  {
    id: 98,
    template:
      "Quiero desplegar mi aplicación {tecnologia_app_deploy} en {plataforma_kubernetes_gestionada} (ej: GKE, EKS, AKS). Necesito los archivos YAML básicos para un Deployment y un Service (LoadBalancer). La imagen de mi aplicación es `{imagen_docker_app}` y expone el puerto `{puerto_app_expuesto}`. El deployment debe tener `{numero_replicas}` réplicas.",
    placeholders: [
      "tecnologia_app_deploy",
      "plataforma_kubernetes_gestionada",
      "imagen_docker_app",
      "puerto_app_expuesto",
      "numero_replicas",
    ],
    nivel: "Intermedio",
    etapa: "DevOps",
    categoría: "DevOps",
    instrucciones:
      "tecnologia_app_deploy: Tipo de aplicación. plataforma_kubernetes_gestionada: Proveedor de K8s. imagen_docker_app: Nombre de la imagen. puerto_app_expuesto: Puerto que la app escucha internamente. numero_replicas: Número deseado de pods.",
    notas_para_el_uso: "Para generar manifiestos básicos de Kubernetes.",
  },
  {
    id: 99,
    template:
      "Con {plataforma_IA_V0_like}, describe una sección 'Hero' para una landing page de una {tipo_empresa_o_producto} (ej: 'startup SaaS', 'app móvil de fitness', 'agencia de diseño'). Debe tener un titular atractivo, un subtitular explicativo, una imagen o ilustración destacada (sugiere tipo o tema) y un botón de Call to Action (CTA) principal con el texto '{texto_cta_hero}'. El estilo debe ser {estilo_hero_section}. Genera el código HTML y {framework_css_hero}.",
    placeholders: [
      "plataforma_IA_V0_like",
      "tipo_empresa_o_producto",
      "texto_cta_hero",
      "estilo_hero_section",
      "framework_css_hero",
    ],
    nivel: "Principiante",
    etapa: "Diseño | Implementación",
    categoría: "Frontend | No-Code",
    instrucciones:
      "plataforma_IA_V0_like: Ej: V0.dev. tipo_empresa_o_producto: Contexto para el contenido. texto_cta_hero: Texto del botón principal. estilo_hero_section: Dirección visual (ej: 'moderno y limpio', 'con gradientes y animaciones sutiles'). framework_css_hero: Ej: TailwindCSS.",
    notas_para_el_uso:
      "Para generar secciones 'Hero' de landing pages con herramientas IA.",
  },
  {
    id: 100,
    template:
      "Estoy usando Firebase Studio. Necesito optimizar una query de Firestore que actualmente lee {descripcion_query_ineficiente_fs} (ej: 'todos los documentos de una colección grande para filtrar en el cliente', 'realiza múltiples lecturas secuenciales'). El objetivo es {objetivo_optimizacion_fs} (ej: 'reducir el número de lecturas', 'mejorar la latencia'). ¿Qué estrategias de indexación, estructuración de datos o modificación de la query podría aplicar? Proporciona ejemplos concretos de reglas de indexación o código de query optimizado.",
    placeholders: [
      "descripcion_query_ineficiente_fs",
      "objetivo_optimizacion_fs",
    ],
    nivel: "Avanzado",
    etapa: "Refactorización | Bases de Datos",
    categoría: "Backend | Productividad asistida por IA",
    instrucciones:
      "descripcion_query_ineficiente_fs: Detalla la query actual y por qué es ineficiente. objetivo_optimizacion_fs: Qué se busca mejorar.",
    notas_para_el_uso:
      "Para optimizar el rendimiento de Firestore con ayuda de Firebase Studio.",
  },
  {
    id: 101,
    template:
      "Explica las diferencias entre autenticación y autorización en el contexto de desarrollo de software. Proporciona un ejemplo práctico en {lenguaje_o_framework_ejemplo} (ej: Node.js con Express, Java con Spring Security) que muestre cómo se implementaría un middleware o decorador para verificar si un usuario está autenticado para acceder a una ruta, y luego si tiene el rol '{rol_ejemplo}' para realizar una acción específica.",
    placeholders: ["lenguaje_o_framework_ejemplo", "rol_ejemplo"],
    nivel: "Intermedio",
    etapa: "Seguridad | Implementación",
    categoría: "Seguridad | Backend",
    instrucciones:
      "lenguaje_o_framework_ejemplo: Tecnología para el ejemplo de código. rol_ejemplo: Un rol de usuario para el ejemplo de autorización (ej: 'admin', 'editor').",
    notas_para_el_uso:
      "Clarifica conceptos fundamentales de seguridad con ejemplos.",
  },
];
