# Getting Started

Welcome to the **Leaf** documentation. This guide will help you get started with the framework in just a few minutes.

## What is Leaf?

Leaf is a modern and lightweight framework designed to build fast and scalable web applications. It offers an exceptional developer experience with native TypeScript support.

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** version 18 or higher
- **npm** or **pnpm** as your package manager

## Create a project

The fastest way to start a Leaf project is using the CLI:

::: code-group

```bash [npm]
npm create leaf@latest my-project
cd my-project
npm install
npm run dev
```

```bash [pnpm]
pnpm create leaf@latest my-project
cd my-project
pnpm install
pnpm run dev
```

:::

## Project structure

Once created, your project will have the following structure:

```
my-project/
├── src/
│   ├── routes/
│   │   └── index.ts
│   ├── middleware/
│   ├── models/
│   └── app.ts
├── public/
├── package.json
└── leaf.config.ts
```

## Next step

Check the [Installation](/en/guide/installation) guide for more details on environment setup.

::: tip
Leaf automatically detects your environment and applies the appropriate optimizations for development and production.
:::
