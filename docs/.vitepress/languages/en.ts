import type { DefaultTheme } from 'vitepress'

export const enLocale = {
  label: 'English',
  lang: 'en',
  link: '/en/',
  description: 'Official documentation for the Leaf framework',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'Guide', link: '/en/guide/' },
      { text: 'API', link: '/en/api/' },
    ],

    sidebar: {
      '/en/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/en/guide/' },
            { text: 'Installation', link: '/en/guide/installation' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3] as [number, number],
      label: 'On this page',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2024 Leaf Framework',
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
