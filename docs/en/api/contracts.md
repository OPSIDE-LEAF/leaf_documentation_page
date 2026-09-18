# `leaf-contracts`

`leaf-contracts` %LEAF_VERSION% defines the public `Action` and `Workflow` interfaces and the types that control their transitions. It does not open sessions, make network calls, or include a UI implementation.

## Action

An `Action` represents a one-time task. It receives data, does its work, and returns an answer. For example, it can receive a quantity and return a quote. It does not keep screen state or coordinate several steps.

<!-- kotlin-snippet: reference: contracts-action -->
```kotlin
interface Action<Input, Output> {
    val moduleInfo: ModuleInfo
    suspend fun execute(input: Input): Output
}

fun <Input, Output> action(
    moduleInfo: ModuleInfo,
    execute: suspend (Input) -> Output,
): Action<Input, Output>
```

## Workflow

Use `Workflow` as the public contract whenever a module requires UI. Its types can represent the state and events of one screen or internal navigation across several screens. `Output` communicates the final result to the host app.

<!-- kotlin-snippet: reference: contracts-workflow -->
```kotlin
interface Workflow<in Input, State, Event, Effect, out Output> {
    val moduleInfo: ModuleInfo
    val eventBufferCapacity: Int
    fun initialize(input: Input): WorkflowStep<State, Effect, Output>
    fun reduce(state: State, event: Event): WorkflowStep<State, Effect, Output>
    val effectHandler: EffectHandler<Effect, Event>
}

fun interface EffectHandler<Effect, Event> {
    suspend fun handle(effect: Effect): Event
}
```

A Workflow answers with one of three steps. `initialize` and `reduce` choose a step immediately; they do not wait for a network call or database.

| Decision | Result |
| --- | --- |
| `continueWorkflow(state)` | publishes state and accepts another event |
| `emitEffect(state, effect)` | publishes state and requests one effect |
| `completeWorkflow(output)` | fixes the single successful outcome |

When you choose `Emit`, Core first publishes the state. It then calls `EffectHandler.handle` to do slow work (saving, calling a service). That handler returns an event and Core sends it back to the reducer. While that work is pending, the screen must disable the action that would start another effect. If a second effect is attempted, Core ends with `WorkflowOutcome.Failed`.

### How a Workflow ends

| Outcome | Meaning |
| --- | --- |
| `Completed(output)` | Delivers the business result |
| `Failed(reason)` | Technical problem while starting, reducing, running an effect, or double effect |
| `Cancelled` | The screen or its coroutine left the flow before it finished |

`eventBufferCapacity` must be between 1 and `MAX_FEATURE_EVENT_CAPACITY`. The [Workflow guide](/en/guide/workflow) explains how to start a session, present screens, send events, and handle the final result.

Contracts also includes `Feature<Input, State, Event, Output>` as an older API. Its reducer returns `FeatureTransition`. Use `Workflow` for new modules that require UI.
