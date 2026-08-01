/// <reference types="vitepress/client" />

/** Versión de Leaf inyectada en build time (ver leaf-version.ts) */
declare const __LEAF_VERSION__: string

declare module 'virtual:markdown-raw' {
  const pages: Record<string, string>
  export default pages
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css' {}
