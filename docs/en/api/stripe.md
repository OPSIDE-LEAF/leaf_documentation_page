# Stripe

Stripe 2.0.1 is a Kotlin Multiplatform module that implements a Stripe payment checkout. It exposes Actions for preparing a checkout and observing its status. The app provides the backend and `PaymentSheet` presentation. The module does not depend on any authentication module.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-stripe-payment:2.0.1`. Its source code corresponds to tag [`v2.0.1`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v2.0.1), revision [`10a1af7`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/10a1af7).

Stripe is versioned independently of the LEAF base train. Declared compatibility is LEAF Contracts 3.1.0. It uses `leaf-payment-contracts` 0.1.0 for shared payment types. The leaf-visuals 1.4.0 integration is optional: it comes with `leaf-stripe-payment-checkout-ui` and `leaf-stripe-payment-android-ui`, and the base module does not use it.

::: info Changes in 2.0
- **2.0.0:** the module no longer depends on `leaf-authentication`. The sandbox factories receive the token through `StripeAccessTokenProvider`, a Port owned by the module. If your app used 1.0.0 with Authentication, wrap Authentication's `ValidAccessTokenProvider` as shown in [Implement the token Port](#implement-the-token-port).
- **2.0.1:** on iOS, `StripePaymentView(backendURL:accessTokens:…)` receives the token Port. The Kotlin artifacts are unchanged from 2.0.0.
:::

## Dependency

Stripe is Kotlin Multiplatform: the `leaf-stripe-payment` coordinate works for Android and iOS. The ready-made payment UI is distributed per platform: on Android, the `leaf-stripe-payment-android-ui` Maven artifact; on iOS, the repository's `apple-ui` Swift package.

::: code-group

```kotlin [Android]
dependencies {
    implementation("com.opside-leaf:leaf-stripe-payment:2.0.1")
    // Optional: ready-made payment UI (Stripe's PaymentSheet)
    implementation("com.opside-leaf:leaf-stripe-payment-android-ui:2.0.1")
}
```

```kotlin [Kotlin Multiplatform]
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.opside-leaf:leaf-stripe-payment:2.0.1")
        }
        androidMain.dependencies {
            // Optional: ready-made Android payment UI (Stripe's PaymentSheet)
            implementation("com.opside-leaf:leaf-stripe-payment-android-ui:2.0.1")
        }
    }
}
```

```swift [iOS (Swift Package)]
// The app's Package.swift. In Xcode: File > Add Package Dependencies > Add Local…
dependencies: [
    .package(path: "../leaf_stripe_payment/apple-ui"),
],
targets: [
    .target(
        name: "MyApp",
        dependencies: [.product(name: "LeafStripePaymentUI", package: "apple-ui")]
    ),
]
```

:::

Stripe declares `leaf-contracts` and `leaf-payment-contracts` as transitive dependencies (`api`). Ktor and kotlinx-serialization are internal implementation dependencies; the host does not need to declare them separately. The host needs `leaf-core` to run the Actions with `Leaf.run`.

`PaymentSheet` is Stripe's official payment form: it collects card details, handles 3D Secure authentication, and confirms the payment with the `clientSecret`. It exists on both Android and iOS:

- **Android:** `leaf-stripe-payment-android-ui` is optional and includes `leaf-stripe-payment-checkout-ui` and the Stripe Android SDK.
- **iOS:** the `apple-ui` Swift package presents the Stripe iOS SDK's `PaymentSheet` (`stripe-ios-spm` 26.4.1). It is not distributed through Maven: clone the repository at tag `v2.0.1` and generate its XCFramework with `./gradlew :checkout-ui:stageForSwiftPackage` before adding the package.

## Public surface

| API | Responsibility |
| --- | --- |
| `StripeCheckoutModule` | Module with checkout Actions: `prepare`, `observeCheckout`, `observeCheckoutOperation` |
| `StripeCheckoutBackend` | Port the app implements to connect to its payment backend |
| `stripeCheckoutModule(backend)` | Factory that creates the module with a host-owned backend |
| `providerTestStripeCheckoutModule(accessTokens, baseUrl)` | Test factory that creates and owns an HTTP client against the LEAF sandbox backend |
| `StripeAccessTokenProvider` | Port for the bearer token used by the sandbox factories; the host connects it to its session |
| `StripePaymentLauncher` | Compose launcher for Android (`leaf-stripe-payment-android-ui`) that presents `PaymentSheet` |
| `StripePaymentView` | SwiftUI view from the `apple-ui` package for iOS; its sandbox initializer receives `accessTokens` |

## Host responsibilities

The application implements `StripeCheckoutBackend` to communicate with its payment server. The host handles Stripe `PaymentSheet` presentation and decides what to do with the payment result.

When it uses the sandbox factories, the host implements `StripeAccessTokenProvider` with its own session, for example with Authentication, and calls `close()` when finished to release the HTTP client.

## Usage

### Implement the backend

`StripeCheckoutBackend` connects the module to your payment server. Each function returns the typed result you get from your server:

```kotlin
import com.ops.leaf_stripe_payment.ObserveStripeCheckoutOperationRequest
import com.ops.leaf_stripe_payment.ObserveStripeCheckoutRequest
import com.ops.leaf_stripe_payment.PrepareStripeCheckoutRequest
import com.ops.leaf_stripe_payment.StripeCheckoutBackend
import com.ops.leaf_stripe_payment.StripeCheckoutObservationOutcome
import com.ops.leaf_stripe_payment.StripePrepareOutcome

class MyStripeBackend : StripeCheckoutBackend {
    override suspend fun prepare(request: PrepareStripeCheckoutRequest): StripePrepareOutcome =
        TODO("Create the PaymentIntent; request.paymentOperationId is the idempotency key")

    override suspend fun observe(request: ObserveStripeCheckoutRequest): StripeCheckoutObservationOutcome =
        TODO("Look up the status of request.paymentAttemptId")

    override suspend fun observeOperation(
        request: ObserveStripeCheckoutOperationRequest,
    ): StripeCheckoutObservationOutcome =
        TODO("Look up the status by request.orderId and request.paymentOperationId")
}
```

### Create the module

```kotlin
import com.ops.leaf_stripe_payment.stripeCheckoutModule

val checkout = stripeCheckoutModule(MyStripeBackend())
```

### Implement the token Port

The sandbox factories need it: `providerTestStripeCheckoutModule` and `localFakeStripePaymentModule`. This adapter connects Authentication's `ValidAccessTokenProvider`, which restores or renews the session before lending the token:

```kotlin
import com.ops.leaf_authentication.ValidAccessTokenProvider
import com.ops.leaf_authentication.ValidAccessTokenUseResult
import com.ops.leaf_stripe_payment.StripeAccessTokenProvider
import com.ops.leaf_stripe_payment.StripeAccessTokenResult

class AuthenticationTokens(
    private val tokens: ValidAccessTokenProvider,
) : StripeAccessTokenProvider {
    override suspend fun <T> useAccessToken(
        minimumValidityMilliseconds: Long,
        block: suspend (CharArray) -> T,
    ): StripeAccessTokenResult<T> =
        when (val result = tokens.useValidAccessToken(minimumValidityMilliseconds, block)) {
            is ValidAccessTokenUseResult.Used -> StripeAccessTokenResult.Used(result.value)
            ValidAccessTokenUseResult.NoSession,
            is ValidAccessTokenUseResult.Rejected -> StripeAccessTokenResult.NoSession
            ValidAccessTokenUseResult.Superseded -> StripeAccessTokenResult.Expired
            is ValidAccessTokenUseResult.Unavailable ->
                StripeAccessTokenResult.Unavailable(result.retryAfterMilliseconds)
        }
}
```

For testing with the sandbox:

```kotlin
import com.ops.leaf_authentication.AuthenticationModule
import com.ops.leaf_stripe_payment.StripeCheckoutModule
import com.ops.leaf_stripe_payment.providerTestStripeCheckoutModule

// Call close() on the module when finished to release its HTTP client.
fun sandboxCheckout(auth: AuthenticationModule): StripeCheckoutModule =
    providerTestStripeCheckoutModule(
        accessTokens = AuthenticationTokens(auth.validAccessTokens),
    )
```

`baseUrl` defaults to `http://127.0.0.1:8080`. It must be an HTTPS origin, or HTTP only with the local hosts `127.0.0.1`, `localhost`, or `10.0.2.2`, with no path, query, fragment, or credentials.

On iOS, `StripePaymentView(backendURL:accessTokens:…)` receives a provider that implements the protocol exported by `LeafStripeCheckoutUI`. To Swift, a provider created in another Kotlin framework is a different type. Also, the framework does not export `CharArray`, so in 2.0.1 Swift cannot lend a token: it can only return `NoSession`, `Expired`, or `Unavailable`. The iOS test app uses this provider:

```swift
import LeafStripeCheckoutUI
import LeafStripePaymentUI
import SwiftUI

final class NoSessionAccessTokens: NSObject, StripeAccessTokenProvider {
    func useAccessToken(minimumValidityMilliseconds: Int64, block: any KotlinSuspendFunction1,
                        completionHandler: @escaping ((any StripeAccessTokenResult)?, (any Error)?) -> Void) {
        completionHandler(StripeAccessTokenResultNoSession.shared, nil)
    }
}

struct CheckoutScreen: View {
    var body: some View {
        StripePaymentView(
            backendURL: "http://127.0.0.1:8080",
            accessTokens: NoSessionAccessTokens(),
            amountMinor: 1_250,
            merchantDisplayName: "My store"
        ) { status, paymentAttemptID in
            // status is a StripePaymentStatus
        }
    }
}
```

For authenticated payments on iOS, use `StripePaymentView(module:input:merchantDisplayName:onResult:)` with a module built on your own `StripeCheckoutBackend`, which handles authentication with your server.

### Prepare a checkout

```kotlin
import com.ops.leaf_stripe_payment.PrepareStripeCheckoutRequest
import com.ops.leaf_stripe_payment.StripePrepareOutcome
import com.ops.leaf_payment_contracts.Money
import com.ops.leaf_payment_contracts.OrderId
import com.ops.leaf_payment_contracts.PaymentOperationId
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.prepare, PrepareStripeCheckoutRequest(
    orderId = OrderId.of("order-42"),
    amount = Money.of(minorUnits = 1_250, currency = "MXN"),
    paymentOperationId = PaymentOperationId.of("op-1"),
))

when (outcome) {
    is StripePrepareOutcome.Prepared -> {
        // outcome.session contains publishableKey and clientSecret
        // for presenting PaymentSheet
    }
    is StripePrepareOutcome.Rejected -> { /* outcome.reason */ }
    is StripePrepareOutcome.Unavailable -> {
        // retry
    }
}
```

### Observe status

```kotlin
import com.ops.leaf_stripe_payment.ObserveStripeCheckoutRequest
import com.ops.leaf_stripe_payment.StripeCheckoutObservationOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.observeCheckout, ObserveStripeCheckoutRequest(
    paymentAttemptId = session.paymentAttemptId,
))

when (outcome) {
    is StripeCheckoutObservationOutcome.Available -> {
        // outcome.observation.status is a PaymentStatus
    }
    is StripeCheckoutObservationOutcome.Rejected -> { /* outcome.reason */ }
    is StripeCheckoutObservationOutcome.Unavailable -> {
        // retry
    }
}
```

If the token Port returns `NoSession` or `Expired`, the test factory does not send the request and the Action returns `Rejected` with `AUTHENTICATION_REQUIRED`. If it returns `Unavailable`, the Action returns `Unavailable`. With the test factory, `observeCheckoutOperation` always returns `Rejected` with `NOT_FOUND`; use `observeCheckout` with the `paymentAttemptId`.

## Security

`StripePublishableKey` and `StripeClientSecret` redact their values in `toString()`. The `StripePublishableKey.test()` factory only accepts keys with the `pk_test_` prefix. `StripeAccessTokenProvider` lends the token only for the duration of each call; the module does not keep it.

## Platform transport

The test factory uses Ktor's OkHttp engine on Android and the Darwin engine on iOS. The factory with a host-owned backend creates no HTTP client.

::: warning Test environments only
The 2.0.1 artifacts are meant for testing: `StripePublishableKey.test()` only accepts `pk_test_` keys, and the test factories target the LEAF sandbox backend. Test the full flow with Stripe's sandbox environment: the UI, backend, callbacks, authentication, and handling of failed or cancelled results.
:::
