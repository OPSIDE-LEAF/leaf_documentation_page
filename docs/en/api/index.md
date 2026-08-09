# API Reference

Reference for the stable public surface of the `%LEAF_VERSION%` train, organized by artifact.

| Artifact | Package | Contents |
|---|---|---|
| [leaf-contracts](/en/api/contracts) | `com.ops.leaf_core.api` | `Module`, `ModuleInfo`, `Action`, `Feature`, `FeatureTransition`, DSLs `action`/`feature`/`stay`/`finish`, capacity constants |
| [leaf-core](/en/api/core) | `com.ops.leaf_core.api` | `Leaf.run`, `Leaf.open`, `FeatureSession`, results and failures, `LeafException`, `LeafTelemetry` |
| [leaf-compose](/en/api/compose) | `com.ops.leaf_core.ui.compose` | `Leaf.rememberLeaf`, `LeafComposeState` |

The stability of these surfaces is guaranteed with ABI validation (`api/` dumps in each repository). The historical packages are maintained during LEAF 2; the namespace migration is reserved for LEAF 3.

## Separation of responsibilities

| Artifact | Responsibility | Does not |
|---|---|---|
| `leaf-contracts` | Declare typed contracts | Execute sessions or know about UI |
| `leaf-core` | Execute Actions and own Feature sessions | Know domain rules or render UI |
| `leaf-compose` | Observe a session and expose a Compose holder | Create another session, queue, or reducer |
