# Authentication

Authentication 1.0.0 es un módulo Kotlin Multiplatform que ofrece Actions para iniciar sesión, continuar un reto de autenticación, restaurar una sesión y cerrar sesión. La app proporciona la conexión con su backend y el almacenamiento seguro de tokens.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-authentication:1.0.0`. Su código fuente corresponde al tag [`v1.0.0`](https://github.com/OPSIDE-LEAF/leaf_authentication/tree/v1.0.0), revisión [`8d9b09c`](https://github.com/OPSIDE-LEAF/leaf_authentication/commit/8d9b09c).

La compatibilidad declarada es LEAF Contracts 3.1.0. No depende de Core, Compose ni Visuals.

Authentication mantiene una versión independiente del tren base de LEAF. Antes de integrarlo, comprueba sus requisitos de compatibilidad y que el artefacto esté disponible en el repositorio Maven configurado por tu organización.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-authentication:1.0.0")
}
```

Authentication declara `leaf-contracts` como dependencia transitiva. El host necesita `leaf-core` para ejecutar las Actions con `Leaf.run`.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `AuthenticationModule` | Módulo que recibe backend, vault y configuración opcional; expone cuatro Actions y dos providers |
| `AuthenticationBackend` | Port que la app implementa para conectar con su servicio de autenticación |
| `TokenVault` | Port que la app implementa para almacenar sesiones y tokens de forma segura |
| `OAuthPresenter` | Port opcional para presentar el flujo OAuth en un user-agent externo |
| `AccessTokenProvider` | Presta una copia del token de acceso vigente |
| `ValidAccessTokenProvider` | Restaura la sesión si es necesario y luego presta el token de acceso |

## Responsabilidades del host

La aplicación implementa `AuthenticationBackend` para conectar con su servicio de autenticación y `TokenVault` para el almacenamiento seguro de tokens. Opcionalmente implementa `OAuthPresenter` cuando necesita login social. El host decide cuándo ejecutar cada Action, cómo navegar al usuario y qué hacer después de la autenticación.

Los adaptadores HTTP y de almacenamiento son opcionales y están separados del contrato principal. Cada aplicación puede usarlos, reemplazarlos o implementar sus propios puertos según su arquitectura.

## Uso

### Crear el módulo

```kotlin
import com.ops.leaf_authentication.AuthenticationModule

val auth = AuthenticationModule(
    backend = myBackend,
    tokenVault = mySecureVault,
)
```

Los parámetros opcionales (`sessionKey`, `clock`, `oauthPresenter`, `policy`, `refreshCoordinator`) tienen valores por defecto. Solo configúralos si tu app lo requiere.

### Iniciar sesión

```kotlin
import com.ops.leaf_authentication.AuthSecret
import com.ops.leaf_authentication.SignInRequest
import com.ops.leaf_authentication.SignInOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(auth.signIn, SignInRequest.Password(
    identifier = email,
    password = AuthSecret.from(password),
))

when (outcome) {
    is SignInOutcome.Authenticated -> { /* sesión activa: outcome.session */ }
    is SignInOutcome.ChallengeRequired -> { /* MFA: outcome.challenge */ }
    is SignInOutcome.Rejected -> { /* rechazado: outcome.reason */ }
    is SignInOutcome.Unavailable -> { /* servicio no disponible */ }
    SignInOutcome.Cancelled -> { /* flujo OAuth cancelado */ }
    SignInOutcome.Superseded -> { /* otra operación tomó precedencia */ }
}
```

### Restaurar sesión

```kotlin
import com.ops.leaf_authentication.RestoreSessionRequest
import com.ops.leaf_authentication.RestoreSessionOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(auth.restoreSession, RestoreSessionRequest())

when (outcome) {
    is RestoreSessionOutcome.Authenticated -> { /* sesión válida */ }
    is RestoreSessionOutcome.Rejected -> { /* requiere re-autenticación */ }
    is RestoreSessionOutcome.Unavailable -> { /* backend o storage no disponible */ }
    RestoreSessionOutcome.NoSession -> { /* no hay sesión guardada */ }
    RestoreSessionOutcome.Superseded -> { /* otra operación tomó precedencia */ }
}
```

### Cerrar sesión

```kotlin
import com.ops.leaf_authentication.SignOutRequest
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(auth.signOut, SignOutRequest(revokeRemote = true))
```

`SignOutOutcome` reporta el estado de la revocación remota (`remoteRevocation`) y de la limpieza local (`localStatus`).

## Actions disponibles

| Action | Input | Output | Descripción |
| --- | --- | --- | --- |
| `signIn` | `SignInRequest` | `SignInOutcome` | Autentica con password u OAuth |
| `continueChallenge` | `ContinueAuthChallengeRequest` | `SignInOutcome` | Completa un reto MFA pendiente |
| `restoreSession` | `RestoreSessionRequest` | `RestoreSessionOutcome` | Recupera o renueva la sesión guardada |
| `signOut` | `SignOutRequest` | `SignOutOutcome` | Cierra la sesión local y opcionalmente revoca remotamente |

## Seguridad

El módulo usa `AuthSecret` para manejar credenciales. Los secretos se limpian de memoria cuando dejan de usarse. `AuthSession`, `AuthSessionKey` y `SessionTokens` redactan sus valores en `toString()`.

::: warning Credenciales y tokens
No registres, persistas ni expongas tokens de acceso, refresh tokens ni passwords en logs o telemetría. La implementación de `TokenVault` debe usar almacenamiento cifrado por plataforma (Keystore en Android, Keychain en iOS).
:::
