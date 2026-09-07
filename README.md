# 🌿 Leaf Documentation Page

Official documentation site for the **Leaf** framework, built with [VitePress](https://vitepress.dev/) (Vue 3).

> Design inspired by the official Kotlin Multiplatform (KMP) documentation.

## ✨ Features

- 📐 **3-Column Layout** — Navigation sidebar, central content area, and table of contents (TOC) with scroll-spy
- 🌗 **Light / Dark Mode** — Native support with no flash on load
- 🌍 **Internationalization (i18n)** — Multi-language support (Spanish & English) with separate config files
- 🔍 **Local Search** — Powered by MiniSearch, accessible via `Cmd+K` / `Ctrl+K`
- 📋 **Copy as Markdown** — Global button to copy the raw `.md` source of any page
- 🎨 **Custom Theme** — Inter + JetBrains Mono typography, green primary color (Leaf)
- 🧩 **Reusable Components** — Cards and CardGrid for quickstart sections
- 📝 **Enhanced Code Blocks** — Native copy button and code-group (tabs) support

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/OPSIDE-LEAF/leaf_documentation_page.git
cd leaf_documentation_page

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot-reload
npm run docs:dev
```

The site will be available at `http://localhost:5173`.

### Production Build

```bash
# Generate static site
npm run docs:build

# Preview the production build
npm run docs:preview
```

## 📁 Project Structure

```
docs/
├── .vitepress/
│   ├── config.mts              # Main VitePress configuration
│   ├── env.d.ts                # TypeScript type declarations
│   ├── languages/              # Language configurations (i18n)
│   │   ├── index.ts            # Barrel export
│   │   ├── es.ts              # Spanish locale
│   │   └── en.ts              # English locale
│   ├── plugins/
│   │   └── markdownRaw.ts     # Vite plugin for Markdown virtual module
│   ├── scripts/                # Source and bilingual documentation checks
│   │   ├── check-api-surface.mjs
│   │   ├── check-kotlin-snippets.mjs
│   │   └── check-parity.mjs
│   ├── kotlin-snippets/        # Android fixture that compiles documented examples
│   └── theme/
│       ├── index.ts           # Custom theme registration
│       ├── style.css          # CSS variables and global styles
│       └── components/
│           ├── Card.vue       # Individual card component
│           ├── CardGrid.vue   # Card grid (quickstart)
│           ├── CopyMarkdown.vue # Copy as Markdown button
│           └── LanguageLink.vue # Valid counterpart-language link
├── es/                         # Spanish content → /es/
│   ├── index.md
│   └── guide/
│       ├── index.md
│       └── installation.md
├── en/                         # English content → /en/
│   ├── index.md
│   └── guide/
│       ├── index.md
│       └── installation.md
├── index.md                    # Root redirect → /es/
└── public/
    └── favicon.ico
```

## 🌍 Internationalization

The site supports multiple languages using VitePress' native `locales` feature.

| Language | Base URL | Configuration File |
|----------|----------|-------------------|
| Spanish  | `/es/`   | `docs/.vitepress/languages/es.ts` |
| English  | `/en/`   | `docs/.vitepress/languages/en.ts` |

The root (`/`) automatically redirects to `/es/`.
The language link follows the matching page even when Spanish and English use different slugs.

### Adding a New Language

1. Create `docs/.vitepress/languages/{lang}.ts` with nav, sidebar, and translations
2. Export it in `docs/.vitepress/languages/index.ts`
3. Register in `docs/.vitepress/config.mts` (locales + search)
4. Create `docs/{lang}/` folder with translated `.md` files

## 📄 Adding Documentation

Public content must explain LEAF in terms that work for any project or organization. Do not include
personal filesystem paths, private repository layouts, or organization-specific build, release, and
distribution rules. Maven Local may be documented only as an optional way to test an artifact.
Keep Spanish and English pages conceptually equivalent.

Run the public documentation checks from the repository root:

```powershell
node docs/.vitepress/scripts/check-parity.mjs
node docs/.vitepress/scripts/check-kotlin-snippets.mjs
```

The `compiled` Kotlin examples are kept in `docs/.vitepress/kotlin-snippets/` and
checked against the Markdown. API excerpts marked `reference` are signatures or
focused extracts and are not presented as standalone applications.

### New Page

1. Create the `.md` file at `docs/{lang}/{section}/{page}.md`
2. Register it in the sidebar of `docs/.vitepress/languages/{lang}.ts`
3. Replicate for all supported languages

### New Section

1. Create folder `docs/{lang}/{section}/` with an `index.md`
2. Add a sidebar block in each language file
3. Update the top navigation (`nav`) if applicable

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [VitePress](https://vitepress.dev/) | ^1.6.0 | Static site generator |
| [Vue 3](https://vuejs.org/) | ^3.5.0 | Component framework |
| [TypeScript](https://www.typescriptlang.org/) | — | Static typing |
| [Inter](https://rsms.me/inter/) | — | Main typography |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | — | Monospace typography |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run docs:dev` | Start the development server |
| `npm run docs:build` | Generate the static site for production |
| `npm run docs:preview` | Preview the production build |
| `node docs/.vitepress/scripts/check-parity.mjs` | Check bilingual page, route, link, and rendered-page parity |
| `node docs/.vitepress/scripts/check-kotlin-snippets.mjs` | Check documented Kotlin examples against their compilable fixture |

## 🤝 Contributing

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-section`)
3. Make your changes following the [documentation guide](#-adding-documentation)
4. Commit your changes (`git commit -m 'docs: add new section'`)
5. Push to the branch (`git push origin feature/new-section`)
6. Open a Pull Request

## 📝 License

This project is owned by [OPSIDE-LEAF](https://github.com/OPSIDE-LEAF).
