# `leaf-visuals`

`leaf-visuals` 1.4.0 is an optional Compose Material 3 theme. It gives a screen LEAF colors, type, and shapes. You may use it or choose your own theme: it does not change how Contracts, Core, or Compose work, does not open sessions, and does not decide where the app navigates.

## Public API

<!-- kotlin-snippet: compiled: visuals-api -->
```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.opside.leaf.visuals.ThingsLeafTheme
import com.opside.leaf.visuals.thingsLeafVisuals

val visuals = thingsLeafVisuals()

@Composable
fun LeafSurface() {
    ThingsLeafTheme {
        Text("Host content")
    }
}
```

`thingsLeafVisuals()` creates a `LeafVisuals` with light and dark colors, `LeafBrandTypography`, and `LeafBrandShapes`. If you want the direct option, wrap content in `ThingsLeafTheme`: Compose then receives those values and applies the Material 3 theme. This only changes appearance. An `Action` or `Workflow` works even when the app does not use Visuals.

## When to use it

Use `leaf-visuals` when you want to apply the LEAF theme to Compose content. If your organization already has a design system, you can keep it without changing Contracts, Core, or the modules. See [the module catalog](/en/guide/catalog) to compare this optional library with the other artifacts.
