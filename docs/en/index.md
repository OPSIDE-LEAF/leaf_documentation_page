---
layout: home
hero:
  name: Leaf
  tagline: Reusable Kotlin Multiplatform modules for building products faster without starting from zero.
  actions:
    - theme: brand
      text: Understand Leaf
      link: /en/guide/
    - theme: alt
      text: API reference
      link: /en/api/
---

<script setup>
const integrate = [
  { title: 'Maven Local', description: 'Use it optionally to test an artifact during development.', link: '/en/guide/maven-local' },
  { title: 'First Action', description: 'Solve one simple task: receive data and return an answer.', link: '/en/guide/quickstart-action' },
  { title: 'First Workflow', description: 'Implement a UI with state, events, and a final result.', link: '/en/guide/quickstart-workflow' },
]
const build = [
  { title: 'Module contract', description: 'Make clear which data and services the module needs, and what the app must do.', link: '/en/guide/module-contract' },
  { title: 'Implementation', description: 'Choose Action or Workflow and separate rules from the screen.', link: '/en/guide/module-implementation' },
  { title: 'Integration testing', description: 'Check the module from a consuming application before distributing it.', link: '/en/guide/module-publishing' },
]
const evaluate = [
  { title: 'Architecture', description: 'Understand what the module does, what Core does, and what your app keeps.', link: '/en/guide/architecture' },
  { title: 'Module catalog', description: 'Find reusable capabilities and integrate them without rebuilding them from zero.', link: '/en/guide/catalog' },
  { title: 'Adoption', description: 'Evaluate how reuse can shorten delivery time and keep work focused on your product.', link: '/en/project/' },
]
</script>

<CardGrid title="Integrate" :items="integrate" />
<CardGrid title="Build" :items="build" />
<CardGrid title="Evaluate" :items="evaluate" />
