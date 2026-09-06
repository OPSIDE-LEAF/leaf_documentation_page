# Workflow API (preview)

Workflow se reparte entre `leaf-contracts`, `leaf-core` y `leaf-compose` `3.0.0`. Toda la superficie de esta página requiere `@OptIn(ExperimentalLeafWorkflowApi::class)` y puede cambiar aunque el resto del tren siga semantic versioning estable.

## Opt-in

```kotlin
@RequiresOptIn(
    message = "LEAF Workflow is experimental and may change incompatibly.",
    level = RequiresOptIn.Level.ERROR,
)
@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.CLASS,
    AnnotationTarget.FUNCTION,
    AnnotationTarget.PROPERTY,
    AnnotationTarget.CONSTRUCTOR,
    AnnotationTarget.TYPEALIAS,
)
annotation class ExperimentalLeafWorkflowApi
```

## Contracts

```kotlin
@ExperimentalLeafWorkflowApi
interface Workflow<in Input, State, Event, Effect, out Output> {
    val moduleInfo: ModuleInfo
    val eventBufferCapacity: Int
    fun initialize(input: Input): WorkflowStep<State, Effect, Output>
    fun reduce(state: State, event: Event): WorkflowStep<State, Effect, Output>
    val effectHandler: EffectHandler<Effect, Event>
}

@ExperimentalLeafWorkflowApi
fun <Input, State, Event, Effect, Output> workflow(
    moduleInfo: ModuleInfo,
    eventBufferCapacity: Int = 16,
    initialize: (Input) -> WorkflowStep<State, Effect, Output>,
    reduce: (State, Event) -> WorkflowStep<State, Effect, Output>,
    effectHandler: EffectHandler<Effect, Event>,
): Workflow<Input, State, Event, Effect, Output>

@ExperimentalLeafWorkflowApi
fun interface EffectHandler<Effect, Event> {
    suspend fun handle(effect: Effect): Event
}
```

`eventBufferCapacity` admite `1..1024`. `initialize` y `reduce` son síncronos. El runtime de Core invoca `effectHandler` como hijo de la sesión.

## WorkflowStep

```kotlin
@ExperimentalLeafWorkflowApi
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

`Emit` publica estado antes de iniciar el handler. Core admite un efecto pendiente; un segundo `Emit` termina la sesión sin publicar el estado de ese segundo paso.

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

`send` no suspende. `REJECTED_OVERFLOW` solo rechaza ese evento y deja activa la sesión; `REJECTED_CLOSED` indica cancelación o outcome terminal. `awaitOutcome()` espera también el cleanup de los jobs hijos. `cancel()` es idempotente.

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

Ambos overloads requieren un `Job`. El primero delega con `LeafTelemetry.None`. La telemetría es best-effort y no contiene payloads. Usa `STARTED/RUNNING` al abrir y una fase `FINISHED` tras cleanup; ese nombre de fase de telemetría no es el `FeatureSessionResult.Finished` retirado en LEAF 3.

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

`snapshot` comienza en `Initializing`; una inicialización que completa directamente puede conservarlo y publicar un outcome terminal. `outcome` es `null` hasta que se fija una vez.

La identidad usa referencia de Workflow y igualdad Compose de `sessionKey`. Una clave estable captura el input inicial. Reemplazo o disposal cancelan la sesión; callbacks tardíos de la anterior no actualizan el holder nuevo. El holder delega `send` sin cola ni reintentos y no ejecuta handlers.

Para el comportamiento completo consulta la [guía de Workflow](/es/guide/workflow).
