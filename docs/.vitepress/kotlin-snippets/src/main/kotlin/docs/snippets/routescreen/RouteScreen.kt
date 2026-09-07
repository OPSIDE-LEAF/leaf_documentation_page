package docs.snippets.routescreen

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
