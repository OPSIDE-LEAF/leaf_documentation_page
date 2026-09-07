package example.leaf.skill

import com.ops.leaf_core.api.EffectHandler
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.Workflow
import com.ops.leaf_core.api.completeWorkflow
import com.ops.leaf_core.api.continueWorkflow
import com.ops.leaf_core.api.workflow

enum class SelectionPage { LIST, CONFIRM }
data class SelectionState(
    val options: List<String>,
    val selected: String? = null,
    val page: SelectionPage = SelectionPage.LIST,
)
sealed interface SelectionEvent {
    data class Choose(val value: String) : SelectionEvent
    data object Back : SelectionEvent
    data object Confirm : SelectionEvent
    data object Cancel : SelectionEvent
}
sealed interface SelectionOutput {
    data class Selected(val value: String) : SelectionOutput
    data object Dismissed : SelectionOutput
    data object NoOptions : SelectionOutput
}

/** Two internal pages; the Host supplies UI and decides where to go after Selected. */
class SelectionModule : Module {
    override val info = ModuleInfo("example.selection", "1.0.0")

    val select: Workflow<List<String>, SelectionState, SelectionEvent, Nothing, SelectionOutput> = workflow(
        moduleInfo = info,
        initialize = { input ->
            val options = input.filter { it.isNotBlank() }.distinct()
            if (options.isEmpty()) completeWorkflow(SelectionOutput.NoOptions)
            else continueWorkflow(SelectionState(options))
        },
        reduce = { state, event ->
            when {
                event == SelectionEvent.Cancel -> completeWorkflow(SelectionOutput.Dismissed)
                event == SelectionEvent.Back -> continueWorkflow(state.copy(page = SelectionPage.LIST))
                event is SelectionEvent.Choose && state.page == SelectionPage.LIST && event.value in state.options ->
                    continueWorkflow(state.copy(selected = event.value, page = SelectionPage.CONFIRM))
                event == SelectionEvent.Confirm && state.page == SelectionPage.CONFIRM && state.selected != null ->
                    completeWorkflow(SelectionOutput.Selected(state.selected))
                else -> continueWorkflow(state)
            }
        },
        effectHandler = EffectHandler<Nothing, SelectionEvent> { effect -> effect },
    )
}
