# Action vs Feature

The stable capabilities of a module are `Action` and `Feature`. LEAF 3 also includes `Workflow` as an [experimental preview](/en/guide/workflow). The choice depends on the **interaction**, not on the UI layer that consumes it.

## Selection criteria

| Question | Choice |
|---|---|
| Do I only need to execute a capability and get a response? | `Action` |
| Can the person edit, correct, and continue while seeing state? | `Feature` |
| Should the operation navigate/terminate with a domain result? | `completeFeature(output)` in a `Feature` |
| Should Core execute suspending effects and return them as events? | `Workflow` (opt-in preview) |

**`Action<Input, Output>`** -- finite operation: receives an input, executes, and returns an output. It does not offer observable interactive state. Examples: process a payment, send an email, authenticate without an interactive form.

**`Feature<Input, State, Event, Output>`** -- the host displays state and sends intents during the interaction. Core processes events **serially** and the Feature responds with a transition. Examples: login form, counter, editable checkout.

## Transitions: `Continue` and `Complete`

```kotlin
sealed interface FeatureTransition<out State, out Output> {
    data class Continue<State>(val state: State) : FeatureTransition<State, Nothing>
    data class Complete<Output>(val output: Output) : FeatureTransition<Nothing, Output>
}

fun <State> continueFeature(state: State): FeatureTransition<State, Nothing>
fun <Output> completeFeature(output: Output): FeatureTransition<Nothing, Output>
```

- `continueFeature(state)` keeps the session open and publishes the new state. Use it for expected corrections: an invalid field, rejected credentials, or a recoverable error.
- `completeFeature(output)` sets the terminal output **exactly once**. Afterwards, the session rejects events with `REJECTED_TERMINATED`.

::: warning Do not use exceptions for business results
`InvalidCredentials` is not an exception: it is a `continueFeature` with the error in the form state, or a variant of the output type. Exceptions are reserved for unexpected technical failures.
:::

## Stable signatures

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

The event queue capacity (`eventCapacity`) must be between `1` and `1024`.

::: tip Do not inflate the capacity
Do not increase `eventCapacity` to hide an excessive producer: review the flow that generates the events.
:::

## Comparative example

```kotlin
class PaymentsModule(private val gateway: PaymentGateway) : Module {
    override val info = ModuleInfo("com.example.payments", "1.0.0")

    // Finite operation -> Action
    val pay = action<PaymentRequest, PaymentOutcome>(info) { request ->
        gateway.charge(request)
    }
}

class CheckoutModule(private val gateway: PaymentGateway) : Module {
    override val info = ModuleInfo("com.example.checkout", "1.0.0")

    // Editable interaction with state -> Feature
    val checkout = feature<CheckoutInput, CheckoutState, CheckoutEvent, CheckoutResult>(
        moduleInfo = info,
        initialState = { input -> CheckoutState(items = input.items) },
    ) { state, event -> /* continueFeature or completeFeature */ }
}
```

If you are coming from LEAF 2.0.1, see the [Feature migration table](/en/guide/feature-migration).
