# Architecture and principles

## Design principles

1. **Typed local route** — Hosts invoke capabilities directly with typed Kotlin references. Type errors surface at compile time.
2. **Modular design** — Modules encapsulate dependencies via constructor and expose typed capabilities (`Action` or `Feature`).
3. **Structured cancellation** — Core manages concurrency, lifecycle, and cleanup. Consumers do not manage coroutines or Flows.
4. **Kotlin Multiplatform** — Shared logic compiled natively for each platform, with no abstraction layers at runtime.
5. **No dynamics in Core** — `Map<String, Any?>`, generic payloads, codecs, unchecked casts, registry, installation, and manual invocation are prohibited in the local route.

::: warning What Leaf does NOT have (by design)
There is no global DI container, no module registry, no intermediary intents or requests, no event serialization, and no code generation. Communication is direct and typed.
:::

## The three artifacts

The ecosystem separates responsibilities into three independently published artifacts:

| Artifact | Responsibility | Does not |
|---|---|---|
| `leaf-contracts` | Declares `Module`, `Action`, `Feature`, and typed transitions | Execute sessions or know about UI |
| `leaf-core` | Executes Actions and owns a Feature's session: event serialization, cancellation, result, backpressure, and technical errors | Know about domain rules or render UI |
| `leaf-compose` | Observes a Core session and exposes a holder for Compose | Create another session, queue, or reducer |

```
┌─────────────────────────────────────────────┐
│                    Host                     │
│  (Android / iOS app that assembles modules) │
└───────────────┬─────────────────────────────┘
                │ Leaf.run / Leaf.open / rememberLeaf
┌───────────────▼─────────────┐  ┌────────────────────┐
│         leaf-core           │  │    leaf-compose     │
│  (runtime: sessions, queue, │◄─┤ (Compose adapter    │
│  cancellation, telemetry)   │  │  for a session)     │
└───────────────┬─────────────┘  └────────────────────┘
                │ implements
┌───────────────▼─────────────────────────────┐
│              leaf-contracts                 │
│  Module · ModuleInfo · Action · Feature ·   │
│  FeatureTransition (stay / finish)          │
└───────────────▲─────────────────────────────┘
                │ implements
┌───────────────┴─────────────────────────────┐
│           Domain modules                    │
│  leaf-login · leaf-*-payments · ...         │
│  (domain + gateways + optional UI)          │
└─────────────────────────────────────────────┘
```

## The Module → Capability → Host paradigm

- A **Module** is a local object that implements `Module`, encapsulates its dependencies (injected via constructor), and publishes capabilities as typed `val` properties.
- A **capability** is an `Action<Input, Output>` (finite operation) or a `Feature<Input, State, Event, Output>` (stateful interaction).
- A **Host** constructs the module explicitly and executes its capabilities with `Leaf.run` / `Leaf.open` / `Leaf.rememberLeaf`. The host retains navigation and makes decisions based on domain results.

External dependencies (APIs, identity services, payment gateways) are modeled as **ports**: interfaces declared within the module whose implementation belongs to the host — hexagonal architecture (Ports & Adapters).

## Technology stack

| Technology | Version | Usage |
|---|---|---|
| Kotlin Multiplatform | `2.3.20` | Shared business logic for Android/iOS |
| Compose Multiplatform | `1.10.3` | Cross-platform declarative UI |
| Gradle + AGP | `8.14.3` / `8.11.2` | Build system |
| Android SDK | compileSdk 36, minSdk 24 | Android target (AAR) |
| iOS | Arm64 + Simulator Arm64 | Native static framework |
| kotlinx.coroutines | `1.10.2` | Structured concurrency |
| GitHub Packages | — | Versioned artifact distribution |
| Kotlin Test | — | Testing in `commonTest` |
| ABI Validation | — | Public surface stability |

## Code organization

Each piece of the ecosystem lives in its own repository:

```
leaf_contracts/   → Typed KMP contracts (Module, Action, Feature)
leaf_core/        → Runtime (Leaf.run, Leaf.open, FeatureSession)
leaf_compose/     → Compose adapter (rememberLeaf)
leaf_visuals/     → Design system (in development)
leaf_login/       → Reference module (Feature + UI)
leaf_*_payments/  → Payment modules (stubs)
```

Public Kotlin packages are `com.ops.leaf_core.api` (contracts + core) and `com.ops.leaf_core.ui.compose` (compose). New domain modules use `com.opside.leaf.<module>`.

::: info Binary compatibility
The historical packages `com.ops.leaf_core.api` and `com.ops.leaf_core.ui.compose` are maintained during LEAF 2. The namespace migration is reserved for LEAF 3.
:::
