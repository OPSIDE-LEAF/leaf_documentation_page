# Workflow API

Official surface of Contracts, Core and Compose `%LEAF_WORKFLOW_VERSION%`, requiring no opt-in.

## Distribution and compatibility

This version is validated exclusively in Maven Local; it is not published to GitHub Packages. Build the three repositories in order and enable `-Pleaf.useMavenLocal=true` in the consumer. The earlier `%LEAF_VERSION%` line retains its experimental behavior. `ExperimentalLeafWorkflowApi` remains as a compatibility marker for old imports but no longer annotates this surface.

## Contracts

```kotlin
interface Workflow<in Input, State, Event, Effect, out Output> {
    val moduleInfo: ModuleInfo
    val eventBufferCapacity: Int
    fun initialize(input: Input): WorkflowStep<State, Effect, Output>
    fun reduce(state: State, event: Event): WorkflowStep<State, Effect, Output>
    val effectHandler: EffectHandler<Effect, Event>
}

fun <Input, State, Event, Effect, Output> workflow(
    moduleInfo: ModuleInfo,
    eventBufferCapacity: Int = 16,
    initialize: (Input) -> WorkflowStep<State, Effect, Output>,
    reduce: (State, Event) -> WorkflowStep<State, Effect, Output>,
    effectHandler: EffectHandler<Effect, Event>,
): Workflow<Input, State, Event, Effect, Output>

fun interface EffectHandler<Effect, Event> {
    suspend fun handle(effect: Effect): Event
}
```

`eventBufferCapacity` accepts `1..1024`. `initialize` and `reduce` are synchronous. The Core runtime invokes `effectHandler` as a child of the session.

## WorkflowStep

```kotlin
sealed interface WorkflowStep<out State, out Effect, out Output> {
    data class Continue<State>(val state: State) :
        WorkflowStep<State, Nothing, Nothing>
    data class Emit<State, Effect>(val state: State, val effect: Effect) :
        WorkflowStep<State, Effect, Nothing>
    data class Complete<Output>(val output: Output) :
        WorkflowStep<Nothing, Nothing, Output>
}

fun <State> continueWorkflow(state: State): WorkflowStep<State, Nothing, Nothing>
fun <State, Effect> emitEffect(
    state: State,
    effect: Effect,
): WorkflowStep<State, Effect, Nothing>
fun <Output> completeWorkflow(output: Output): WorkflowStep<Nothing, Nothing, Output>
```

`Emit` publishes state before the handler starts. Core permits one pending effect; a second `Emit` ends the session without publishing that second step's state.

## WorkflowSession

```kotlin
enum class WorkflowSendResult {
    ACCEPTED,
    REJECTED_OVERFLOW,
    REJECTED_CLOSED,
}

enum class WorkflowFailureReason {
    INITIALIZATION_FAILED,
    REDUCER_FAILED,
    EFFECT_FAILED,
    SECOND_EFFECT_WHILE_PENDING,
}

sealed interface WorkflowOutcome<out Output> {
    data class Completed<Output>(val output: Output) : WorkflowOutcome<Output>
    data class Failed(val reason: WorkflowFailureReason) : WorkflowOutcome<Nothing>
    data object Cancelled : WorkflowOutcome<Nothing>
}

interface WorkflowSession<out State, in Event, out Output> {
    val states: Flow<State>
    fun send(event: Event): WorkflowSendResult
    suspend fun awaitOutcome(): WorkflowOutcome<Output>
    fun cancel()
}
```

`send` never suspends. `REJECTED_OVERFLOW` rejects only that event and leaves the session active; `REJECTED_CLOSED` means cancellation or a terminal outcome. `awaitOutcome()` also waits for child-job cleanup. `cancel()` is idempotent.

## Leaf.open

```kotlin
suspend fun <Input, State, Event, Effect, Output> Leaf.Companion.open(
    workflow: Workflow<Input, State, Event, Effect, Output>,
    input: Input,
): WorkflowSession<State, Event, Output>

suspend fun <Input, State, Event, Effect, Output> Leaf.Companion.open(
    workflow: Workflow<Input, State, Event, Effect, Output>,
    input: Input,
    telemetry: LeafTelemetry,
): WorkflowSession<State, Event, Output>
```

Both overloads require a `Job`. The first delegates with `LeafTelemetry.None`. Telemetry is best-effort and payload-free. It uses `STARTED/RUNNING` when opening and a `FINISHED` phase after cleanup; this telemetry phase name is not the `FeatureSessionResult.Finished` removed in LEAF 3.

## Compose

```kotlin
sealed interface WorkflowSnapshot<out State> {
    data object Initializing : WorkflowSnapshot<Nothing>
    data class Active<State>(val state: State) : WorkflowSnapshot<State>
}

@Stable
class LeafWorkflowHolder<State, Event, Output> internal constructor() {
    val snapshot: State<WorkflowSnapshot<State>>
    val outcome: State<WorkflowOutcome<Output>?>
    fun send(event: Event): WorkflowSendResult
    fun cancel()
}

@Composable
fun <Input, State, Event, Effect, Output> Leaf.Companion.rememberLeafWorkflowHolder(
    workflow: Workflow<Input, State, Event, Effect, Output>,
    input: Input,
    sessionKey: Any? = input,
): LeafWorkflowHolder<State, Event, Output>
```

`snapshot` starts at `Initializing`; initialization that completes directly may retain it while publishing a terminal outcome. `outcome` is `null` until it is fixed once.

Identity uses Workflow reference identity and Compose equality for `sessionKey`. A stable key captures the initial input. Replacement or disposal cancels the session; late callbacks from the old session cannot update the new holder. The holder delegates `send` without queueing or retries and never executes handlers.

See the [Workflow guide](/en/guide/workflow) for full behavior.
