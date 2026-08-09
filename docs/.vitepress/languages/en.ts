import type { DefaultTheme } from 'vitepress'

const guideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    collapsed: false,
    items: [
      { text: 'What is Leaf?', link: '/en/guide/' },
      { text: 'Architecture and principles', link: '/en/guide/architecture' },
      { text: 'Glossary', link: '/en/guide/glossary' },
    ],
  },
  {
    text: 'Concepts',
    collapsed: false,
    items: [
      { text: 'Module and ModuleInfo', link: '/en/guide/modules' },
      { text: 'Action vs Feature', link: '/en/guide/action-vs-feature' },
      { text: 'FeatureSession', link: '/en/guide/feature-session' },
      { text: 'Errors, telemetry, and privacy', link: '/en/guide/errors-telemetry' },
    ],
  },
  {
    text: 'Host Guide — build apps',
    collapsed: false,
    items: [
      { text: 'Installation', link: '/en/guide/installation' },
      { text: 'Run an Action', link: '/en/guide/quickstart-action' },
      { text: 'Open a Feature', link: '/en/guide/quickstart-feature' },
      { text: 'Compose: rememberLeaf', link: '/en/guide/compose-adapter' },
      { text: 'Integrate published modules', link: '/en/guide/host-integration' },
    ],
  },
  {
    text: 'Author Guide — build modules',
    collapsed: false,
    items: [
      { text: 'Repository setup', link: '/en/guide/module-setup' },
      { text: 'Implementation', link: '/en/guide/module-implementation' },
      { text: 'UI: Route + Screen pattern', link: '/en/guide/compose-route-screen' },
      { text: 'Testing', link: '/en/guide/module-testing' },
      { text: 'Validation and publishing', link: '/en/guide/module-publishing' },
    ],
  },
  {
    text: 'Ecosystem',
    collapsed: false,
    items: [
      { text: 'Module catalog', link: '/en/guide/catalog' },
      { text: 'Login: reference module', link: '/en/guide/login-reference' },
      { text: 'Email: example module (Action)', link: '/en/guide/email-reference' },
      { text: 'Legacy migration', link: '/en/guide/legacy-migration' },
      { text: 'Roadmap', link: '/en/guide/roadmap' },
    ],
  },
]

const apiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'API Reference',
    items: [
      { text: 'Overview', link: '/en/api/' },
      { text: 'leaf-contracts', link: '/en/api/contracts' },
      { text: 'leaf-core', link: '/en/api/core' },
      { text: 'leaf-compose', link: '/en/api/compose' },
    ],
  },
]

export const enLocale = {
  label: 'English',
  lang: 'en',
  link: '/en/',
  description: 'Official documentation for the Leaf ecosystem',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'Guide', link: '/en/guide/' },
      { text: 'API', link: '/en/api/' },
    ],

    sidebar: {
      '/en/guide/': guideSidebar,
      '/en/api/': apiSidebar,
    },

    outline: {
      level: [2, 3] as [number, number],
      label: 'On this page',
    },

    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: '© 2026 OPSIDE LEAF',
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },

    darkModeSwitchLabel: 'Appearance',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Back to top',
    langMenuLabel: 'Change language',
  } satisfies DefaultTheme.Config,
}

export const enSearchConfig = {
  translations: {
    button: {
      buttonText: 'Search',
      buttonAriaLabel: 'Search',
    },
    modal: {
      noResultsText: 'No results found',
      resetButtonTitle: 'Clear search',
      footer: {
        selectText: 'to select',
        navigateText: 'to navigate',
        closeText: 'to close',
      },
    },
  },
}
