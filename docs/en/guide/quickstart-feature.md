# Host: opening a Feature

A `Feature<Input, State, Event, Output>` models an interaction: as a host you observe **state**, send **events**, and receive exactly one **terminal result**. Core owns the session; you only observe and send.

## 1. The module (published by its Author)

```kotlin
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.feature
import com.ops.leaf_core.api.completeFeature
import com.ops.leaf_core.api.continueFeature

sealed interface CounterEvent {
    data object Increment : CounterEvent
    data object Done : CounterEvent
}

sealed interface CounterResult {
    data class FinalCount(val value: Int) : CounterResult
}

class CounterModule : Module {
    override val info = ModuleInfo("com.example.counter", "1.0.0")

    val counter = feature<Unit, Int, CounterEvent, CounterResult>(
        moduleInfo = info,
        initialState = { 0 },
    ) { state, event ->
        when (event) {
            CounterEvent.Increment -> continueFeature(state + 1)
            CounterEvent.Done -> completeFeature(CounterResult.FinalCount(state))
        }
    }
}
```

What matters to you as a host: each event produces `continueFeature` (new state, session remains open) or `completeFeature` (terminal result, exactly once). You do not implement that logic; you only consume it.

## 2. From a coroutine (`Leaf.open`)

```kotlin
import com.ops.leaf_core.api.FeatureSendResult
import com.ops.leaf_core.api.FeatureSessionResult
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.api.open
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.flow.first

suspend fun runCounter(module: CounterModule) {
    val session = Leaf.open(module.counter, Unit)
    try {
        check(session.send(CounterEvent.Increment) == FeatureSendResult.ACCEPTED)
        check(session.send(CounterEvent.Done) == FeatureSendResult.ACCEPTED)

        when (val result = session.result.filterNotNull().first()) {
            is FeatureSessionResult.Completed -> persistCount(result.output.value)
            FeatureSessionResult.Cancelled -> Unit
            is FeatureSessionResult.Failed -> showTechnicalFailure(result.failure)
        }
    } finally {
        session.close()
    }
}
```

`Leaf.open` requires a coroutine with a `Job`: the session is a **child** of that coroutine. If the host is cancelled, the session is cancelled.

The example sends `Done` and awaits the first non-null result, so it reaches terminality and stops observing. In a real UI, handle each `FeatureSendResult` according to the interaction.

## 3. From Compose (`rememberLeaf`)

```kotlin
import androidx.compose.runtime.Composable
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.ui.compose.rememberLeaf

@Composable
fun CounterRoute(module: CounterModule) {
    val leaf = Leaf.rememberLeaf(
        feature = module.counter,
        input = Unit,
    )

    when (val state = leaf.state) {
        null -> Loading()
        else -> CounterScreen(
            count = state,
            onIncrement = { leaf.send(CounterEvent.Increment) },
            onDone = { leaf.send(CounterEvent.Done) },
        )
    }
}
```

`rememberLeaf` opens the session, exposes it as Compose observable state, and automatically closes it when leaving composition.

::: warning A single session
Do not implement a reducer, a queue, or a parallel session in the host. Do not open another session in `LaunchedEffect` or store the session in a ViewModel. Core owns the session.
:::

## Next steps

- [FeatureSession in depth](/en/guide/feature-session) — lifecycle, backpressure, metrics.
- [Compose in depth](/en/guide/compose-adapter) — the `(feature, input)` key and the lifecycle.
- [Integrating published modules](/en/guide/host-integration) — host gateways and navigation.
- [Migrating from LEAF 2.0.1](/en/guide/feature-migration) — removed names and replacements.
