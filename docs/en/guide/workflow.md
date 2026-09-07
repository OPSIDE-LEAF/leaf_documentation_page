# Workflow: official API

`Workflow<Input, State, Event, Effect, Output>` models an interaction where state reduction is synchronous and Core executes suspending effects. It is an official API requiring no opt-in in Contracts, Core and Compose `%LEAF_WORKFLOW_VERSION%`.

::: info Local distribution
This version is validated and distributed only through Maven Local. It is not published to GitHub Packages. Build Contracts, Core and Compose in that order with `publishToMavenLocal` and use `-Pleaf.useMavenLocal=true`. The old marker remains for compatibility, but no Workflow surface requires it.
:::

## When to use it

| Capability | Use it when |
|---|---|
| `Action` | A suspending operation ends with an output and publishes no interactive state. |
| `Feature` | A suspending reducer transforms events and state; the Feature owns its asynchronous logic. |
| `Workflow` | You want synchronous reduction and suspending effects that Core executes and feeds back as events. |

Workflow is not a required next stage for Feature. Both contracts coexist.

## Reduce first, execute afterwards

`initialize` and `reduce` are not `suspend` functions. Each call returns exactly one `WorkflowStep`:

```kotlin
sealed interface WorkflowStep<out State, out Effect, out Output> {
    data class Continue<State>(val state: State) : WorkflowStep<State, Nothing, Nothing>
    data class Emit<State, Effect>(val state: State, val effect: Effect) :
        WorkflowStep<State, Effect, Nothing>
    data class Complete<Output>(val output: Output) :
        WorkflowStep<Nothing, Nothing, Output>
}
```

- `Continue` publishes state and waits for another event.
- `Emit` publishes state first, then requests an effect.
- `Complete` fixes the successful outcome exactly once.

The matching helpers are `continueWorkflow`, `emitEffect`, and `completeWorkflow`.

## The runtime owns effects

The Author provides an `EffectHandler<Effect, Event>`. Core invokes it as a child of the session and feeds its result back into the serial reducer:

```kotlin
val checkout = workflow<CheckoutInput, CheckoutState, CheckoutEvent, CheckoutEffect, CheckoutOutput>(
    moduleInfo = info,
    initialize = { input ->
        continueWorkflow(CheckoutState(orderId = input.orderId, loading = false))
    },
    reduce = { state, event ->
        when (event) {
            CheckoutEvent.Submit -> emitEffect(
                state.copy(loading = true),
                CheckoutEffect.Charge(state.orderId),
            )
            is CheckoutEvent.ChargeFinished -> {
                if (event.approved) completeWorkflow(CheckoutOutput.Paid)
                else continueWorkflow(state.copy(loading = false, error = "Rejected"))
            }
            CheckoutEvent.Cancel -> completeWorkflow(CheckoutOutput.Cancelled)
        }
    },
    effectHandler = EffectHandler { effect ->
        when (effect) {
            is CheckoutEffect.Charge ->
                CheckoutEvent.ChargeFinished(gateway.charge(effect.orderId))
        }
    },
)
```

The host does not invoke the handler, retry effects, or create another coordinator. Model expected rejections as domain events. An unexpected handler exception ends with `Failed(EFFECT_FAILED)`.

The first version allows one active effect. A second `Emit` while the previous effect is pending ends with `Failed(SECOND_EFFECT_WHILE_PENDING)`; the second step's state is not published.

## Opening and closing a session

```kotlin
suspend fun runCheckout(
    workflow: Workflow<CheckoutInput, CheckoutState, CheckoutEvent, CheckoutEffect, CheckoutOutput>,
) {
    val session = Leaf.open(workflow, CheckoutInput("order-1"))
    try {
        session.send(CheckoutEvent.Submit)
        when (val outcome = session.awaitOutcome()) {
            is WorkflowOutcome.Completed -> show(outcome.output)
            is WorkflowOutcome.Failed -> showTechnicalFailure(outcome.reason)
            WorkflowOutcome.Cancelled -> Unit
        }
    } finally {
        session.cancel()
    }
}
```

`Leaf.open` requires a `Job` in the calling coroutine and creates a child session. `states` exposes domain states. `awaitOutcome()` returns `Completed`, `Failed`, or `Cancelled` after child-job cleanup; `cancel()` is idempotent.

### Event admission

| `WorkflowSendResult` | Meaning |
|---|---|
| `ACCEPTED` | The event entered the bounded external queue. |
| `REJECTED_OVERFLOW` | The queue is full. The session remains active; decide explicitly how to report or retry. |
| `REJECTED_CLOSED` | The session was cancelled or reached a terminal outcome. |

Workflow overflow is non-terminal. The internal lane that returns handler events is separate from the external queue.

## Compose and session identity

```kotlin
@Composable
fun CheckoutRoute(module: CheckoutModule, orderId: String) {
    val workflow = remember(module) { module.createCheckoutWorkflow() }
    val holder = Leaf.rememberLeafWorkflowHolder(
        workflow = workflow,
        input = CheckoutInput(orderId),
        sessionKey = orderId,
    )

    when (val snapshot = holder.snapshot.value) {
        WorkflowSnapshot.Initializing -> Loading()
        is WorkflowSnapshot.Active -> CheckoutScreen(snapshot.state, holder::send)
    }
}
```

Identity combines `workflow` reference identity (`===`) with Compose equality for `sessionKey`. The default is `sessionKey = input`. A stable key captures the input used to open the session; later `input` changes do not restart or alter it. Changing the Workflow reference or using a non-equal key creates another holder and cancels the previous one. Leaving composition also cancels.

`LeafWorkflowHolder.send` delegates once to Core, with no local queue or retry. Before an active session exists and after closing it returns `REJECTED_CLOSED`; `REJECTED_OVERFLOW` remains a non-terminal rejection.

## Telemetry and privacy

The `Leaf.open(workflow, input, telemetry)` overload reuses `LeafTelemetry`. It emits `STARTED/RUNNING` when opening and one `FINISHED` event after cleanup, mapped to `SUCCEEDED`, `FAILED`, or `CANCELLED`. Callbacks are best-effort: their failure cannot change state, outcome, or cleanup.

Technical telemetry contains only `moduleInfo`, phase, duration, and result. It neither retains nor converts Input, State, Event, Effect, Output, or Throwable to text. State and outcome observed through Compose are UI data; the host decides how to protect them.

See the [complete API reference](/en/api/workflow) and [Feature migration](/en/guide/feature-migration).
