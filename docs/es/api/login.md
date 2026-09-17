# Login

Login 3.1.0 es un módulo Kotlin Multiplatform de referencia para iniciar sesión. Ofrece un Workflow con UI Compose sobre la capability oficial de LEAF 3 y conserva una ruta Feature compatible; la autenticación real y la navegación permanecen bajo control de la aplicación host.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-login:3.1.0`. Su código fuente corresponde al tag [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v3.1.0), revisión [`edd0bf0`](https://github.com/OPSIDE-LEAF/leaf-login/commit/edd0bf0).

La compatibilidad declarada es LEAF Contracts/Core/Compose 3.1.0; la integración con leaf-visuals 1.4.0 es opcional.

Login mantiene una versión independiente del tren base de LEAF. Antes de integrarlo, comprueba sus requisitos de compatibilidad y que el artefacto esté disponible en el repositorio Maven configurado por tu organización.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-login:3.1.0")
}
```

Login declara `leaf-contracts`, `leaf-core` y `leaf-compose` como dependencias transitivas. `leaf-visuals` es una dependencia de implementación interna; el host no necesita declararla por separado.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `LoginModule` y `login` | Exponen la Feature estable de formulario, validación y autenticación. |
| `AuthGateway` | Define el Port que la aplicación implementa para autenticar correo y contraseña. |
| `LoginRoute` y `LoginScreen` | Conectan la Feature con Compose; la navegación terminal pertenece al host. |
| `createLoginWorkflow` y `LoginWorkflowScreen` | Exponen el Workflow de referencia; la API Kotlin publicada aún requiere opt-in explícito. |

## Responsabilidades del host

La aplicación implementa `AuthGateway`, traduce las respuestas esperadas a los resultados del módulo y decide qué ocurre después de una autenticación correcta. También controla el transporte, la persistencia, la telemetría, el tema visual opcional y la navegación fuera de Login.

## Uso

### Implementar AuthGateway

La aplicación proporciona el transporte de autenticación implementando `AuthGateway`:

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

`AuthResponse` tiene tres variantes:

| Variante | Significado |
| --- | --- |
| `Success(userId)` | Autenticación exitosa |
| `InvalidCredentials` | Correo o contraseña incorrectos |
| `Unavailable(retryAfterMilliseconds?)` | El servicio no está disponible |

### Ruta Feature (estable)

`LoginRoute` conecta la Feature con Compose. El host solo recibe el resultado final:

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

Ambas rutas coexisten en el mismo artefacto. El host decide cuál presentar.

## Feature y Workflow

La Feature estable usa `LoginInput`, `LoginState`, `LoginEvent` y `LoginResult`. `LoginRoute` observa su resultado y entrega `LoginResult.Authenticated` al callback del host.

El Workflow separa el password de `LoginWorkflowState` mediante `LoginPassword`, emite el efecto de autenticación y termina con `LoginWorkflowOutput.Authenticated` o `LoginWorkflowOutput.Cancelled`. Los fallos recuperables vuelven a un estado editable; la aplicación sigue siendo dueña del Gateway y de las acciones posteriores.

## Seguridad

No registres, persistas ni envíes passwords a telemetría. La ruta Feature conserva el password durante la sesión para procesar el formulario, por lo que el host debe evitar serializar su estado. La ruta Workflow redacta `LoginPassword` al convertirlo en texto y la UI limpia su copia cuando termina o sale de composición.
