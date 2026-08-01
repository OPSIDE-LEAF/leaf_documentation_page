# leaf-compose

`com.opside-leaf:leaf-compose:2.0.1` · paquete `com.ops.leaf_core.ui.compose`

Adaptador Compose: observa la única sesión de Core y expone un holder observable. No crea otra sesión, cola ni reducer.

## Leaf.rememberLeaf

```kotlin
@Composable
fun <Input, State, Event, Output> Leaf.Companion.rememberLeaf(
    feature: Feature<Input, State, Event, Output>,
    input: Input,
): LeafComposeState<State, Event, Output>
```

- La pareja `(feature, input)` es la **clave de composición**: identifica la sesión.
- Recomposición con la misma pareja conserva la sesión; cambiarla cierra la anterior y abre una nueva.
- Salir de composición cierra la sesión (disposal automático).
- Si `initialState` falla: publica `Failed(INITIALIZATION_FAILED)`, deja `isReady = false`, no expone el throwable.

## LeafComposeState

```kotlin
@Stable
class LeafComposeState<State, Event, Output> internal constructor() {
    var state: State? by mutableStateOf(null)
        private set

    var result: FeatureSessionResult<Output>? by mutableStateOf(null)
        private set

    var isReady: Boolean by mutableStateOf(false)
        private set

    fun send(event: Event): FeatureSendResult
}
```

Constructor interno: la única forma de obtener una instancia es `rememberLeaf`.

| Miembro | Semántica |
|---|---|
| `state` | Último estado publicado; `null` durante inicialización |
| `result` | `null` activa; después exactamente un `FeatureSessionResult` |
| `isReady` | `true` cuando la sesión acepta eventos |
| `send(event)` | Misma disposición que `FeatureSession.send` (`ACCEPTED` / `REJECTED_*`) |

Ver [guía de uso](/es/guide/compose-adapter) y [anti-patrones](/es/guide/compose-adapter#anti-patrones).
