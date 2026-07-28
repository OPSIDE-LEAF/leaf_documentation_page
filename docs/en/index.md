---
layout: home

hero:
  name: "Leaf"
  text: "Modern & lightweight framework"
  tagline: Build fast, scalable, and elegant applications with an exceptional developer experience.
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/leaf-framework

features:
  - icon: 🚀
    title: Fast by default
    details: Optimized performance out of the box, no additional configuration needed.
  - icon: 🧩
    title: Modular
    details: Module-based architecture that you can use according to your needs.
  - icon: 🎯
    title: Native TypeScript
    details: Full TypeScript support with strict types and autocompletion.
  - icon: 🌿
    title: Lightweight
    details: Minimal memory footprint and reduced dependencies to the maximum.
---

<script setup>
const quickstartItems = [
  {
    title: 'Create a project',
    description: 'Initialize a new Leaf project with the CLI in seconds.',
    icon: '📦',
    link: '/en/guide/'
  },
  {
    title: 'Installation',
    description: 'Set up Leaf in your development environment step by step.',
    icon: '⚙️',
    link: '/en/guide/installation'
  },
  {
    title: 'Routing',
    description: 'Define routes declaratively with middleware support.',
    icon: '🛤️',
    link: '/en/guide/'
  },
  {
    title: 'Database',
    description: 'Connect and query databases with the built-in ORM.',
    icon: '🗄️',
    link: '/en/guide/'
  },
  {
    title: 'Authentication',
    description: 'Implement auth with JWT, sessions, and guards easily.',
    icon: '🔐',
    link: '/en/guide/'
  },
  {
    title: 'Deployment',
    description: 'Deploy your application to production with a single command.',
    icon: '☁️',
    link: '/en/guide/'
  }
]
</script>

<CardGrid title="Quickstart" :items="quickstartItems" />
