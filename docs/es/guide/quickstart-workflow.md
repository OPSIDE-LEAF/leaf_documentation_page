# Host: abrir un Workflow

Usa Workflow para cualquier módulo que proporcione UI. El Workflow recibe un input, publica el estado que debe mostrar la UI, procesa eventos y termina una sola vez con un output. El host abre la sesión, presenta la UI y decide qué hacer con el resultado final.

Este ejemplo usa una sola pantalla con un contador. La misma estructura permite crear un módulo con varias pantallas: el estado indica qué pantalla está activa y los eventos cambian ese estado. Esa navegación permanece dentro del Workflow.

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

`persist` es una capacidad que proporciona el host porque el módulo necesita guardar el valor sin depender de una implementación concreta de almacenamiento. Este Workflow no necesita datos iniciales, por eso usa `Unit`. `CounterState.persisting` indica que ya existe un guardado en curso; la UI debe usarlo para desactivar el botón y evitar iniciar un segundo efecto.

El host puede llamar `Leaf.open` desde el punto que corresponda en su aplicación: una ruta, un botón, una notificación u otra pantalla. No necesita conocer las transiciones entre las pantallas internas del módulo; solo observa el estado publicado y presenta el contenido correspondiente.

Cuando el Workflow termina, `saveCounter` distingue los tres resultados de la sesión: entrega el output en `Completed`, devuelve `null` si ocurre un fallo técnico y también devuelve `null` si la sesión se cancela. En una integración real, el host puede usar el output para mostrar un mensaje, volver a una pantalla anterior o navegar a otra pantalla propia.

En una pantalla Compose, observa el holder, el estado y el resultado con [el adaptador](/es/guide/compose-adapter).
