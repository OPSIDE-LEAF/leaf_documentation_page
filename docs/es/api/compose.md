# `leaf-compose`

`leaf-compose` %LEAF_VERSION% ayuda a una pantalla Compose a observar un Workflow. La sesión sigue siendo administrada por Core.

<!-- kotlin-snippet: reference: compose-surface -->
```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State as ComposeState
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.api.Workflow
import com.ops.leaf_core.api.WorkflowOutcome
import com.ops.leaf_core.api.WorkflowSendResult
import com.ops.leaf_core.ui.compose.WorkflowSnapshot

@Composable
fun <Input, WorkflowState, Event, Effect, Output> Leaf.Companion.rememberLeafWorkflowHolder(
    workflow: Workflow<Input, WorkflowState, Event, Effect, Output>,
    input: Input,
    sessionKey: Any? = input,
): LeafWorkflowHolder<WorkflowState, Event, Output>

class LeafWorkflowHolder<WorkflowState, Event, Output> {
    val snapshot: ComposeState<WorkflowSnapshot<WorkflowState>>
    val outcome: ComposeState<WorkflowOutcome<Output>?>
    fun send(event: Event): WorkflowSendResult
    fun cancel()
}
```

`WorkflowSnapshot` tiene dos formas: `Initializing`, mientras aún no hay datos, y `Active(state)`, cuando ya hay un estado para mostrar. El holder identifica la sesión con el Workflow y `sessionKey`. Si cambias el dato de entrada y necesitas empezar de nuevo, cambia también esa clave. Cuando la pantalla sale de composición, el holder cancela la sesión.

El holder solo observa y envía eventos. No ejecuta efectos, no vuelve a intentar eventos y no guarda los datos de entrada por ti. Mira [la guía de Compose](/es/guide/compose-adapter) para mostrar el resultado final y desactivar un botón mientras hay una operación en curso.

## Referencia Feature

`rememberLeaf(feature, input)` devuelve `LeafComposeState` con `state`, `result` e `isReady` de una `FeatureSession`. Está aquí solo para consultar esa API existente. Para pantallas nuevas usa el holder de Workflow.
