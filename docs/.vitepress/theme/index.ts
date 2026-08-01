// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

import CardGrid from './components/CardGrid.vue'
import Card from './components/Card.vue'
import CopyMarkdown from './components/CopyMarkdown.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-before': () => h(CopyMarkdown),
      'nav-bar-title-after': () =>
        h('span', { class: 'leaf-version-badge' }, `v${__LEAF_VERSION__}`),
    })
  },
  enhanceApp({ app }) {
    app.component('CardGrid', CardGrid)
    app.component('Card', Card)
  },
} satisfies Theme
