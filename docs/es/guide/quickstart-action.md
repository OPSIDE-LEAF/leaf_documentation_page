# Host: ejecutar una Action

Una Action sirve cuando quieres hacer una sola tarea y recibir una sola respuesta. En este ejemplo la app pide una cotización: entrega una cantidad y recibe un total. No hay una sesión que mantener ni una pantalla con estados intermedios.

<!-- kotlin-snippet: compiled: quickstart-action -->
```kotlin
import com.ops.leaf_core.api.Action
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.action

data class QuoteRequest(val quantity: Int)
data class Quote(val totalMinorUnits: Long)

class QuoteModule(
    private val calculate: suspend (QuoteRequest) -> Quote,
) : Module {
    override val info = ModuleInfo("com.example.quote", "1.0.0")
    val quote: Action<QuoteRequest, Quote> = action(info, calculate)
}

suspend fun requestQuote(module: QuoteModule, quantity: Int): Quote =
    Leaf.run(module.quote, QuoteRequest(quantity))
```

`quantity` es un dato obligatorio. `calculate` realiza el cálculo de la cotización y la proporciona la app o el código que construye el módulo. El módulo no depende de si esa implementación usa red, una base de datos o una regla local.

Si `calculate` falla por un problema técnico, `Leaf.run` lanza `LeafException`. La pantalla que inició la corrutina decide cómo explicarlo al usuario. Si la corrutina se cancela, la Action también se detiene.

Si el usuario debe ver una carga, enviar varios toques o esperar pasos, no fuerces ese estado dentro de una Action. Usa [Workflow](/es/guide/quickstart-workflow).
