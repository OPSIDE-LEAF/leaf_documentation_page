<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
  link?: string
}>()
</script>

<template>
  <a
    class="card"
    :href="link"
    :class="{ 'card--linked': link }"
  >
    <div class="card__icon" v-if="icon" v-html="icon"></div>
    <div class="card__content">
      <h3 class="card__title">{{ title }}</h3>
      <p class="card__description">{{ description }}</p>
    </div>
  </a>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 26px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-2);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.card--linked:hover {
  border-color: var(--vp-c-border);
  box-shadow: var(--vp-shadow-4);
  transform: translateY(-4px);
}

.card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background-color: var(--vp-c-brand-soft);
  margin-bottom: 18px;
}

.card__icon :deep(svg) {
  width: 24px;
  height: 24px;
  color: var(--vp-c-brand-1);
  fill: currentColor;
}

.card__title {
  font-size: 16px;
  font-weight: 640;
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.card__description {
  font-size: 14px;
  line-height: 1.65;
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
