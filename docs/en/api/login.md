# Login

Login 3.1.0 is a reference Kotlin Multiplatform sign-in module. It provides a Compose UI Workflow on the official LEAF 3 capability and retains a compatible Feature path; real authentication and navigation remain under the host application's control.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-login:3.1.0`. Its source corresponds to tag [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v3.1.0), revision [`edd0bf0`](https://github.com/OPSIDE-LEAF/leaf-login/commit/edd0bf0).

Declared compatibility is LEAF Contracts/Core/Compose 3.1.0; integration with leaf-visuals 1.4.0 is optional.

Login has a version independent of the base LEAF release train. Before integrating it, check its compatibility requirements and confirm that the artifact is available from the Maven repository configured by your organization.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-login:3.1.0")
}
```

Login declares `leaf-contracts`, `leaf-core`, and `leaf-compose` as transitive dependencies. `leaf-visuals` is an internal implementation dependency; the host does not need to declare it separately.

## Public surface

| API | Responsibility |
| --- | --- |
| `LoginModule` and `login` | Expose the stable form, validation, and authentication Feature. |
| `AuthGateway` | Defines the Port implemented by the application to authenticate an email and password. |
| `LoginRoute` and `LoginScreen` | Connect the Feature to Compose; terminal navigation belongs to the host. |
| `createLoginWorkflow` and `LoginWorkflowScreen` | Expose the reference Workflow; the published Kotlin API still requires explicit opt-in. |

## Host responsibilities

The application implements `AuthGateway`, maps expected responses to the module's results, and decides what happens after successful authentication. It also controls transport, persistence, telemetry, the optional visual theme, and navigation outside Login.

## Usage

### Implement AuthGateway

The application provides the authentication transport by implementing `AuthGateway`:

```kotlin
import com.opside.leaf.login.gateway.AuthGateway
import com.opside.leaf.login.gateway.AuthResponse

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
}
```

`AuthResponse` has three variants:

| Variant | Meaning |
| --- | --- |
| `Success(userId)` | Authentication succeeded |
| `InvalidCredentials` | Wrong email or password |
| `Unavailable(retryAfterMilliseconds?)` | Service is not available |

### Feature path (stable)

`LoginRoute` connects the Feature to Compose. The host only receives the final result:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.opside.leaf.login.LoginModule
import com.opside.leaf.login.domain.LoginInput
import com.opside.leaf.login.ui.LoginRoute

@Composable
fun MyLoginScreen(onLoggedIn: (String) -> Unit) {
    val module = remember { LoginModule(MyAuthGateway(api)) }
    LoginRoute(
        module = module,
        input = LoginInput(initialEmail = ""),
        onAuthenticated = { result -> onLoggedIn(result.userId) },
    )
}
```

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

Both paths coexist in the same artifact. The host decides which one to present.

## Feature and Workflow

The stable Feature uses `LoginInput`, `LoginState`, `LoginEvent`, and `LoginResult`. `LoginRoute` observes its result and delivers `LoginResult.Authenticated` to the host callback.

The Workflow keeps the password out of `LoginWorkflowState` through `LoginPassword`, emits the authentication effect, and completes with `LoginWorkflowOutput.Authenticated` or `LoginWorkflowOutput.Cancelled`. Recoverable failures return to an editable state; the application remains responsible for the Gateway and subsequent actions.

## Security

Do not log, persist, or send passwords to telemetry. The Feature path retains the password during the session to process the form, so the host must not serialize its state. The Workflow path redacts `LoginPassword` when converted to text, and the UI clears its copy when it completes or leaves composition.
