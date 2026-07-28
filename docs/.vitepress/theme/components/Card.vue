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
    <div class="card__icon" v-if="icon">
      {{ icon }}
    </div>
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
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.card--linked:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.08);
  transform: translateY(-2px);
}

.card__icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.card__title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.card__description {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
