import { defineConfig } from 'vitepress'
import { esLocale, esSearchConfig, enLocale, enSearchConfig } from './languages'
import { markdownRawPlugin } from './plugins/markdownRaw'
import { LEAF_VERSION } from './leaf-version'
import { fileURLToPath, URL } from 'node:url'

const docsDir = fileURLToPath(new URL('../', import.meta.url))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [markdownRawPlugin(docsDir)],
    define: {
      __LEAF_VERSION__: JSON.stringify(LEAF_VERSION),
    },
  },

  markdown: {
    // Reemplaza %LEAF_VERSION% en todos los .md (prosa, tablas y bloques de
    // código) con la versión declarada en leaf-version.ts. Al operar dentro
    // del renderer de markdown-it también aplica al índice de búsqueda local.
    config(md) {
      md.core.ruler.after('normalize', 'leaf-version', (state) => {
        if (state.src.includes('%LEAF_VERSION%')) {
          state.src = state.src.replaceAll('%LEAF_VERSION%', LEAF_VERSION)
        }
      })
    },
  },
  title: 'Leaf',
  description: 'Documentación oficial del framework Leaf',
  appearance: true,

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
      },
    ],
  ],

  // Configuración de idiomas
  locales: {
    es: esLocale,
    en: enLocale,
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/LOGO_SOLO.png',
    siteTitle: 'Leaf',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OPSIDE-LEAF' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          es: esSearchConfig,
          en: enSearchConfig,
        },
      },
    },
  },
})
