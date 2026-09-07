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

A Workflow answers with one of three steps: `Continue` to show a new state, `Emit` to request work, or `Complete` to finish. Create them with `continueWorkflow`, `emitEffect`, and `completeWorkflow`. `initialize` and `reduce` choose a step immediately; they do not wait for a network call or database. `eventBufferCapacity` must be between 1 and `MAX_FEATURE_EVENT_CAPACITY`.

Contracts also includes `Feature<Input, State, Event, Output>` as an older API. Its reducer returns `FeatureTransition`. Use `Workflow` for new modules that require UI.
