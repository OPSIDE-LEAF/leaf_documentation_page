<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, useRoute } from 'vitepress'

// @ts-ignore - módulo virtual generado por el plugin
import markdownPages from 'virtual:markdown-raw'

const route = useRoute()
const { lang } = useData()

const copied = ref(false)

const i18n = computed(() => {
  if (lang.value === 'en') {
    return {
      copy: 'Copy as Markdown',
      copied: 'Copied!',
    }
  }
  // Default: español
  return {
    copy: 'Copiar como Markdown',
    copied: '¡Copiado!',
  }
})

const currentMarkdown = computed(() => {
  // La ruta en VitePress es algo como /es/guide/installation.html
  // Necesitamos convertirla a la clave del mapa: es/guide/installation
  let routePath = route.path

  // Remover el .html final
  routePath = routePath.replace(/\.html$/, '')

  // Remover el slash inicial
  routePath = routePath.replace(/^\//, '')

  // Si termina en / es un index
  if (routePath.endsWith('/')) {
    routePath += 'index'
  }

  // Si está vacío, es el index raíz
  if (!routePath) {
    routePath = 'index'
  }

  return markdownPages[routePath] || ''
})

async function copyMarkdown() {
  if (!currentMarkdown.value) return

  try {
    await navigator.clipboard.writeText(currentMarkdown.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}
</script>

<template>
  <div class="copy-markdown-toolbar">
    <button
      class="copy-markdown-btn"
      :class="{ copied }"
      @click="copyMarkdown"
      :title="copied ? i18n.copied : i18n.copy"
      :aria-label="copied ? i18n.copied : i18n.copy"
    >
    <svg
      v-if="!copied"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 4h2v2H4zM4 10h2v2H4zM4 16h2v2H4zM10 4h10v2H10zM10 10h10v2H10zM10 16h10v2H10z" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <span class="copy-markdown-label">{{ copied ? i18n.copied : i18n.copy }}</span>
  </button>
  </div>
</template>

<style scoped>
.copy-markdown-toolbar {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.copy-markdown-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.copy-markdown-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.copy-markdown-btn.copied {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.copy-markdown-label {
  line-height: 1;
}

@media (max-width: 768px) {
  .copy-markdown-label {
    display: none;
  }

  .copy-markdown-btn {
    padding: 6px 8px;
  }
}
</style>
