# leaf-core

Workflow is official without opt-in in the local `%LEAF_WORKFLOW_VERSION%` Contracts, Core and Compose promotion. It is not published to GitHub Packages. See [Workflow](/en/guide/workflow).

`com.opside-leaf:leaf-core:%LEAF_VERSION%` · package `com.ops.leaf_core.api` · [repo](https://github.com/OPSIDE-LEAF/leaf-core)

Ecosystem runtime: executes Actions and owns Feature sessions (event serialization, cancellation, result, backpressure, technical errors). It also executes [Workflow](/en/api/workflow) sessions. It does not know domain rules or render UI.

## Leaf.run

```kotlin
class Leaf private constructor() {
    companion object {
        suspend fun <Input, Output> run(
            action: Action<Input, Output>,
            input: Input,
            telemetry: LeafTelemetry = LeafTelemetry.None
        ): Output
    }
}
```

Executes an Action. On unexpected failure, throws a redacted `LeafException`; `CancellationException` propagates.

## Leaf.open

```kotlin
suspend fun <Input, State, Event, Output> Leaf.Companion.open(
    feature: Feature<Input, State, Event, Output>,
    input: Input,
): FeatureSession<State, Event, Output>
```

Creates a `FeatureSession` that is a **child of the current coroutine** (requires `Job` in context).

## FeatureSession

```kotlin
interface FeatureSession<State, Event, Output> {
    val state: StateFlow<State>
    val result: StateFlow<FeatureSessionResult<Output>?>
    val metrics: StateFlow<FeatureSessionMetrics>
    val isActive: Boolean
    fun send(event: Event): FeatureSendResult
    fun cancel()
    fun close()
}
```

`send` never suspends. `cancel()` and `close()` are idempotent. See [full semantics](/en/guide/feature-session).

## FeatureSendResult

```kotlin
enum class FeatureSendResult { ACCEPTED, REJECTED_TERMINATED, REJECTED_OVERFLOW }
```

## FeatureSessionResult

```kotlin
sealed interface FeatureSessionResult<out Output> {
    data class Completed<Output>(val output: Output) : FeatureSessionResult<Output>
    data object Cancelled : FeatureSessionResult<Nothing>
    data class Failed(val failure: FeatureTechnicalFailure) : FeatureSessionResult<Nothing>
}
```

`result` is `null` while the session is active; afterwards it retains exactly one value.

## FeatureTechnicalFailure

```kotlin
enum class FeatureTechnicalFailure { INITIALIZATION_FAILED, EVENT_QUEUE_OVERFLOW, TRANSITION_FAILED }
```

No payloads or throwable messages.

## FeatureSessionTerminalCause

```kotlin
enum class FeatureSessionTerminalCause { COMPLETED, CANCELLED, EVENT_QUEUE_OVERFLOW, TRANSITION_FAILED }
```

## FeatureSessionMetrics

```kotlin
// StateFlow<FeatureSessionMetrics> in the session
val eventQueueOverflowCount: Long
val terminalCause: FeatureSessionTerminalCause?
```

## LeafException

Redacted technical error. Its constructor is internal and its only additional public property is `moduleInfo`. `LeafOperation` is internal too: it contributes a safe description to the message but consumers cannot read it as a property. The input, state, and original message are never retained.

## LeafTelemetry

```kotlin
fun interface LeafTelemetry {
    fun record(event: LeafTelemetryEvent)
    companion object { val None: LeafTelemetry }
}
```

### LeafTelemetryEvent

| Field | Values |
|---|---|
| `moduleInfo` | Module identity |
| `phase` | `STARTED`, `FINISHED` |
| `duration` | Operation duration |
| `result` | `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED` |

Best-effort and isolated: no input, state, event, output, throwable, or PII. A hook failure does not alter execution.

`LeafTelemetryPhase.FINISHED` remains the name of a technical phase. It is independent from `FeatureSessionResult.Completed` and `FeatureSessionTerminalCause.COMPLETED`.
