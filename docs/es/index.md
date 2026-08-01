---
layout: home

hero:
  name: "Leaf"
  image:
    src: /logo-mark.png
    alt: Leaf
  text: "Build. Grow. Repeat."
  tagline: Ecosistema modular para desarrollo móvil multiplataforma. Kotlin Multiplatform + Compose, con capacidades locales, directas y tipadas.
  actions:
    - theme: brand
      text: Comenzar
      link: /es/guide/
    - theme: alt
      text: Guía del Host
      link: /es/guide/installation
    - theme: alt
      text: Guía del Autor
      link: /es/guide/module-setup

features:
  - icon: 🌿
    title: Nativo real, código compartido
    details: Kotlin Multiplatform compila a bytecode JVM y framework iOS nativo. Sin capas de abstracción en runtime.
  - icon: 🧩
    title: Módulos independientes
    details: Cada módulo se compila, prueba, versiona y publica de forma aislada. Los hosts ensamblan, no construyen desde cero.
  - icon: 🎯
    title: Tipado de extremo a extremo
    details: Action y Feature con tipos de dominio. Los errores de integración fallan al compilar, no en runtime.
  - icon: 🛡️
    title: Core que administra el riesgo
    details: Cancelación estructurada, backpressure acotado, errores redactados y telemetría sin payload — por diseño.
---

<script setup>
const hostItems = [
  {
    title: 'Instalación',
    description: 'Credenciales, repositorios y dependencias del tren estable 2.0.1.',
    icon: '⚙️',
    link: '/es/guide/installation'
  },
  {
    title: 'Ejecutar una Action',
    description: 'Construye un módulo y ejecuta su capacidad con Leaf.run.',
    icon: '⚡',
    link: '/es/guide/quickstart-action'
  },
  {
    title: 'Abrir una Feature',
    description: 'Sesiones con estado, eventos y resultado terminal único.',
    icon: '🔄',
    link: '/es/guide/quickstart-feature'
  },
  {
    title: 'Compose',
    description: 'rememberLeaf: una sesión observable con disposal automático.',
    icon: '🖼️',
    link: '/es/guide/compose-adapter'
  },
  {
    title: 'Integrar módulos',
    description: 'Implementa gateways, ejecuta capacidades y conserva la navegación.',
    icon: '🔌',
    link: '/es/guide/host-integration'
  },
  {
    title: 'Catálogo',
    description: 'Módulos disponibles del ecosistema y su estado.',
    icon: '📦',
    link: '/es/guide/catalogo'
  }
]

const authorItems = [
  {
    title: 'Setup del repositorio',
    description: 'Estructura, Gradle, ABI validation y GitHub Packages.',
    icon: '🏗️',
    link: '/es/guide/module-setup'
  },
  {
    title: 'Implementación',
    description: 'Modelos de dominio, gateways como puertos y la clase Module.',
    icon: '🧠',
    link: '/es/guide/module-implementation'
  },
  {
    title: 'Route + Screen',
    description: 'UI Compose del módulo: conector con sesión y vista pura.',
    icon: '🎨',
    link: '/es/guide/compose-route-screen'
  },
  {
    title: 'Testing',
    description: 'Transiciones, gateways, lifecycle y presión en commonTest.',
    icon: '🧪',
    link: '/es/guide/module-testing'
  },
  {
    title: 'Publicación',
    description: 'Clean consumer, validación completa y publicación por tag.',
    icon: '🚀',
    link: '/es/guide/module-publishing'
  },
  {
    title: 'Login como referencia',
    description: 'El módulo validado que modela la arquitectura 2.x.',
    icon: '🔐',
    link: '/es/guide/login-reference'
  }
]
</script>

<CardGrid title="Para Hosts — crea apps con Leaf" :items="hostItems" />
<CardGrid title="Para Autores — crea módulos para Leaf" :items="authorItems" />
