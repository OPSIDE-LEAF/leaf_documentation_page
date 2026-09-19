# Login

Login 3.1.1 es un módulo Kotlin Multiplatform para inicio de sesión y registro de usuarios. Expone dos Features (`login` y `register`) con UI Compose, un Workflow con manejo separado del password, y conserva la autenticación real y la navegación bajo control de la aplicación host.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-login:3.1.1`. Su código fuente corresponde al tag [`v3.1.1`](https://github.com/OPSIDE-LEAF/leaf_login/tree/v3.1.1), revisión [`a562cec`](https://github.com/OPSIDE-LEAF/leaf_login/commit/a562cec).

La compatibilidad declarada es LEAF Contracts/Core/Compose 3.1.0; la integración con leaf-visuals 1.4.0 es opcional.

Login mantiene una versión independiente del tren base de LEAF. Antes de integrarlo, comprueba sus requisitos de compatibilidad y que el artefacto esté disponible en el repositorio Maven configurado por tu organización.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-login:3.1.1")
}
```

Login declara `leaf-contracts`, `leaf-core` y `leaf-compose` como dependencias transitivas. `leaf-visuals` es una dependencia de implementación interna; el host no necesita declararla por separado.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `LoginModule` | Expone las Features `login` y `register`, y la factoría del Workflow. |
| `AuthGateway` | Port que la aplicación implementa para autenticar y registrar usuarios. |
| `LoginRoute` / `LoginScreen` | Conectan la Feature de login con Compose; la navegación terminal pertenece al host. |
| `RegisterRoute` / `RegisterScreen` | Conectan la Feature de registro con Compose; la navegación terminal pertenece al host. |
| `createLoginWorkflow` / `LoginWorkflowScreen` | Exponen el Workflow de referencia para login; la API Kotlin publicada aún requiere opt-in explícito. |

## Responsabilidades del host

La aplicación implementa `AuthGateway` (tanto `authenticate` como `register`), traduce las respuestas esperadas a los resultados del módulo y decide qué ocurre después de una autenticación o registro exitoso. También controla el transporte, la persistencia, la telemetría, el tema visual opcional y la navegación entre login y registro.

## Uso

### Implementar AuthGateway

La aplicación proporciona el transporte de autenticación y registro implementando `AuthGateway`:

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

`AuthResponse` tiene tres variantes:

| Variante | Significado |
| --- | --- |
| `Success(userId)` | Autenticación exitosa |
| `InvalidCredentials` | Correo o contraseña incorrectos |
| `Unavailable(retryAfterMilliseconds?)` | El servicio no está disponible |

`RegisterResponse` tiene tres variantes:

| Variante | Significado |
| --- | --- |
| `Success(userId)` | Registro exitoso |
| `EmailAlreadyExists` | Ya existe una cuenta con ese correo |
| `Unavailable(retryAfterMilliseconds?)` | El servicio no está disponible |

### Ruta Feature — Login (estable)

`LoginRoute` conecta la Feature de login con Compose. El host solo recibe el resultado final:

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

El parámetro `onRegisterRequested` es opcional. Cuando es `null`, el enlace "Crear cuenta" se oculta.

### Ruta Feature — Registro (estable)

`RegisterRoute` conecta la Feature de registro con Compose:

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

El parámetro `onLoginRequested` es opcional. Cuando es `null`, el enlace "Ya tengo cuenta" se oculta.

### Ruta Workflow

`LoginWorkflowScreen` usa el Workflow con manejo separado del password y efecto de autenticación:

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

Las tres rutas coexisten en el mismo artefacto. El host decide cuál presentar y controla la navegación entre login y registro.

## Feature y Workflow

La Feature de login usa `LoginInput`, `LoginState`, `LoginEvent` y `LoginResult`. `LoginRoute` observa su resultado y entrega `LoginResult.Authenticated` al callback del host.

La Feature de registro usa `RegisterInput`, `RegisterState`, `RegisterEvent` y `RegisterResult`. `RegisterRoute` observa su resultado y entrega `RegisterResult.Registered` al callback del host. Valida nombre, correo, contraseña (mínimo 8 caracteres) y confirmación de contraseña antes de enviar al gateway.

El Workflow separa el password de `LoginWorkflowState` mediante `LoginPassword`, emite el efecto de autenticación y termina con `LoginWorkflowOutput.Authenticated` o `LoginWorkflowOutput.Cancelled`. Los fallos recuperables vuelven a un estado editable; la aplicación sigue siendo dueña del Gateway y de las acciones posteriores.

## Seguridad

No registres, persistas ni envíes passwords a telemetría. La ruta Feature conserva el password durante la sesión para procesar el formulario, por lo que el host debe evitar serializar su estado. La ruta Workflow redacta `LoginPassword` al convertirlo en texto y la UI limpia su copia cuando termina o sale de composición.
