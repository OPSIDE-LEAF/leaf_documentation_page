# Compose: holder de Workflow

Una pantalla Compose necesita dos cosas: el estado que puede dibujar ahora y saber cuándo el flujo terminó. `rememberLeafWorkflowHolder` entrega ambas. Abre una sesión de Core para un Workflow, expone `snapshot` y `outcome`, y la cancela cuando la pantalla deja de existir.

<!-- kotlin-snippet: compiled: compose-adapter -->
```kotlin
import androidx.compose.runtime.Composable
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.api.Workflow
import com.ops.leaf_core.api.WorkflowOutcome
import com.ops.leaf_core.api.WorkflowSendResult
import com.ops.leaf_core.ui.compose.WorkflowSnapshot
import com.ops.leaf_core.ui.compose.rememberLeafWorkflowHolder

@Composable
fun <Input, State, Event, Effect, Output> WorkflowRoute(
    workflow: Workflow<Input, State, Event, Effect, Output>,
    input: Input,
    sessionKey: Any? = input,
    screen: @Composable (
        WorkflowSnapshot<State>,
        WorkflowOutcome<Output>?,
        (Event) -> WorkflowSendResult,
        () -> Unit,
    ) -> Unit,
) {
    val holder = Leaf.rememberLeafWorkflowHolder(workflow, input, sessionKey)
    screen(holder.snapshot.value, holder.outcome.value, holder::send, holder::cancel)
}
```

La función `WorkflowRoute` del ejemplo solo conecta Compose con el Workflow. Entrega a tu Screen el estado actual, el resultado final y callbacks para enviar eventos o cancelar. Así, la Screen puede concentrarse en dibujar botones y texto sin conocer cómo se administra la sesión.

En el contador de [Primer Workflow](/es/guide/quickstart-workflow), pasa `state.value` y `state.persisting` a `CounterScreen`. Mientras `persisting` sea `true`, no llames `send(Save)`: el guardado anterior todavía está en curso. La Route no ejecuta `EffectHandler`, no vuelve a intentar `send` y no abre otra sesión desde `LaunchedEffect`. Cambia `sessionKey` solo si cambiar el dato de entrada debe abrir una sesión nueva.
