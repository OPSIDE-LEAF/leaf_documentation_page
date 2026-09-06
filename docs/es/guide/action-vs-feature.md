# Action vs Feature

Las capabilities estables de un módulo son `Action` y `Feature`. LEAF 3 también incluye `Workflow` como [preview experimental](/es/guide/workflow). La elección depende de la **interacción**, no de la capa de UI que la consuma.

## Criterios de elección

| Pregunta | Elección |
|---|---|
| ¿Solo necesito ejecutar una capability y obtener una respuesta? | `Action` |
| ¿La persona puede editar, corregir y continuar mientras ve estado? | `Feature` |
| ¿La operación debe navegar/terminar con un resultado de dominio? | `completeFeature(output)` en una `Feature` |
| ¿Core debe ejecutar efectos suspendidos y regresarlos como eventos? | `Workflow` (preview con opt-in) |

**`Action<Input, Output>`** — operación finita: recibe un input, se ejecuta y devuelve un output. No ofrece estado interactivo observable. Ejemplos: procesar un pago, enviar un email, autenticar sin formulario interactivo.

**`Feature<Input, State, Event, Output>`** — el host muestra estado y envía intenciones durante la interacción. Core procesa los eventos **en serie** y la Feature responde con una transición. Ejemplos: formulario de login, contador, checkout editable.

## Transiciones: `Continue` y `Complete`

```kotlin
sealed interface FeatureTransition<out State, out Output> {
    data class Continue<State>(val state: State) : FeatureTransition<State, Nothing>
    data class Complete<Output>(val output: Output) : FeatureTransition<Nothing, Output>
}

fun <State> continueFeature(state: State): FeatureTransition<State, Nothing>
fun <Output> completeFeature(output: Output): FeatureTransition<Nothing, Output>
```

- `continueFeature(state)` conserva la sesión abierta y publica el nuevo estado. Úsalo para correcciones esperables: un campo inválido, credenciales rechazadas o un error recuperable.
- `completeFeature(output)` fija la salida terminal **exactamente una vez**. Después, la sesión rechaza eventos con `REJECTED_TERMINATED`.

::: warning No uses excepciones para resultados de negocio
`InvalidCredentials` no es una excepción: es un `continueFeature` con el error en el estado del formulario, o una variante del tipo de salida. Las excepciones quedan reservadas para fallos técnicos inesperados.
:::

## Firmas estables

```kotlin
fun <Input, Output> action(
    moduleInfo: ModuleInfo,
    execute: suspend (Input) -> Output
): Action<Input, Output>

fun <Input, State, Event, Output> feature(
    moduleInfo: ModuleInfo,
    eventCapacity: Int = 16,
    initialState: (Input) -> State,
    transition: suspend (State, Event) -> FeatureTransition<State, Output>
): Feature<Input, State, Event, Output>
```

La capacidad de la cola de eventos (`eventCapacity`) debe estar entre `1` y `1024`.

::: tip No infles la capacidad
No aumentes `eventCapacity` para ocultar un productor excesivo: revisa el flujo que genera los eventos.
:::

## Ejemplo comparado

```kotlin
class PaymentsModule(private val gateway: PaymentGateway) : Module {
    override val info = ModuleInfo("com.example.payments", "1.0.0")

    // Operación finita → Action
    val pay = action<PaymentRequest, PaymentOutcome>(info) { request ->
        gateway.charge(request)
    }
}

class CheckoutModule(private val gateway: PaymentGateway) : Module {
    override val info = ModuleInfo("com.example.checkout", "1.0.0")

    // Interacción editable con estado → Feature
    val checkout = feature<CheckoutInput, CheckoutState, CheckoutEvent, CheckoutResult>(
        moduleInfo = info,
        initialState = { input -> CheckoutState(items = input.items) },
    ) { state, event -> /* continueFeature o completeFeature */ }
}
```

Si vienes de LEAF 2.0.1, consulta la [tabla de migración de Feature](/es/guide/feature-migration).
