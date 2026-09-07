import type { DefaultTheme } from 'vitepress'

const guideSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Understand Leaf', items: [
    { text: 'Overview', link: '/en/guide/' },
    { text: 'Architecture: who does what', link: '/en/guide/architecture' },
    { text: 'Glossary', link: '/en/guide/glossary' },
    { text: 'Reusable modules', link: '/en/guide/modules' },
    { text: 'Action vs Workflow', link: '/en/guide/action-vs-workflow' },
    { text: 'Workflow', link: '/en/guide/workflow' },
    { text: 'Errors and telemetry', link: '/en/guide/errors-telemetry' },
  ] },
  { text: 'Use LEAF in an app', items: [
    { text: 'Installation', link: '/en/guide/installation' },
    { text: 'Maven Local', link: '/en/guide/maven-local' },
    { text: 'Run an Action', link: '/en/guide/quickstart-action' },
    { text: 'Open a Workflow', link: '/en/guide/quickstart-workflow' },
    { text: 'Compose: Workflow holder', link: '/en/guide/compose-adapter' },
    { text: 'What your app provides', link: '/en/guide/host-integration' },
  ] },
  { text: 'Build a module', items: [
    { text: 'Build modules with AI', link: '/en/guide/ai-skill' },
    { text: 'Module contract', link: '/en/guide/module-contract' },
    { text: 'Structure and dependencies', link: '/en/guide/module-setup' },
    { text: 'Implement Action or Workflow', link: '/en/guide/module-implementation' },
    { text: 'UI: Route + Screen', link: '/en/guide/compose-route-screen' },
    { text: 'Testing', link: '/en/guide/module-testing' },
    { text: 'Test before distribution', link: '/en/guide/module-publishing' },
  ] },
  { text: 'Ecosystem', items: [
    { text: 'Module catalog', link: '/en/guide/catalog' },
    { text: 'Visuals', link: '/en/guide/visuals-reference' },
  ] },
]

const apiSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'API reference', items: [
    { text: 'Overview', link: '/en/api/' },
    { text: 'leaf-contracts', link: '/en/api/contracts' },
    { text: 'leaf-core', link: '/en/api/core' },
    { text: 'leaf-compose', link: '/en/api/compose' },
    { text: 'Workflow', link: '/en/api/workflow' },
    { text: 'leaf-visuals', link: '/en/api/visuals' },
    { text: 'Authentication', link: '/en/api/authentication' },
    { text: 'Payment Contracts', link: '/en/api/payment-contracts' },
    { text: 'Payment modules', link: '/en/api/payments' },
  ] },
]

const projectSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Adoption', items: [{ text: 'Evaluate Leaf', link: '/en/project/' }] },
]

export const enLocale = {
  label: 'English',
  lang: 'en',
  link: '/en/',
  description: 'LEAF 3 documentation',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'Guide', link: '/en/guide/' },
      { text: 'API', link: '/en/api/' },
      { text: 'Adoption', link: '/en/project/' },
    ],
    sidebar: { '/en/guide/': guideSidebar, '/en/api/': apiSidebar, '/en/project/': projectSidebar },
    outline: { level: [2, 3] as [number, number], label: 'On this page' },
    footer: { message: 'Released under the Apache 2.0 License.', copyright: '© 2026 OPSIDE LEAF' },
    docFooter: { prev: 'Previous', next: 'Next' },
    darkModeSwitchLabel: 'Appearance', sidebarMenuLabel: 'Menu', returnToTopLabel: 'Back to top', langMenuLabel: 'Change language',
  } satisfies DefaultTheme.Config,
}

export const enSearchConfig = {
  translations: {
    button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
    modal: { noResultsText: 'No results found', resetButtonTitle: 'Clear search', footer: { selectText: 'to select', navigateText: 'to navigate', closeText: 'to close' } },
  },
}
