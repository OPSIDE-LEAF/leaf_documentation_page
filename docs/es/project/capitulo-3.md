# Capítulo III — Diseño y desarrollo del proyecto

## 3.1 Requerimientos del proyecto

El proyecto Leaf define un conjunto esencial de requerimientos que aseguran la viabilidad arquitectónica del ecosistema. Estos requerimientos se organizan en requerimientos funcionales (qué debe hacer el sistema) y requerimientos no funcionales (cómo debe comportarse el sistema). Cada requerimiento está vinculado directamente a los objetivos específicos del proyecto y al núcleo de la propuesta: un ecosistema modular multiplataforma que reduzca tiempos de desarrollo sin sacrificar rendimiento nativo.

### Requerimientos funcionales

| Ref. | Requerimiento | Descripción | Prioridad |
|---|---|---|---|
| RF001 | Orquestación de módulos en tiempo de ejecución | El Core Orquestador registra, resuelve y ejecuta módulos en tiempo de ejecución mediante tratos estandarizados | 1 |
| RF002 | Definición de contratos de comunicación | El Core expone interfaces públicas que actúan como el único canal de comunicación entre módulos, evitando dependencias directas entre ellos | 1 |
| RF003 | Compilación independiente de módulos | Cada módulo del ecosistema se compila, prueba y empaqueta de forma aislada, sin requerir el código fuente de los demás módulos del sistema | 1 |
| RF004 | Distribución de módulos vía repositorio remoto | El framework publica y consume los módulos como artefactos versionados a través de GitHub Packages, soportando AAR para Android y framework para iOS | 1 |
| RF005 | Integración plug-and-play de módulos | La aplicación host añade, reemplaza o retira módulos del sistema sin afectar el Core ni los módulos restantes, gracias a los contratos definidos en el núcleo | 1 |
| RF006 | Gestión del ciclo de vida de dependencias | El Core soporta distintos ciclos de vida para las instancias de los módulos registrados, basado en un runtime | 2 |
| RF007 | Encapsulación funcional de cada módulo | Cada módulo expone una API pública clara y predecible, manteniendo privados los detalles internos de persistencia, validaciones e integraciones externas | 1 |
| RF008 | Ejecución multiplataforma del Core | El Core ejecuta su lógica de orquestación tanto en aplicaciones Android como iOS a partir de un código base compartido construido sobre Kotlin Multiplatform | 1 |

### Requerimientos no funcionales

| Ref. | Requerimiento | Descripción | Prioridad |
|---|---|---|---|
| RNF001 | Rendimiento equivalente al desarrollo nativo | Las aplicaciones generadas con Leaf mantienen tiempos de arranque y latencia de interacción con una variación máxima del 10% respecto al desarrollo nativo puro en Swift y Kotlin | 1 |
| RNF002 | Consumo eficiente de recursos del dispositivo | El framework conserva el frame rate, la fluidez de animaciones y el consumo de batería sin presentar degradación perceptible para el usuario final | 1 |
| RNF003 | Mantenibilidad del código fuente | El Core y los módulos siguen convenciones de Clean Architecture que permiten a cualquier desarrollador del equipo leer, comprender y modificar el código sin curva de aprendizaje extensa | 1 |
| RNF004 | Documentación técnica integrada | Cada módulo y componente del Core incluye documentación inline y guías de uso publicadas junto al artefacto distribuido en el repositorio | 2 |
| RNF005 | Escalabilidad horizontal del ecosistema | El framework permite añadir nuevos módulos al ecosistema sin comprometer la estabilidad ni el rendimiento de los módulos previamente integrados | 1 |
| RNF006 | Versionado independiente de cada módulo | Cada módulo se versiona mediante semantic versioning de forma autónoma, permitiendo evolucionar los componentes del sistema a distinta velocidad | 2 |
| RNF007 | Portabilidad multiplataforma del código compartido | El framework comparte la lógica de negocio y la capa de presentación entre Android e iOS mediante Kotlin Multiplatform y Compose Multiplatform | 1 |
| RNF008 | Compatibilidad con binarios nativos | El sistema de compilación dual genera binarios nativos válidos para ambas plataformas objetivo, asegurando la integración correcta con los SDK oficiales de Android e iOS | 2 |

## 3.2 Descripción general del proyecto — Cronograma

| Fase | Actividad | Fecha inicio | Fecha fin |
|---|---|---|---|
| **1. Investigación y Análisis** | Análisis de mercado (Clutch + GoodFirms) | Feb 2026 | Feb 2026 |
| | Revisión del estado del arte | Feb 2026 | Mar 2026 |
| | FODA y validación de hipótesis | Mar 2026 | Mar 2026 |
| **2. Diseño Arquitectónico** | Diseño del Core Orquestador | Mar 2026 | May 2026 |
| | Definición de contratos entre módulos | Mar 2026 | May 2026 |
| | Diseño UI/UX en Figma | Abr 2026 | May 2026 |
| **3. Desarrollo del Prototipo** | Implementación del Core | May 2026 | Jun 2026 |
| | Módulo de Login y Autenticación | Jun 2026 | Jul 2026 |
| | Módulo de Catálogo | Jun 2026 | Ago 2026 |
| | Módulo de Email | Jul 2026 | Ago 2026 |
| | Módulo de Pagos (Stripe + Mercado Pago) | Jul 2026 | Sep 2026 |
| | App Host Android + iOS | Ago 2026 | Sep 2026 |
| **4. Validación y Documentación** | Recolección de métricas | Sep 2026 | Oct 2026 |
| | Pruebas integrales | Sep 2026 | Oct 2026 |
| | Redacción del reporte final | Sep 2026 | Oct 2026 |
| | Preparación de la presentación | Oct 2026 | Oct 2026 |

## 3.3 Diseño y experimentación — Metodología

**Elección de metodología.** El proyecto adopta una metodología híbrida que combina investigación aplicada con desarrollo iterativo de tipo Scrum-ágil adaptado. Esta combinación responde a la doble naturaleza del proyecto: por un lado requiere rigor investigativo (análisis de mercado, validación arquitectónica, métricas), y por otro lado requiere construcción incremental de software con entregas funcionales periódicas.

### Etapas o fases

- **Fase 1. Investigación y análisis (Feb – Mar 2026).** Análisis del mercado de desarrollo móvil en Guadalajara, revisión del estado del arte, definición de la arquitectura conceptual, análisis FODA y validación inicial de la hipótesis de mercado.
- **Fase 2. Diseño arquitectónico (Mar – Abr 2026).** Diseño detallado del Core Orquestador, definición de contratos entre módulos, especificación de la estructura de cada módulo funcional, diseño UI/UX en Figma y configuración del entorno de desarrollo multiplataforma.
- **Fase 3. Desarrollo del prototipo (Abr – Jul 2026).** Implementación iterativa del Core, desarrollo de los módulos funcionales (Login, Catálogo, Email, Pagos), configuración del sistema de publicación de artefactos, construcción de la App Host demostrativa.
- **Fase 4. Validación y documentación (Jul – Ago 2026).** Recolección de métricas, pruebas integrales en Android e iOS, redacción de la documentación final, preparación de la presentación de titulación y entrega del reporte.

### Distribución de responsabilidades del equipo

| Área | Responsable principal | Responsable de apoyo |
|---|---|---|
| Core Orquestador y arquitectura | Mario Razo | Moises Pulido |
| Módulos funcionales (Login, Catálogo, Email, Pagos) | Mario Razo | Moises Pulido |
| App Host y validación cross-platform | Moises Pulido | Mario Razo |
| Documentación y entregables académicos | Moises Pulido | Mario Razo |
| Análisis de mercado y FODA | Moises Pulido | Mario Razo |

### Métodos y herramientas por etapa

- **Fase 1**: análisis cuantitativo de datos de Clutch.co y GoodFirms (Python / Jupyter Notebook), análisis FODA, revisión bibliográfica.
- **Fase 2**: modelado arquitectónico (Figma para diagramas, Markdown para documentación), Gradle KMP para configuración inicial.
- **Fase 3**: Android Studio + IntelliJ IDEA para desarrollo, Xcode para builds iOS, Git/GitHub para control de versiones, GitHub Actions para CI/CD básico.
- **Fase 4**: scripts de medición de métricas (tamaño de binario, tiempos de compilación), herramientas de profiling de Android Studio y Xcode Instruments.

### Técnicas para alcanzar cada objetivo

Cada objetivo específico se aborda mediante: (1) revisión de literatura técnica oficial (JetBrains, Google, Apple), (2) prototipado iterativo con commits frecuentes y revisión por pares dentro del equipo, (3) validación continua mediante pruebas automatizadas, (4) documentación incremental conforme se desarrolla cada componente.

### Control del proyecto

- Tablero de tareas en GitHub Projects o Notion para seguimiento semanal.
- Reuniones de avance semanales entre los integrantes del equipo y reunión quincenal con el asesor metodológico.
- Control de versiones estricto en Git con ramas por funcionalidad y revisión cruzada antes de merge.
- Hitos formales alineados al cronograma para validación con el asesor técnico.

## 3.4 Pruebas del proyecto — Evaluación de resultados

La evaluación se realiza en dos planos:

**Plano de desarrollo**: se evalúa el cumplimiento de los entregables del EDT, la cobertura de pruebas (≥70%) y la conformidad con los requerimientos funcionales y no funcionales.

**Plano de hipótesis**: se mide cuantitativamente (a) el porcentaje de código compartido entre Android e iOS, (b) la diferencia de rendimiento respecto a una app nativa equivalente (≤10% de variación), (c) el tiempo de ensamblaje de un proyecto nuevo a partir de los módulos Leaf comparado con el tiempo estimado de desarrollo desde cero.
