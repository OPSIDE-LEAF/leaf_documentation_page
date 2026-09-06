# Workflow: preview experimental en LEAF 3

`Workflow<Input, State, Event, Effect, Output>` modela una interacción donde la reducción de estado es síncrona y Core ejecuta los efectos suspendidos. Está incluida en los artefactos `3.0.0`, pero su API continúa protegida por `@ExperimentalLeafWorkflowApi`: requiere opt-in y puede cambiar en versiones posteriores.

::: warning Preview provisional
El número estable del tren no estabiliza Workflow. Agrega `@OptIn(ExperimentalLeafWorkflowApi::class)` en cada frontera de uso y evita exponer esta API desde contratos que prometan estabilidad sin controlar su migración.
:::

## Cuándo usarla

| Capability | Úsala cuando |
|---|---|
| `Action` | Una operación suspendida termina con un output y no publica estado interactivo. |
| `Feature` | Un reducer suspendido transforma eventos y estado; la Feature posee su lógica asíncrona. |
| `Workflow` | Quieres reducción síncrona y efectos suspendidos que Core ejecute y reincorpore como eventos. |

Workflow no es una etapa obligatoria de Feature. Ambos contratos coexisten.

## Reducir primero, ejecutar después

`initialize` y `reduce` no son funciones `suspend`. Cada llamada devuelve exactamente un `WorkflowStep`:

```kotlin
sealed interface WorkflowStep<out State, out Effect, out Output> {
    data class Continue<State>(val state: State) : WorkflowStep<State, Nothing, Nothing>
    data class Emit<State, Effect>(val state: State, val effect: Effect) :
        WorkflowStep<State, Effect, Nothing>
    data class Complete<Output>(val output: Output) :
        WorkflowStep<Nothing, Nothing, Output>
}
```

- `Continue` publica estado y espera otro evento.
- `Emit` publica primero el estado y solicita un efecto.
- `Complete` fija el outcome exitoso una sola vez.

Los helpers equivalentes son `continueWorkflow`, `emitEffect` y `completeWorkflow`.

## El runtime posee los efectos

El Author entrega un `EffectHandler<Effect, Event>`. Core lo invoca como hijo de la sesión y reintroduce su resultado en el reducer serial:

```kotlin
@OptIn(ExperimentalLeafWorkflowApi::class)
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

El host no llama al handler, no reintenta efectos y no crea otro coordinador. Modela rechazos esperados como eventos de dominio. Una excepción inesperada del handler termina con `Failed(EFFECT_FAILED)`.

La primera versión admite un efecto activo. Un segundo `Emit` mientras el anterior sigue pendiente termina con `Failed(SECOND_EFFECT_WHILE_PENDING)`; el estado del segundo paso no se publica.

## Abrir y cerrar una sesión

```kotlin
@OptIn(ExperimentalLeafWorkflowApi::class)
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

`Leaf.open` necesita un `Job` en la corrutina llamadora y crea una sesión hija. `states` expone los estados de dominio. `awaitOutcome()` devuelve `Completed`, `Failed` o `Cancelled` después de limpiar los jobs hijos; `cancel()` es idempotente.

### Admisión de eventos

| `WorkflowSendResult` | Significado |
|---|---|
| `ACCEPTED` | El evento entró a la cola externa acotada. |
| `REJECTED_OVERFLOW` | La cola está llena. La sesión sigue activa; decide explícitamente cómo informar o reintentar. |
| `REJECTED_CLOSED` | La sesión ya fue cancelada o alcanzó un outcome terminal. |

El overflow de Workflow no es terminal. El carril interno que devuelve eventos desde el handler está separado de la cola externa.

## Compose e identidad de sesión

```kotlin
@OptIn(ExperimentalLeafWorkflowApi::class)
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

La identidad combina la referencia de `workflow` (`===`) con la igualdad Compose de `sessionKey`. Por defecto `sessionKey = input`. Una clave estable captura el input con el que se abrió la sesión; cambios posteriores de `input` no reinician ni alteran esa sesión. Cambiar la referencia de Workflow o usar una clave no igual crea otro holder y cancela el anterior. Salir de composición también cancela.

`LeafWorkflowHolder.send` delega una vez a Core, sin cola local ni retry. Antes de que exista una sesión activa y después del cierre devuelve `REJECTED_CLOSED`; `REJECTED_OVERFLOW` se conserva como rechazo no terminal.

## Telemetría y privacidad

El overload `Leaf.open(workflow, input, telemetry)` reutiliza `LeafTelemetry`. Emite un evento `STARTED/RUNNING` al abrir y uno `FINISHED` tras el cleanup, mapeado a `SUCCEEDED`, `FAILED` o `CANCELLED`. Los callbacks son best-effort: si fallan, no cambian estado, outcome ni cleanup.

La telemetría técnica solo contiene `moduleInfo`, fase, duración y resultado. No retiene ni convierte a texto Input, State, Event, Effect, Output o Throwable. El estado y el outcome observados por Compose son datos de UI; el host decide cómo protegerlos.

Consulta la [referencia API completa](/es/api/workflow) y la [migración de Feature](/es/guide/feature-migration).
