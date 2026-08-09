# Crear un módulo: implementación

Con el [repositorio configurado](/es/guide/module-setup), el código del módulo sigue cuatro pasos.

## 1. Modelos de dominio

`src/commonMain/kotlin/com/opside/leaf/<modulo>/domain/<Modulo>Models.kt`

```kotlin
// Input: datos que el host proporciona al abrir la Feature
data class CheckoutInput(
    val someParam: String = "",
)

// State: estado observable de la sesión
data class CheckoutState(
    val field: String = "",
    val error: String? = null,
)

// Event: intenciones del usuario
sealed interface CheckoutEvent {
    data class FieldChanged(val value: String) : CheckoutEvent
    data object Submit : CheckoutEvent
}

// Result: resultado terminal (los errores de dominio van aquí)
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

Las dependencias externas se modelan como interfaces; la implementación pertenece al host.

## 3. La clase Module

`<Modulo>Module.kt`

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

::: tip ¿Solo necesitas una operación sin estado?
Usa `Action` en lugar de `Feature`. No hay `State`, `Event` ni UI — solo input y resultado:

```kotlin
class NotificationModule(
    private val gateway: NotificationGateway,
) : Module {
    override val info = ModuleInfo(id = "com.opside.leaf.notification", version = "1.0.0")

    val notify = action<NotificationRequest, NotificationOutcome>(info) { input ->
        gateway.send(input)
    }
}

// Uso:
when (val r = Leaf.run(module.notify, request)) {
    NotificationOutcome.Delivered -> onSuccess()
    is NotificationOutcome.Failed -> onError(r.reason)
}
```

Ver [leaf-email](/es/guide/email-reference) como ejemplo completo de un módulo Action.
:::

## 4. UI Compose (opcional)

`ui/<Modulo>Route.kt` — el conector:

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

`ui/<Modulo>Screen.kt` es la vista pura (estado + callbacks). Ver [Patrón Route + Screen](/es/guide/compose-route-screen).

## Reglas al implementar

- Errores de negocio esperados → variantes del `Result` o `stay` con error en el estado. Nunca excepciones.
- No guardes secretos en `State`, `Event`, `Output`, logs ni telemetría ([reglas de privacidad](/es/guide/errores-telemetria)).
- Cola de eventos: default 16, máximo 1,024. No la infles para ocultar sobreproducción.
- Todo en `commonMain`; `androidMain`/`iosMain` solo cuando sea estrictamente necesario. El caso legítimo son **gateways de plataforma** que requieren APIs nativas (ej. transporte de red, sensores, almacenamiento). Usa `expect/actual` para la fábrica y mantén la interfaz del gateway en `commonMain`.

## Siguiente paso

[Testing del módulo](/es/guide/module-testing).
