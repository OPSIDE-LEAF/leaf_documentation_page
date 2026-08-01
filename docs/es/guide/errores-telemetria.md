# Errores, telemetría y privacidad

## Errores de dominio vs fallos técnicos

Leaf separa estrictamente dos categorías:

| | Error de dominio | Fallo técnico |
|---|---|---|
| Naturaleza | Resultado de negocio **esperado** | Excepción **inesperada** |
| Dónde vive | En el tipo de salida (`sealed interface`) | `LeafException` / `FeatureTechnicalFailure` |
| Ejemplo | `LoginResult.Rejected`, `AuthResponse.InvalidCredentials` | Gateway lanza por red caída |
| Manejo del host | Decisión de negocio / estado de UI | Estado técnico seguro, sin detalle |

```kotlin
// Error de dominio: variante del resultado
sealed interface LoginResult {
    data class Authenticated(val userId: String) : LoginResult
}

// Recuperable: stay con el error en el estado del formulario
state.copy(formError = "Correo o contraseña inválidos")
```

## LeafException

Los fallos técnicos se normalizan a `LeafException`, un error **redactado**: solo expone `moduleInfo` y la `LeafOperation` — nunca el input, el estado ni el mensaje del throwable original.

- En `Leaf.run`: la Action que lanza produce `LeafException`.
- En sesiones: la transición que lanza termina la sesión con `Failed(TRANSITION_FAILED)`; si `initialState` lanza, `FEATURE_INITIALIZATION` / `INITIALIZATION_FAILED`.
- La **cancelación** no se redacta: `CancellationException` se re-lanza conservando la semántica estructurada de coroutines.

::: info Conserva la causa solo donde la política lo permita
Maneja `LeafException` como fallo técnico redactado. La causa real solo debe tratarse donde una política de seguridad del host lo permita.
:::

## Telemetría

```kotlin
fun interface LeafTelemetry {
    fun record(event: LeafTelemetryEvent)
    companion object { val None: LeafTelemetry }
}
```

`LeafTelemetryEvent` contiene únicamente: `moduleInfo`, `phase` (`STARTED`/`FINISHED`), `duration` y `result` (`RUNNING`/`SUCCEEDED`/`FAILED`/`CANCELLED`).

La telemetría es **best-effort e isolada**:

- Nunca contiene input, state, event, output, throwable ni mensajes.
- Un fallo en el hook de telemetría **no altera** la ejecución ni el resultado.
- Sus callbacks no deben registrar objetos de dominio ni llamar `toString()` sobre ellos.

## Reglas de privacidad

- No incluyas credenciales, tokens, inputs, estados, eventos, outputs ni throwables en telemetría o logs.
- No guardes secretos en `State`, outputs, errores técnicos, `rememberSaveable` ni persistencia. No los publiques por callbacks o navegación.
- Contraseñas, tokens y credenciales deben tener vida efímera, en el borde UI/gateway.
- Trata los mensajes de validación de negocio como datos de UI controlados; no reexpongas detalles de un gateway o proveedor de identidad.

### Defensa adicional: `toString()` redactado

Para tipos que transportan secretos durante una llamada:

```kotlin
@JvmInline
value class AuthenticationSecret private constructor(private val value: String) {
    companion object {
        fun from(value: String): AuthenticationSecret = AuthenticationSecret(value)
    }
    override fun toString(): String = "[REDACTED]"
}
```

::: danger El redactado no autoriza a registrar
Un `toString()` redactado es una defensa adicional, no autorización para registrar el request ni valores de dominio sensibles. El request solo vive durante la llamada.
:::
