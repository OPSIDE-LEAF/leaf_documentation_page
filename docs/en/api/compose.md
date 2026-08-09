# leaf-compose

`com.opside-leaf:leaf-compose:%LEAF_VERSION%` · package `com.ops.leaf_core.ui.compose` · [repo](https://github.com/OPSIDE-LEAF/leaf-compose)

Compose adapter: observes the single Core session and exposes an observable holder. Does not create another session, queue, or reducer.

## Leaf.rememberLeaf

```kotlin
@Composable
fun <Input, State, Event, Output> Leaf.Companion.rememberLeaf(
    feature: Feature<Input, State, Event, Output>,
    input: Input,
): LeafComposeState<State, Event, Output>
```

- The pair `(feature, input)` is the **composition key**: it identifies the session.
- Recomposition with the same pair preserves the session; changing it closes the previous one and opens a new one.
- Leaving composition closes the session (automatic disposal).
- If `initialState` fails: publishes `Failed(INITIALIZATION_FAILED)`, leaves `isReady = false`, does not expose the throwable.

## LeafComposeState

```kotlin
@Stable
class LeafComposeState<State, Event, Output> internal constructor() {
    var state: State? by mutableStateOf(null)
        private set

    var result: FeatureSessionResult<Output>? by mutableStateOf(null)
        private set

    var isReady: Boolean by mutableStateOf(false)
        private set

    fun send(event: Event): FeatureSendResult
}
```

Internal constructor: the only way to obtain an instance is `rememberLeaf`.

| Member | Semantics |
|---|---|
| `state` | Last published state; `null` during initialization |
| `result` | `null` while active; afterwards exactly one `FeatureSessionResult` |
| `isReady` | `true` when the session accepts events |
| `send(event)` | Same disposition as `FeatureSession.send` (`ACCEPTED` / `REJECTED_*`) |

See [usage guide](/en/guide/compose-adapter) and [anti-patterns](/en/guide/compose-adapter#anti-patterns).
