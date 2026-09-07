# Host: open a Workflow

Use Workflow for any module that provides UI. A Workflow receives an input, publishes the state the UI must show, processes events, and ends once with an output. The host opens the session, presents the UI, and decides what to do with the final result.

This example uses one screen with a counter. The same structure can support a module with several screens: state indicates which screen is active, and events change that state. This navigation remains inside the Workflow.

<!-- kotlin-snippet: compiled: workflow-definition -->
```kotlin
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
```

<!-- kotlin-snippet: compiled: workflow-usage -->
```kotlin
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.api.WorkflowOutcome
import com.ops.leaf_core.api.WorkflowSendResult
import com.ops.leaf_core.api.open

suspend fun saveCounter(module: CounterModule): CounterResult? {
    val session = Leaf.open(module.counter, Unit)
    return try {
        check(session.send(CounterEvent.Increment) == WorkflowSendResult.ACCEPTED)
        check(session.send(CounterEvent.Save) == WorkflowSendResult.ACCEPTED)
        when (val outcome = session.awaitOutcome()) {
            is WorkflowOutcome.Completed -> outcome.output
            is WorkflowOutcome.Failed -> null
            WorkflowOutcome.Cancelled -> null
        }
    } finally {
        session.cancel()
    }
}
```

`persist` is a capability supplied by the host because the module must save the value without depending on a specific storage implementation. This Workflow needs no starting data, so it uses `Unit`. `CounterState.persisting` indicates that a save is already in progress; the UI must use it to disable the button and avoid starting a second effect.

The host can call `Leaf.open` from the appropriate point in its application: a route, a button, a notification, or another screen. It does not need to know the transitions between the module's internal screens; it only observes published state and presents the corresponding content.

When the Workflow ends, `saveCounter` handles all three session results: it returns the output for `Completed`, returns `null` for a technical failure, and also returns `null` when the session is cancelled. In a real integration, the host can use the output to show a message, return to a previous screen, or navigate to another host screen.

In a Compose screen, observe the holder, state, and result with [the adapter](/en/guide/compose-adapter).
