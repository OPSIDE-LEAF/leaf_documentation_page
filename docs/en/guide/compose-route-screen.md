# UI: Route + Screen

Split the integration into two parts to make it easier to test. The Route manages the Workflow and its lifecycle. Each Screen receives simple values and functions for sending the corresponding interactions.

<!-- kotlin-snippet: compiled: compose-route-screen -->
```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun CounterScreen(
    value: Int,
    persisting: Boolean,
    onIncrement: () -> Unit,
    onSave: () -> Unit,
) {
    Column {
        Text("Counter: $value")
        Button(onClick = onIncrement, enabled = !persisting) { Text("+") }
        Button(onClick = onSave, enabled = !persisting) { Text("Save $value") }
    }
}
```

The Route takes `CounterState` and calls the Screen with `value = state.value` and `persisting = state.persisting`. It also decides what to show before data exists (`Initializing`) and handles the session outcome: `Completed`, `Failed`, or `Cancelled`.

In a Workflow with several screens, state can indicate which one to show and the Route selects the matching Screen. Those transitions are part of the module's internal navigation. When an `Output` arrives, the Route passes it to the host so the host can decide external navigation or any other application response.

The Screen opens no session, calls no port, and chooses no navigation. Its buttons only send events. If the host app uses Visuals, apply the theme around composition; the module does not require one specific theme.
