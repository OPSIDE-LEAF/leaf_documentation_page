# Login

Login 4.0.1 is a Kotlin Multiplatform module for sign-in and user registration. It exposes two Workflows (`login` and `register`) with Compose UI, an alternative Workflow with separate password handling, and keeps real authentication and navigation under the host application's control. The host can customize the copy and visible elements of each screen through `LoginContent` / `RegisterContent`.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-login:4.0.1`. Its source corresponds to tag [`v4.0.1`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v4.0.1), revision [`6b59110`](https://github.com/OPSIDE-LEAF/leaf-login/commit/6b59110).

Declared compatibility is LEAF Contracts/Core/Compose 3.1.0; integration with leaf-visuals 1.4.0 is optional.

::: info Changes in 4.0
`LoginModule.login` and `LoginModule.register` moved from `Feature`, being deprecated in LEAF, to `Workflow`. It is a breaking change: both properties change type, `LoginEvent`/`RegisterEvent` gain result events (an exhaustive `when` breaks), and the states gain `isSubmitting` (their binary signature changes). `LoginRoute` and `RegisterRoute` keep their signatures. An unexpected gateway exception, including its own timeout since 4.0.1, no longer ends the session; it is shown as service unavailable.
:::

Login has a version independent of the base LEAF release train. Before integrating it, check its compatibility requirements and confirm that the artifact is available from the Maven repository configured by your organization.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-login:4.0.1")
}
```

Login declares `leaf-contracts`, `leaf-core`, `leaf-compose`, and `leaf-visuals` as transitive dependencies (`api`); the host does not need to declare them separately.

## Public surface

| API | Responsibility |
| --- | --- |
| `LoginModule` | Exposes the `login` and `register` Workflows and the alternative Workflow factory. |
| `AuthGateway` | Port implemented by the application to authenticate and register users. |
| `LoginRoute` / `LoginScreen` | Connect the login Workflow to Compose; terminal navigation belongs to the host. |
| `RegisterRoute` / `RegisterScreen` | Connect the registration Workflow to Compose; terminal navigation belongs to the host. |
| `LoginContent` / `RegisterContent` | Configure the copy and element presence of each screen, without touching visual style. |
| `createLoginWorkflow` / `LoginWorkflowScreen` | Expose an alternative login Workflow with a redacted password, timeout, and retry; no opt-in required. |

## Host responsibilities

The application implements `AuthGateway` (both `authenticate` and `register`), maps expected responses to the module's results, and decides what happens after successful authentication or registration. It also controls transport, persistence, telemetry, the optional visual theme, the screen content (copy and visible elements), and navigation between login and registration.

## Usage

### Implement AuthGateway

The application provides the authentication and registration transport by implementing `AuthGateway`:

```kotlin
import com.opside.leaf.login.gateway.AuthGateway
import com.opside.leaf.login.gateway.AuthResponse
import com.opside.leaf.login.gateway.RegisterResponse

class MyAuthGateway(private val api: MyApi) : AuthGateway {
    override suspend fun authenticate(
        email: String,
        password: String,
    ): AuthResponse = try {
        val userId = api.login(email, password)
        AuthResponse.Success(userId)
    } catch (e: InvalidCredentialsException) {
        AuthResponse.InvalidCredentials
    } catch (e: Exception) {
        AuthResponse.Unavailable()
    }

    override suspend fun register(
        name: String,
        email: String,
        password: String,
    ): RegisterResponse = try {
        val userId = api.register(name, email, password)
        RegisterResponse.Success(userId)
    } catch (e: EmailExistsException) {
        RegisterResponse.EmailAlreadyExists
    } catch (e: Exception) {
        RegisterResponse.Unavailable()
    }
}
```

`AuthResponse` has three variants:

| Variant | Meaning |
| --- | --- |
| `Success(userId)` | Authentication succeeded |
| `InvalidCredentials` | Wrong email or password |
| `Unavailable(retryAfterMilliseconds?)` | Service is not available |

`RegisterResponse` has three variants:

| Variant | Meaning |
| --- | --- |
| `Success(userId)` | Registration succeeded |
| `EmailAlreadyExists` | An account with that email already exists |
| `Unavailable(retryAfterMilliseconds?)` | Service is not available |

### Login path

`LoginRoute` connects the login Workflow to Compose. The host only receives the final result:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.opside.leaf.login.LoginModule
import com.opside.leaf.login.domain.LoginInput
import com.opside.leaf.login.ui.LoginRoute

@Composable
fun MyLoginScreen(
    onLoggedIn: (String) -> Unit,
    onRegister: () -> Unit,
) {
    val module = remember { LoginModule(MyAuthGateway(api)) }
    LoginRoute(
        module = module,
        input = LoginInput(initialEmail = ""),
        onAuthenticated = { result -> onLoggedIn(result.userId) },
        onRegisterRequested = onRegister,
    )
}
```

The `onRegisterRequested` parameter is optional. When `null`, the "Create account" link is hidden.

### Registration path

`RegisterRoute` connects the registration Workflow to Compose:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.opside.leaf.login.LoginModule
import com.opside.leaf.login.domain.RegisterInput
import com.opside.leaf.login.ui.RegisterRoute

@Composable
fun MyRegisterScreen(
    onRegistered: (String) -> Unit,
    onLogin: () -> Unit,
) {
    val module = remember { LoginModule(MyAuthGateway(api)) }
    RegisterRoute(
        module = module,
        input = RegisterInput(initialEmail = ""),
        onRegistered = { result -> onRegistered(result.userId) },
        onLoginRequested = onLogin,
    )
}
```

The `onLoginRequested` parameter is optional. When `null`, the "Already have an account" link is hidden.

### Alternative login path

`LoginWorkflowScreen` uses the alternative Workflow, with separate password handling, timeout, and retry:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.opside.leaf.login.LoginModule
import com.opside.leaf.login.LoginWorkflowInput
import com.opside.leaf.login.ui.workflow.LoginWorkflowScreen

@Composable
fun MyLoginWorkflowScreen(
    onLoggedIn: () -> Unit,
    onBack: () -> Unit,
) {
    val module = remember { LoginModule(MyAuthGateway(api)) }
    LoginWorkflowScreen(
        module = module,
        input = LoginWorkflowInput(initialEmail = ""),
        onAuthenticated = onLoggedIn,
        onCancelled = onBack,
    )
}
```

All three paths coexist in the same artifact. The host decides which one to present and controls navigation between login and registration.

## Content customization

`LoginRoute` and `RegisterRoute` accept a `content` parameter that controls **which elements appear and what they say**, without touching visual style. Every field defaults to the built-in copy, so you only set what you want to change.

The rule is simple: optional elements are `String?` and passing `null` hides them; field labels and the button are non-null `String`s you can rename but not remove; the decorative accent bar is toggled with the `showAccentBar` `Boolean`.

::: code-group

```kotlin [LoginContent]
data class LoginContent(
    val showAccentBar: Boolean = true,
    val title: String = "Inicia sesión",
    val subtitle: String? = "Ingresa tus datos para continuar.",
    val badge: String? = "CREDENCIALES",
    val cardTitle: String? = "Tu cuenta",
    val cardSubtitle: String? = "Un acceso claro, privado y bajo tu control.",
    val emailLabel: String = "Correo electrónico",
    val passwordLabel: String = "Contraseña",
    val submitLabel: String = "Continuar",
    val registerPrompt: String = "¿No tienes cuenta? ",
    val registerLink: String = "Crear cuenta",
)
```

```kotlin [RegisterContent]
data class RegisterContent(
    val showAccentBar: Boolean = true,
    val title: String = "Crear cuenta",
    val subtitle: String? = "Completa tus datos para registrarte.",
    val badge: String? = "REGISTRO",
    val cardTitle: String? = "Tu nueva cuenta",
    val cardSubtitle: String? = "Un acceso claro, privado y bajo tu control.",
    val nameLabel: String = "Nombre completo",
    val emailLabel: String = "Correo electrónico",
    val passwordLabel: String = "Contraseña",
    val confirmPasswordLabel: String = "Confirmar contraseña",
    val submitLabel: String = "Crear cuenta",
    val loginPrompt: String = "¿Ya tienes cuenta? ",
    val loginLink: String = "Iniciar sesión",
)
```

:::

The `String?` fields (`subtitle`, `badge`, `cardTitle`, `cardSubtitle`) are hidden with `null`; `showAccentBar = false` hides the top decorative bar; the rest are labels you only rename. The cross-navigation row (`registerPrompt` / `registerLink`, `loginPrompt` / `loginLink`) only appears when you provide the matching callback (`onRegisterRequested` / `onLoginRequested`).

```kotlin
import com.opside.leaf.login.ui.LoginContent
import com.opside.leaf.login.ui.LoginRoute

// Without the "CREDENCIALES" chip, with custom title and button
LoginRoute(
    module = module,
    content = LoginContent(
        badge = null,
        title = "Welcome back",
        submitLabel = "Sign in",
    ),
    onAuthenticated = { result -> onLoggedIn(result.userId) },
)

// Minimal version: fields and button only
LoginRoute(
    module = module,
    content = LoginContent(
        showAccentBar = false,
        subtitle = null,
        badge = null,
        cardTitle = null,
        cardSubtitle = null,
    ),
    onAuthenticated = { result -> onLoggedIn(result.userId) },
)
```

::: info
`content` only changes the copy and element presence. It exposes no composable slots and no restyling: to change colors, shapes, or typography use the `visuals` parameter with a `LeafVisuals`.
:::

## Workflows

The login Workflow uses `LoginInput`, `LoginState`, `LoginEvent`, `LoginEffect`, and `LoginResult`. It validates in the synchronous reducer; the `AuthGateway` call runs as a `LoginEffect` that Core executes, and `LoginState.isSubmitting` shows a submission in flight: a second `Submit` is ignored and `LoginScreen` disables its fields and button and shows a progress indicator. `LoginRoute` observes its result and delivers `LoginResult.Authenticated` to the host callback.

The registration Workflow uses `RegisterInput`, `RegisterState`, `RegisterEvent`, `RegisterEffect`, and `RegisterResult`. `RegisterRoute` observes its result and delivers `RegisterResult.Registered` to the host callback. It validates name, email, password (minimum 8 characters), and password confirmation before submitting to the gateway.

In both, an unexpected gateway exception is shown as "El servicio no está disponible" and the session stays open for a retry. Only the module creates the result events (`AuthenticationFinished`, `RegistrationFinished`) and the effects.

The alternative Workflow keeps the password out of `LoginWorkflowState` through `LoginPassword`, emits the authentication effect, and completes with `LoginWorkflowOutput.Authenticated` or `LoginWorkflowOutput.Cancelled`. Recoverable failures return to an editable state; the application remains responsible for the Gateway and subsequent actions.

## Security

Do not log, persist, or send passwords to telemetry. `LoginRoute` and `RegisterRoute` keep the password in state during the session to process the form, so the host must not serialize their state; the states, the password events, and the effects redact the password in `toString`. The alternative path redacts `LoginPassword` when converted to text, and the UI clears its copy when it completes or leaves composition.
