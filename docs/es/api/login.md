# Login

Login 4.0.1 es un módulo Kotlin Multiplatform para inicio de sesión y registro de usuarios. Expone dos Workflows (`login` y `register`) con UI Compose, un Workflow alternativo con manejo separado del password, y conserva la autenticación real y la navegación bajo control de la aplicación host. El host puede personalizar el texto y los elementos visibles de cada pantalla mediante `LoginContent` / `RegisterContent`.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-login:4.0.1`. Su código fuente corresponde al tag [`v4.0.1`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v4.0.1), revisión [`6b59110`](https://github.com/OPSIDE-LEAF/leaf-login/commit/6b59110).

La compatibilidad declarada es LEAF Contracts/Core/Compose 3.1.0; la integración con leaf-visuals 1.4.0 es opcional.

::: info Cambios en 4.0
`LoginModule.login` y `LoginModule.register` pasaron de `Feature`, en depreciación en LEAF, a `Workflow`. Es un cambio incompatible: cambia el tipo de ambas propiedades, `LoginEvent`/`RegisterEvent` suman eventos de resultado (rompe un `when` exhaustivo) y los estados suman `isSubmitting` (cambia su firma binaria). `LoginRoute` y `RegisterRoute` conservan su firma. Una excepción inesperada del gateway, incluido su propio timeout desde 4.0.1, ya no termina la sesión; se muestra como servicio no disponible.
:::

Login mantiene una versión independiente del tren base de LEAF. Antes de integrarlo, comprueba sus requisitos de compatibilidad y que el artefacto esté disponible en el repositorio Maven configurado por tu organización.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-login:4.0.1")
}
```

Login declara `leaf-contracts`, `leaf-core`, `leaf-compose` y `leaf-visuals` como dependencias transitivas (`api`); el host no necesita declararlas por separado.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `LoginModule` | Expone los Workflows `login` y `register`, y la factoría del Workflow alternativo. |
| `AuthGateway` | Port que la aplicación implementa para autenticar y registrar usuarios. |
| `LoginRoute` / `LoginScreen` | Conectan el Workflow de login con Compose; la navegación terminal pertenece al host. |
| `RegisterRoute` / `RegisterScreen` | Conectan el Workflow de registro con Compose; la navegación terminal pertenece al host. |
| `LoginContent` / `RegisterContent` | Configuran el texto y la presencia de los elementos de cada pantalla, sin tocar el estilo visual. |
| `createLoginWorkflow` / `LoginWorkflowScreen` | Exponen un Workflow alternativo de login con password redactado, timeout y reintento; no requieren opt-in. |

## Responsabilidades del host

La aplicación implementa `AuthGateway` (tanto `authenticate` como `register`), traduce las respuestas esperadas a los resultados del módulo y decide qué ocurre después de una autenticación o registro exitoso. También controla el transporte, la persistencia, la telemetría, el tema visual opcional, el contenido de las pantallas (texto y elementos visibles) y la navegación entre login y registro.

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

### Ruta de login

`LoginRoute` conecta el Workflow de login con Compose. El host solo recibe el resultado final:

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

### Ruta de registro

`RegisterRoute` conecta el Workflow de registro con Compose:

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

### Ruta de login alternativa

`LoginWorkflowScreen` usa el Workflow alternativo, con manejo separado del password, timeout y reintento:

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

## Personalización de contenido

`LoginRoute` y `RegisterRoute` aceptan un parámetro `content` que controla **qué elementos aparecen y qué dicen**, sin tocar el estilo visual. Cada campo tiene un valor por defecto que reproduce la pantalla estándar, así que solo defines lo que quieres cambiar.

La regla es simple: los elementos opcionales son `String?` y pasar `null` los oculta; los labels de campos y el botón son `String` no nulos que puedes renombrar pero no quitar; la barra de acento decorativa se controla con el `Boolean` `showAccentBar`.

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

Los campos `String?` (`subtitle`, `badge`, `cardTitle`, `cardSubtitle`) se ocultan con `null`; `showAccentBar = false` oculta la barra decorativa superior; el resto son labels que solo se renombran. La fila de navegación cruzada (`registerPrompt` / `registerLink`, `loginPrompt` / `loginLink`) solo aparece cuando entregas el callback correspondiente (`onRegisterRequested` / `onLoginRequested`).

```kotlin
import com.opside.leaf.login.ui.LoginContent
import com.opside.leaf.login.ui.LoginRoute

// Sin el chip "CREDENCIALES", con título y botón propios
LoginRoute(
    module = module,
    content = LoginContent(
        badge = null,
        title = "Bienvenido de vuelta",
        submitLabel = "Entrar",
    ),
    onAuthenticated = { result -> onLoggedIn(result.userId) },
)

// Versión mínima: solo campos y botón
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
`content` solo cambia el texto y la presencia de los elementos. No expone slots de composables ni permite reestilizar: para cambiar colores, formas o tipografía usa el parámetro `visuals` con un `LeafVisuals`.
:::

## Workflows

El Workflow de login usa `LoginInput`, `LoginState`, `LoginEvent`, `LoginEffect` y `LoginResult`. Valida en el reductor síncrono; la llamada a `AuthGateway` corre como un `LoginEffect` que ejecuta Core, y `LoginState.isSubmitting` indica que hay un envío en curso: un segundo `Submit` se ignora y `LoginScreen` deshabilita campos y botón y muestra un indicador. `LoginRoute` observa su resultado y entrega `LoginResult.Authenticated` al callback del host.

El Workflow de registro usa `RegisterInput`, `RegisterState`, `RegisterEvent`, `RegisterEffect` y `RegisterResult`. `RegisterRoute` observa su resultado y entrega `RegisterResult.Registered` al callback del host. Valida nombre, correo, contraseña (mínimo 8 caracteres) y confirmación de contraseña antes de enviar al gateway.

En ambos, una excepción inesperada del gateway se muestra como "El servicio no está disponible" y la sesión sigue abierta para reintentar. Los eventos de resultado (`AuthenticationFinished`, `RegistrationFinished`) y los efectos solo los crea el módulo.

El Workflow alternativo separa el password de `LoginWorkflowState` mediante `LoginPassword`, emite el efecto de autenticación y termina con `LoginWorkflowOutput.Authenticated` o `LoginWorkflowOutput.Cancelled`. Los fallos recuperables vuelven a un estado editable; la aplicación sigue siendo dueña del Gateway y de las acciones posteriores.

## Seguridad

No registres, persistas ni envíes passwords a telemetría. `LoginRoute` y `RegisterRoute` conservan el password en el estado durante la sesión para procesar el formulario, por lo que el host debe evitar serializar su estado; los estados, los eventos de contraseña y los efectos redactan el password en `toString`. La ruta alternativa redacta `LoginPassword` al convertirlo en texto y la UI limpia su copia cuando termina o sale de composición.
