# Arquitectura y principios

## Principios de diseño

1. **Ruta local tipada** — Los hosts invocan capacidades directamente con referencias Kotlin tipadas. Los errores de tipo aparecen al compilar.
2. **Diseño modular** — Los módulos encapsulan dependencias por constructor y exponen capacidades tipadas (`Action` o `Feature`).
3. **Cancelación estructurada** — Core administra concurrencia, lifecycle y cleanup. Los consumidores no administran coroutines ni Flows.
4. **Kotlin Multiplatform** — Lógica compartida compilada nativamente para cada plataforma, sin capas de abstracción en runtime.
5. **Sin dinámica en Core** — Quedan prohibidos `Map<String, Any?>`, payloads genéricos, codecs, casts no comprobados, registry, instalación e invocación manual en la ruta local.

::: warning Lo que Leaf NO tiene (por diseño)
No hay contenedor DI global, no hay registro de módulos, no hay intents ni requests intermediarios, no hay serialización de eventos ni generación de código. La comunicación es directa y tipada.
:::

## Los tres artefactos

El ecosistema separa responsabilidades en tres artefactos publicados de forma independiente:

| Artefacto | Responsabilidad | No hace |
|---|---|---|
| `leaf-contracts` | Declara `Module`, `Action`, `Feature` y transiciones tipadas | Ejecutar sesiones o conocer UI |
| `leaf-core` | Ejecuta Actions y posee la sesión de una Feature: serialización de eventos, cancelación, resultado, presión y errores técnicos | Conocer reglas de dominio o renderizar UI |
| `leaf-compose` | Observa una sesión de Core y expone un holder para Compose | Crear otra sesión, cola o reducer |

```
┌─────────────────────────────────────────────┐
│                    Host                     │
│   (App Android / iOS que ensambla módulos)  │
└───────────────┬─────────────────────────────┘
                │ Leaf.run / Leaf.open / rememberLeaf
┌───────────────▼─────────────┐  ┌────────────────────┐
│         leaf-core           │  │    leaf-compose    │
│  (runtime: sesiones, cola,  │◄─┤ (adaptador Compose │
│  cancelación, telemetría)   │  │  de una sesión)    │
└───────────────┬─────────────┘  └────────────────────┘
                │ implementa
┌───────────────▼─────────────────────────────┐
│              leaf-contracts                 │
│  Module · ModuleInfo · Action · Feature ·   │
│  FeatureTransition (stay / finish)          │
└───────────────▲─────────────────────────────┘
                │ implementa
┌───────────────┴─────────────────────────────┐
│         Módulos de dominio                  │
│  leaf-login · leaf-*-payments · ...         │
│  (dominio + gateways + UI opcional)         │
└─────────────────────────────────────────────┘
```

## El paradigma Module → Capability → Host

- Un **Module** es un objeto local que implementa `Module`, encapsula sus dependencias (inyectadas por constructor) y publica capacidades como propiedades `val` tipadas.
- Una **capacidad** es una `Action<Input, Output>` (operación finita) o una `Feature<Input, State, Event, Output>` (interacción con estado).
- Un **Host** construye el módulo explícitamente y ejecuta sus capacidades con `Leaf.run` / `Leaf.open` / `Leaf.rememberLeaf`. El host conserva la navegación y decide con los resultados de dominio.

Las dependencias externas (APIs, servicios de identidad, pasarelas de pago) se modelan como **puertos**: interfaces declaradas dentro del módulo cuya implementación pertenece al host — arquitectura hexagonal (Ports & Adapters).

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Kotlin Multiplatform | `2.3.20` | Lógica de negocio compartida Android/iOS |
| Compose Multiplatform | `1.10.3` | UI declarativa multiplataforma |
| Gradle + AGP | `8.14.3` / `8.11.2` | Sistema de compilación |
| Android SDK | compileSdk 36, minSdk 24 | Target Android (AAR) |
| iOS | Arm64 + Simulator Arm64 | Framework estático nativo |
| kotlinx.coroutines | `1.10.2` | Concurrencia estructurada |
| GitHub Packages | — | Distribución de artefactos versionados |
| Kotlin Test | — | Testing en `commonTest` |
| ABI Validation | — | Estabilidad de la superficie pública |

## Organización del código

Cada pieza del ecosistema vive en su propio repositorio:

```
leaf_contracts/   → Contratos tipados KMP (Module, Action, Feature)
leaf_core/        → Runtime (Leaf.run, Leaf.open, FeatureSession)
leaf_compose/     → Adaptador Compose (rememberLeaf)
leaf_visuals/     → Sistema de diseño (en desarrollo)
leaf_login/       → Módulo de referencia (Feature + UI)
leaf_*_payments/  → Módulos de pagos (stubs)
```

Los paquetes Kotlin públicos son `com.ops.leaf_core.api` (contracts + core) y `com.ops.leaf_core.ui.compose` (compose). Los módulos de dominio nuevos usan `com.opside.leaf.<modulo>`.

::: info Compatibilidad binaria
Los paquetes históricos `com.ops.leaf_core.api` y `com.ops.leaf_core.ui.compose` se mantienen durante LEAF 2. La migración de namespace queda reservada para LEAF 3.
:::
