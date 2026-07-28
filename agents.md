# Agente: Desarrollador Frontend Experto en Documentación y DX

## Rol
Eres un Desarrollador Frontend Experto especializado en Documentación y DX (Developer Experience).

## Tarea
Tu tarea es inicializar y configurar el sitio de documentación para el framework "Leaf".

## Pasos a ejecutar

### 1. INICIALIZACIÓN
Configura un proyecto base utilizando VitePress (Vue).

### 2. TEMA Y LAYOUT
Asegura la configuración del diseño de tres columnas:
- Sidebar lateral (navegación de contexto)
- Contenido central (área de lectura)
- Tabla de contenidos derecha (TOC con scroll-spy)

### 3. ESTILOS
Sobrescribe el tema base. Configura las variables CSS para:
- **Color principal (Primary Color)** del framework Leaf (verde — ver comentarios `/* TODO: CAMBIAR COLOR LEAF */` en el código para personalizar)
- **Soporte nativo y sin destellos** para Modo Claro y Modo Oscuro
- **Tipografía principal** "Inter" y monoespaciada "JetBrains Mono"

### 4. COMPONENTES
Implementa una grilla (Grid) de componentes tipo "Card" en la página principal que replique la sección "Quickstart / Popular use cases" de la documentación de Kotlin.

### 5. BÚSQUEDA
Integra el plugin de búsqueda (búsqueda local de VitePress con MiniSearch), asegurando que el atajo `Cmd+K` abra el modal con estilos coherentes al tema.

### 6. COMPONENTES MDX
Asegura que los bloques de código tengan botón de "Copiar" y soporte nativo para bloques de pestañas (Tabs) dentro del texto.

### 7. INTERNACIONALIZACIÓN (i18n)
Soporte multilenguaje con archivos de configuración separados por idioma.

---

## Referencia de Diseño

El diseño está inspirado en la documentación oficial de Kotlin Multiplatform (KMP). Consulta `implementation_plan.md` para los detalles técnicos completos de la implementación.

## Notas Importantes
- El color principal es un verde placeholder. Busca los comentarios `/* TODO: CAMBIAR COLOR LEAF */` para actualizarlo.
- VitePress ya incluye botón de copiar en bloques de código de forma nativa.
- VitePress ya incluye búsqueda local con Cmd+K de forma nativa.
- El layout de 3 columnas es el comportamiento por defecto de VitePress con sidebar y outline habilitados.

---

## Arquitectura de Internacionalización (i18n)

### Estrategia
Se usa la funcionalidad nativa de `locales` de VitePress con archivos de configuración separados por idioma en `docs/.vitepress/languages/`.

### Estructura de archivos

```
docs/
├── .vitepress/
│   ├── config.mts                  # Config principal — importa locales
│   ├── languages/                  # Configuraciones por idioma
│   │   ├── index.ts                # Barrel export
│   │   ├── es.ts                   # Locale español
│   │   └── en.ts                   # Locale inglés
│   └── theme/
│       ├── index.ts
│       ├── style.css
│       └── components/
├── es/                             # Contenido en español → /es/
│   ├── index.md
│   └── guide/
│       ├── index.md
│       └── installation.md
├── en/                             # Contenido en inglés → /en/
│   ├── index.md
│   └── guide/
│       ├── index.md
│       └── installation.md
├── index.md                        # Redirección raíz → /es/
└── public/
```

### Cómo agregar un nuevo idioma

1. **Crear archivo de configuración**: Crear `docs/.vitepress/languages/{lang}.ts` con la estructura de `nav`, `sidebar`, `outline`, `footer`, `docFooter` y traducciones de UI.
2. **Exportar en barrel**: Agregar el export en `docs/.vitepress/languages/index.ts`.
3. **Registrar en config**: Agregar el locale al objeto `locales` en `docs/.vitepress/config.mts` y su configuración de búsqueda en `themeConfig.search.options.locales`.
4. **Crear contenido**: Crear la carpeta `docs/{lang}/` con los archivos `.md` traducidos.

### Ejemplo de archivo de idioma (`languages/es.ts`)

Cada archivo exporta:
- `{lang}Locale` — Objeto con `label`, `lang`, `link`, `description` y `themeConfig` (nav, sidebar, outline, footer, docFooter, labels de UI).
- `{lang}SearchConfig` — Objeto con traducciones del modal de búsqueda.

### URLs resultantes
- Español: `/es/`, `/es/guide/`, `/es/guide/installation`
- Inglés: `/en/`, `/en/guide/`, `/en/guide/installation`
- Raíz (`/`): Redirige automáticamente a `/es/`

### Modo Oscuro
Las variables CSS de fondo (`--vp-c-bg`, `--vp-c-bg-alt`, `--vp-c-bg-elv`, `--vp-c-bg-soft`) están definidas tanto en `:root` (modo claro) como en `.dark` (modo oscuro) en `docs/.vitepress/theme/style.css`. La opción `appearance: true` está habilitada en la configuración.

---

## Botón "Copiar como Markdown"

### Descripción
Se implementó un botón global que permite copiar el contenido fuente (raw `.md`) de la página actual al portapapeles. Aparece como un toolbar alineado a la derecha, justo arriba del contenido principal del documento (slot `doc-before`).

### Arquitectura

#### Plugin de Vite (`docs/.vitepress/plugins/markdownRaw.ts`)
- Genera un **módulo virtual** (`virtual:markdown-raw`) que expone un mapa `Record<string, string>` con todas las páginas `.md` del proyecto.
- Las claves son las rutas relativas sin extensión (ej: `es/guide/installation`).
- Se invalida automáticamente en HMR cuando un archivo `.md` cambia.

#### Componente Vue (`docs/.vitepress/theme/components/CopyMarkdown.vue`)
- Usa `useRoute()` para determinar la página actual y buscar su contenido en el módulo virtual.
- Usa `useData()` para detectar el idioma activo (`lang`) y mostrar textos traducidos.
- Feedback visual: muestra "¡Copiado!" / "Copied!" durante 2 segundos tras copiar.
- Responsive: en móvil oculta el texto y solo muestra el icono.

#### Registro en el tema (`docs/.vitepress/theme/index.ts`)
- Se renderiza en el slot `'doc-before'` del layout de VitePress.

#### Declaración de tipos (`docs/.vitepress/env.d.ts`)
- Declara el módulo virtual `virtual:markdown-raw` para TypeScript.
- Declara módulos `*.vue` y `*.css`.

### Soporte i18n
El componente detecta el idioma activo y muestra:
- **Español** (`es`): "Copiar como Markdown" / "¡Copiado!"
- **Inglés** (`en`): "Copy as Markdown" / "Copied!"

Para agregar un nuevo idioma, añadir una condición en el `computed` `i18n` dentro del componente `CopyMarkdown.vue`.

### Configuración en `config.mts`
El plugin se registra en la sección `vite.plugins`:
```ts
import { markdownRawPlugin } from './plugins/markdownRaw'
import { fileURLToPath, URL } from 'node:url'

const docsDir = fileURLToPath(new URL('../', import.meta.url))

export default defineConfig({
  vite: {
    plugins: [markdownRawPlugin(docsDir)],
  },
  // ...
})
```

---

## Estrategia para Agregar Más Documentación

### Resumen
Para agregar nuevas páginas o secciones de documentación al sitio, se deben seguir **3 pasos obligatorios**: crear el archivo `.md`, registrarlo en el sidebar del idioma correspondiente, y replicar la estructura en todos los idiomas soportados.

---

### Paso 1: Crear el archivo Markdown

Crear el archivo `.md` dentro de la carpeta del idioma correspondiente, siguiendo la convención de rutas existente.

**Convención de rutas:**
```
docs/{lang}/{sección}/{página}.md
```

**Ejemplo** — Agregar una página "Routing" a la guía en español:
```
docs/es/guide/routing.md
```

**Plantilla base para una página nueva:**
```markdown
# Título de la Página

Descripción introductoria breve del contenido.

## Sección principal

Contenido con explicaciones claras.

### Subsección

Detalles adicionales.

::: tip
Consejos útiles para el desarrollador.
:::

::: warning Nota
Advertencias importantes.
:::

## Ejemplo de código

::: code-group

```bash [npm]
npm run ejemplo
```

```bash [pnpm]
pnpm run ejemplo
```

:::

## Siguiente paso

Enlace a la siguiente página lógica: [Siguiente tema](/es/guide/siguiente-tema)
```

---

### Paso 2: Registrar en el Sidebar

Agregar la entrada de la nueva página en el archivo de configuración del idioma correspondiente en `docs/.vitepress/languages/{lang}.ts`.

**Ejemplo** — Agregar "Routing" al sidebar en español (`languages/es.ts`):

```ts
sidebar: {
  '/es/guide/': [
    {
      text: 'Introducción',
      items: [
        { text: 'Getting Started', link: '/es/guide/' },
        { text: 'Instalación', link: '/es/guide/installation' },
      ],
    },
    // ✅ NUEVO GRUPO O NUEVA ENTRADA
    {
      text: 'Fundamentos',
      items: [
        { text: 'Routing', link: '/es/guide/routing' },
        { text: 'Middlewares', link: '/es/guide/middlewares' },
      ],
    },
  ],
},
```

**Reglas del sidebar:**
- Cada grupo (`text` + `items`) representa una sección colapsable en la navegación lateral.
- Los `link` deben coincidir exactamente con la ruta del archivo sin extensión `.md`.
- El orden de los items define el orden de navegación y los botones "Anterior" / "Siguiente".

---

### Paso 3: Replicar en todos los idiomas

Cada página debe existir en **todos los idiomas soportados**. Repetir los pasos 1 y 2 para cada idioma.

| Idioma   | Archivo de contenido          | Archivo de configuración         |
|----------|-------------------------------|----------------------------------|
| Español  | `docs/es/guide/routing.md`    | `docs/.vitepress/languages/es.ts` |
| Inglés   | `docs/en/guide/routing.md`    | `docs/.vitepress/languages/en.ts` |

---

### Agregar una nueva sección completa (no solo una página)

Si necesitas crear una sección completamente nueva (ej: `api/`, `advanced/`, `plugins/`):

1. **Crear la carpeta** en cada idioma:
   ```
   docs/es/api/
   docs/en/api/
   ```

2. **Crear un `index.md`** dentro de cada carpeta (página de entrada de la sección):
   ```
   docs/es/api/index.md
   docs/en/api/index.md
   ```

3. **Agregar un nuevo bloque de sidebar** en cada archivo de idioma:
   ```ts
   sidebar: {
     '/es/guide/': [ /* ... */ ],
     // ✅ NUEVA SECCIÓN
     '/es/api/': [
       {
         text: 'Referencia API',
         items: [
           { text: 'Visión general', link: '/es/api/' },
           { text: 'Configuración', link: '/es/api/configuration' },
           { text: 'Router', link: '/es/api/router' },
         ],
       },
     ],
   },
   ```

4. **Actualizar la navegación superior (`nav`)** si la sección debe aparecer en el menú principal:
   ```ts
   nav: [
     { text: 'Inicio', link: '/es/' },
     { text: 'Guía', link: '/es/guide/' },
     { text: 'API', link: '/es/api/' },  // ← Ya existe, verificar que el link sea correcto
   ],
   ```

5. **(Opcional) Actualizar la home page** — Si la nueva sección debe aparecer en las cards de "Inicio rápido", editar el array `quickstartItems` en `docs/{lang}/index.md` y actualizar el `link` correspondiente.

---

### Checklist rápido para agregar documentación

```
- [ ] Crear archivo .md en docs/{lang}/{sección}/{página}.md
- [ ] Agregar entrada en sidebar de docs/.vitepress/languages/{lang}.ts
- [ ] Repetir para TODOS los idiomas soportados (es, en)
- [ ] (Si es sección nueva) Crear carpeta + index.md en cada idioma
- [ ] (Si es sección nueva) Agregar bloque de sidebar nuevo en cada idioma
- [ ] (Si es sección nueva) Verificar/actualizar nav en cada idioma
- [ ] (Opcional) Actualizar cards de quickstart en la home page
- [ ] Verificar que los links internos entre páginas sean correctos
- [ ] Ejecutar `npm run docs:dev` y validar navegación y renderizado
```

---

### Buenas prácticas de contenido

| Práctica | Descripción |
|----------|-------------|
| **Frontmatter mínimo** | Solo usar frontmatter cuando sea necesario (ej: `layout: home` para la página principal). Las páginas normales no lo requieren. |
| **Headings jerárquicos** | Usar `#` para el título principal (uno solo por página), `##` para secciones, `###` para subsecciones. El TOC derecho muestra niveles 2 y 3. |
| **Code groups** | Usar `::: code-group` para mostrar alternativas (npm/pnpm/yarn). |
| **Containers** | Usar `:::tip`, `:::warning`, `:::danger`, `:::info` para callouts. |
| **Links internos** | Siempre usar rutas absolutas con el prefijo del idioma: `/es/guide/routing` (sin `.md`). |
| **Imágenes** | Colocar en `docs/public/images/` y referenciar como `/images/nombre.png`. |
| **Consistencia entre idiomas** | Mantener la misma estructura de headings y secciones en todos los idiomas, solo traducir el contenido. |
