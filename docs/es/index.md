---
layout: home
hero:
  name: Leaf
  tagline: Módulos Kotlin Multiplatform reutilizables para construir productos más rápido sin empezar desde cero.
  actions:
    - theme: brand
      text: Comprender Leaf
      link: /es/guide/
    - theme: alt
      text: Referencia API
      link: /es/api/
---

<script setup>
const integrate = [
  { title: 'Maven Local', description: 'Úsalo de forma opcional para probar un artefacto durante el desarrollo.', link: '/es/guide/maven-local' },
  { title: 'Primera Action', description: 'Resuelve una tarea sencilla: recibe datos y devuelve una respuesta.', link: '/es/guide/quickstart-action' },
  { title: 'Primer Workflow', description: 'Implementa una UI con estado, eventos y un resultado final.', link: '/es/guide/quickstart-workflow' },
]
const build = [
  { title: 'Contrato del módulo', description: 'Aclara qué datos y servicios necesita el módulo, y qué debe hacer la app.', link: '/es/guide/module-contract' },
  { title: 'Implementación', description: 'Elige Action o Workflow y separa la lógica de la pantalla.', link: '/es/guide/module-implementation' },
  { title: 'Pruebas de integración', description: 'Comprueba el módulo desde una aplicación consumidora antes de distribuirlo.', link: '/es/guide/module-publishing' },
]
const evaluate = [
  { title: 'Arquitectura', description: 'Entiende qué hace el módulo, qué hace Core y qué conserva tu aplicación.', link: '/es/guide/arquitectura' },
  { title: 'Catálogo de módulos', description: 'Encuentra capacidades reutilizables para integrarlas sin volver a construirlas desde cero.', link: '/es/guide/catalogo' },
  { title: 'Adopción', description: 'Evalúa cómo el reúso puede reducir tiempos de entrega y concentrar el trabajo en tu producto.', link: '/es/project/' },
]
</script>

<CardGrid title="Integrar" :items="integrate" />
<CardGrid title="Construir" :items="build" />
<CardGrid title="Evaluar" :items="evaluate" />
