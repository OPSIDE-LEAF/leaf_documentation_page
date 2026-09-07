# `leaf-core`

`leaf-core` %LEAF_VERSION% runs Actions and manages Workflow sessions. The module describes the business rule; Core keeps events in order, runs effects, and stores one final result.

## Entry points

<!-- kotlin-snippet: reference: core-entry -->
```kotlin
class Leaf private constructor() {
    companion object {
        suspend fun <Input, Output> run(
            action: Action<Input, Output>,
            input: Input,
            telemetry: LeafTelemetry = LeafTelemetry.None,
        ): Output
    }
}

suspend fun <Input, State, Event, Effect, Output> Leaf.Companion.open(
    workflow: Workflow<Input, State, Event, Effect, Output>,
    input: Input,
): WorkflowSession<State, Event, Output>
```

Call `Leaf.open` from a coroutine with a `Job`. The session belongs to that coroutine. The overload that receives `LeafTelemetry` only records technical information; it does not change the result.

## Workflow session

<!-- kotlin-snippet: reference: core-session -->
```kotlin
interface WorkflowSession<out State, in Event, out Output> {
    val states: Flow<State>
    fun send(event: Event): WorkflowSendResult
    suspend fun awaitOutcome(): WorkflowOutcome<Output>
    fun cancel()
}
```

`send` answers immediately: `ACCEPTED` when it received the event, `REJECTED_OVERFLOW` when the queue is full, and `REJECTED_CLOSED` when the session already ended. A full queue does not close an active session. `awaitOutcome()` waits for the final result: `Completed(output)`, `Failed(reason)`, or `Cancelled`. Workflow has no public `close()`; use `cancel()` when the app leaves the session.

## Feature reference

`FeatureSession` keeps `state`, `result`, `metrics`, and `isActive`, and allows `send`, `cancel`, and `close`. In Core, `close()` does the same as cancelling. This API remains as a reference; use the Workflow API to implement new UI.
