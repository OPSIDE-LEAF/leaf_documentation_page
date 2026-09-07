# Authentication

Authentication 0.2.0 provides Actions for signing in, continuing a challenge, restoring a session, and signing out. The app provides its backend connection, token storage, and OAuth presentation when required.

## Main API

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

`SignInOutcome` tells you whether sign-in worked, another challenge is needed, the request was rejected, the service is unavailable, or the flow was cancelled. `TokenVault` is the place the app provides for tokens. `AuthenticationBackend` and `OAuthPresenter` also come from the app when they are needed. The remaining parameters have defaults, including the coordinator that avoids duplicating a session refresh. The module uses `AuthSecret` and clears secrets when it no longer needs them.

HTTP and storage adapters are optional and separate from the main contract. Each application may use them, replace them, or implement its own ports according to its architecture.
