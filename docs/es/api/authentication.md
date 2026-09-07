# Authentication

Authentication 0.2.0 ofrece Actions para iniciar sesión, continuar un reto, recuperar una sesión y cerrar sesión. La app proporciona la conexión con su backend, el almacenamiento de tokens y, cuando aplica, la presentación de OAuth.

## API principal

<!-- kotlin-snippet: reference: authentication-surface -->
```kotlin
class AuthenticationModule(
    backend: AuthenticationBackend,
    tokenVault: TokenVault,
    sessionKey: AuthSessionKey = AuthSessionKey.Default,
    clock: SessionClock = SystemSessionClock,
    oauthPresenter: OAuthPresenter? = null,
    policy: AuthenticationPolicy = AuthenticationPolicy(),
    refreshCoordinator: SessionRefreshCoordinator = SessionRefreshCoordinator(),
)

val signIn: Action<SignInRequest, SignInOutcome>
val continueChallenge: Action<ContinueAuthChallengeRequest, SignInOutcome>
val restoreSession: Action<RestoreSessionRequest, RestoreSessionOutcome>
val signOut: Action<SignOutRequest, SignOutOutcome>
val accessTokens: AccessTokenProvider
val validAccessTokens: ValidAccessTokenProvider
```

`SignInOutcome` indica si se inició sesión, si falta un reto, si se rechazó la petición, si el servicio no está disponible o si el flujo se canceló. `TokenVault` es el lugar que la app proporciona para guardar tokens. `AuthenticationBackend` y `OAuthPresenter` también los aporta la app cuando hacen falta. Los demás parámetros tienen valores por defecto, incluido el coordinador que evita duplicar una renovación de sesión. El módulo usa `AuthSecret` y limpia los secretos cuando deja de necesitarlos.

Los adaptadores HTTP y de almacenamiento son opcionales y están separados del contrato principal. Cada aplicación puede usarlos, reemplazarlos o implementar sus propios puertos según su arquitectura.
