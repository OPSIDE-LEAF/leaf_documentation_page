# leaf-core

`com.opside-leaf:leaf-core:2.0.1` · paquete `com.ops.leaf_core.api` · [repo](https://github.com/OPSIDE-LEAF/leaf-core)

Runtime del ecosistema: ejecuta Actions y posee las sesiones de Features (serialización de eventos, cancelación, resultado, presión, errores técnicos). No conoce reglas de dominio ni renderiza UI.

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

Ejecuta una Action. Si falla inesperadamente lanza `LeafException` redactada; `CancellationException` se propaga.

## Leaf.open

```kotlin
suspend fun <Input, State, Event, Output> Leaf.Companion.open(
    feature: Feature<Input, State, Event, Output>,
    input: Input,
): FeatureSession<State, Event, Output>
```

Crea una `FeatureSession` **hija de la corrutina actual** (requiere `Job` en contexto).

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

`send` nunca suspende. `cancel()` y `close()` son idempotentes. Ver [semántica completa](/es/guide/feature-session).

## FeatureSendResult

```kotlin
enum class FeatureSendResult { ACCEPTED, REJECTED_TERMINATED, REJECTED_OVERFLOW }
```

## FeatureSessionResult

```kotlin
sealed interface FeatureSessionResult<out Output> {
    data class Finished<Output>(val output: Output) : FeatureSessionResult<Output>
    data object Cancelled : FeatureSessionResult<Nothing>
    data class Failed(val failure: FeatureTechnicalFailure) : FeatureSessionResult<Nothing>
}
```

`result` es `null` mientras la sesión está activa; después retiene exactamente un valor.

## FeatureTechnicalFailure

```kotlin
enum class FeatureTechnicalFailure { INITIALIZATION_FAILED, EVENT_QUEUE_OVERFLOW, TRANSITION_FAILED }
```

Sin payloads ni mensajes de throwables.

## FeatureSessionTerminalCause

```kotlin
enum class FeatureSessionTerminalCause { FINISHED, CANCELLED, EVENT_QUEUE_OVERFLOW, TRANSITION_FAILED }
```

## FeatureSessionMetrics

```kotlin
// StateFlow<FeatureSessionMetrics> en la sesión
val eventQueueOverflowCount: Long
val terminalCause: FeatureSessionTerminalCause?
```

## LeafException

Error técnico **redactado**: solo expone `moduleInfo` y la `LeafOperation` (ej. `FEATURE_INITIALIZATION`). Nunca el input, estado ni mensaje original.

## LeafTelemetry

```kotlin
fun interface LeafTelemetry {
    fun record(event: LeafTelemetryEvent)
    companion object { val None: LeafTelemetry }
}
```

### LeafTelemetryEvent

| Campo | Valores |
|---|---|
| `moduleInfo` | Identidad del módulo |
| `phase` | `STARTED`, `FINISHED` |
| `duration` | Duración de la operación |
| `result` | `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED` |

Best-effort e isolada: sin input, state, event, output, throwable ni PII. Un fallo del hook no altera la ejecución.
