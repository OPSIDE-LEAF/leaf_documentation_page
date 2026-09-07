# Visuals

Visuals 1.4.0 is an option for giving a Compose screen the LEAF visual style: colors, type, and shapes. It is fully optional. Your app can use it when it likes that style or use its own theme; Actions and Workflows work the same either way.

<!-- kotlin-snippet: compiled: visuals-guide -->
```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.opside.leaf.visuals.ThingsLeafTheme

@Composable
fun HostContent() {
    ThingsLeafTheme {
        Text("Host content")
    }
}
```

The example uses `ThingsLeafTheme`, a function that creates and applies the LEAF theme. If your app needs direct access to the values so it can apply them differently, the API also provides `thingsLeafVisuals()`. Visuals changes appearance only: it does not open sessions, control a Workflow, or choose navigation. See [the API reference](/en/api/visuals) for the available values.
