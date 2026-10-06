<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

// Pantalla de entrada con el logo completo animado. Se renderiza en el HTML estático para que
// cubra el contenido desde el primer pintado. Aparece al abrir o recargar el sitio, no al navegar
// entre páginas, porque el Layout no se vuelve a montar.
//
// El tiempo lo controla una sola animación CSS (leaf-splash-out): espera a que termine el intro
// del logo y se desvanece. Así también se va aunque JavaScript no cargue. Saltar (clic, Esc,
// Enter o espacio) solo adelanta esa animación al inicio del desvanecido.
const visible = ref(true)
const root = ref<HTMLElement | null>(null)
let safety: ReturnType<typeof setTimeout> | undefined

function fadeAnimation(): Animation | undefined {
  return root.value
    ?.getAnimations?.()
    .find((animation) => (animation as CSSAnimation).animationName === 'leaf-splash-out')
}

function close() {
  clearTimeout(safety)
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('leaf-splash-open')
  visible.value = false
}

function skip() {
  const animation = fadeAnimation()
  if (!animation) return close()
  const fadeStart = Number(animation.effect?.getTiming().delay ?? 0)
  if (Number(animation.currentTime ?? 0) < fadeStart) animation.currentTime = fadeStart
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    skip()
  }
}

onMounted(() => {
  const animation = fadeAnimation()
  if (!animation || animation.playState === 'finished') return close()
  document.documentElement.classList.add('leaf-splash-open')
  window.addEventListener('keydown', onKey)
  animation.finished.then(close, close)
  safety = setTimeout(close, 6000)
})

onBeforeUnmount(close)
</script>

<template>
  <div v-if="visible" ref="root" class="leaf-splash" aria-hidden="true" @click="skip">
    <img
      class="leaf-splash__logo leaf-splash__logo--light"
      :src="withBase('/leaf-logo-full-animated-light.svg')"
      alt=""
      width="318"
      height="298"
    />
    <img
      class="leaf-splash__logo leaf-splash__logo--dark"
      :src="withBase('/leaf-logo-full-animated-dark.svg')"
      alt=""
      width="318"
      height="298"
    />
  </div>
</template>

<style>
.leaf-splash {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: var(--vp-c-bg);
  cursor: pointer;
  /* El lema del logo termina de aparecer a los 2.64 s; a los 3.2 s empieza el desvanecido. */
  animation: leaf-splash-out 0.6s ease 3.2s forwards;
}

.leaf-splash__logo {
  display: block;
  width: clamp(190px, 34vw, 300px);
  height: auto;
}

.leaf-splash__logo--dark,
.dark .leaf-splash__logo--light {
  display: none;
}

.dark .leaf-splash__logo--dark {
  display: block;
}

html.leaf-splash-open {
  overflow: hidden;
}

@keyframes leaf-splash-out {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .leaf-splash {
    animation-delay: 0.8s;
  }
}
</style>
