# FeatureSession: lifecycle and backpressure

`Leaf.open` creates a `FeatureSession` owned by Core. The host observes and sends; Core manages the queue, event serialization, cancellation, and the result.

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

## Guaranteed semantics

- **Bounded queue** -- default capacity 16, range 1..1,024 (`DEFAULT_FEATURE_EVENT_CAPACITY` / `MAX_FEATURE_EVENT_CAPACITY`). Never `Channel.UNLIMITED`.
- **Send never suspends** -- `send` is linearized against termination; pressure fails fast with `REJECTED_OVERFLOW`.
- **Single terminality** -- `finish` produces exactly one result; late events are rejected with `REJECTED_TERMINATED`.
- **Structured cancellation** -- the session is a child of the coroutine that called `Leaf.open`; if the host is cancelled, the session is cancelled. `cancel()` and `close()` are idempotent.
- **Safe initialization** -- if `initialState(input)` throws, Core produces `LeafException` with operation `FEATURE_INITIALIZATION` (in Compose: `Failed(INITIALIZATION_FAILED)`).

## `send` disposition

```kotlin
enum class FeatureSendResult { ACCEPTED, REJECTED_TERMINATED, REJECTED_OVERFLOW }
```

| Result | Meaning and host action |
|---|---|
| `ACCEPTED` | The event entered the queue; Core will reduce it serially. |
| `REJECTED_OVERFLOW` | The queue is full and the session terminates with `EVENT_QUEUE_OVERFLOW`. Report a safe technical state and review event overproduction. |
| `REJECTED_TERMINATED` | The session has already finished or been closed. Do not retry blindly. |

## Terminal result

While the session is active, `result` is `null`. Afterwards it retains exactly one of:

```kotlin
sealed interface FeatureSessionResult<out Output> {
    data class Finished<Output>(val output: Output) : FeatureSessionResult<Output>
    data object Cancelled : FeatureSessionResult<Nothing>
    data class Failed(val failure: FeatureTechnicalFailure) : FeatureSessionResult<Nothing>
}
```

The possible technical failures are `INITIALIZATION_FAILED`, `EVENT_QUEUE_OVERFLOW`, and `TRANSITION_FAILED`. They are designed to **contain no payloads or messages** from throwables.

## Metrics

```kotlin
// FeatureSessionMetrics
val eventQueueOverflowCount: Long
val terminalCause: FeatureSessionTerminalCause? // FINISHED, CANCELLED, EVENT_QUEUE_OVERFLOW, TRANSITION_FAILED
```

Payload-free metrics: only the overflow counter and the terminal cause.

## Host pattern without UI

```kotlin
suspend fun runCounter(module: CounterModule) {
    val session = Leaf.open(module.counter, Unit)
    try {
        session.send(CounterEvent.Increment)
        session.result.collect { result ->
            if (result is FeatureSessionResult.Finished) {
                persistCount(result.output.value)
            }
        }
    } finally {
        session.close()
    }
}
```

::: warning The host does not duplicate Core
Do not implement a reducer, a queue, or a parallel session in the host. A single `FeatureSession` per `Leaf.open`, managed by Core.
:::
