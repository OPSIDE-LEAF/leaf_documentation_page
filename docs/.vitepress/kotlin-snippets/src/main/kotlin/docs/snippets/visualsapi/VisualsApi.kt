package docs.snippets.visualsapi

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
