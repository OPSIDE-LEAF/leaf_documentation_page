# Installation

This page covers the different ways to install and configure Leaf in your project.

## Global CLI installation

You can install the Leaf CLI globally to create projects from anywhere:

::: code-group

```bash [npm]
npm install -g @leaf/cli
```

```bash [pnpm]
pnpm add -g @leaf/cli
```

:::

Once installed, verify the installation:

```bash
leaf --version
```

## Manual installation

If you prefer to add Leaf to an existing project:

::: code-group

```bash [npm]
npm install @leaf/core
```

```bash [pnpm]
pnpm add @leaf/core
```

:::

## Configuration

Create a `leaf.config.ts` file at the root of your project:

```typescript
import { defineConfig } from '@leaf/core'

export default defineConfig({
  // Development server port
  port: 3000,

  // Enable strict TypeScript mode
  strict: true,

  // Database configuration
  database: {
    driver: 'sqlite',
    filename: './data/app.db',
  },

  // Global middlewares
  middleware: ['cors', 'logger'],
})
```

## Environment variables

Leaf natively supports `.env` files:

```bash
# .env
APP_PORT=3000
APP_ENV=development
DB_CONNECTION=sqlite
DB_DATABASE=./data/app.db
SECRET_KEY=your-secret-key
```

Access variables in your code:

```typescript
import { env } from '@leaf/core'

const port = env('APP_PORT', 3000)
const secret = env('SECRET_KEY')
```

## Verify installation

Run the development server to confirm everything works:

```bash
leaf dev
```

You should see something like:

```
🌿 Leaf v1.0.0
   ➜ Local:   http://localhost:3000
   ➜ Network: http://192.168.1.100:3000
   ➜ Ready in 120ms
```

::: warning Note
Make sure you have Node.js 18+ installed. You can check your version with `node --version`.
:::

## Next step

Done! Now you can explore the [Getting Started](/en/guide/) guide to learn the basic concepts of the framework.
