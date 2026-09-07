package docs.snippets.workflow

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
