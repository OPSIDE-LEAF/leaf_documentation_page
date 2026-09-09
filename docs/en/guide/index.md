# What is Leaf?

**Leaf** is an ecosystem for cross-platform mobile development built on **Kotlin Multiplatform** and **Compose Multiplatform**. It lets you structure applications as sets of independent, reusable, and decoupled modules shared between Android and iOS while preserving native performance.

::: tip <kbd>LEAF %LEAF_VERSION%</kbd>
Separates module rules from the infrastructure of a Kotlin application. Contracts defines types, Core runs Actions and Workflow sessions, and Compose connects a Workflow to its UI. The module controls its rules and, when it provides UI, its screens and internal navigation. The host app provides network, storage, and other external capabilities; it also decides where to open the module and what to do with its result.
:::

The name LEAF represents this idea. Each module is a reusable **leaf**. The host app is the **trunk** that connects the leaves, provides their infrastructure, and decides how they fit into the product. Together they form the tree: an application composed of independent modules that collaborate through public contracts.

![LEAF: the tree metaphor](/images/guide/fig-tree-metaphor.svg)

## The problem it solves

Many applications need the same kinds of capabilities: authentication, payments, forms, validation, search, or data selection. Reimplementing them in every project takes time and forces teams to solve the same errors, tests, and security decisions repeatedly.

**LEAF** lets a complete capability be encapsulated in a module with a clear contract. After that module is built and tested, it can be integrated into more than one application. The team spends less time repeating known work and can deliver the product-specific features that create value sooner.

Mobile development faces a structural contradiction:

| Path | Advantage | Cost |
|---|---|---|
| **Traditional native** | Maximum UX quality | Doubles teams, budgets, and timelines (Swift/iOS + Kotlin/Android) |
| **Hybrid frameworks** (Flutter, React Native) | Reduces costs and timelines | Intermediate abstraction layers that compromise performance and organic platform integration |

Leaf operates at the intersection that neither alternative covers: **shared code that produces applications indistinguishable from those built with native SDKs**. Kotlin Multiplatform introduces no abstraction layers at runtime — shared code compiles to JVM bytecode for Android and to a native framework for iOS.

Reuse does not mean trusting a module without checking it. A module should keep its tests, versions, security review, and integration checks. By placing common logic in one location, a correction or improvement can benefit every application that adopts an updated module version.

## Value proposition

Instead of building each application from scratch, projects are assembled from **pre-built, reusable, independently compilable modules**, distributed as versioned artifacts.

Each module:

- Encapsulates its dependencies by constructor and exposes ready-to-use capabilities (`Action` or `Workflow`).
- Compiles, tests, and publishes independently (its own semantic versioning).
- Models its external dependencies as ports (interfaces) that the host implements.

## Who is it for?

- **Teams and agencies** that need to deliver Android + iOS without duplicating codebases.
- **Startups** looking to reduce time-to-market without compromising the native experience.
- **Enterprises** looking to reduce mobile application development and maintenance costs.
- **Module authors** who want to distribute reusable capabilities with stable contracts.
- **KMP developers** looking for a modular reference architecture.

## Quick comparison

| | Native x2 | Flutter / RN | **Leaf (KMP)** |
|---|---|---|---|
| Native performance | ✅ | ⚠️ Intermediate layer | ✅ Native compilation |
| Shared code | ❌ | ✅ | ✅ Logic + UI (Compose MP) |
| Maintenance | Two codebases | One base + native bridges | **One shared base** |
| Versioned reusable modules | Manual | Manual | ✅ Native to the ecosystem |
| Team duplication | ✅ Required | ❌ | ❌ |

## Recommended sections

1. [Concepts](/en/guide/architecture): learn what each part does and when to choose Action or Workflow.
2. [Integrate](/en/guide/installation): add the required dependencies and use an Action or Workflow in your app.
3. [Build](/en/guide/module-contract): define the contract, implement the rules, and test the module.
4. [Evaluate](/en/guide/adoption): review responsibilities and decide whether the architecture fits your product.

Use an Action for a finite operation that does not require UI. Use a Workflow whenever the module requires UI, whether that UI contains one screen or internal navigation across several screens. See [Action vs Workflow](/en/guide/action-vs-workflow) for the complete differences.
