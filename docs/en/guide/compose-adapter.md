# rememberLeaf and LeafComposeState

`leaf-compose` provides the stable adapter for Compose hosts:

```kotlin
@Composable
fun <Input, State, Event, Output> Leaf.Companion.rememberLeaf(
    feature: Feature<Input, State, Event, Output>,
    input: Input,
): LeafComposeState<State, Event, Output>
```

`rememberLeaf` opens Core's single session, exposes it as Compose observable state, and automatically closes it. The package is `com.ops.leaf_core.ui.compose`.

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

Its constructor is internal: the host receives an instance **exclusively** from `rememberLeaf`.

| Property | Meaning |
|---|---|
| `state` | Last published state; `null` while the session initializes |
| `result` | `null` while active; afterwards, exactly one terminal result |
| `isReady` | `true` when the session is ready to receive events |
| `send(event)` | Same disposition as `FeatureSession.send` |

## The composition key: `(feature, input)`

The pair `(feature, input)` **identifies the session**:

- Recomposition with the same pair → the session is preserved (no new one is opened).
- Either reference/value changes → Compose **closes the previous session and opens a new one**.
- Leaving composition → the session is closed.

::: warning An edit is an Event, not a new input
Do not change `input` on every keystroke: that replaces the entire session. Form edits travel as events (`leaf.send(EmailChanged(...))`).
:::

## State handling in the host

```kotlin
@Composable
fun Login(module: LoginModule) {
    val leaf = Leaf.rememberLeaf(module.login, LoginInput())

    when {
        !leaf.isReady && leaf.result == null -> Loading()
        leaf.result is FeatureSessionResult.Failed -> TechnicalFailure()
        else -> LoginContent(state = leaf.state, onEvent = leaf::send)
    }
}
```

If `initialState` fails, `rememberLeaf` publishes `Failed(INITIALIZATION_FAILED)`, leaves `isReady` as `false`, and **does not expose the throwable**.

## Anti-patterns

- Do not open another session in `LaunchedEffect`.
- Do not store the session (or `LeafComposeState`) in a ViewModel.
- Do not manually collect session flows to create another UI state.
- Do not implement a reducer or parallel queue in the host.
- Do not change `input` for every user interaction.

`LeafComposeState` reflects Core's single session; duplicating it breaks unique terminality and the managed lifecycle.
