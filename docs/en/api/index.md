# API Reference

Reference for the `%LEAF_VERSION%` train and local `%LEAF_WORKFLOW_VERSION%` promotion, organized by artifact. Workflow is an official API without opt-in in the latter; validation uses only Maven Local, not GitHub Packages.

| Artifact | Package | Contents |
|---|---|---|
| [leaf-contracts](/en/api/contracts) | `com.ops.leaf_core.api` | `Module`, `ModuleInfo`, `Action`, `Feature`, `FeatureTransition`, DSLs, and capacity constants |
| [leaf-core](/en/api/core) | `com.ops.leaf_core.api` | `Leaf.run`, `Leaf.open`, `FeatureSession`, results and failures, `LeafException`, `LeafTelemetry` |
| [leaf-compose](/en/api/compose) | `com.ops.leaf_core.ui.compose` | `Leaf.rememberLeaf`, `LeafComposeState` |
| [Workflow](/en/api/workflow) | Contracts, Core and Compose `%LEAF_WORKFLOW_VERSION%` (Maven Local) | Official `Workflow`, steps, `EffectHandler`, session, outcome and Compose holder |

The three repositories validate their public surface with ABI dumps. The `com.ops.leaf_core.*` packages remain. The old marker exists for compatibility but does not annotate Workflow in the local promotion.

## Separation of responsibilities

| Artifact | Responsibility | Does not |
|---|---|---|
| `leaf-contracts` | Declare typed Action, Feature, and Workflow contracts | Execute sessions or know about UI |
| `leaf-core` | Execute Actions and own Feature/Workflow sessions | Know domain rules or render UI |
| `leaf-compose` | Observe sessions and expose Compose holders | Create another session, queue, reducer, or handler |
