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
  - title: <span class="leaf-stat">~1,680 h</span>Launch faster
    details: "Developer hours saved on real apps: about 10,500 lines nobody had to write by hand, close to 10 person-months."
  - title: <span class="leaf-stat">94.6–100%</span>Proven quality
    details: "Test coverage of the LEAF core. If it drops below 70%, the project won't build. Each module ships with its own version and checks its public API on every build."
  - title: <span class="leaf-stat">~17×</span>Don't reinvent the wheel
    details: "A complete app with sign-in, catalog, cart, payment and receipt wrote only 390 lines of its own to connect it all: about 17 lines of LEAF for every line it wrote."
  - title: <span class="leaf-stat">~US$101</span>Lower AI spend
    details: "Generating an 11,013-line app with AI on top of LEAF cost ~US$266 in tokens. Without LEAF it needs 4,182 more lines and ~US$367, 38% more. In another app the gap reached 255%."
---

<p class="leaf-results-note">Figures from LEAF's validation (October 2026) on apps built with the ecosystem. Values marked ~ are estimates with an explicit method; AI cost is computed at about US$0.02 per generated line.</p>

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
