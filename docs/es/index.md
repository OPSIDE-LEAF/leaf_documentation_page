---
layout: home
hero:
  image:
    light: /logo-full-light.png
    dark: /logo-full-dark.png
    alt: Leaf
  tagline: Ecosistema de módulos reutilizables para construir productos más rápido, sin empezar desde cero.
  actions:
    - theme: brand
      text: Comprender Leaf
      link: /es/guide/
    - theme: alt
      text: Referencia API
      link: /es/api/

features:
  - title: <span class="leaf-stat">~1,680 h</span>Lanza más rápido
    details: "Horas de desarrollo ahorradas en apps reales: unas 10,500 líneas que no hubo que programar a mano, cerca de 10 meses-persona."
  - title: <span class="leaf-stat">94.6–100 %</span>Calidad comprobada
    details: "Cobertura de pruebas del núcleo de LEAF. Si baja de 70 %, el proyecto no compila. Cada módulo se publica con su propia versión y valida su API pública en cada compilación."
  - title: <span class="leaf-stat">~17×</span>No reinventes la rueda
    details: "Una app completa, con acceso, catálogo, carrito, pago y recibo, solo escribió 390 líneas propias para conectarlo todo: unas 17 líneas de LEAF por cada línea suya."
  - title: <span class="leaf-stat">~US$101</span>Menos gasto en IA
    details: "Generar con IA una app de 11,013 líneas sobre LEAF costó ~US$266 en tokens. Sin LEAF habría que escribir 4,182 líneas más y costaría ~US$367, un 38 % más. En otra app la diferencia llegó a 255 %."
---

<p class="leaf-results-note">Cifras de la validación de LEAF (octubre de 2026) en apps construidas con el ecosistema. Las marcadas con ~ son estimaciones con un método explícito; el costo con IA se calcula a unos US$0.02 por línea generada.</p>

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
  { title: 'Adopción', description: 'Evalúa cómo el reúso puede reducir tiempos de entrega y concentrar el trabajo en tu producto.', link: '/es/guide/adopcion' },
]
</script>

<CardGrid title="Integrar" :items="integrate" />
<CardGrid title="Construir" :items="build" />
<CardGrid title="Evaluar" :items="evaluate" />
