# UI: Route + Screen

Divide la integración en dos partes para facilitar las pruebas. La Route administra el Workflow y su ciclo de vida. Cada Screen recibe valores sencillos y funciones para enviar las interacciones correspondientes.

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
        Text("Contador: $value")
        Button(onClick = onIncrement, enabled = !persisting) { Text("+") }
        Button(onClick = onSave, enabled = !persisting) { Text("Guardar $value") }
    }
}
```

La Route toma `CounterState` y llama a la Screen con `value = state.value` y `persisting = state.persisting`. También decide qué mostrar antes de tener datos (`Initializing`) y procesa el final de la sesión: `Completed`, `Failed` o `Cancelled`.

En un Workflow con varias pantallas, el estado puede indicar cuál corresponde mostrar y la Route selecciona la Screen adecuada. Esas transiciones forman parte de la navegación interna del módulo. Cuando llega un `Output`, la Route lo entrega al host para que decida la navegación externa o cualquier otra respuesta de la aplicación.

La Screen no abre sesiones, no llama puertos y no decide navegación. Sus botones solo envían eventos. Si tu app usa Visuals, aplica el tema alrededor de la composición; el módulo no obliga a usar un tema concreto.
