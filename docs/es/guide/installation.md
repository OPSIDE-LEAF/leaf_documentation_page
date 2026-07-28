# Instalación

Esta página cubre las diferentes formas de instalar y configurar Leaf en tu proyecto.

## Instalación global de la CLI

Puedes instalar la CLI de Leaf de forma global para crear proyectos desde cualquier lugar:

::: code-group

```bash [npm]
npm install -g @leaf/cli
```

```bash [pnpm]
pnpm add -g @leaf/cli
```

:::

Una vez instalada, verifica la instalación:

```bash
leaf --version
```

## Instalación manual

Si prefieres agregar Leaf a un proyecto existente:

::: code-group

```bash [npm]
npm install @leaf/core
```

```bash [pnpm]
pnpm add @leaf/core
```

:::

## Configuración

Crea un archivo `leaf.config.ts` en la raíz de tu proyecto:

```typescript
import { defineConfig } from '@leaf/core'

export default defineConfig({
  // Puerto del servidor de desarrollo
  port: 3000,

  // Habilitar modo estricto de TypeScript
  strict: true,

  // Configuración de base de datos
  database: {
    driver: 'sqlite',
    filename: './data/app.db',
  },

  // Middlewares globales
  middleware: ['cors', 'logger'],
})
```

## Variables de entorno

Leaf soporta archivos `.env` de forma nativa:

```bash
# .env
APP_PORT=3000
APP_ENV=development
DB_CONNECTION=sqlite
DB_DATABASE=./data/app.db
SECRET_KEY=tu-clave-secreta
```

Accede a las variables en tu código:

```typescript
import { env } from '@leaf/core'

const port = env('APP_PORT', 3000)
const secret = env('SECRET_KEY')
```

## Verificar la instalación

Ejecuta el servidor de desarrollo para confirmar que todo funciona:

```bash
leaf dev
```

Deberías ver algo como:

```
🌿 Leaf v1.0.0
   ➜ Local:   http://localhost:3000
   ➜ Network: http://192.168.1.100:3000
   ➜ Ready in 120ms
```

::: warning Nota
Asegúrate de tener Node.js 18+ instalado. Puedes verificar tu versión con `node --version`.
:::

## Siguiente paso

¡Listo! Ahora puedes explorar la guía de [Getting Started](/es/guide/) para aprender los conceptos básicos del framework.
