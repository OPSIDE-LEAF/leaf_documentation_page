# Getting Started

Bienvenido a la documentación de **Leaf**. Esta guía te ayudará a comenzar con el framework en pocos minutos.

## ¿Qué es Leaf?

Leaf es un framework moderno y ligero diseñado para construir aplicaciones web rápidas y escalables. Ofrece una experiencia de desarrollo excepcional con soporte nativo de TypeScript.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior
- **npm** o **pnpm** como gestor de paquetes

## Crear un proyecto

La forma más rápida de iniciar un proyecto Leaf es usando la CLI:

::: code-group

```bash [npm]
npm create leaf@latest mi-proyecto
cd mi-proyecto
npm install
npm run dev
```

```bash [pnpm]
pnpm create leaf@latest mi-proyecto
cd mi-proyecto
pnpm install
pnpm run dev
```

:::

## Estructura del proyecto

Una vez creado, tu proyecto tendrá la siguiente estructura:

```
mi-proyecto/
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

## Siguiente paso

Consulta la guía de [Instalación](/es/guide/installation) para más detalles sobre la configuración del entorno.

::: tip
Leaf detecta automáticamente tu entorno y aplica las optimizaciones adecuadas para desarrollo y producción.
:::
