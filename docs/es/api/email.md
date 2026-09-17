# Email

Email 1.1.1 es un módulo Kotlin Multiplatform que envía correos electrónicos por SMTP en Android e iOS. Expone una única Action sin UI; el host solo proporciona la configuración SMTP.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-email:1.1.1`. Su código fuente corresponde al tag [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_email/tree/v1.1.1), revisión [`232e521`](https://github.com/OPSIDE-LEAF/leaf_email/commit/232e521).

La compatibilidad declarada es LEAF Contracts/Core 3.1.0.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `EmailModule` | Módulo que recibe `EmailConfig` y expone la Action `send` |
| `EmailConfig` | Configuración SMTP: host, puerto, credenciales y remitente |
| `EmailInput` | Destinatario, asunto, cuerpo y flag HTML |
| `EmailResult` | Resultado: `Sent` o `Rejected(reason)` |

## Uso

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
    subject = "Confirmación",
    body = "Tu pedido fue confirmado.",
))

when (result) {
    is EmailResult.Sent -> { /* éxito */ }
    is EmailResult.Rejected -> { /* reason es seguro para UI */ }
}
```

## Validación

El módulo valida la entrada antes de enviar. Si la validación falla, devuelve `EmailResult.Rejected` con una razón legible:

| Campo | Regla |
| --- | --- |
| `to` | No vacío, formato de email válido |
| `subject` | No vacío, máximo 255 caracteres |
| `body` | No vacío, máximo 10,000 caracteres |
| `body` (HTML) | Si `isHtml = true`, debe contener al menos una etiqueta HTML |

Los fallos técnicos de transporte SMTP se reportan como `LeafException` desde Core, no como `EmailResult`.

## Seguridad

::: warning Credenciales SMTP
`EmailConfig` redacta `username` y `password` en `toString()`. No registres, persistas ni expongas la configuración SMTP en logs o telemetría.
:::

## Transporte por plataforma

El módulo resuelve el transporte SMTP en tiempo de compilación mediante `expect`/`actual`:

| Plataforma | Implementación |
| --- | --- |
| Android | Jakarta Mail (SMTP sobre TLS) |
| iOS | NSStream (conexión SMTP directa) |

El host no necesita interactuar con el transporte; `EmailModule` lo gestiona internamente a partir de `EmailConfig`.
