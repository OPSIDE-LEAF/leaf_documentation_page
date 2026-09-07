package docs.snippets.quickstartaction

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
