# Email

Email 1.1.1 is a Kotlin Multiplatform module that sends emails via SMTP on Android and iOS. It exposes a single Action with no UI; the host only provides the SMTP configuration.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-email:1.1.1`. Its source code corresponds to tag [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_email/tree/v1.1.1), revision [`232e521`](https://github.com/OPSIDE-LEAF/leaf_email/commit/232e521).

Declared compatibility is LEAF Contracts/Core 3.1.0.

## Public surface

| API | Responsibility |
| --- | --- |
| `EmailModule` | Module that receives `EmailConfig` and exposes the `send` Action |
| `EmailConfig` | SMTP configuration: host, port, credentials, and sender |
| `EmailInput` | Recipient, subject, body, and HTML flag |
| `EmailResult` | Result: `Sent` or `Rejected(reason)` |

## Usage

```kotlin
val email = EmailModule(
    config = EmailConfig(
        host = "smtp.example.com",
        port = 587,
        username = "user",
        password = "secret",
        fromEmail = "noreply@example.com",
    )
)

val result = Leaf.run(email.send, EmailInput(
    to = "dest@example.com",
    subject = "Confirmation",
    body = "Your order has been confirmed.",
))

when (result) {
    is EmailResult.Sent -> { /* success */ }
    is EmailResult.Rejected -> { /* reason is safe for UI */ }
}
```

## Validation

The module validates input before sending. If validation fails, it returns `EmailResult.Rejected` with a readable reason:

| Field | Rule |
| --- | --- |
| `to` | Not empty, valid email format |
| `subject` | Not empty, max 255 characters |
| `body` | Not empty, max 10,000 characters |
| `body` (HTML) | If `isHtml = true`, must contain at least one HTML tag |

Technical SMTP transport failures are reported as `LeafException` from Core, not as `EmailResult`.

## Security

::: warning SMTP credentials
`EmailConfig` redacts `username` and `password` in `toString()`. Do not log, persist, or expose SMTP configuration in logs or telemetry.
:::

## Platform transport

The module resolves SMTP transport at compile time via `expect`/`actual`:

| Platform | Implementation |
| --- | --- |
| Android | Jakarta Mail (SMTP over TLS) |
| iOS | NSStream (direct SMTP connection) |

The host does not need to interact with the transport; `EmailModule` manages it internally from `EmailConfig`.
