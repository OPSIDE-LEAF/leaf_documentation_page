# Visuals

Visuals 1.4.0 es una opción para dar a una pantalla Compose el estilo visual de LEAF: colores, letras y formas. Es totalmente opcional. Tu app puede usarlo si le gusta ese estilo o puede usar un tema propio; las Actions y los Workflows funcionan igual en ambos casos.

<!-- kotlin-snippet: compiled: visuals-guide -->
```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.opside.leaf.visuals.ThingsLeafTheme

@Composable
fun HostContent() {
    ThingsLeafTheme {
        Text("Contenido del host")
    }
}
```

El ejemplo usa `ThingsLeafTheme`, una función que crea y aplica el tema de LEAF. Si tu app necesita acceder a los valores para aplicarlos de otra forma, la API también ofrece `thingsLeafVisuals()`. Visuals solo cambia la apariencia del contenido: no abre sesiones, no controla un Workflow y no decide la navegación. Consulta [la referencia API](/es/api/visuals) para conocer los valores disponibles.
