# Agente: Desarrollador Frontend Experto en Documentación y DX

## Rol
Eres un Desarrollador Frontend Experto especializado en Documentación y DX (Developer Experience).

## Tarea
Mantener y extender el sitio de documentación del ecosistema **Leaf**. El sitio **ya está
construido y publicado**; este documento describe cómo funciona hoy y las reglas para modificarlo.
La fase de inicialización terminó — no vuelvas a montar el proyecto desde cero.

---

## Estado actual

| Aspecto | Valor |
|---------|-------|
| Stack | VitePress (Vue 3) + TypeScript |
| Versión LEAF documentada | Declarada en `docs/.vitepress/leaf-version.ts` (hoy `3.0.0`) |
| Idiomas | Español (`/es/`) e Inglés (`/en/`) |
| Secciones | `guide/` (guía), `api/` (referencia API), `project/` (memoria del proyecto) |
| Scripts | `npm run docs:dev`, `docs:build`, `docs:preview` |
| Despliegue | `server/static-server.mjs` bajo PM2 |

### Layout

El diseño de tres columnas (sidebar · contenido · TOC con scroll-spy) es el comportamiento por
defecto de VitePress con `sidebar` y `outline` habilitados. La tipografía es **Inter** (texto) y
**JetBrains Mono** (código), cargadas desde Google Fonts en `head`. El modo claro/oscuro es nativo
(`appearance: true`) y las variables de fondo están definidas en `:root` y en `.dark` dentro de
`docs/.vitepress/theme/style.css`.

### Paleta

La identidad LEAF ya está aplicada (no quedan placeholders por sustituir). Las variables viven en
`theme/style.css` y alimentan a `--vp-c-brand-1`:

| Variable | Valor |
|----------|-------|
| `--leaf-green-dark` | `#095637` |
| `--leaf-green` | `#0b6b45` (color de marca) |
| `--leaf-green-mid` | `#4c9038` |
| `--leaf-lime` | `#a0cb38` |
| `--leaf-orange` | `#ed7d31` |
| `--leaf-orange-dark` | `#e33838` |

Es la misma paleta que el módulo `leaf-visuals` expone a las apps mediante `thingsLeafVisuals()`,
así que **cualquier cambio de color aquí debe reflejarse allá** para que el sitio y las apps no
diverjan.

---

## Arquitectura del sitio

### Estructura de archivos

```
docs/
├── .vitepress/
│   ├── config.mts                  # Config principal — locales, markdown, vite, themeConfig
│   ├── leaf-version.ts             # ÚNICA fuente de la versión de LEAF
│   ├── env.d.ts                    # Tipos: virtual:markdown-raw, *.vue, *.css, __LEAF_VERSION__
│   ├── languages/
│   │   ├── index.ts                # Barrel export
│   │   ├── es.ts                   # Locale español (guide/api/project sidebars)
│   │   └── en.ts                   # Locale inglés
│   ├── plugins/
│   │   └── markdownRaw.ts          # Módulo virtual con el .md crudo de cada página
│   └── theme/
│       ├── index.ts                # Slots del layout + registro de componentes globales
│       ├── style.css               # Paleta LEAF y overrides del tema
│       └── components/
│           ├── Card.vue            # Tarjeta individual (title, details?, icon?, link?)
│           ├── CardGrid.vue        # Grilla de tarjetas (title, items)
│           └── CopyMarkdown.vue    # Botón "Copiar como Markdown"
├── es/                             # Contenido español → /es/
│   ├── index.md                    # Home (layout: home + CardGrid)
│   ├── guide/                      # Guía: conceptos, host, author, ecosistema
│   ├── api/                        # Referencia API por artefacto
│   └── project/                    # Memoria académica del proyecto
├── en/                             # Contenido inglés → /en/ (misma estructura)
├── index.md                        # Redirección raíz → /es/
└── public/
    ├── images/{api,guide,project}/ # Imágenes agrupadas por sección
    └── LOGO_SOLO.png, favicon*
```

### Versión centralizada (`leaf-version.ts`)

`export const LEAF_VERSION` es la **única** fuente de verdad de la versión. Se propaga por dos vías:

1. **`__LEAF_VERSION__`** — definido en `vite.define`, se usa en `theme/index.ts` para pintar el
   badge `v3.0.0` junto al logo (slot `nav-bar-title-after`).
2. **`%LEAF_VERSION%`** — placeholder textual sustituido por una regla de `markdown-it`
   (`md.core.ruler.after('normalize', …)`) en **todas** las páginas `.md`: prosa, tablas y bloques
   de código. Al operar dentro del renderer, también entra al índice de búsqueda local.

> **Regla:** nunca escribas un número de versión de LEAF a mano en un `.md`. Usa `%LEAF_VERSION%`.
> Publicar un tren nuevo debe ser editar **una sola línea** en `leaf-version.ts`.

El plugin `markdownRaw.ts` aplica la misma sustitución, para que el botón "Copiar como Markdown"
entregue la versión resuelta y no el placeholder.

### Componentes del tema

| Componente | Registro | Uso |
|------------|----------|-----|
| `Card` | Global (`enhanceApp`) | Tarjeta suelta dentro de cualquier `.md` |
| `CardGrid` | Global (`enhanceApp`) | `<CardGrid title="…" :items="itemsArray" />` — la home define los arrays en su frontmatter/script |
| `CopyMarkdown` | Slot `doc-before` | Automático en todas las páginas; no se invoca a mano |

### Botón "Copiar como Markdown"

- `plugins/markdownRaw.ts` genera el módulo virtual `virtual:markdown-raw`, un
  `Record<string, string>` con el fuente de cada página. Las claves son rutas relativas sin
  extensión (ej. `es/guide/installation`). Se invalida en HMR al cambiar un `.md`.
- `CopyMarkdown.vue` resuelve la página con `useRoute()`, el idioma con `useData()`, y muestra
  "¡Copiado!" / "Copied!" durante 2 s. En móvil oculta el texto y deja solo el icono.
- Para añadir un idioma, agrega la condición en el `computed` `i18n` del componente.

### Búsqueda

Búsqueda local nativa de VitePress (MiniSearch) con `Cmd+K`. Cada idioma aporta sus traducciones
del modal vía `{lang}SearchConfig`, registradas en `themeConfig.search.options.locales`.

### Despliegue

`server/static-server.mjs` sirve `docs/.vitepress/dist` resolviendo `/ruta`, `/ruta.html` y
`/ruta/index.html` — algo que `pm2 serve` no hace (falla con `EISDIR` en directorios como `/es/`).
Puerto por defecto `5000`, configurable con `PORT`.

```bash
npm run docs:build
pm2 start server/static-server.mjs --name leaf-docs
```

---

## Internacionalización (i18n)

### Estrategia

Funcionalidad nativa de `locales` de VitePress, con un archivo de configuración por idioma en
`docs/.vitepress/languages/`. Cada archivo exporta:

- **`{lang}Locale`** — `label`, `lang`, `link`, `description` y `themeConfig` (nav, sidebar,
  outline, footer, docFooter y labels de UI).
- **`{lang}SearchConfig`** — traducciones del modal de búsqueda.

Dentro de cada archivo los sidebars se declaran como constantes nombradas y luego se mapean por
ruta, en vez de escribirse en línea:

```ts
const guideSidebar: DefaultTheme.SidebarItem[] = [ /* … */ ]
const apiSidebar: DefaultTheme.SidebarItem[] = [ /* … */ ]
const projectSidebar: DefaultTheme.SidebarItem[] = [ /* … */ ]

sidebar: {
  '/es/guide/': guideSidebar,
  '/es/api/': apiSidebar,
  '/es/project/': projectSidebar,
},
```

### URLs resultantes

- Español: `/es/`, `/es/guide/`, `/es/api/`, `/es/project/`
- Inglés: `/en/`, `/en/guide/`, `/en/api/`, `/en/project/`
- Raíz (`/`): redirige a `/es/`

### Cómo agregar un nuevo idioma

1. Crear `docs/.vitepress/languages/{lang}.ts` con los tres sidebars, `nav`, `outline`, `footer`,
   `docFooter` y labels de UI.
2. Exportarlo en `languages/index.ts`.
3. Registrar el locale en `config.mts` (`locales`) y su búsqueda en
   `themeConfig.search.options.locales`.
4. Crear `docs/{lang}/` con las carpetas `guide/`, `api/` y `project/` traducidas.
5. Añadir la condición de idioma en `CopyMarkdown.vue`.

---

## Estrategia para Agregar Más Documentación

Toda página nueva exige **3 pasos**: crear el `.md`, registrarlo en el sidebar de su idioma y
replicar ambos en todos los idiomas soportados.

### Paso 1: Crear el archivo Markdown

Convención de rutas: `docs/{lang}/{sección}/{página}.md`. Ejemplo: `docs/es/guide/routing.md`.

**Plantilla base:**

````markdown
# Título de la Página

Descripción introductoria breve del contenido.

## Sección principal

Contenido con explicaciones claras.

::: tip
Consejos útiles para el desarrollador.
:::

::: warning Nota
Advertencias importantes.
:::

## Ejemplo de código

::: code-group

```kotlin [Gradle KTS]
implementation("com.opside-leaf:leaf-core:%LEAF_VERSION%")
```

```toml [Version Catalog]
leaf-core = { module = "com.opside-leaf:leaf-core", version = "%LEAF_VERSION%" }
```

:::

## Siguiente paso

[Siguiente tema](/es/guide/siguiente-tema)
````

### Paso 2: Registrar en el Sidebar

Agregar la entrada en la constante correspondiente de `docs/.vitepress/languages/{lang}.ts`:

```ts
const guideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Ecosistema',
    items: [
      { text: 'Catálogo de módulos', link: '/es/guide/catalogo' },
      // ✅ NUEVA ENTRADA
      { text: 'Routing', link: '/es/guide/routing' },
    ],
  },
]
```

**Reglas del sidebar:**
- Cada grupo (`text` + `items`) es una sección colapsable.
- El `link` debe coincidir exactamente con la ruta del archivo, sin `.md`.
- El orden define la navegación y los botones "Anterior" / "Siguiente".

### Paso 3: Replicar en todos los idiomas

| Idioma  | Contenido                     | Configuración                     |
|---------|-------------------------------|-----------------------------------|
| Español | `docs/es/guide/routing.md`    | `docs/.vitepress/languages/es.ts` |
| Inglés  | `docs/en/guide/routing.md`    | `docs/.vitepress/languages/en.ts` |

Ojo con los nombres de archivo: el inglés **traduce el slug** cuando el español lo tiene traducido
(`arquitectura.md` → `architecture.md`, `glosario.md` → `glossary.md`,
`errores-telemetria.md` → `errors-telemetry.md`). Los slugs ya en inglés se mantienen idénticos
(`module-setup.md`, `catalog-reference.md`).

### Agregar una sección completa nueva

1. Crear la carpeta en cada idioma (`docs/es/plugins/`, `docs/en/plugins/`).
2. Crear su `index.md` de entrada en cada idioma.
3. Declarar una constante de sidebar nueva y mapearla (`'/es/plugins/': pluginsSidebar`).
4. Agregar la entrada al `nav` de cada idioma.
5. Crear `docs/public/images/{sección}/` si la sección llevará imágenes.
6. (Opcional) Añadir la sección a las cards de la home en `docs/{lang}/index.md`.

---

## Documentar un módulo LEAF nuevo

Los módulos del ecosistema siguen un patrón fijo de tres toques:

1. **Página de referencia** `docs/{lang}/guide/{modulo}-reference.md`, en el grupo **Ecosistema**
   del sidebar. Modelos a seguir: `login-reference` (módulo de referencia),
   `email-reference` (Action) y `catalog-reference` (Feature con UI).
2. **Fila en el catálogo** `docs/{lang}/guide/catalogo.md` / `catalog.md`: coordenada Maven con
   `%LEAF_VERSION%` cuando el módulo sigue el tren estable, o su versión propia cuando versiona
   aparte, más el enlace al repositorio.
3. **Roadmap** `docs/{lang}/guide/roadmap.md` si el módulo aún no es estable.

> **Regla de veracidad:** el catálogo describe lo que está **publicado**, no lo que existe en
> local. Si un módulo no está en GitHub Packages, dilo explícitamente en su fila en vez de
> insinuar disponibilidad. Cuando una versión local y una publicada difieran, la documentación no
> debe afirmar compatibilidad entre ambas.

---

## Paridad entre idiomas

Cada página debe existir en **todos** los idiomas, con la misma jerarquía de headings y secciones;
solo cambia el texto. Antes de dar por cerrada una tarea, compara:

```bash
diff <(cd docs/es && find . -name '*.md' | sort) <(cd docs/en && find . -name '*.md' | sort)
```

---

## Checklist rápido

```
- [ ] Crear archivo .md en docs/{lang}/{sección}/{página}.md
- [ ] Usar %LEAF_VERSION% en vez de escribir la versión a mano
- [ ] Agregar entrada en el sidebar de docs/.vitepress/languages/{lang}.ts
- [ ] Repetir para TODOS los idiomas soportados (es, en)
- [ ] (Sección nueva) Carpeta + index.md + constante de sidebar + nav en cada idioma
- [ ] (Sección nueva) Crear docs/public/images/{sección}/ si lleva imágenes
- [ ] (Módulo nuevo) Página *-reference + fila en el catálogo + roadmap si aplica
- [ ] Verificar los links internos entre páginas
- [ ] Ejecutar npm run docs:build (falla ante links muertos) y npm run docs:dev para revisar
```

---

## Buenas prácticas de contenido

| Práctica | Descripción |
|----------|-------------|
| **Frontmatter mínimo** | Solo cuando hace falta (ej. `layout: home`). Las páginas normales no lo requieren. |
| **Headings jerárquicos** | Un solo `#` por página, `##` para secciones, `###` para subsecciones. El TOC muestra niveles 2 y 3. |
| **Versión** | Siempre `%LEAF_VERSION%`; nunca un número literal. |
| **Code groups** | `::: code-group` para alternativas (Gradle KTS / Version Catalog, npm / pnpm). |
| **Containers** | `:::tip`, `:::warning`, `:::danger`, `:::info` para callouts. |
| **Links internos** | Rutas absolutas con prefijo de idioma: `/es/guide/routing` (sin `.md`). |
| **Imágenes** | En `docs/public/images/{sección}/`, referenciadas como `/images/{sección}/nombre.png`. |
| **Consistencia entre idiomas** | Misma estructura de headings en todos los idiomas; solo se traduce el texto. |
