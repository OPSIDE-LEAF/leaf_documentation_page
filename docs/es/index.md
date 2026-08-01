---
layout: home

hero:
  name: "Leaf"
  image:
    light: /logo-full-light.png
    dark: /logo-full-dark.png
    alt: Leaf
  tagline: Ecosistema modular para desarrollo móvil multiplataforma. Módulos reutilizables que se ensamblan en apps Android e iOS con rendimiento nativo, desde una sola base de código.
  actions:
    - theme: brand
      text: Comenzar
      link: /es/guide/
    - theme: alt
      text: Guía del Host
      link: /es/guide/installation
    - theme: alt
      text: Guía del Author
      link: /es/guide/module-setup

features:
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg>
    title: Time-to-market más corto
    details: Una sola base de código para Android e iOS — un equipo en lugar de dos, la mitad del esfuerzo. Lanza y valida tu producto en menos tiempo.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z"/></svg>
    title: Experiencia nativa, sin sacrificios
    details: Aplicaciones indistinguibles de las construidas con los SDKs nativos. La calidad que las capas híbridas no alcanzan, a un costo que sí puedes pagar.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-318v-324q0-19 10.5-37t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 37v324q0 19-10.5 37T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 44 238 137Zm-160 93 78-45-237-137-78 44 237 138Z"/></svg>
    title: Ensambla, no empieces de cero
    details: Login, pagos, catálogo — módulos probados y versionados que se integran a tu app. Cada proyecto nuevo reutiliza lo ya construido.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M120-120v-200h200v200H120Zm260 0v-200h200v200H380Zm260 0v-200h200v200H640ZM120-380v-200h200v200H120Zm260 0v-200h200v200H380Zm260 0v-200h200v200H640ZM120-640v-200h200v200H120Zm260 0v-200h200v200H380Zm260 0v-200h200v200H640Z"/></svg>
    title: Crece al ritmo de tu negocio
    details: Agrega, reemplaza o retira módulos cuando cambian los requerimientos, sin reescribir la aplicación. Mantenimiento simple, evolución continua.
---

<script setup>
const hostItems = [
  {
    title: 'Instalación PITOoooooooooooooooo',
    description: 'Credenciales, repositorios y dependencias del tren estable %LEAF_VERSION%.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-120v-264L254-197l-57-57 187-186H120v-80h264L197-706l57-57 186 187v-264h80v264l186-187 57 57-187 186h264v80H576l187 186-57 57-186-187v264h-80Z"/></svg>',
    link: '/es/guide/installation'
  },
  {
    title: 'Ejecutar una Action',
    description: 'Construye un módulo y ejecuta su capability con Leaf.run.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-360v240h80v-240h-80Zm0-160v80h80v-80h-80Z"/></svg>',
    link: '/es/guide/quickstart-action'
  },
  {
    title: 'Abrir una Feature',
    description: 'Sesiones con estado, eventos y resultado terminal único.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160ZM200-560l-56-56 336-338 336 338-56 56-280-280-280 280Z"/></svg>',
    link: '/es/guide/quickstart-feature'
  },
  {
    title: 'Compose',
    description: 'rememberLeaf: una sesión observable con disposal automático.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>',
    link: '/es/guide/compose-adapter'
  },
  {
    title: 'Integrar módulos',
    description: 'Implementa gateways, ejecuta capabilities y conserva la navegación.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-318v-324q0-19 10.5-37t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 37v324q0 19-10.5 37T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 44 238 137Zm-160 93 78-45-237-137-78 44 237 138Z"/></svg>',
    link: '/es/guide/host-integration'
  },
  {
    title: 'Catálogo',
    description: 'Módulos disponibles del ecosistema y su estado.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640H240v640Zm80-120h200v-80H320v80Zm0-160h320v-80H320v80Zm0-160h320v-80H320v80ZM240-160v-640 640Z"/></svg>',
    link: '/es/guide/catalogo'
  }
]

const authorItems = [
  {
    title: 'Setup del repositorio',
    description: 'Estructura, Gradle, ABI validation y GitHub Packages.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-120v-80h480v80H160Zm226-194L160-540l56-56 170 170 368-368 56 56-424 424Z"/></svg>',
    link: '/es/guide/module-setup'
  },
  {
    title: 'Implementación',
    description: 'Modelos de dominio, gateways como ports y la clase Module.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>',
    link: '/es/guide/module-implementation'
  },
  {
    title: 'Route + Screen',
    description: 'UI Compose del módulo: conector con sesión y vista pura.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"/></svg>',
    link: '/es/guide/compose-route-screen'
  },
  {
    title: 'Testing',
    description: 'Transiciones, gateways, lifecycle y presión en commonTest.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-80-200h160v-80H400v80Zm0-160h160v-280H400v280Z"/></svg>',
    link: '/es/guide/module-testing'
  },
  {
    title: 'Publicación',
    description: 'Clean consumer, validación completa y publicación por tag.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg>',
    link: '/es/guide/module-publishing'
  },
  {
    title: 'Login como referencia',
    description: 'El módulo validado que modela la arquitectura 2.x.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>',
    link: '/es/guide/login-reference'
  }
]
</script>

<CardGrid title="Para Hosts — crea apps con Leaf" :items="hostItems" />
<CardGrid title="Para Authors — crea módulos para Leaf" :items="authorItems" />
