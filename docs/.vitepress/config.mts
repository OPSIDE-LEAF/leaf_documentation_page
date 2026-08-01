import { defineConfig } from 'vitepress'
import { esLocale, esSearchConfig, enLocale, enSearchConfig } from './languages'
import { markdownRawPlugin } from './plugins/markdownRaw'
import { fileURLToPath, URL } from 'node:url'

const docsDir = fileURLToPath(new URL('../', import.meta.url))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [markdownRawPlugin(docsDir)],
  },
  title: 'Leaf',
  description: 'Documentación oficial del framework Leaf',
  appearance: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
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
    logo: '/logo-mark.png',
    siteTitle: 'Leaf',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leaf-framework' },
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
