import type { DefaultTheme } from 'vitepress'

const guideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introducción',
    collapsed: false,
    items: [
      { text: '¿Qué es Leaf?', link: '/es/guide/' },
      { text: 'Arquitectura y principios', link: '/es/guide/arquitectura' },
      { text: 'Glosario', link: '/es/guide/glosario' },
    ],
  },
  {
    text: 'Conceptos',
    collapsed: false,
    items: [
      { text: 'Module y ModuleInfo', link: '/es/guide/modules' },
      { text: 'Action vs Feature', link: '/es/guide/action-vs-feature' },
      { text: 'FeatureSession', link: '/es/guide/feature-session' },
      { text: 'Errores, telemetría y privacidad', link: '/es/guide/errores-telemetria' },
    ],
  },
  {
    text: 'Guía del Host — crear apps',
    collapsed: false,
    items: [
      { text: 'Instalación', link: '/es/guide/installation' },
      { text: 'Ejecutar una Action', link: '/es/guide/quickstart-action' },
      { text: 'Abrir una Feature', link: '/es/guide/quickstart-feature' },
      { text: 'Compose: rememberLeaf', link: '/es/guide/compose-adapter' },
      { text: 'Integrar módulos publicados', link: '/es/guide/host-integration' },
    ],
  },
  {
    text: 'Guía del Author — crear módulos',
    collapsed: false,
    items: [
      { text: 'Setup del repositorio', link: '/es/guide/module-setup' },
      { text: 'Implementación', link: '/es/guide/module-implementation' },
      { text: 'UI: patrón Route + Screen', link: '/es/guide/compose-route-screen' },
      { text: 'Testing', link: '/es/guide/module-testing' },
      { text: 'Validación y publicación', link: '/es/guide/module-publishing' },
    ],
  },
  {
    text: 'Ecosistema',
    collapsed: false,
    items: [
      { text: 'Catálogo de módulos', link: '/es/guide/catalogo' },
      { text: 'Login: módulo de referencia', link: '/es/guide/login-reference' },
      { text: 'Migración desde legacy', link: '/es/guide/legacy-migration' },
      { text: 'Roadmap', link: '/es/guide/roadmap' },
    ],
  },
]

const apiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Referencia API',
    items: [
      { text: 'Visión general', link: '/es/api/' },
      { text: 'leaf-contracts', link: '/es/api/contracts' },
      { text: 'leaf-core', link: '/es/api/core' },
      { text: 'leaf-compose', link: '/es/api/compose' },
    ],
  },
]

const projectSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'El proyecto',
    items: [
      { text: 'Contexto y justificación', link: '/es/project/' },
      { text: 'Estado del arte', link: '/es/project/estado-del-arte' },
      { text: 'Viabilidad y modelo de negocio', link: '/es/project/viabilidad' },
      { text: 'Metodología y validación', link: '/es/project/metodologia' },
    ],
  },
]

export const esLocale = {
  label: 'Español',
  lang: 'es',
  link: '/es/',
  description: 'Documentación oficial del ecosistema Leaf',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/es/' },
      { text: 'Guía', link: '/es/guide/' },
      { text: 'API', link: '/es/api/' },
      { text: 'Proyecto', link: '/es/project/' },
    ],

    sidebar: {
      '/es/guide/': guideSidebar,
      '/es/api/': apiSidebar,
      '/es/project/': projectSidebar,
    },

    outline: {
      level: [2, 3] as [number, number],
      label: 'En esta página',
    },

    footer: {
      message: 'Publicado bajo la Licencia Apache 2.0.',
      copyright: '© 2026 OPSIDE LEAF',
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
