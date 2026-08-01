# Registro de cambios — Sitio de documentación Leaf

> Sesión del 2026-07-31. Adaptación de marca + generación completa del contenido en español.

## 1. Identidad visual (branding Leaf)

### Assets creados en `docs/public/`

| Archivo | Origen | Uso |
|---|---|---|
| `logo-mark.png` | Recorte de las dos hojas (sin texto) desde `LOGO_FONDO_BLANCO.png` | Logo del navbar y hero del homepage |
| `logo-full-light.png` | Copia de `LOGO_FONDO_BLANCO.png` | Lockup completo para fondos claros (uso futuro) |
| `logo-full-dark.png` | Copia de `LOGO_FONDO_NEGRO.png` | Lockup completo para fondos oscuros (uso futuro) |
| `favicon.ico` | Regenerado desde `logo-mark.png` | Favicon multi-tamaño (16/32/48 px) |

### Paleta aplicada — `docs/.vitepress/theme/style.css` (reescrito)

Colores de marca definidos como tokens CSS:

- Verde: `#095637` → `#A0CB38` (gradiente hoja verde)
- Naranja: `#E33838` → `#ED7D31` (gradiente hoja naranja, muestreado del logo — la propuesta original decía `A0CB38` pero el logo real termina en naranja)

| Elemento | Modo claro | Modo oscuro |
|---|---|---|
| Links/primario (`--vp-c-brand-1`) | `#0B6B45` | `#A0CB38` (lima) |
| Hover (`--vp-c-brand-2`) | `#095637` | `#C3E26A` |
| Botón brand | Fondo `#095637`, texto blanco | Fondo `#A0CB38`, texto oscuro |
| Tinte suave (`brand-soft`) | Lima al 16% | Lima al 16% |
| Hero "Leaf" | Gradiente `#095637 → #A0CB38` | Gradiente `#A0CB38 → #C3E26A` |
| Glow tras el logo | Gradiente dual naranja→verde (eco de las dos hojas), blur 56px | Igual con verde medio |
| Custom block `tip` | Tinte lima | — |
| Custom block `warning` | Tinte `#ED7D31` al 14% | — |
| Custom block `danger` | Tinte `#E33838` al 14% | — |

Además: fondo alterno con matiz verde (`#F6F8F4`), logo del navbar a 28px.

### Config — `docs/.vitepress/config.mts`

- `themeConfig.logo`: `/logo.svg` (no existía) → `/logo-mark.png`

## 2. Contenido — 29 páginas nuevas/reescritas en `docs/es/`

Estructura fusionada de dos propuestas de topics, con separación explícita de audiencias:

- **Host** = quien usa Leaf para crear apps (consume core + módulos publicados)
- **Autor** = quien usa contracts/core/compose/visuals para crear módulos

### `/es/guide/` — Guía (21 páginas)

**Introducción**
| Página | Contenido |
|---|---|
| `index.md` (reescrito) | Qué es Leaf, problema que resuelve, propuesta de valor, público, comparativa vs nativo/híbridos |
| `arquitectura.md` | 5 principios, los 3 artefactos + diagrama, paradigma Module→Capability→Host, stack, organización de repos |
| `glosario.md` | 19 términos del ecosistema |

**Conceptos (compartidos)**
| Página | Contenido |
|---|---|
| `modules.md` | Contrato Module/ModuleInfo, anatomía, gateways como puertos, convenciones |
| `action-vs-feature.md` | Criterios de elección, transiciones stay/finish, firmas estables |
| `feature-session.md` | Semántica de sesión, cola acotada, send, resultado terminal, métricas |
| `errores-telemetria.md` | Dominio vs técnico, LeafException redactada, telemetría sin payload, reglas de privacidad |

**Guía del Host**
| Página | Contenido |
|---|---|
| `installation.md` (reescrito) | Prerrequisitos, credenciales duales (local.properties/CI), repos GitHub Packages, dependencias, mavenLocal |
| `quickstart-action.md` | Ejecutar una Action con Leaf.run (reencuadrado a perspectiva host) |
| `quickstart-feature.md` | Abrir una Feature con Leaf.open y rememberLeaf (reencuadrado a perspectiva host) |
| `compose-adapter.md` | rememberLeaf, LeafComposeState, clave (feature, input), anti-patrones |
| `host-integration.md` | Flujo completo: instalar módulo, implementar gateways, ejecutar, navegar, checklist |

**Guía del Autor**
| Página | Contenido |
|---|---|
| `module-setup.md` | Repositorio OPSIDE-LEAF, archivos del primer commit, Gradle completo (toml, settings, build), convenciones |
| `module-implementation.md` | Modelos de dominio, puertos, clase Module, UI opcional, reglas |
| `compose-route-screen.md` | Patrón Route (conector) + Screen (vista pura) |
| `module-testing.md` | 7 niveles de prueba, tests de transición y de sesión, fakes |
| `module-publishing.md` | ABI validation, clean consumer, validación completa, publicación por tag, checklist |

**Ecosistema**
| Página | Contenido |
|---|---|
| `catalogo.md` | Core (contracts/core/compose/visuals), módulos 2.x (login, pagos), legacy, repositorios |
| `login-reference.md` | Walkthrough completo del módulo de referencia + nota de seguridad sobre password en State |
| `legacy-migration.md` | Diferencias 1.x vs 2.x, módulos pendientes, estrategia de migración en 8 pasos, ejemplo didáctico |
| `roadmap.md` | Tren 2.0.1, en curso, LEAF 3 (namespace), advertencia del experimento Workflow |

### `/es/api/` — Referencia API (4 páginas)

| Página | Contenido |
|---|---|
| `index.md` | Tabla de artefactos y separación de responsabilidades |
| `contracts.md` | Module, ModuleInfo, Action, Feature, FeatureTransition, DSLs, constantes |
| `core.md` | Leaf.run, Leaf.open, FeatureSession, FeatureSendResult, FeatureSessionResult, fallos, métricas, LeafException, LeafTelemetry |
| `compose.md` | rememberLeaf, LeafComposeState |

### `/es/project/` — Sección académica (4 páginas, resumidas desde project.md)

| Página | Contenido |
|---|---|
| `index.md` | Justificación, planteamiento del problema, objetivos, hipótesis y supuestos, alcance + nota sobre la evolución de "Core Orquestador" (registry) a ruta local tipada 2.x |
| `estado-del-arte.md` | 10 antecedentes en tabla, la intersección única, teoría fundamental |
| `viabilidad.md` | Oportunidad, FODA, modelo de ingresos open core, inversión ($13,700) y operación anual ($6,572) |
| `metodologia.md` | Enfoque híbrido, 4 fases, requerimientos RF/RNF, control, evaluación (planos de desarrollo e hipótesis), equipo |

## 3. Navegación y homepage

### `docs/.vitepress/languages/es.ts` (reescrito)

- Nav: Inicio · Guía · API · **Proyecto** (nuevo)
- Sidebar de `/es/guide/` con 5 grupos: Introducción, Conceptos, **Guía del Host**, **Guía del Autor**, Ecosistema
- Sidebars nuevos para `/es/api/` y `/es/project/`
- Footer: licencia Apache 2.0, © 2026 OPSIDE LEAF (antes MIT/2024)

### `docs/es/index.md` (reescrito)

- Hero: logo de marca, tagline "Build. Grow. Repeat.", descripción real (KMP + Compose, capacidades tipadas)
- Acciones: Comenzar / Guía del Host / Guía del Autor
- Features reales (antes decían TypeScript/ORM): nativo real, módulos independientes, tipado extremo a extremo, Core que administra el riesgo
- Dos CardGrids separados por audiencia: "Para Hosts" y "Para Autores"

### `docs/index.md`

- Redirect raíz: `/en/` → `/es/` (el locale en/ queda como placeholder hasta la traducción)

## 4. Verificación

- `npm run docs:build` en verde (2.46s) — VitePress valida links internos muertos, todos resuelven.
- 29 HTML generados: 21 guide + 4 api + 4 project.
- Nota: el build desde el sandbox Linux de Claude requiere reinstalar node_modules (el binario nativo de rollup en el repo es de macOS); en Mac no afecta.

## 5. Ajustes posteriores

- **Features del homepage reorientados a negocio** (objetivos de project.md): Time-to-market más corto · Experiencia nativa sin sacrificios · Ensambla, no empieces de cero · Crece al ritmo de tu negocio.
- **Convención de terminología**: conceptos siempre en inglés dentro de la prosa en español — Host, Author, Capability, Port, Gateway, Module, Action, Feature. Aplicado en las 29 páginas, sidebar y homepage. Se preservó "capacidad" solo cuando refiere a la capacidad de la cola de eventos (`eventCapacity`).
- **Referencias a GitHub corregidas**: navbar y homepage en/ apuntan a `github.com/OPSIDE-LEAF`; catálogo con columna de repositorios; API y Login reference enlazan su repo.
- **Énfasis en tipado rebajado** en homepage y "¿Qué es Leaf?" (se mantiene como principio técnico en Arquitectura/Conceptos/API).
- **Roadmap**: sección Distribución (GitHub Packages hoy → servidor Maven propio con lectura anónima); Workflow reencuadrado como feature planeada de LEAF 3 (tercer tipo de capability), con warning mientras sea experimental.
- **Sección Proyecto reestructurada al formato del reporte** (solo contenido de project.md): Resumen/Abstract/Índice · Introducción y justificación · Cap. I Contextualización (problema, propuesta SÍ/NO, EDT, objetivos, hipótesis, viabilidad + hoja de ruta financiera) · Cap. II Marco teórico (estado del arte completo, teoría, tecnologías) · Cap. III Diseño y desarrollo (RF/RNF, cronograma, metodología, evaluación) · Cap. IV Resultados (pendiente — Fase 4) · Referencias APA + Anexos A y B únicamente.

## 6. Versión única del sitio

- **`docs/.vitepress/leaf-version.ts`** — única fuente de la versión del tren Leaf; se edita manualmente (`export const LEAF_VERSION = '2.0.1'`). Sin CI ni variables de entorno.
- Se propaga automáticamente a: badge del navbar (pill con gradiente lima→verde de la marca, vía `define` de Vite), 24 menciones en 11 páginas markdown (prosa, tablas y bloques de código Gradle) mediante el placeholder `%LEAF_VERSION%` reemplazado por markdown-it, índice de búsqueda local y botón "Copy markdown" (parche en `markdownRawPlugin`).
- Para páginas nuevas: escribir `%LEAF_VERSION%` donde vaya la versión del tren.
- `leaf-login:1.0.0` queda fija a propósito (versión independiente del módulo, no del tren).

## 7. Soporte de imágenes

### Dónde van

```
docs/public/images/
├── guide/      → capturas y diagramas de la Guía
├── api/        → diagramas de la Referencia API
└── project/    → EDT, cronograma, FODA, diagramas del reporte académico
```

Todo lo de `docs/public/` se sirve desde la raíz del sitio tal cual (sin procesamiento): optimizar peso antes de agregar (PNG/WebP para capturas, SVG para diagramas).

### Cómo se referencian

Markdown estándar (ruta absoluta, sin `public/`):

```md
![Diagrama de artefactos](/images/guide/artefactos.png)
```

Con pie de imagen — cursiva en la línea inmediata siguiente (sin línea en blanco):

```md
![EDT del proyecto](/images/project/edt.png)
*Figura 1. Estructura de Desglose del Trabajo.*
```

Variante light/dark — dos archivos, uno por tema:

```md
<img src="/images/guide/flujo-light.png" class="light-only" alt="Flujo de Feature">
<img src="/images/guide/flujo-dark.png" class="dark-only" alt="Flujo de Feature">
```

Sin marco (por defecto toda imagen lleva borde redondeado y marco sutil):

```md
<img src="/images/guide/badge.png" class="no-frame" alt="Badge">
```

### Estilo automático (style.css, sección "IMÁGENES EN CONTENIDO")

Borde redondeado 10px + marco con `--vp-c-divider`, centradas y responsivas, pie de imagen en gris pequeño, utilidades `light-only` / `dark-only` / `no-frame`.

### Lugares que ya esperan imagen

- `images/project/edt.png` → sección EDT del Capítulo I (hoy tiene aviso de "diagrama en el documento original")
- `images/project/cronograma.png` → Capítulo III, versión gráfica opcional además de la tabla

## Pendientes sugeridos

- [ ] Traducción del locale `en/` (a cargo de moises)
- [ ] Actualizar `en/index.md` y `en.ts` cuando exista la traducción
- [ ] Documentar leaf-visuals cuando salga de desarrollo inicial
- [ ] Subir `edt.png` y `cronograma.png` a `images/project/` cuando estén listos
