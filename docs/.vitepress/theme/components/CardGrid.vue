<script setup lang="ts">
import Card from './Card.vue'

interface CardItem {
  title: string
  description: string
  icon?: string
  link?: string
}

defineProps<{
  title?: string
  items: CardItem[]
}>()
</script>

<template>
  <div class="card-grid">
    <h2 v-if="title" class="card-grid__title">{{ title }}</h2>
    <div class="card-grid__container">
      <Card
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :link="item.link"
      />
    </div>
  </div>
</template>

<style scoped>
.card-grid {
  margin: 56px 0;
}

.card-grid__title {
  font-size: 22px;
  font-weight: 680;
  letter-spacing: -0.02em;
  margin-bottom: 22px;
  color: var(--vp-c-text-1);
}

.card-grid__container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

@media (max-width: 640px) {
  .card-grid__container {
    grid-template-columns: 1fr;
  }
}
</style>
