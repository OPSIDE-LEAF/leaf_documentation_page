---
layout: home

hero:
  name: "Leaf"
  text: "Framework moderno y ligero"
  tagline: Construye aplicaciones rápidas, escalables y elegantes con una experiencia de desarrollo excepcional.
  actions:
    - theme: brand
      text: Comenzar
      link: /es/guide/
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/leaf-framework

features:
  - icon: 🚀
    title: Rápido por defecto
    details: Rendimiento optimizado desde el primer momento, sin configuración adicional.
  - icon: 🧩
    title: Modular
    details: Arquitectura basada en módulos que puedes usar según tus necesidades.
  - icon: 🎯
    title: TypeScript nativo
    details: Soporte completo de TypeScript con tipos estrictos y autocompletado.
  - icon: 🌿
    title: Ligero
    details: Mínima huella de memoria y dependencias reducidas al máximo.
---

<script setup>
const quickstartItems = [
  {
    title: 'Crear un proyecto',
    description: 'Inicializa un nuevo proyecto Leaf con la CLI en segundos.',
    icon: '📦',
    link: '/es/guide/'
  },
  {
    title: 'Instalación',
    description: 'Configura Leaf en tu entorno de desarrollo paso a paso.',
    icon: '⚙️',
    link: '/es/guide/installation'
  },
  {
    title: 'Routing',
    description: 'Define rutas de forma declarativa con soporte para middlewares.',
    icon: '🛤️',
    link: '/es/guide/'
  },
  {
    title: 'Base de datos',
    description: 'Conecta y consulta bases de datos con el ORM integrado.',
    icon: '🗄️',
    link: '/es/guide/'
  },
  {
    title: 'Autenticación',
    description: 'Implementa auth con JWT, sesiones y guards de forma sencilla.',
    icon: '🔐',
    link: '/es/guide/'
  },
  {
    title: 'Despliegue',
    description: 'Despliega tu aplicación en producción con un solo comando.',
    icon: '☁️',
    link: '/es/guide/'
  }
]
</script>

<CardGrid title="Inicio rápido" :items="quickstartItems" />
