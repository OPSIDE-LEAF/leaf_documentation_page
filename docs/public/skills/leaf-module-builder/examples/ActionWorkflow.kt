package example.leaf.skill

import com.ops.leaf_core.api.Action
import com.ops.leaf_core.api.EffectHandler
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.Workflow
import com.ops.leaf_core.api.completeWorkflow
import com.ops.leaf_core.api.continueWorkflow
import com.ops.leaf_core.api.emitEffect
import com.ops.leaf_core.api.workflow

enum class PaymentCheck { CONFIRMED, PENDING, UNAVAILABLE }
data class PaymentReviewState(
    val attemptId: String,
    val checking: Boolean = false,
    val lastCheck: PaymentCheck? = null,
)
sealed interface PaymentReviewEvent {
    data object Check : PaymentReviewEvent
    data object Close : PaymentReviewEvent
    data class Checked(val result: PaymentCheck) : PaymentReviewEvent
}
data class CheckPaymentEffect(val attemptId: String)
sealed interface PaymentReviewOutput {
    data class Closed(val attemptId: String, val lastCheck: PaymentCheck?) : PaymentReviewOutput
    data object InvalidInput : PaymentReviewOutput
}

/** Receives an Action from any compatible module; it does not know a payment SDK. */
class PaymentReviewModule(
    private val checkPayment: Action<String, PaymentCheck>,
) : Module {
    override val info = ModuleInfo("example.payment-review", "1.0.0")

    val review: Workflow<String, PaymentReviewState, PaymentReviewEvent, CheckPaymentEffect, PaymentReviewOutput> = workflow(
        moduleInfo = info,
        initialize = { attemptId ->
            if (attemptId.isBlank()) completeWorkflow(PaymentReviewOutput.InvalidInput)
            else continueWorkflow(PaymentReviewState(attemptId))
        },
        reduce = { state, event ->
            when {
                event == PaymentReviewEvent.Close ->
                    completeWorkflow(PaymentReviewOutput.Closed(state.attemptId, state.lastCheck))
                event == PaymentReviewEvent.Check && !state.checking ->
                    emitEffect(state.copy(checking = true), CheckPaymentEffect(state.attemptId))
                event is PaymentReviewEvent.Checked && state.checking ->
                    continueWorkflow(state.copy(checking = false, lastCheck = event.result))
                else -> continueWorkflow(state)
            }
        },
        effectHandler = EffectHandler { effect ->
            // Same coroutine context as the owning effect; cancellation propagates.
            PaymentReviewEvent.Checked(checkPayment.execute(effect.attemptId))
        },
    )
}
