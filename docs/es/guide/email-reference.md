# Email: módulo de ejemplo (Action)

`leaf-email` (`com.opside-leaf:leaf-email:1.0.0`, paquete `com.opside.leaf.email`, [repo](https://github.com/OPSIDE-LEAF/leaf_email)) es el primer módulo de ejemplo que usa `Action` en lugar de `Feature`. A diferencia de `leaf-login`, no tiene UI ni estado observable — es una operación fire-and-forget.

## El recorrido de la Action

```text
EmailConfig (SMTP credentials)
        |
EmailModule(config): Module
        |
Leaf.run(module.send, EmailInput) → EmailResult
        |
EmailResult.Sent  o  EmailResult.Rejected(reason)
```

## Modelos

```kotlin
data class EmailInput(
    val to: String,
    val subject: String,
    val body: String,
    val isHtml: Boolean = false,
)

data class EmailConfig(
    val host: String,
    val port: Int,
    val username: String,
    val password: String,
    val fromEmail: String,
)

sealed interface EmailResult {
    data object Sent : EmailResult
    data class Rejected(val reason: String) : EmailResult
}
```

`EmailConfig.toString()` redacta `username` y `password` — nunca aparecen en logs ni telemetría.

## El Module

```kotlin
class EmailModule internal constructor(
    private val gateway: EmailGateway,
) : Module {

    constructor(config: EmailConfig) : this(createEmailGateway(config))

    override val info = ModuleInfo(
        id = "com.opside.leaf.email",
        version = "1.0.0",
    )

    private val useCase = SendEmailUseCase(gateway)

    val send: Action<EmailInput, EmailResult> = action(info) { input ->
        useCase.execute(input)
    }
}
```

Puntos clave:

- El constructor público recibe `EmailConfig`, no un gateway. La resolución de plataforma es interna.
- `SendEmailUseCase` valida antes de tocar el transporte: destinatario, asunto (≤ 255), cuerpo (≤ 10 000), HTML con tags.
- Una violación retorna `EmailResult.Rejected(reason)` — nunca una excepción.
- Errores de transporte inesperados sí lanzan excepción para que Core los convierta en `LeafException` redactado.

## Gateways internos (expect/actual)

A diferencia de `leaf-login` donde el host implementa `AuthGateway`, `leaf-email` resuelve sus gateways internamente con `expect/actual`:

```kotlin
// commonMain
interface EmailGateway {
    suspend fun send(message: EmailMessage): EmailResult
}

expect fun createEmailGateway(config: EmailConfig): EmailGateway
```

```kotlin
// androidMain — SMTP vía jakarta.mail
actual fun createEmailGateway(config: EmailConfig): EmailGateway =
    AndroidEmailGateway(config)
```

```kotlin
// iosMain — SMTP nativo vía NSStream (STARTTLS + AUTH LOGIN)
actual fun createEmailGateway(config: EmailConfig): EmailGateway =
    IosSmtpEmailGateway(config)
```

Este patrón es adecuado cuando el transporte es propio del módulo y no depende de infraestructura del host. El host solo proporciona configuración, no implementación.

## Implementación iOS: SmtpClient

El cliente SMTP nativo usa Foundation `NSStream` para enviar correos en background, con el mismo flujo que jakarta.mail en Android:

```text
EHLO → STARTTLS → TLS upgrade → EHLO → AUTH LOGIN → MAIL FROM → RCPT TO → DATA → QUIT
```

Características de robustez:

- Read timeout de 30 segundos (evita bloqueos indefinidos)
- Verificación de que TLS se aplicó correctamente
- Headers RFC 5322: `Date` y `Message-ID`
- Dot-stuffing robusto (normaliza `\n`, `\r` y `\r\n`)
- `SmtpException` dedicada (nunca filtra credenciales)

La lógica pura de construcción MIME está en `MimeFormatter` (commonMain), lo que permite testearla en ambas plataformas.

## Validación (SendEmailUseCase)

Reglas de negocio que corren antes de cualquier transporte:

| Campo | Regla | Error |
|---|---|---|
| `to` | No vacío + formato email válido | `Rejected` con razón |
| `subject` | No vacío, ≤ 255 caracteres | `Rejected` con razón |
| `body` | No vacío, ≤ 10 000 caracteres | `Rejected` con razón |
| `isHtml` | Si true, body debe contener tags HTML | `Rejected` con razón |

## Uso desde un host

```kotlin
val email = EmailModule(
    EmailConfig(
        host = "smtp.gmail.com",
        port = 587,
        username = "sender@gmail.com",
        password = "app-password",
        fromEmail = "sender@gmail.com",
    )
)

when (val r = Leaf.run(email.send, EmailInput(to = "dest@example.com", subject = "Hola", body = "Cuerpo"))) {
    EmailResult.Sent        -> onSent()
    is EmailResult.Rejected -> showError(r.reason)
}
```

No hay gateways que implementar, no hay UI que montar, no hay sesión que observar. Construye el módulo con la configuración SMTP y ejecuta la Action.

## Testing

```kotlin
class EmailModuleTest {

    @Test
    fun `run send returns Sent on a successful gateway`() = runTest {
        val module = EmailModule(FakeEmailGateway(result = EmailResult.Sent))
        val result = Leaf.run(
            module.send,
            EmailInput(to = "a@b.com", subject = "Hi", body = "Body"),
        )
        assertEquals(EmailResult.Sent, result)
    }

    @Test
    fun `run send returns Rejected for invalid input`() = runTest {
        val module = EmailModule(FakeEmailGateway())
        val result = Leaf.run(
            module.send,
            EmailInput(to = "invalid", subject = "Hi", body = "Body"),
        )
        assertIs<EmailResult.Rejected>(result)
    }

    @Test
    fun `unexpected gateway failure surfaces as LeafException`() = runTest {
        val module = EmailModule(
            FakeEmailGateway(throwable = RuntimeException("smtp down"))
        )
        assertFailsWith<LeafException> {
            Leaf.run(
                module.send,
                EmailInput(to = "a@b.com", subject = "Hi", body = "Body"),
            )
        }
    }
}
```

El `FakeEmailGateway` es un test double mínimo que implementa `EmailGateway` con un resultado preconfigurable y un throwable opcional.

## Nota de seguridad

::: warning Credenciales SMTP
`EmailConfig` contiene credenciales SMTP. El módulo las mantiene en el borde gateway y nunca las expone en logs, telemetría, estados ni excepciones. El host es responsable de no hardcodear estas credenciales — deben venir de `local.properties`, `Info.plist`, variables de entorno o un gestor de secretos.
:::
