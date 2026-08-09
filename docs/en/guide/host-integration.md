# Host: integrating published modules

This page covers the full flow for a host integrating a module from the [catalog](/en/guide/catalog): install, implement the ports, execute, and navigate.

## 1. Install the dependency

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.opside-leaf:leaf-login:1.0.0")
            implementation("com.opside-leaf:leaf-core:%LEAF_VERSION%")
            implementation("com.opside-leaf:leaf-compose:%LEAF_VERSION%") // if your host is Compose
        }
    }
}
```

See [Installation](/en/guide/installation) for repositories and credentials.

## 2. Implement the module's gateways

Each module declares its external dependencies as **ports** (interfaces). As a host, you provide the real implementation:

```kotlin
// The module declares the port:
interface AuthGateway {
    suspend fun authenticate(email: String, password: String): AuthResponse
}

// Your host provides the infrastructure adapter:
class HttpAuthGateway(private val client: HttpClient) : AuthGateway {
    override suspend fun authenticate(email: String, password: String): AuthResponse =
        // actual call to your backend / identity provider
}
```

In development or testing you can use a fake:

```kotlin
class FakeAuthGateway : AuthGateway {
    override suspend fun authenticate(email: String, password: String) =
        AuthResponse.Success(userId = "fake-id")
}
```

## 3. Build the module and run it

The host builds the module **explicitly** — no registry, no global DI:

```kotlin
val loginModule = LoginModule(HttpAuthGateway(client))

// Compose host: the module brings its own Route
LoginRoute(
    module = loginModule,
    onAuthenticated = { result -> navigateToHome(result.userId) },
)
```

The module's Route delivers the terminal result to your callback. **Navigation is yours**: the module never navigates by itself.

For modules with an `Action` (e.g. payments):

```kotlin
val payments = MercadoPagoPaymentModule(/* gateways */)

when (val outcome = Leaf.run(payments.pay, request)) {
    is MercadoPagoPaymentOutcome.Approved -> showReceipt(outcome)
    // ... remaining domain variants
}
```

### Modules with internal gateways

Some modules resolve their gateways internally using `expect/actual` because the transport belongs to the module, not the host. In these cases the host only provides configuration:

```kotlin
val email = EmailModule(
    EmailConfig(host = "smtp.gmail.com", port = 587, ...)
)

when (val r = Leaf.run(email.send, EmailInput(to, subject, body))) {
    EmailResult.Sent        -> onSent()
    is EmailResult.Rejected -> showError(r.reason)
}
```

There is no gateway to implement — the module brings its own platform implementation. The module constructor receives configuration data, not interfaces.

## 4. Distinguish domain from technical failure

- **Domain results** (output variants) → business decisions and UI states.
- **`LeafException` / `Failed`** → safe technical state, without exposing details. See [Errors and telemetry](/en/guide/errors-telemetry).

## Integration checklist

- [ ] The host builds the module explicitly and retains navigation.
- [ ] The module's gateways have a host implementation (real or fake depending on environment).
- [ ] There is a single Core session per Feature; no duplicate reducer or queue in the host.
- [ ] The host distinguishes business results from technical failures.
- [ ] No secrets in logs, telemetry, or host persistence.
- [ ] Dependencies are exclusively the stable `%LEAF_VERSION%` train when that is the publication target.

## Host rules

- Do not implement reducers, queues, or parallel sessions — Core owns the session.
- Do not store sessions in ViewModels or open them in `LaunchedEffect`.
- Do not use exceptions to read business results.
- Observe `state`/`result`, send events, decide with the output.
