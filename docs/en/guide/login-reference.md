# Login: the reference module

`leaf-login` (`com.opside-leaf:leaf-login:%LEAF_VERSION%`, package `com.opside.leaf.login`, [repo](https://github.com/OPSIDE-LEAF/leaf-login)) is the LEAF 3 train's reference module. It retains its stable Feature/UI and adds an experimental Workflow/UI route.

## The Feature flow

```text
LoginInput(initialEmail)
        |
LoginModule.login: Feature<LoginInput, LoginState, LoginEvent, LoginResult>
        |
LoginRoute -> Leaf.rememberLeaf(module.login, input)
        |
LoginScreen(state, callbacks) -> LoginEvent
        |
continueFeature(LoginState) or completeFeature(LoginResult.Authenticated)
```

## Models and gateway

```kotlin
data class LoginInput(val initialEmail: String = "")

sealed interface LoginEvent {
    data class EmailChanged(val value: String) : LoginEvent
    data class PasswordChanged(val value: String) : LoginEvent
    data object Submit : LoginEvent
}

sealed interface LoginResult {
    data class Authenticated(val userId: String) : LoginResult
}

interface AuthGateway {
    suspend fun authenticate(email: String, password: String): AuthResponse
}

sealed interface AuthResponse {
    data class Success(val userId: String) : AuthResponse
    data object InvalidCredentials : AuthResponse
}
```

## The Module

```kotlin
class LoginModule(
    private val authGateway: AuthGateway,
) : Module {
    override val info = ModuleInfo(id = "com.opside.leaf.login", version = "%LEAF_VERSION%")

    val login = feature<LoginInput, LoginState, LoginEvent, LoginResult>(
        moduleInfo = info,
        initialState = { input -> LoginState(email = input.initialEmail) },
    ) { state, event ->
        when (event) {
            is LoginEvent.EmailChanged -> continueFeature(state.copy(email = event.value))
            is LoginEvent.PasswordChanged -> continueFeature(state.copy(password = event.value))
            LoginEvent.Submit -> submit(state)
        }
    }

    private suspend fun submit(state: LoginState) = when {
        state.email.isBlank() -> continueFeature(state.copy(emailError = "El correo es obligatorio"))
        state.password.length < 8 -> continueFeature(state.copy(passwordError = "Usa al menos 8 caracteres"))
        else -> when (val response = authGateway.authenticate(state.email, state.password)) {
            is AuthResponse.Success -> completeFeature(LoginResult.Authenticated(response.userId))
            AuthResponse.InvalidCredentials -> continueFeature(state.copy(formError = "Correo o contraseña inválidos"))
        }
    }
}
```

Key points:

- Local validation is a `continueFeature` with the error in state, so it remains recoverable.
- `InvalidCredentials` **is also recoverable**: it comes back as form state, not as an exception.
- Only `AuthResponse.Success` produces `completeFeature`, exactly once.

## UI: Route + Screen

```kotlin
@Composable
fun LoginRoute(
    module: LoginModule,
    input: LoginInput = LoginInput(),
    onAuthenticated: (LoginResult.Authenticated) -> Unit,
)

@Composable
fun LoginScreen(
    state: LoginState,
    onEmailChanged: (String) -> Unit,
    onPasswordChanged: (String) -> Unit,
    onSubmit: () -> Unit,
    modifier: Modifier = Modifier,
)
```

`LoginRoute` opens the Feature with `rememberLeaf`, converts UI callbacks into `LoginEvent`, and delivers the `Completed` result to the navigation callback. `LoginScreen` is a stateless view with no session awareness.

## Experimental Workflow route

`LoginModule.createLoginWorkflow()` returns a `Workflow<LoginWorkflowInput, LoginWorkflowState, LoginWorkflowEvent, LoginWorkflowEffect, LoginWorkflowOutput>`. `LoginWorkflowScreen` uses `rememberLeafWorkflowHolder` directly; it does not open an inner Feature. This entire surface requires `@OptIn(ExperimentalLeafWorkflowApi::class)`.

The password travels inside `LoginPassword`, remains outside `LoginWorkflowState`, and is cleared at the UI boundary when the session completes, fails, cancels, is replaced, or is disposed. Handler-produced events and `LoginWorkflowEffect.Authenticate` have internal constructors; the host creates only `EmailChanged`, `Submit`, `Retry`, and `Cancel`.

## Usage from a host

```kotlin
val loginModule = LoginModule(authGateway)

LoginRoute(
    module = loginModule,
    onAuthenticated = { result -> navigateToHome(result.userId) },
)
```

## Security note

::: danger Do not copy this detail without evaluation
The `LoginModule` keeps `password` in `LoginState` and exposes `LoginEvent.PasswordChanged`. This allows observing its reduction as a Feature, but **it is not a pattern for new modules**.
:::

The presence of an editable field does not authorize retaining a secret in domain state. In new modules, minimize secrets in `State`, `Event`, and `Output`; give them ephemeral lifetimes at the UI/gateway edge and never persist or re-expose them through logs, telemetry, `rememberSaveable`, or technical errors. See [privacy rules](/en/guide/errors-telemetry).

The [Feature migration](/en/guide/feature-migration) explains the names removed from 2.0.1.
