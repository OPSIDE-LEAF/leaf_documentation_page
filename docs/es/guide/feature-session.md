# FeatureSession: ciclo de vida y backpressure

`Leaf.open` crea una `FeatureSession` propiedad de Core. El host observa y envía; Core administra la cola, la serialización de eventos, la cancelación y el resultado.

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

## Semántica garantizada

- **Cola acotada** — capacidad predeterminada 16, rango 1..1,024 (`DEFAULT_FEATURE_EVENT_CAPACITY` / `MAX_FEATURE_EVENT_CAPACITY`). Nunca `Channel.UNLIMITED`.
- **Envío nunca suspende** — `send` es linearizado contra terminación; la presión falla rápido con `REJECTED_OVERFLOW`.
- **Terminalidad única** — `finish` produce exactamente un resultado; eventos tardíos se rechazan con `REJECTED_TERMINATED`.
- **Cancelación estructurada** — la sesión es hija de la corrutina que llamó `Leaf.open`; si el host se cancela, la sesión se cancela. `cancel()` y `close()` son idempotentes.
- **Inicialización segura** — si `initialState(input)` lanza, Core produce `LeafException` con operación `FEATURE_INITIALIZATION` (en Compose: `Failed(INITIALIZATION_FAILED)`).

## Disposición de `send`

```kotlin
enum class FeatureSendResult { ACCEPTED, REJECTED_TERMINATED, REJECTED_OVERFLOW }
```

| Resultado | Significado y acción del host |
|---|---|
| `ACCEPTED` | El evento entró a la cola; Core lo reducirá serialmente. |
| `REJECTED_OVERFLOW` | La cola está llena y la sesión termina con `EVENT_QUEUE_OVERFLOW`. Informa un estado técnico seguro y revisa la sobreproducción de eventos. |
| `REJECTED_TERMINATED` | La sesión ya terminó o se cerró. No reintentes a ciegas. |

## Resultado terminal

Mientras la sesión está activa, `result` es `null`. Después retiene exactamente uno de:

```kotlin
sealed interface FeatureSessionResult<out Output> {
    data class Finished<Output>(val output: Output) : FeatureSessionResult<Output>
    data object Cancelled : FeatureSessionResult<Nothing>
    data class Failed(val failure: FeatureTechnicalFailure) : FeatureSessionResult<Nothing>
}
```

Los fallos técnicos posibles son `INITIALIZATION_FAILED`, `EVENT_QUEUE_OVERFLOW` y `TRANSITION_FAILED`. Están diseñados para **no contener payloads ni mensajes** de throwables.

## Métricas

```kotlin
// FeatureSessionMetrics
val eventQueueOverflowCount: Long
val terminalCause: FeatureSessionTerminalCause? // FINISHED, CANCELLED, EVENT_QUEUE_OVERFLOW, TRANSITION_FAILED
```

Métricas sin payload: solo el contador de overflow y la causa terminal.

## Patrón de host sin UI

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

::: warning El host no duplica al Core
No implementes un reducer, una cola o una sesión paralela en el host. Una única `FeatureSession` por `Leaf.open`, administrada por Core.
:::
