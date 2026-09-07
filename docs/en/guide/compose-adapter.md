# Compose: Workflow holder

A Compose screen needs two things: the state it can draw now and a way to know when the flow is over. `rememberLeafWorkflowHolder` provides both. It opens a Core session for a Workflow, exposes `snapshot` and `outcome`, and cancels the session when the screen no longer exists.

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

The example's `WorkflowRoute` only connects Compose to the Workflow. It gives your Screen the current state, final result, and callbacks for sending an event or cancelling. The Screen can then focus on drawing buttons and text without knowing how the session is managed.

For the [First Workflow](/en/guide/quickstart-workflow) counter, pass `state.value` and `state.persisting` to `CounterScreen`. While `persisting` is `true`, do not call `send(Save)`: the earlier save is still running. The Route does not run `EffectHandler`, retry `send`, or open another session from `LaunchedEffect`. Change `sessionKey` only when changed input should open a new session.
