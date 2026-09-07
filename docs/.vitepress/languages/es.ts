import type { DefaultTheme } from 'vitepress'

const guideSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Comprender Leaf', items: [
    { text: 'Visión general', link: '/es/guide/' },
    { text: 'Arquitectura y responsabilidades', link: '/es/guide/arquitectura' },
    { text: 'Glosario', link: '/es/guide/glosario' },
    { text: 'Módulos reutilizables', link: '/es/guide/modules' },
    { text: 'Action vs Workflow', link: '/es/guide/action-vs-workflow' },
    { text: 'Workflow', link: '/es/guide/workflow' },
    { text: 'Errores y telemetría', link: '/es/guide/errores-telemetria' },
  ] },
  { text: 'Usar LEAF en una app', items: [
    { text: 'Instalación', link: '/es/guide/installation' },
    { text: 'Maven Local', link: '/es/guide/maven-local' },
    { text: 'Ejecutar una Action', link: '/es/guide/quickstart-action' },
    { text: 'Abrir un Workflow', link: '/es/guide/quickstart-workflow' },
    { text: 'Compose: holder de Workflow', link: '/es/guide/compose-adapter' },
    { text: 'Lo que aporta tu app', link: '/es/guide/host-integration' },
  ] },
  { text: 'Construir un módulo', items: [
    { text: 'Crear módulos con IA', link: '/es/guide/ai-skill' },
    { text: 'Contrato del módulo', link: '/es/guide/module-contract' },
    { text: 'Estructura y dependencias', link: '/es/guide/module-setup' },
    { text: 'Implementar Action o Workflow', link: '/es/guide/module-implementation' },
    { text: 'UI: Route + Screen', link: '/es/guide/compose-route-screen' },
    { text: 'Pruebas', link: '/es/guide/module-testing' },
    { text: 'Probar antes de distribuir', link: '/es/guide/module-publishing' },
  ] },
  { text: 'Ecosistema', items: [
    { text: 'Catálogo de módulos', link: '/es/guide/catalogo' },
    { text: 'Visuals', link: '/es/guide/visuals-reference' },
  ] },
]

const apiSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Referencia API', items: [
    { text: 'Visión general', link: '/es/api/' },
    { text: 'leaf-contracts', link: '/es/api/contracts' },
    { text: 'leaf-core', link: '/es/api/core' },
    { text: 'leaf-compose', link: '/es/api/compose' },
    { text: 'Workflow', link: '/es/api/workflow' },
    { text: 'leaf-visuals', link: '/es/api/visuals' },
    { text: 'Login', link: '/es/api/login' },
    { text: 'Authentication', link: '/es/api/authentication' },
    { text: 'Payment Contracts', link: '/es/api/payment-contracts' },
    { text: 'Módulos de pago', link: '/es/api/payments' },
  ] },
]

const projectSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Adopción', items: [{ text: 'Evaluar Leaf', link: '/es/project/' }] },
]

export const esLocale = {
  label: 'Español',
  lang: 'es',
  link: '/es/',
  description: 'Documentación de LEAF 3',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/es/' },
      { text: 'Guía', link: '/es/guide/' },
      { text: 'API', link: '/es/api/' },
      { text: 'Adopción', link: '/es/project/' },
    ],
    sidebar: { '/es/guide/': guideSidebar, '/es/api/': apiSidebar, '/es/project/': projectSidebar },
    outline: { level: [2, 3] as [number, number], label: 'En esta página' },
    footer: { message: 'Publicado bajo la Licencia Apache 2.0.', copyright: '© 2026 OPSIDE LEAF' },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    darkModeSwitchLabel: 'Apariencia', sidebarMenuLabel: 'Menú', returnToTopLabel: 'Volver arriba', langMenuLabel: 'Cambiar idioma',
  } satisfies DefaultTheme.Config,
}

export const esSearchConfig = {
  translations: {
    button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
    modal: { noResultsText: 'No se encontraron resultados', resetButtonTitle: 'Limpiar búsqueda', footer: { selectText: 'para seleccionar', navigateText: 'para navegar', closeText: 'para cerrar' } },
  },
}
