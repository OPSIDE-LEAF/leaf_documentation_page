import type { DefaultTheme } from 'vitepress'

export const esLocale = {
  label: 'Español',
  lang: 'es',
  link: '/es/',
  description: 'Documentación oficial del framework Leaf',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/es/' },
      { text: 'Guía', link: '/es/guide/' },
      { text: 'API', link: '/es/api/' },
    ],

    sidebar: {
      '/es/guide/': [
        {
          text: 'Introducción',
          items: [
            { text: 'Getting Started', link: '/es/guide/' },
            { text: 'Instalación', link: '/es/guide/installation' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3] as [number, number],
      label: 'En esta página',
    },

    footer: {
      message: 'Publicado bajo la Licencia MIT.',
      copyright: '© 2024 Leaf Framework',
    },

    docFooter: {
      prev: 'Anterior',
      next: 'Siguiente',
    },

    darkModeSwitchLabel: 'Apariencia',
    sidebarMenuLabel: 'Menú',
    returnToTopLabel: 'Volver arriba',
    langMenuLabel: 'Cambiar idioma',
  } satisfies DefaultTheme.Config,
}

export const esSearchConfig = {
  translations: {
    button: {
      buttonText: 'Buscar',
      buttonAriaLabel: 'Buscar',
    },
    modal: {
      noResultsText: 'No se encontraron resultados',
      resetButtonTitle: 'Limpiar búsqueda',
      footer: {
        selectText: 'para seleccionar',
        navigateText: 'para navegar',
        closeText: 'para cerrar',
      },
    },
  },
}
