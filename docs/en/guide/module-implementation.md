# Creating a module: implementation

With the [repository set up](/en/guide/module-setup), the module code follows four steps.

## 1. Domain models

`src/commonMain/kotlin/com/opside/leaf/<module>/domain/<Module>Models.kt`

```kotlin
// Input: data the host provides when opening the Feature
data class CheckoutInput(
    val someParam: String = "",
)

// State: observable session state
data class CheckoutState(
    val field: String = "",
    val error: String? = null,
)

// Event: user intents
sealed interface CheckoutEvent {
    data class FieldChanged(val value: String) : CheckoutEvent
    data object Submit : CheckoutEvent
}

// Result: terminal outcome (domain errors go here)
sealed interface CheckoutResult {
    data class Success(val id: String) : CheckoutResult
    data object Rejected : CheckoutResult
}
```

## 2. Ports (gateways)

`gateway/<Service>Gateway.kt`

```kotlin
/** Port implemented by the host or an infrastructure adapter. */
interface PaymentGateway {
    suspend fun execute(param: String): PaymentResponse
}

sealed interface PaymentResponse {
    data class Success(val id: String) : PaymentResponse
    data object Failed : PaymentResponse
}
```

External dependencies are modeled as interfaces; the implementation belongs to the host.

## 3. The Module class

`<Module>Module.kt`

```kotlin
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.feature
import com.ops.leaf_core.api.finish
import com.ops.leaf_core.api.stay

class CheckoutModule(
    private val gateway: PaymentGateway,
) : Module {
    override val info = ModuleInfo(
        id = "com.opside.leaf.checkout",
        version = VERSION,
    )

    val checkout = feature<CheckoutInput, CheckoutState, CheckoutEvent, CheckoutResult>(
        moduleInfo = info,
        initialState = { input -> CheckoutState(field = input.someParam) },
    ) { state, event ->
        when (event) {
            is CheckoutEvent.FieldChanged -> stay(state.copy(field = event.value, error = null))
            CheckoutEvent.Submit -> handleSubmit(state)
        }
    }

    private suspend fun handleSubmit(state: CheckoutState) = when {
        state.field.isBlank() -> stay(state.copy(error = "El campo es obligatorio"))
        else -> when (val response = gateway.execute(state.field)) {
            is PaymentResponse.Success -> finish(CheckoutResult.Success(response.id))
            PaymentResponse.Failed -> stay(state.copy(error = "Operación fallida"))
        }
    }

    private companion object {
        const val VERSION = "0.1.0"
    }
}
```

::: tip Only need a stateless operation?
Use `Action` instead of `Feature`. There is no `State`, `Event`, or UI -- just input and result:

```kotlin
class NotificationModule(
    private val gateway: NotificationGateway,
) : Module {
    override val info = ModuleInfo(id = "com.opside.leaf.notification", version = "1.0.0")

    val notify = action<NotificationRequest, NotificationOutcome>(info) { input ->
        gateway.send(input)
    }
}

// Usage:
when (val r = Leaf.run(module.notify, request)) {
    NotificationOutcome.Delivered -> onSuccess()
    is NotificationOutcome.Failed -> onError(r.reason)
}
```

See [leaf-email](/en/guide/email-reference) as a complete example of an Action module.
:::

## 4. Compose UI (optional)

`ui/<Module>Route.kt` -- the connector:

```kotlin
@Composable
fun CheckoutRoute(
    module: CheckoutModule,
    input: CheckoutInput = CheckoutInput(),
    onSuccess: (CheckoutResult.Success) -> Unit,
) {
    val leaf = Leaf.rememberLeaf(feature = module.checkout, input = input)
    val result = leaf.result

    LaunchedEffect(result) {
        if (result is FeatureSessionResult.Finished) {
            val output = result.output
            if (output is CheckoutResult.Success) onSuccess(output)
        }
    }

    val state = leaf.state
    if (state == null) {
        // Loading placeholder
    } else {
        CheckoutScreen(
            state = state,
            onFieldChanged = { leaf.send(CheckoutEvent.FieldChanged(it)) },
            onSubmit = { leaf.send(CheckoutEvent.Submit) },
        )
    }
}
```

`ui/<Module>Screen.kt` is the pure view (state + callbacks). See [Route + Screen pattern](/en/guide/compose-route-screen).

## Rules when implementing

- Expected business errors -> `Result` variants or `stay` with an error in the state. Never exceptions.
- Do not store secrets in `State`, `Event`, `Output`, logs, or telemetry ([privacy rules](/en/guide/errors-telemetry)).
- Event queue: default 16, maximum 1,024. Do not inflate it to hide overproduction.
- Everything in `commonMain`; `androidMain`/`iosMain` only when strictly necessary. The legitimate case is **platform gateways** that require native APIs (e.g. network transport, sensors, storage). Use `expect/actual` for the factory and keep the gateway interface in `commonMain`.

## Next step

[Module testing](/en/guide/module-testing).
