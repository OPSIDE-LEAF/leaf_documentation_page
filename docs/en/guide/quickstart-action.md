# Host: run an Action

An Action is useful when you want to do one task and receive one answer. In this example the app asks for a quote: it gives a quantity and gets a total. There is no session to keep and no screen with intermediate states.

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

`quantity` is required data. `calculate` performs the quote calculation and is provided by the app or the code that constructs the module. The module does not depend on whether that implementation uses a network call, a database, or a local rule.

If `calculate` fails for a technical reason, `Leaf.run` throws `LeafException`. The screen that started the coroutine decides how to explain it to the person. If the coroutine is cancelled, the Action stops too.

If a person must see loading, send several taps, or wait through steps, do not force that state into an Action. Use [Workflow](/en/guide/quickstart-workflow).
