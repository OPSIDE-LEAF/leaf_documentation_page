# Login: el módulo de referencia

`leaf-login` (`com.opside-leaf:leaf-login:1.0.0`, paquete `com.opside.leaf.login`, [repo](https://github.com/OPSIDE-LEAF/leaf-login)) es la implementación de referencia validada de la arquitectura 2.x. Este walkthrough recorre su mecánica completa.

## El recorrido de la Feature

```text
LoginInput(initialEmail)
        |
LoginModule.login: Feature<LoginInput, LoginState, LoginEvent, LoginResult>
        |
LoginRoute -> Leaf.rememberLeaf(module.login, input)
        |
LoginScreen(state, callbacks) -> LoginEvent
        |
stay(LoginState) o finish(LoginResult.Authenticated)
```

## Modelos y gateway

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

## El Module

```kotlin
class LoginModule(
    private val authGateway: AuthGateway,
) : Module {
    override val info = ModuleInfo(id = "com.opside.leaf.login", version = "1.0.0")

    val login = feature<LoginInput, LoginState, LoginEvent, LoginResult>(
        moduleInfo = info,
        initialState = { input -> LoginState(email = input.initialEmail) },
    ) { state, event ->
        when (event) {
            is LoginEvent.EmailChanged -> stay(state.copy(email = event.value))
            is LoginEvent.PasswordChanged -> stay(state.copy(password = event.value))
            LoginEvent.Submit -> submit(state)
        }
    }

    private suspend fun submit(state: LoginState) = when {
        state.email.isBlank() -> stay(state.copy(emailError = "El correo es obligatorio"))
        state.password.length < 8 -> stay(state.copy(passwordError = "Usa al menos 8 caracteres"))
        else -> when (val response = authGateway.authenticate(state.email, state.password)) {
            is AuthResponse.Success -> finish(LoginResult.Authenticated(response.userId))
            AuthResponse.InvalidCredentials -> stay(state.copy(formError = "Correo o contraseña inválidos"))
        }
    }
}
```

Puntos clave:

- La validación local es un `stay` con el error en el estado — recuperable.
- `InvalidCredentials` **también es recuperable**: vuelve como estado de formulario, no como excepción.
- Solo `AuthResponse.Success` produce `finish`, exactamente una vez.

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

`LoginRoute` abre la Feature con `rememberLeaf`, convierte callbacks de UI en `LoginEvent` y entrega el `Finished` al callback de navegación. `LoginScreen` es una vista sin estado de sesión.

## Uso desde un host

```kotlin
val loginModule = LoginModule(authGateway)

LoginRoute(
    module = loginModule,
    onAuthenticated = { result -> navigateToHome(result.userId) },
)
```

## Nota de seguridad

::: danger No copies este detalle sin evaluar
El `LoginModule` conserva `password` en `LoginState` y expone `LoginEvent.PasswordChanged`. Eso permite observar su reducción como Feature, pero **no es un patrón para módulos nuevos**.
:::

La presencia de un campo editable no autoriza a retener un secreto en el estado de dominio. En módulos nuevos minimiza secretos en `State`, `Event` y `Output`; dales vida efímera en el borde UI/gateway y nunca los persistas ni los reexpongas por logs, telemetría, `rememberSaveable` o errores técnicos. Ver [reglas de privacidad](/es/guide/errores-telemetria).
