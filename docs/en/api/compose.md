# `leaf-compose`

`leaf-compose` %LEAF_VERSION% helps a Compose screen watch a Workflow. Core still manages the session itself.

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

`WorkflowSnapshot` has two forms: `Initializing`, while there is no data to show yet, and `Active(state)`, once there is a state for the screen. The holder identifies a session with the Workflow and `sessionKey`. If changed input should start over, change that key too. When the screen leaves composition, the holder cancels the session.

The holder only watches and sends events. It does not run effects, retry events, or keep input for you. See [the Compose guide](/en/guide/compose-adapter) to show the final result and disable a button while work is in progress.

## Feature reference

`rememberLeaf(feature, input)` returns `LeafComposeState` with a `FeatureSession`'s `state`, `result`, and `isReady`. It is here only to document that existing API. For new screens, use the Workflow holder.
