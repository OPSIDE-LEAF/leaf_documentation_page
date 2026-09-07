<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const props = defineProps<{ mobile?: boolean }>()

const { localeIndex } = useData()
const route = useRoute()

// Most Spanish and English routes share a filename. These four pairs use a
// translated filename, so VitePress' default same-slug language switch would
// point to a page that does not exist.
const translatedRoutes: Record<string, string> = {
  '/es/guide/arquitectura': '/en/guide/architecture',
  '/en/guide/architecture': '/es/guide/arquitectura',
  '/es/guide/glosario': '/en/guide/glossary',
  '/en/guide/glossary': '/es/guide/glosario',
  '/es/guide/errores-telemetria': '/en/guide/errors-telemetry',
  '/en/guide/errors-telemetry': '/es/guide/errores-telemetria',
  '/es/guide/catalogo': '/en/guide/catalog',
  '/en/guide/catalog': '/es/guide/catalogo',
}

const targetLocale = computed(() => localeIndex.value === 'en' ? 'es' : 'en')
const targetLabel = computed(() => targetLocale.value === 'en' ? 'English' : 'Español')
const accessibilityLabel = computed(() => localeIndex.value === 'en'
  ? `Change language to ${targetLabel.value}`
  : `Cambiar idioma a ${targetLabel.value}`)

const targetLink = computed(() => {
  const hasHtmlExtension = route.path.endsWith('.html')
  const currentPath = route.path.replace(/\.html$/, '')
  const translatedPath = translatedRoutes[currentPath] ?? currentPath.replace(
    /^\/(?:es|en)(?=\/|$)/,
    `/${targetLocale.value}`,
  )

  // Heading ids are translated too. Switching languages should open the same
  // page at its beginning instead of retaining an anchor that may not exist.
  return withBase(`${translatedPath}${hasHtmlExtension ? '.html' : ''}`)
})
</script>

<template>
  <a
    class="leaf-language-link"
    :class="{ 'leaf-language-link--mobile': props.mobile }"
    :href="targetLink"
    :aria-label="accessibilityLabel"
  >
    <span class="vpi-languages" aria-hidden="true" />
    <span>{{ targetLabel }}</span>
  </a>
</template>

<style scoped>
.leaf-language-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.leaf-language-link:hover {
  color: var(--vp-c-brand-1);
}

.leaf-language-link--mobile {
  margin-top: 24px;
}
</style>
