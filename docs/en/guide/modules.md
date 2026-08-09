# Module and ModuleInfo

## The contract

The module contract is deliberately small:

```kotlin
data class ModuleInfo(val id: String, val version: String)

interface Module {
    val info: ModuleInfo
}
```

- `id` and `version` cannot be blank (validated at construction).
- `ModuleInfo` is the **stable identity** of the module: it is the only thing that appears in telemetry and technical errors.

## Anatomy of a module

```kotlin
class LoginModule(
    private val authGateway: AuthGateway,   // 1. Constructor dependency
) : Module {
    override val info = ModuleInfo(          // 2. Stable identity
        id = "com.opside.leaf.login",
        version = "1.0.0",
    )

    val login = feature<LoginInput, LoginState, LoginEvent, LoginResult>( // 3. Typed capability
        moduleInfo = info,
        initialState = { input -> LoginState(email = input.initialEmail) },
    ) { state, event -> /* ... */ }
}
```

1. **Constructor injection** -- Domain dependencies are kept as private properties. There is no global Leaf DI container.
2. **Identity** -- All module capabilities are created with the same `ModuleInfo`.
3. **Capabilities as `val`** -- Typed `Action` or `Feature`, built with the `action` / `feature` DSLs.

## Gateways: dependencies as ports

External dependencies (APIs, identity services, gateways) are modeled as **interfaces (ports)** within the module. The implementation belongs to the host:

```kotlin
// Declared in the module (commonMain)
interface AuthGateway {
    suspend fun authenticate(email: String, password: String): AuthResponse
}

sealed interface AuthResponse {
    data class Success(val userId: String) : AuthResponse
    data object InvalidCredentials : AuthResponse
}
```

```kotlin
// Implemented by the host (or an infrastructure adapter)
class HttpAuthGateway(private val client: HttpClient) : AuthGateway {
    override suspend fun authenticate(email: String, password: String): AuthResponse {
        // actual API call
    }
}

val module = LoginModule(HttpAuthGateway(client))
```

This keeps the module compilable in isolation, testable with fakes, and infrastructure-agnostic -- hexagonal architecture applied at the module level.

## What a module is NOT

- It is not a global DI container.
- It does not require registration, installation, or dynamic routing.
- It does not use payload maps, event serialization, or code generation.
- It does not communicate with other modules directly: the host orchestrates and connects results.

## Conventions

| Aspect | Convention |
|---|---|
| Package (new modules) | `com.opside.leaf.<module>` |
| Contract | Every module implements `Module` |
| Capabilities | Typed `val` properties (`Action` / `Feature`) |
| Dependencies | Injected via constructor |
| Domain errors | In the output type (`sealed interface`) |
| Shared code | Everything in `commonMain`; `androidMain`/`iosMain` only if needed |
