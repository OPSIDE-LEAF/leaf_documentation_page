package docs.snippets.composeadapter

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
