# What is Leaf?

**Leaf** is an ecosystem for cross-platform mobile development built on **Kotlin Multiplatform** and **Compose Multiplatform**. It allows structuring applications as sets of independent, reusable, and decoupled modules that are shared between Android and iOS while preserving native performance.

Its core provides **local and direct** capabilities: Module Authors expose `Action<Input, Output>` or `Feature<Input, State, Event, Output>` values, and hosts execute them in a single statement via `Leaf.run`, `Leaf.open`, or the Compose adapter `Leaf.rememberLeaf`.

```kotlin
// The Author defines the capability
val login: Feature<LoginInput, LoginState, LoginEvent, LoginResult>

// The host executes it in a single statement
val leaf = Leaf.rememberLeaf(module.login, LoginInput())
```

::: tip The primary route is local and direct
No module registration, payload maps, codecs, or code generation required. Integrating a module means instantiating it and calling it — and if something doesn't fit, you'll see it at compile time.
:::

## The problem it solves

Mobile development faces a structural contradiction:

| Route | Advantage | Cost |
|---|---|---|
| **Traditional native** | Maximum UX quality | Doubles teams, budgets, and timelines (Swift/iOS + Kotlin/Android) |
| **Hybrid frameworks** (Flutter, React Native) | Reduces costs and timelines | Intermediate abstraction layers that compromise performance and organic integration with each platform |

Leaf operates at the intersection that neither alternative covers: **shared code that produces applications indistinguishable from those developed with native SDKs**. Kotlin Multiplatform introduces no abstraction layers at runtime — shared code compiles to JVM bytecode for Android and to a native framework for iOS.

## Value proposition

Instead of building each application from scratch, projects are assembled from **pre-built, reusable, and independently compilable modules**, distributed as versioned artifacts via GitHub Packages.

Each module:

- Encapsulates its dependencies via constructor and exposes ready-to-use capabilities (`Action` or `Feature`).
- Is compiled, tested, and published independently (with its own semantic versioning).
- Models its external dependencies as ports (interfaces) that the host implements.
- Validates its public surface with ABI validation and a *clean consumer*.

## Who is it for?

- **Teams and agencies** that need to deliver Android + iOS without duplicating codebases.
- **Startups** looking to reduce time-to-market without compromising the native experience.
- **Module Authors** who want to distribute reusable capabilities with stable contracts.
- **KMP developers** looking for a reference modular architecture.

## Quick comparison

| | Native x2 | Flutter / RN | **Leaf (KMP)** |
|---|---|---|---|
| Native performance | ✅ | ⚠️ Intermediate layer | ✅ Native compilation |
| Shared code | ❌ | ✅ | ✅ Logic + UI (Compose MP) |
| Maintenance | Two codebases | One codebase + native bridges | **One shared codebase** |
| Versioned reusable modules | Manual | Manual | ✅ Native to the ecosystem |
| Team duplication | ✅ Required | ❌ | ❌ |

## Next steps

- [Architecture and principles](/en/guide/architecture) — how the ecosystem is built.
- [Installation](/en/guide/installation) — set up credentials and dependencies.
- [Your first Action](/en/guide/quickstart-action) — Hello World in 5 minutes.
