# Action vs Feature

Toda capacidad de un módulo es una `Action` o una `Feature`. La elección depende de la **interacción**, no de la capa de UI que la consuma.

## Criterios de elección

| Pregunta | Elección |
|---|---|
| ¿Solo necesito ejecutar una capacidad y obtener una respuesta? | `Action` |
| ¿La persona puede editar, corregir y continuar mientras ve estado? | `Feature` |
| ¿La operación debe navegar/terminar con un resultado de dominio? | `finish(output)` en una `Feature` |

**`Action<Input, Output>`** — operación finita: recibe un input, se ejecuta y devuelve un output. No ofrece estado interactivo observable. Ejemplos: procesar un pago, enviar un email, autenticar sin formulario interactivo.

**`Feature<Input, State, Event, Output>`** — el host muestra estado y envía intenciones durante la interacción. Core procesa los eventos **en serie** y la Feature responde con una transición. Ejemplos: formulario de login, contador, checkout editable.

## Transiciones: `stay` vs `finish`

```kotlin
sealed interface FeatureTransition<out State, out Output> {
    data class Stay<State>(val state: State) : FeatureTransition<State, Nothing>
    data class Finish<Output>(val output: Output) : FeatureTransition<Nothing, Output>
}

fun <State> stay(state: State): FeatureTransition<State, Nothing>
fun <Output> finish(output: Output): FeatureTransition<Nothing, Output>
```

- `stay(state)` conserva la sesión abierta y publica el nuevo estado. Úsalo para correcciones esperables — un campo inválido, credenciales rechazadas, un error recuperable.
- `finish(output)` fija la salida terminal **exactamente una vez**. Después, la sesión rechaza eventos con `REJECTED_TERMINATED`.

::: warning No uses excepciones para resultados de negocio
`InvalidCredentials` no es una excepción: es un `stay` con el error en el estado del formulario, o una variante del tipo de salida. Las excepciones quedan reservadas para fallos técnicos inesperados.
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
    ) { state, event -> /* stay o finish */ }
}
```
