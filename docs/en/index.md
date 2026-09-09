---
layout: home
hero:
  image:
    light: /logo-full-light.png
    dark: /logo-full-dark.png
    alt: Leaf
  tagline: Ecosystem of reusable modules to build products faster, without starting from scratch.
  actions:
    - theme: brand
      text: Understand Leaf
      link: /en/guide/
    - theme: alt
      text: API reference
      link: /en/api/

features:
  - title: Launch faster
    details: One team builds for Android and iOS at the same time. Less cost, more speed.
  - title: Quality you can feel
    details: Your users won't tell the difference from a custom-built app. Same experience, a fraction of the cost.
  - title: Don't reinvent the wheel
    details: Login, payments, catalog — ready-to-use capabilities. Every new project leverages what already works.
  - title: Evolve without rebuilding
    details: Add or change features without starting over. Your product grows with you.
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
  { title: 'Adoption', description: 'Evaluate how reuse can shorten delivery time and keep work focused on your product.', link: '/en/guide/adoption' },
]
</script>

<CardGrid title="Integrate" :items="integrate" />
<CardGrid title="Build" :items="build" />
<CardGrid title="Evaluate" :items="evaluate" />
