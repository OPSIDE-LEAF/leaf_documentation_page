# Login: el módulo de referencia

`leaf-login` (`com.opside-leaf:leaf-login:%LEAF_VERSION%`, paquete `com.opside.leaf.login`, [repo](https://github.com/OPSIDE-LEAF/leaf-login)) es el módulo de referencia del tren LEAF 3. Conserva su Feature/UI estable y añade una ruta Workflow/UI experimental.

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
continueFeature(LoginState) o completeFeature(LoginResult.Authenticated)
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

Puntos clave:

- La validación local es un `continueFeature` con el error en el estado: es recuperable.
- `InvalidCredentials` **también es recuperable**: vuelve como estado de formulario, no como excepción.
- Solo `AuthResponse.Success` produce `completeFeature`, exactamente una vez.

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

`LoginRoute` abre la Feature con `rememberLeaf`, convierte callbacks de UI en `LoginEvent` y entrega el `Completed` al callback de navegación. `LoginScreen` es una vista sin estado de sesión.

## Ruta Workflow experimental

`LoginModule.createLoginWorkflow()` devuelve un `Workflow<LoginWorkflowInput, LoginWorkflowState, LoginWorkflowEvent, LoginWorkflowEffect, LoginWorkflowOutput>`. `LoginWorkflowScreen` usa directamente `rememberLeafWorkflowHolder`; no abre una Feature interna. Toda esta superficie requiere `@OptIn(ExperimentalLeafWorkflowApi::class)`.

La contraseña viaja en `LoginPassword`, permanece fuera de `LoginWorkflowState` y se limpia en la frontera UI al terminar, fallar, cancelar, reemplazar o disponer la sesión. Los eventos producidos por el handler y `LoginWorkflowEffect.Authenticate` tienen constructores internos; el host solo crea `EmailChanged`, `Submit`, `Retry` y `Cancel`.

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

La [migración de Feature](/es/guide/feature-migration) explica los nombres retirados de 2.0.1.
