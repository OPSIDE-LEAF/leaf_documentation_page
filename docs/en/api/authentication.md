# Authentication

Authentication 1.0.0 is a Kotlin Multiplatform module that provides Actions for signing in, continuing an authentication challenge, restoring a session, and signing out. The app provides its backend connection and secure token storage.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-authentication:1.0.0`. Its source code corresponds to tag [`v1.0.0`](https://github.com/OPSIDE-LEAF/leaf_authentication/tree/v1.0.0), revision [`8d9b09c`](https://github.com/OPSIDE-LEAF/leaf_authentication/commit/8d9b09c).

Declared compatibility is LEAF Contracts 3.1.0. It does not depend on Core, Compose, or Visuals.

Authentication has a version independent of the base LEAF release train. Before integrating it, check its compatibility requirements and confirm that the artifact is available from the Maven repository configured by your organization.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-authentication:1.0.0")
}
```

Authentication declares `leaf-contracts` as a transitive dependency. The host needs `leaf-core` to run the Actions with `Leaf.run`.

## Public surface

| API | Responsibility |
| --- | --- |
| `AuthenticationModule` | Module that receives backend, vault, and optional configuration; exposes four Actions and two providers |
| `AuthenticationBackend` | Port the app implements to connect to its authentication service |
| `TokenVault` | Port the app implements for secure session and token storage |
| `OAuthPresenter` | Optional port for presenting the OAuth flow in an external user-agent |
| `AccessTokenProvider` | Lends a copy of the current access token |
| `ValidAccessTokenProvider` | Restores the session if needed and then lends the access token |

## Host responsibilities

The application implements `AuthenticationBackend` to connect to its authentication service and `TokenVault` for secure token storage. It optionally implements `OAuthPresenter` when social login is needed. The host decides when to run each Action, how to navigate the user, and what to do after authentication.

HTTP and storage adapters are optional and separate from the main contract. Each application may use them, replace them, or implement its own ports according to its architecture.

## Usage

### Create the module

```kotlin
import com.ops.leaf_authentication.AuthenticationModule

val auth = AuthenticationModule(
    backend = myBackend,
    tokenVault = mySecureVault,
)
```

Optional parameters (`sessionKey`, `clock`, `oauthPresenter`, `policy`, `refreshCoordinator`) have defaults. Only configure them if your app requires it.

### Sign in

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
    is SignInOutcome.Authenticated -> { /* active session: outcome.session */ }
    is SignInOutcome.ChallengeRequired -> { /* MFA: outcome.challenge */ }
    is SignInOutcome.Rejected -> { /* rejected: outcome.reason */ }
    is SignInOutcome.Unavailable -> { /* service unavailable */ }
    SignInOutcome.Cancelled -> { /* OAuth flow cancelled */ }
    SignInOutcome.Superseded -> { /* another operation took precedence */ }
}
```

### Restore session

```kotlin
import com.ops.leaf_authentication.RestoreSessionRequest
import com.ops.leaf_authentication.RestoreSessionOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(auth.restoreSession, RestoreSessionRequest())

when (outcome) {
    is RestoreSessionOutcome.Authenticated -> { /* valid session */ }
    is RestoreSessionOutcome.Rejected -> { /* re-authentication required */ }
    is RestoreSessionOutcome.Unavailable -> { /* backend or storage unavailable */ }
    RestoreSessionOutcome.NoSession -> { /* no stored session */ }
    RestoreSessionOutcome.Superseded -> { /* another operation took precedence */ }
}
```

### Sign out

```kotlin
import com.ops.leaf_authentication.SignOutRequest
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(auth.signOut, SignOutRequest(revokeRemote = true))
```

`SignOutOutcome` reports the remote revocation status (`remoteRevocation`) and local cleanup status (`localStatus`).

## Available Actions

| Action | Input | Output | Description |
| --- | --- | --- | --- |
| `signIn` | `SignInRequest` | `SignInOutcome` | Authenticates with password or OAuth |
| `continueChallenge` | `ContinueAuthChallengeRequest` | `SignInOutcome` | Completes a pending MFA challenge |
| `restoreSession` | `RestoreSessionRequest` | `RestoreSessionOutcome` | Recovers or renews the stored session |
| `signOut` | `SignOutRequest` | `SignOutOutcome` | Clears local session and optionally revokes remotely |

## Security

The module uses `AuthSecret` for credential handling. Secrets are cleared from memory when no longer needed. `AuthSession`, `AuthSessionKey`, and `SessionTokens` redact their values in `toString()`.

::: warning Credentials and tokens
Do not log, persist, or expose access tokens, refresh tokens, or passwords in logs or telemetry. The `TokenVault` implementation should use platform-encrypted storage (Keystore on Android, Keychain on iOS).
:::
