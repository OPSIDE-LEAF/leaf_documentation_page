# Route + Screen pattern

Modules with UI separate two composables with distinct responsibilities:

| Composable | Role | Knows about |
|---|---|---|
| `<Module>Route` | **Connector**: opens the Feature with `rememberLeaf`, converts callbacks into events, delivers the terminal result to navigation | Leaf, the module |
| `<Module>Screen` | **Pure view**: receives state and callbacks | Only `State` and lambdas |

## Route: the connector

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

The Route **does not navigate on its own**: it delivers the `Finished` result to a callback. Navigation belongs to the host.

## Screen: the pure view

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

No session, no Leaf, no effects: just state and callbacks. This makes it trivially previewable and testable.

## Usage from the host

```kotlin
val loginModule = LoginModule(authGateway)

LoginRoute(
    module = loginModule,
    onAuthenticated = { result -> navigateToHome(result.userId) },
)
```

The host constructs the module explicitly (with its real gateways) and retains the navigation decision.

## Why separate

- The **Screen** can be developed and previewed without infrastructure.
- The **Route** concentrates the single point of contact with Leaf: easy to audit (one session, one `(feature, input)` key, one navigation effect).
- The **host** decides navigation and infrastructure without touching the module.
