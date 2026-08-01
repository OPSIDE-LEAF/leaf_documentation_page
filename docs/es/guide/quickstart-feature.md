# Host: abrir una Feature

Una `Feature<Input, State, Event, Output>` modela una interacción: como host observas **estado**, envías **eventos** y recibes exactamente un **resultado terminal**. Core es dueño de la sesión; tú solo observas y envías.

## 1. El módulo (lo publica su autor)

```kotlin
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.feature
import com.ops.leaf_core.api.finish
import com.ops.leaf_core.api.stay

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
            CounterEvent.Increment -> stay(state + 1)
            CounterEvent.Done -> finish(CounterResult.FinalCount(state))
        }
    }
}
```

Lo que te importa como host: cada evento produce `stay` (nuevo estado, sesión abierta) o `finish` (resultado terminal, una sola vez). Tú no implementas esa lógica — solo la consumes.

## 2. Desde una corrutina (`Leaf.open`)

```kotlin
import com.ops.leaf_core.api.FeatureSendResult
import com.ops.leaf_core.api.FeatureSessionResult
import com.ops.leaf_core.api.Leaf
import com.ops.leaf_core.api.open

suspend fun runCounter(module: CounterModule) {
    val session = Leaf.open(module.counter, Unit)
    try {
        when (session.send(CounterEvent.Increment)) {
            FeatureSendResult.ACCEPTED -> Unit
            FeatureSendResult.REJECTED_OVERFLOW -> showBackpressureMessage()
            FeatureSendResult.REJECTED_TERMINATED -> Unit
        }

        session.result.collect { result ->
            if (result is FeatureSessionResult.Finished) {
                persistCount(result.output.value)
            }
        }
    } finally {
        session.close()
    }
}
```

`Leaf.open` requiere una corrutina con `Job`: la sesión es **hija** de esa corrutina. Si el host se cancela, la sesión se cancela.

## 3. Desde Compose (`rememberLeaf`)

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

`rememberLeaf` abre la sesión, la expone como estado observable de Compose y la cierra automáticamente al salir de composición.

::: warning Una sola sesión
No implementes un reducer, una cola o una sesión paralela en el host. No abras otra sesión en `LaunchedEffect` ni guardes la sesión en un ViewModel. Core es dueño de la sesión.
:::

## Siguientes pasos

- [FeatureSession a fondo](/es/guide/feature-session) — lifecycle, backpressure, métricas.
- [Compose a fondo](/es/guide/compose-adapter) — la clave `(feature, input)` y el ciclo de vida.
- [Integrar módulos publicados](/es/guide/host-integration) — gateways del host y navegación.
