/// <reference types="vitepress/client" />

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
