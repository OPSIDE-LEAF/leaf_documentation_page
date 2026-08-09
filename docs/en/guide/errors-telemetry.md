# Errors, telemetry, and privacy

## Domain errors vs technical failures

Leaf strictly separates two categories:

| | Domain error | Technical failure |
|---|---|---|
| Nature | **Expected** business result | **Unexpected** exception |
| Where it lives | In the output type (`sealed interface`) | `LeafException` / `FeatureTechnicalFailure` |
| Example | `LoginResult.Rejected`, `AuthResponse.InvalidCredentials` | Gateway throws due to network down |
| Host handling | Business decision / UI state | Safe technical state, no detail |

```kotlin
// Domain error: variant of the result
sealed interface LoginResult {
    data class Authenticated(val userId: String) : LoginResult
}

// Recoverable: stay with the error in the form state
state.copy(formError = "Invalid email or password")
```

## LeafException

Technical failures are normalized to `LeafException`, a **redacted** error: it only exposes `moduleInfo` and the `LeafOperation` -- never the input, state, or message of the original throwable.

- In `Leaf.run`: the Action that throws produces `LeafException`.
- In sessions: the transition that throws terminates the session with `Failed(TRANSITION_FAILED)`; if `initialState` throws, `FEATURE_INITIALIZATION` / `INITIALIZATION_FAILED`.
- **Cancellation** is not redacted: `CancellationException` is re-thrown preserving structured coroutine semantics.

::: info Keep the cause only where policy permits
Handle `LeafException` as a redacted technical failure. The real cause should only be handled where a host security policy permits it.
:::

## Telemetry

```kotlin
fun interface LeafTelemetry {
    fun record(event: LeafTelemetryEvent)
    companion object { val None: LeafTelemetry }
}
```

`LeafTelemetryEvent` contains only: `moduleInfo`, `phase` (`STARTED`/`FINISHED`), `duration`, and `result` (`RUNNING`/`SUCCEEDED`/`FAILED`/`CANCELLED`).

Telemetry is **best-effort and isolated**:

- It never contains input, state, event, output, throwable, or messages.
- A failure in the telemetry hook **does not alter** execution or the result.
- Its callbacks must not log domain objects or call `toString()` on them.

## Privacy rules

- Do not include credentials, tokens, inputs, states, events, outputs, or throwables in telemetry or logs.
- Do not store secrets in `State`, outputs, technical errors, `rememberSaveable`, or persistence. Do not publish them through callbacks or navigation.
- Passwords, tokens, and credentials must be short-lived, at the UI/gateway boundary.
- Treat business validation messages as controlled UI data; do not re-expose details from a gateway or identity provider.

### Additional defense: redacted `toString()`

For types that carry secrets during a call:

```kotlin
@JvmInline
value class AuthenticationSecret private constructor(private val value: String) {
    companion object {
        fun from(value: String): AuthenticationSecret = AuthenticationSecret(value)
    }
    override fun toString(): String = "[REDACTED]"
}
```

::: danger Redacting does not authorize logging
A redacted `toString()` is an additional defense, not authorization to log the request or sensitive domain values. The request only lives during the call.
:::
