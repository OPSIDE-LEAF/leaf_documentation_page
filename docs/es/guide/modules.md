# Module y ModuleInfo

## El contrato

El contrato de módulo es deliberadamente pequeño:

```kotlin
data class ModuleInfo(val id: String, val version: String)

interface Module {
    val info: ModuleInfo
}
```

- `id` y `version` no pueden estar en blanco (se valida en construcción).
- `ModuleInfo` es la **identidad estable** del módulo: es lo único que aparece en telemetría y errores técnicos.

## Anatomía de un módulo

```kotlin
class LoginModule(
    private val authGateway: AuthGateway,   // 1. Dependencia por constructor
) : Module {
    override val info = ModuleInfo(          // 2. Identidad estable
        id = "com.opside.leaf.login",
        version = "1.0.0",
    )

    val login = feature<LoginInput, LoginState, LoginEvent, LoginResult>( // 3. Capacidad tipada
        moduleInfo = info,
        initialState = { input -> LoginState(email = input.initialEmail) },
    ) { state, event -> /* ... */ }
}
```

1. **Constructor injection** — Las dependencias del dominio se conservan como propiedades privadas. No hay contenedor DI global de Leaf.
2. **Identidad** — Todas las capacidades del módulo se crean con la misma `ModuleInfo`.
3. **Capacidades como `val`** — `Action` o `Feature` tipadas, construidas con las DSLs `action` / `feature`.

## Gateways: dependencias como puertos

Las dependencias externas (APIs, servicios de identidad, pasarelas) se modelan como **interfaces (puertos)** dentro del módulo. La implementación pertenece al host:

```kotlin
// Declarado en el módulo (commonMain)
interface AuthGateway {
    suspend fun authenticate(email: String, password: String): AuthResponse
}

sealed interface AuthResponse {
    data class Success(val userId: String) : AuthResponse
    data object InvalidCredentials : AuthResponse
}
```

```kotlin
// Implementado por el host (o un adaptador de infraestructura)
class HttpAuthGateway(private val client: HttpClient) : AuthGateway {
    override suspend fun authenticate(email: String, password: String): AuthResponse {
        // llamada real a la API
    }
}

val module = LoginModule(HttpAuthGateway(client))
```

Esto mantiene el módulo compilable de forma aislada, testeable con fakes y agnóstico de infraestructura — arquitectura hexagonal aplicada al nivel de módulo.

## Qué NO es un módulo

- ❌ No es un contenedor DI global.
- ❌ No necesita registro, instalación ni rutas dinámicas.
- ❌ No usa mapas de payload, serialización de eventos ni generación de código.
- ❌ No se comunica con otros módulos directamente: el host orquesta y conecta resultados.

## Convenciones

| Aspecto | Convención |
|---|---|
| Paquete (módulos nuevos) | `com.opside.leaf.<modulo>` |
| Contrato | Todo módulo implementa `Module` |
| Capacidades | Propiedades `val` tipadas (`Action` / `Feature`) |
| Dependencias | Inyectadas por constructor |
| Errores de dominio | En el tipo de salida (`sealed interface`) |
| Código compartido | Todo en `commonMain`; `androidMain`/`iosMain` solo si es necesario |
