---
layout: home

hero:
  name: "Leaf"
  image:
    light: /logo-full-light.png
    dark: /logo-full-dark.png
    alt: Leaf
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
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z"/></svg>
    title: Fast by default
    details: Optimized performance out of the box, no additional configuration needed.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M120-120v-200h200v200H120Zm260 0v-200h200v200H380Zm260 0v-200h200v200H640ZM120-380v-200h200v200H120Zm260 0v-200h200v200H380Zm260 0v-200h200v200H640ZM120-640v-200h200v200H120Zm260 0v-200h200v200H380Zm260 0v-200h200v200H640Z"/></svg>
    title: Modular
    details: Module-based architecture that you can use according to your needs.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>
    title: Native TypeScript
    details: Full TypeScript support with strict types and autocompletion.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>
    title: Lightweight
    details: Minimal memory footprint and reduced dependencies to the maximum.
---

<script setup>
const quickstartItems = [
  {
    title: 'Create a project',
    description: 'Initialize a new Leaf project with the CLI in seconds.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-318v-324q0-19 10.5-37t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 37v324q0 19-10.5 37T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 44 238 137Zm-160 93 78-45-237-137-78 44 237 138Z"/></svg>',
    link: '/en/guide/'
  },
  {
    title: 'Installation',
    description: 'Set up Leaf in your development environment step by step.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-120v-264L254-197l-57-57 187-186H120v-80h264L197-706l57-57 186 187v-264h80v264l186-187 57 57-187 186h264v80H576l187 186-57 57-186-187v264h-80Z"/></svg>',
    link: '/en/guide/installation'
  },
  {
    title: 'Routing',
    description: 'Define routes declaratively with middleware support.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Z"/></svg>',
    link: '/en/guide/'
  },
  {
    title: 'Database',
    description: 'Connect and query databases with the built-in ORM.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93-6t87.5-18q40.5-12 69-28.5T760-280v-120q-26 14-57.5 25t-67 18.5Q600-349 561-345t-81 5q-42 0-82-5t-75.5-11.5Q287-364 256-375t-56-25v120q2 11 30.5 27.5t69 28.5q40.5 12 87.5 18t93 6Z"/></svg>',
    link: '/en/guide/'
  },
  {
    title: 'Authentication',
    description: 'Implement auth with JWT, sessions, and guards easily.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>',
    link: '/en/guide/'
  },
  {
    title: 'Deployment',
    description: 'Deploy your application to production with a single command.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z"/></svg>',
    link: '/en/guide/'
  }
]
</script>

<CardGrid title="Quickstart" :items="quickstartItems" />
