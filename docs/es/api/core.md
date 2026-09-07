# `leaf-core`

`leaf-core` %LEAF_VERSION% ejecuta Actions y administra las sesiones de Workflow. El módulo describe la regla de negocio; Core ordena los eventos, ejecuta los efectos y guarda un único resultado final.

## Entradas

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

Llama `Leaf.open` desde una corrutina que tenga `Job`. La sesión queda ligada a esa corrutina. La versión que recibe `LeafTelemetry` solo registra información técnica; no cambia el resultado.

## Sesión Workflow

<!-- kotlin-snippet: reference: core-session -->
```kotlin
interface WorkflowSession<out State, in Event, out Output> {
    val states: Flow<State>
    fun send(event: Event): WorkflowSendResult
    suspend fun awaitOutcome(): WorkflowOutcome<Output>
    fun cancel()
}
```

`send` responde al instante: `ACCEPTED` si recibió el evento, `REJECTED_OVERFLOW` si la cola está llena y `REJECTED_CLOSED` si la sesión ya terminó. Que la cola esté llena no cierra una sesión activa. `awaitOutcome()` espera el resultado final: `Completed(output)`, `Failed(reason)` o `Cancelled`. Workflow no tiene un `close()` público; usa `cancel()` si la app abandona la sesión.

## Referencia Feature

`FeatureSession` mantiene `state`, `result`, `metrics` e `isActive`, y permite `send`, `cancel` y `close`. En Core, `close()` hace lo mismo que cancelar. Esta API se conserva como referencia; para implementar UI nueva usa la API de Workflow.
