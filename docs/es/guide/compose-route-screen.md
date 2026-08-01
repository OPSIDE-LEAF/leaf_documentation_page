# Patrón Route + Screen

Los módulos con UI separan dos composables con responsabilidades distintas:

| Composable | Rol | Conoce |
|---|---|---|
| `<Modulo>Route` | **Conector**: abre la Feature con `rememberLeaf`, convierte callbacks en eventos, entrega el resultado terminal a la navegación | Leaf, el módulo |
| `<Modulo>Screen` | **Vista pura**: recibe estado y callbacks | Solo `State` y lambdas |

## Route: el conector

```kotlin
@Composable
fun LoginRoute(
    module: LoginModule,
    input: LoginInput = LoginInput(),
    onAuthenticated: (LoginResult.Authenticated) -> Unit,
) {
    val leaf = Leaf.rememberLeaf(feature = module.login, input = input)
    val result = leaf.result

    LaunchedEffect(result) {
        if (result is FeatureSessionResult.Finished) {
            onAuthenticated(result.output as LoginResult.Authenticated)
        }
    }

    val state = leaf.state
    if (state == null) {
        // Loading
    } else {
        LoginScreen(
            state = state,
            onEmailChanged = { leaf.send(LoginEvent.EmailChanged(it)) },
            onPasswordChanged = { leaf.send(LoginEvent.PasswordChanged(it)) },
            onSubmit = { leaf.send(LoginEvent.Submit) },
        )
    }
}
```

El Route **no navega por sí mismo**: entrega el `Finished` a un callback. La navegación pertenece al host.

## Screen: la vista pura

```kotlin
@Composable
fun LoginScreen(
    state: LoginState,
    onEmailChanged: (String) -> Unit,
    onPasswordChanged: (String) -> Unit,
    onSubmit: () -> Unit,
    modifier: Modifier = Modifier,
)
```

Sin sesión, sin Leaf, sin efectos: solo estado y callbacks. Esto la hace trivialmente previsualizable y testeable.

## Uso desde el host

```kotlin
val loginModule = LoginModule(authGateway)

LoginRoute(
    module = loginModule,
    onAuthenticated = { result -> navigateToHome(result.userId) },
)
```

El host construye el módulo explícitamente (con sus gateways reales) y conserva la decisión de navegación.

## Por qué separar

- La **Screen** se puede desarrollar y previsualizar sin infraestructura.
- El **Route** concentra el único punto de contacto con Leaf: fácil de auditar (una sesión, una clave `(feature, input)`, un efecto de navegación).
- El **host** decide navegación e infraestructura sin tocar el módulo.
