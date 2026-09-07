package example.leaf.skill

import com.ops.leaf_core.api.Action
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.action

sealed interface NameOutput {
    data class Valid(val value: String) : NameOutput
    data object Empty : NameOutput
}

/** Minimal API example; a standalone normalization rule may simply be a function. */
class NormalizeNameModule : Module {
    override val info = ModuleInfo("example.normalize-name", "1.0.0")

    val normalize: Action<String, NameOutput> = action(info) { input ->
        val value = input.trim()
        if (value.isEmpty()) NameOutput.Empty else NameOutput.Valid(value)
    }
}
