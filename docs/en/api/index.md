# API Reference

Reference for the public surface of the `%LEAF_VERSION%` train, organized by artifact. Action and Feature are stable; Workflow is included as an opt-in preview.

| Artifact | Package | Contents |
|---|---|---|
| [leaf-contracts](/en/api/contracts) | `com.ops.leaf_core.api` | `Module`, `ModuleInfo`, `Action`, `Feature`, `FeatureTransition`, DSLs, and capacity constants |
| [leaf-core](/en/api/core) | `com.ops.leaf_core.api` | `Leaf.run`, `Leaf.open`, `FeatureSession`, results and failures, `LeafException`, `LeafTelemetry` |
| [leaf-compose](/en/api/compose) | `com.ops.leaf_core.ui.compose` | `Leaf.rememberLeaf`, `LeafComposeState` |
| [Workflow preview](/en/api/workflow) | Contracts, Core, and Compose | `Workflow`, steps, `EffectHandler`, session, outcome, and Compose holder; all experimental |

The three repositories validate their public surface with ABI dumps. The historical `com.ops.leaf_core.*` packages remain in `3.0.0`; this release does not migrate the namespace. Workflow's experimental marker remains part of its contract.

## Separation of responsibilities

| Artifact | Responsibility | Does not |
|---|---|---|
| `leaf-contracts` | Declare typed Action, Feature, and Workflow contracts | Execute sessions or know about UI |
| `leaf-core` | Execute Actions and own Feature/Workflow sessions | Know domain rules or render UI |
| `leaf-compose` | Observe sessions and expose Compose holders | Create another session, queue, reducer, or handler |
