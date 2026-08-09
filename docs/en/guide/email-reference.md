# Email: example module (Action)

`leaf-email` (`com.opside-leaf:leaf-email:1.0.0`, package `com.opside.leaf.email`, [repo](https://github.com/OPSIDE-LEAF/leaf_email)) is the first example module that uses `Action` instead of `Feature`. Unlike `leaf-login`, it has no UI and no observable state — it is a fire-and-forget operation.

## The Action flow

```text
EmailConfig (SMTP credentials)
        |
EmailModule(config): Module
        |
Leaf.run(module.send, EmailInput) → EmailResult
        |
EmailResult.Sent  o  EmailResult.Rejected(reason)
```

## Models

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

`EmailConfig.toString()` redacts `username` and `password` — they never appear in logs or telemetry.

## The Module

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

Key points:

- The public constructor receives `EmailConfig`, not a gateway. Platform resolution is internal.
- `SendEmailUseCase` validates before touching the transport: recipient, subject (≤ 255), body (≤ 10,000), HTML with tags.
- A violation returns `EmailResult.Rejected(reason)` — never an exception.
- Unexpected transport errors do throw an exception so that Core converts them into a redacted `LeafException`.

## Internal gateways (expect/actual)

Unlike `leaf-login` where the host implements `AuthGateway`, `leaf-email` resolves its gateways internally with `expect/actual`:

```kotlin
// commonMain
interface EmailGateway {
    suspend fun send(message: EmailMessage): EmailResult
}

expect fun createEmailGateway(config: EmailConfig): EmailGateway
```

```kotlin
// androidMain — SMTP via jakarta.mail
actual fun createEmailGateway(config: EmailConfig): EmailGateway =
    AndroidEmailGateway(config)
```

```kotlin
// iosMain — Native SMTP via NSStream (STARTTLS + AUTH LOGIN)
actual fun createEmailGateway(config: EmailConfig): EmailGateway =
    IosSmtpEmailGateway(config)
```

This pattern is appropriate when the transport belongs to the module and does not depend on host infrastructure. The host only provides configuration, not implementation.

## iOS implementation: SmtpClient

The native SMTP client uses Foundation `NSStream` to send emails in the background, following the same flow as jakarta.mail on Android:

```text
EHLO → STARTTLS → TLS upgrade → EHLO → AUTH LOGIN → MAIL FROM → RCPT TO → DATA → QUIT
```

Robustness characteristics:

- 30-second read timeout (prevents indefinite blocking)
- Verification that TLS was applied correctly
- RFC 5322 headers: `Date` and `Message-ID`
- Robust dot-stuffing (normalizes `\n`, `\r`, and `\r\n`)
- Dedicated `SmtpException` (never leaks credentials)

The pure MIME construction logic lives in `MimeFormatter` (commonMain), which allows testing it on both platforms.

## Validation (SendEmailUseCase)

Business rules that run before any transport:

| Field | Rule | Error |
|---|---|---|
| `to` | Non-empty + valid email format | `Rejected` with reason |
| `subject` | Non-empty, ≤ 255 characters | `Rejected` with reason |
| `body` | Non-empty, ≤ 10,000 characters | `Rejected` with reason |
| `isHtml` | If true, body must contain HTML tags | `Rejected` with reason |

## Usage from a host

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

There are no gateways to implement, no UI to mount, and no session to observe. Build the module with the SMTP configuration and execute the Action.

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

The `FakeEmailGateway` is a minimal test double that implements `EmailGateway` with a preconfigurable result and an optional throwable.

## Security note

::: warning SMTP credentials
`EmailConfig` contains SMTP credentials. The module keeps them at the gateway edge and never exposes them in logs, telemetry, states, or exceptions. The host is responsible for not hardcoding these credentials — they should come from `local.properties`, `Info.plist`, environment variables, or a secrets manager.
:::
