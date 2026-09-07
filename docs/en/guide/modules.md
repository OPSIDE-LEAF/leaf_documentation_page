# Reusable modules and `ModuleInfo`

A module encapsulates one complete capability required by an application. It can handle authentication, payments, validation, forms, or another function that commonly appears in several projects. Instead of implementing that logic again, an application integrates the module through its public contract.

## Why reuse modules

Common capabilities are good candidates for modules because they usually require the same rules, error cases, and security measures across different applications. Solving them once makes the work reusable and prevents every team from starting at zero.

The benefit is not limited to writing less code. Design decisions, tests, error handling, and security controls are reused as well. This shortens the time required to deliver a known capability and lets teams spend more effort on the features that distinguish the product and create value for its users.

LEAF supports this reuse through small, explicit contracts. A module with one clear responsibility can evolve and be tested independently. The consuming application keeps control of its infrastructure, appearance, and external navigation.

## Leaves and tree

Each LEAF module works as a **leaf** ready to be connected to an application. The host works as the **trunk**: it constructs modules, supplies network, storage, SDKs, and other external capabilities, and decides how they relate within the product. Together they form a tree without forcing every leaf to depend on the others.

Modularization does not mean turning every small function into a separate project. Extract a capability when it has a complete responsibility, a stable contract, and a realistic chance of being reused. This lets the catalog grow with useful modules instead of fragments that are difficult to integrate.

## What makes a module trustworthy

A reusable module should include tests for its rules, error cases, and security boundaries. It also needs a versioned contract and integration tests from a consuming application. Modules with UI should test their states, events, internal navigation, and results. Modules that handle sensitive data should also review data exposure, dependencies, and permissions.

No software can guarantee the complete absence of bugs or vulnerabilities. The goal is to reduce that risk by centralizing common logic, testing it repeatedly, and correcting it in one module. Applications receive those improvements when they adopt the corrected version.

## Identity and public API

A module implements `Module` and exposes functions that other projects can use through properties. `ModuleInfo(id, version)` identifies the module and its version in errors and telemetry.

<!-- kotlin-snippet: compiled: modules-action -->
```kotlin
import com.ops.leaf_core.api.Action
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.action

data class QuoteRequest(val quantity: Int)
data class Quote(val totalMinorUnits: Long)

class QuoteModule(
    private val calculate: suspend (QuoteRequest) -> Quote,
) : Module {
    override val info = ModuleInfo("com.example.quote", "1.0.0")
    val quote: Action<QuoteRequest, Quote> = action(info, calculate)
}
```

## Module boundaries

The constructor declares the external capabilities required by the module. The host provides them; the module must not obtain global services or require a particular network, storage, or permissions technology.

If the module provides no UI, expose an Action. If it provides any UI, expose a Workflow and define its states, events, effects, and output in the contract. The Workflow can control one or more screens and its internal navigation. The host controls where the module opens and what happens outside it after receiving the output.
