# 🌿 Leaf Documentation Page

Sitio de documentación oficial del framework **Leaf**, construido con [VitePress](https://vitepress.dev/) (Vue 3).

> Diseño inspirado en la documentación oficial de Kotlin Multiplatform (KMP).

## ✨ Características

- 📐 **Layout de 3 columnas** — Sidebar de navegación, contenido central y tabla de contenidos (TOC) con scroll-spy
- 🌗 **Modo Claro / Oscuro** — Soporte nativo sin destellos (flash)
- 🌍 **Internacionalización (i18n)** — Soporte multilenguaje (Español e Inglés) con archivos de configuración separados
- 🔍 **Búsqueda local** — Integrada con MiniSearch, accesible con `Cmd+K` / `Ctrl+K`
- 📋 **Copiar como Markdown** — Botón global para copiar el contenido fuente `.md` de cualquier página
- 🎨 **Tema personalizado** — Tipografía Inter + JetBrains Mono, color primario verde (Leaf)
- 🧩 **Componentes reutilizables** — Cards y CardGrid para secciones de inicio rápido
- 📝 **Bloques de código mejorados** — Botón de copiar nativo y soporte para code-groups (tabs)

## 🚀 Inicio rápido

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/OPSIDE-LEAF/leaf_documentation_page.git
cd leaf_documentation_page

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo con hot-reload
npm run docs:dev
```

El sitio estará disponible en `http://localhost:5173`.

### Build de producción

```bash
# Generar sitio estático
npm run docs:build

# Previsualizar el build
npm run docs:preview
```

## 📁 Estructura del proyecto

```
docs/
├── .vitepress/
│   ├── config.mts              # Configuración principal de VitePress
│   ├── env.d.ts                # Declaraciones de tipos TypeScript
│   ├── languages/              # Configuraciones de idiomas (i18n)
│   │   ├── index.ts            # Barrel export
│   │   ├── es.ts              # Locale español
│   │   └── en.ts              # Locale inglés
│   ├── plugins/
│   │   └── markdownRaw.ts     # Plugin Vite para módulo virtual de Markdown
│   └── theme/
│       ├── index.ts           # Registro del tema personalizado
│       ├── style.css          # Variables CSS y estilos globales
│       └── components/
│           ├── Card.vue       # Componente de tarjeta individual
│           ├── CardGrid.vue   # Grilla de tarjetas (quickstart)
│           └── CopyMarkdown.vue # Botón copiar como Markdown
├── es/                         # Contenido en español → /es/
│   ├── index.md
│   └── guide/
│       ├── index.md
│       └── installation.md
├── en/                         # Contenido en inglés → /en/
│   ├── index.md
│   └── guide/
│       ├── index.md
│       └── installation.md
├── index.md                    # Redirección raíz → /es/
└── public/
    └── favicon.ico
```

## 🌍 Internacionalización

El sitio soporta múltiples idiomas usando la funcionalidad nativa de `locales` de VitePress.

| Idioma   | URL base | Archivo de configuración |
|----------|----------|--------------------------|
| Español  | `/es/`   | `docs/.vitepress/languages/es.ts` |
| Inglés   | `/en/`   | `docs/.vitepress/languages/en.ts` |

La raíz (`/`) redirige automáticamente a `/es/`.

### Agregar un nuevo idioma

1. Crear `docs/.vitepress/languages/{lang}.ts` con nav, sidebar y traducciones
2. Exportar en `docs/.vitepress/languages/index.ts`
3. Registrar en `docs/.vitepress/config.mts` (locales + search)
4. Crear carpeta `docs/{lang}/` con los archivos `.md` traducidos

## 📄 Agregar documentación

### Nueva página

1. Crear el archivo `.md` en `docs/{lang}/{sección}/{página}.md`
2. Registrar en el sidebar del idioma en `docs/.vitepress/languages/{lang}.ts`
3. Replicar en todos los idiomas soportados

### Nueva sección

1. Crear carpeta `docs/{lang}/{sección}/` con un `index.md`
2. Agregar bloque de sidebar en cada archivo de idioma
3. Actualizar la navegación superior (`nav`) si corresponde

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [VitePress](https://vitepress.dev/) | ^1.6.0 | Generador de sitios estáticos |
| [Vue 3](https://vuejs.org/) | ^3.5.0 | Framework de componentes |
| [TypeScript](https://www.typescriptlang.org/) | — | Tipado estático |
| [Inter](https://rsms.me/inter/) | — | Tipografía principal |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | — | Tipografía monoespaciada |

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run docs:dev` | Inicia el servidor de desarrollo |
| `npm run docs:build` | Genera el sitio estático para producción |
| `npm run docs:preview` | Previsualiza el build de producción |

## 🤝 Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-seccion`)
3. Realiza tus cambios siguiendo la [guía de documentación](#-agregar-documentación)
4. Haz commit de tus cambios (`git commit -m 'docs: agregar nueva sección'`)
5. Push a la rama (`git push origin feature/nueva-seccion`)
6. Abre un Pull Request

## 📝 Licencia

Este proyecto es propiedad de [OPSIDE-LEAF](https://github.com/OPSIDE-LEAF).
