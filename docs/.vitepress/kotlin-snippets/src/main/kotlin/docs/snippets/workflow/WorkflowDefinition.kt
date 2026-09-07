package docs.snippets.workflow

import com.ops.leaf_core.api.EffectHandler
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.completeWorkflow
import com.ops.leaf_core.api.continueWorkflow
import com.ops.leaf_core.api.emitEffect
import com.ops.leaf_core.api.workflow

data class CounterState(val value: Int, val persisting: Boolean = false)
sealed interface CounterEvent { data object Increment : CounterEvent; data object Save : CounterEvent; data object Persisted : CounterEvent }
sealed interface CounterEffect { data class Persist(val value: Int) : CounterEffect }
data class CounterResult(val value: Int)

class CounterModule(private val persist: suspend (Int) -> Unit) : Module {
    override val info = ModuleInfo("com.example.counter", "1.0.0")
    val counter = workflow<Unit, CounterState, CounterEvent, CounterEffect, CounterResult>(
        moduleInfo = info,
        initialize = { continueWorkflow(CounterState(0)) },
        reduce = { state, event -> when (event) {
            CounterEvent.Increment -> continueWorkflow(state.copy(value = state.value + 1))
            CounterEvent.Save -> if (state.persisting) continueWorkflow(state) else emitEffect(state.copy(persisting = true), CounterEffect.Persist(state.value))
            CounterEvent.Persisted -> completeWorkflow(CounterResult(state.value))
        } },
        effectHandler = EffectHandler { effect -> when (effect) {
            is CounterEffect.Persist -> { persist(effect.value); CounterEvent.Persisted }
        } },
    )
}
