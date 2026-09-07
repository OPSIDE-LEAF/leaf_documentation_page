# `leaf-visuals`

`leaf-visuals` 1.4.0 es un tema opcional para Compose Material 3. Da a una pantalla colores, tipografías y formas con el estilo de LEAF. Puedes usarlo o elegir tu propio tema: no cambia cómo funcionan Contracts, Core o Compose, no abre sesiones y no decide a dónde navega la app.

## API pública

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
        Text("Contenido del host")
    }
}
```

`thingsLeafVisuals()` crea un `LeafVisuals` con colores claros y oscuros, `LeafBrandTypography` y `LeafBrandShapes`. Si prefieres una opción directa, envuelve tu contenido con `ThingsLeafTheme`: así Compose recibe esos valores y aplica el tema Material 3. Esto solo cambia la apariencia. Una `Action` o un `Workflow` pueden funcionar aunque tu app no use Visuals.

## Cuándo usarlo

Usa `leaf-visuals` cuando quieras aplicar el tema de LEAF a contenido Compose. Si tu organización ya tiene un sistema de diseño, puedes conservarlo sin cambiar Contracts, Core ni los módulos. Revisa [el catálogo de módulos](/es/guide/catalogo) para comparar esta biblioteca opcional con el resto de los artefactos.
