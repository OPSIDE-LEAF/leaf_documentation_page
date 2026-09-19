# Login

Login 3.1.1 is a Kotlin Multiplatform module for sign-in and user registration. It exposes two Features (`login` and `register`) with Compose UI, a Workflow with separate password handling, and keeps real authentication and navigation under the host application's control.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-login:3.1.1`. Its source corresponds to tag [`v3.1.1`](https://github.com/OPSIDE-LEAF/leaf_login/tree/v3.1.1), revision [`a562cec`](https://github.com/OPSIDE-LEAF/leaf_login/commit/a562cec).

Declared compatibility is LEAF Contracts/Core/Compose 3.1.0; integration with leaf-visuals 1.4.0 is optional.

Login has a version independent of the base LEAF release train. Before integrating it, check its compatibility requirements and confirm that the artifact is available from the Maven repository configured by your organization.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-login:3.1.1")
}
```

Login declares `leaf-contracts`, `leaf-core`, and `leaf-compose` as transitive dependencies. `leaf-visuals` is an internal implementation dependency; the host does not need to declare it separately.

## Public surface

| API | Responsibility |
| --- | --- |
| `LoginModule` | Exposes the `login` and `register` Features and the Workflow factory. |
| `AuthGateway` | Port implemented by the application to authenticate and register users. |
| `LoginRoute` / `LoginScreen` | Connect the login Feature to Compose; terminal navigation belongs to the host. |
| `RegisterRoute` / `RegisterScreen` | Connect the registration Feature to Compose; terminal navigation belongs to the host. |
| `createLoginWorkflow` / `LoginWorkflowScreen` | Expose the reference Workflow for login; the published Kotlin API still requires explicit opt-in. |

## Host responsibilities

The application implements `AuthGateway` (both `authenticate` and `register`), maps expected responses to the module's results, and decides what happens after successful authentication or registration. It also controls transport, persistence, telemetry, the optional visual theme, and navigation between login and registration.

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

### Feature path — Login (stable)

`LoginRoute` connects the login Feature to Compose. The host only receives the final result:

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

### Feature path — Registration (stable)

`RegisterRoute` connects the registration Feature to Compose:

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

### Workflow path

`LoginWorkflowScreen` uses the Workflow with separate password handling and authentication effect:

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

## Feature and Workflow

The login Feature uses `LoginInput`, `LoginState`, `LoginEvent`, and `LoginResult`. `LoginRoute` observes its result and delivers `LoginResult.Authenticated` to the host callback.

The registration Feature uses `RegisterInput`, `RegisterState`, `RegisterEvent`, and `RegisterResult`. `RegisterRoute` observes its result and delivers `RegisterResult.Registered` to the host callback. It validates name, email, password (minimum 8 characters), and password confirmation before submitting to the gateway.

The Workflow keeps the password out of `LoginWorkflowState` through `LoginPassword`, emits the authentication effect, and completes with `LoginWorkflowOutput.Authenticated` or `LoginWorkflowOutput.Cancelled`. Recoverable failures return to an editable state; the application remains responsible for the Gateway and subsequent actions.

## Security

Do not log, persist, or send passwords to telemetry. The Feature path retains the password during the session to process the form, so the host must not serialize its state. The Workflow path redacts `LoginPassword` when converted to text, and the UI clears its copy when it completes or leaves composition.
