# rememberLeaf y LeafComposeState

`leaf-compose` provee el adaptador estable para hosts Compose:

```kotlin
@Composable
fun <Input, State, Event, Output> Leaf.Companion.rememberLeaf(
    feature: Feature<Input, State, Event, Output>,
    input: Input,
): LeafComposeState<State, Event, Output>
```

`rememberLeaf` abre la única sesión de Core, la expone como estado observable de Compose y la cierra automáticamente. El paquete es `com.ops.leaf_core.ui.compose`.

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

Su constructor es interno: el host recibe una instancia **exclusivamente** desde `rememberLeaf`.

| Propiedad | Significado |
|---|---|
| `state` | Último estado publicado; `null` mientras la sesión inicializa |
| `result` | `null` mientras está activa; después, exactamente un resultado terminal |
| `isReady` | `true` cuando la sesión está lista para recibir eventos |
| `send(event)` | Misma disposición que `FeatureSession.send` |

## La clave de composición: `(feature, input)`

La pareja `(feature, input)` **identifica la sesión**:

- Recomposición con la misma pareja → la sesión se conserva (no se abre otra).
- Cambia cualquiera de las dos referencias/valores → Compose **cierra la sesión anterior y abre una nueva**.
- Salir de composición → la sesión se cierra.

::: warning Una edición es un Event, no un input nuevo
No cambies `input` en cada pulsación del teclado: eso reemplaza la sesión completa. Las ediciones del formulario viajan como eventos (`leaf.send(EmailChanged(...))`).
:::

## Manejo de estados en el host

```kotlin
@Composable
fun Login(module: LoginModule) {
    val leaf = Leaf.rememberLeaf(module.login, LoginInput())

    when {
        !leaf.isReady && leaf.result == null -> Loading()
        leaf.result is FeatureSessionResult.Failed -> TechnicalFailure()
        else -> LoginContent(state = leaf.state, onEvent = leaf::send)
    }
}
```

Si falla `initialState`, `rememberLeaf` publica `Failed(INITIALIZATION_FAILED)`, deja `isReady` en `false` y **no expone el throwable**.

## Anti-patrones

- ❌ Abrir otra sesión en `LaunchedEffect`.
- ❌ Guardar la sesión (o `LeafComposeState`) en un ViewModel.
- ❌ Coleccionar manualmente los flows de la sesión para crear otro estado de UI.
- ❌ Implementar un reducer o cola paralela en el host.
- ❌ Cambiar `input` por cada interacción del usuario.

`LeafComposeState` refleja la única sesión de Core; duplicarla rompe la terminalidad única y el ciclo de vida administrado.
