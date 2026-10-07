# Mercado Pago

Mercado Pago 2.0.1 is a Kotlin Multiplatform module that implements a Mercado Pago payment checkout. It exposes Actions for obtaining the configuration, submitting a payment with a tokenized card, and observing its status. The app provides the backend as well as card capture and tokenization. The module does not depend on any authentication module.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-mp-payment:2.0.1`. Its source code corresponds to tag [`v2.0.1`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v2.0.1), revision [`88760f0`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/88760f0).

Mercado Pago is versioned independently of the LEAF base train. Declared compatibility is LEAF Contracts 3.1.0. It uses `leaf-payment-contracts` 0.1.0 for shared payment types. The leaf-visuals 1.4.0 integration is optional: it comes with `leaf-mp-payment-checkout-ui` and `leaf-mp-payment-android-ui`, and the base module does not use it.

::: info Changes in 2.0
- **2.0.0:** the module no longer depends on `leaf-authentication`. The sandbox factories receive the token through `MercadoPagoAccessTokenProvider`, a Port owned by the module. If your app used 1.0.0 with Authentication, wrap Authentication's `ValidAccessTokenProvider` as shown in [Implement the token Port](#implement-the-token-port).
- **2.0.1:** `leaf-mp-payment-checkout-ui` and `leaf-mp-payment-android-ui` are also published to GitHub Packages. On iOS, `MercadoPagoPaymentView(backendURL:accessTokens:…)` receives the token Port.
:::

## Dependency

Mercado Pago is Kotlin Multiplatform: the `leaf-mp-payment` coordinate works for Android and iOS. The ready-made payment sheet is distributed per platform: on Android, the `leaf-mp-payment-android-ui` Maven artifact; on iOS, the repository's `apple-ui` Swift package.

::: code-group

```kotlin [Android]
dependencies {
    implementation("com.opside-leaf:leaf-mp-payment:2.0.1")
    // Optional: ready-made payment sheet
    implementation("com.opside-leaf:leaf-mp-payment-android-ui:2.0.1")
}
```

```kotlin [Kotlin Multiplatform]
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.opside-leaf:leaf-mp-payment:2.0.1")
        }
        androidMain.dependencies {
            // Optional: ready-made Android payment sheet
            implementation("com.opside-leaf:leaf-mp-payment-android-ui:2.0.1")
        }
    }
}
```

```swift [iOS (Swift Package)]
// The app's Package.swift. In Xcode: File > Add Package Dependencies > Add Local…
dependencies: [
    .package(path: "../leaf_mp_payment/apple-ui"),
],
targets: [
    .target(
        name: "MyApp",
        dependencies: [.product(name: "LeafMercadoPagoPaymentUI", package: "apple-ui")]
    ),
]
```

:::

Mercado Pago declares `leaf-contracts` and `leaf-payment-contracts` as transitive dependencies (`api`). Ktor and kotlinx-serialization are internal implementation dependencies; the host does not need to declare them separately. The host needs `leaf-core` to run the Actions with `Leaf.run`.

The payment sheet exists on both Android and iOS:

- **Android:** `leaf-mp-payment-android-ui` is optional, includes `leaf-mp-payment-checkout-ui`, and uses Mercado Pago's Core Methods SDK. If you use it, also declare Mercado Pago's Maven repository, `https://artifacts.mercadolibre.com/repository/android-releases`.
- **iOS:** the `apple-ui` Swift package uses Mercado Pago's Core Methods SDK for iOS (`sdk-ios` 1.0.0). It is not distributed through Maven: clone the repository at tag `v2.0.1` and generate its XCFramework with `./gradlew :checkout-ui:stageForSwiftPackage` before adding the package.

## Public surface

| API | Responsibility |
| --- | --- |
| `MercadoPagoCheckoutModule` | Module with checkout Actions: `prepare`, `submit`, `observeCheckout`, `observeCheckoutOperation` |
| `MercadoPagoCheckoutBackend` | Port the app implements to connect to its payment backend |
| `mercadoPagoCheckoutModule(backend)` | Factory that creates the module with a host-owned backend |
| `providerTestMercadoPagoCheckoutModule(accessTokens, baseUrl)` | Test factory that creates and owns an HTTP client against the LEAF sandbox backend |
| `MercadoPagoAccessTokenProvider` | Port for the bearer token used by the sandbox factories; the host connects it to its session |
| `MercadoPagoPaymentBottomSheet` | Compose payment sheet for Android (`leaf-mp-payment-android-ui`) with sandbox card fields and tokenization through the Core Methods SDK |
| `MercadoPagoPaymentView` | SwiftUI view from the `apple-ui` package for iOS; its sandbox initializer receives `accessTokens` |

## Host responsibilities

The application implements `MercadoPagoCheckoutBackend` to communicate with its payment server. Unlike Stripe, the host is responsible for card capture and tokenization with the Mercado Pago SDK. It also decides what to do with the payment result.

When it uses the sandbox factories, the host implements `MercadoPagoAccessTokenProvider` with its own session, for example with Authentication, and calls `close()` when finished to release the HTTP client.

## Usage

### Implement the backend

`MercadoPagoCheckoutBackend` connects the module to your payment server. Each function returns the typed result you get from your server:

```kotlin
import com.ops.leaf_mp_payment.MercadoPagoCheckoutBackend
import com.ops.leaf_mp_payment.MercadoPagoCheckoutObservationOutcome
import com.ops.leaf_mp_payment.MercadoPagoConfigurationOutcome
import com.ops.leaf_mp_payment.MercadoPagoSubmitOutcome
import com.ops.leaf_mp_payment.ObserveMercadoPagoCheckoutOperationRequest
import com.ops.leaf_mp_payment.ObserveMercadoPagoCheckoutRequest
import com.ops.leaf_mp_payment.SubmitMercadoPagoCheckoutRequest

class MyMercadoPagoBackend : MercadoPagoCheckoutBackend {
    override suspend fun configuration(): MercadoPagoConfigurationOutcome =
        TODO("Ask your server for the public key and country")

    override suspend fun submit(request: SubmitMercadoPagoCheckoutRequest): MercadoPagoSubmitOutcome =
        TODO("Submit the payment; request.paymentOperationId is the idempotency key")

    override suspend fun observe(request: ObserveMercadoPagoCheckoutRequest): MercadoPagoCheckoutObservationOutcome =
        TODO("Look up the status of request.paymentAttemptId")

    override suspend fun observeOperation(
        request: ObserveMercadoPagoCheckoutOperationRequest,
    ): MercadoPagoCheckoutObservationOutcome =
        TODO("Look up the status by request.orderId and request.paymentOperationId")
}
```

### Create the module

```kotlin
import com.ops.leaf_mp_payment.mercadoPagoCheckoutModule

val checkout = mercadoPagoCheckoutModule(MyMercadoPagoBackend())
```

### Implement the token Port

The sandbox factories need it: `providerTestMercadoPagoCheckoutModule` and `localFakeMercadoPagoPaymentModule`. This adapter connects Authentication's `ValidAccessTokenProvider`, which restores or renews the session before lending the token:

```kotlin
import com.ops.leaf_authentication.ValidAccessTokenProvider
import com.ops.leaf_authentication.ValidAccessTokenUseResult
import com.ops.leaf_mp_payment.MercadoPagoAccessTokenProvider
import com.ops.leaf_mp_payment.MercadoPagoAccessTokenResult

class AuthenticationTokens(
    private val tokens: ValidAccessTokenProvider,
) : MercadoPagoAccessTokenProvider {
    override suspend fun <T> useAccessToken(
        minimumValidityMilliseconds: Long,
        block: suspend (CharArray) -> T,
    ): MercadoPagoAccessTokenResult<T> =
        when (val result = tokens.useValidAccessToken(minimumValidityMilliseconds, block)) {
            is ValidAccessTokenUseResult.Used -> MercadoPagoAccessTokenResult.Used(result.value)
            ValidAccessTokenUseResult.NoSession,
            is ValidAccessTokenUseResult.Rejected -> MercadoPagoAccessTokenResult.NoSession
            ValidAccessTokenUseResult.Superseded -> MercadoPagoAccessTokenResult.Expired
            is ValidAccessTokenUseResult.Unavailable ->
                MercadoPagoAccessTokenResult.Unavailable(result.retryAfterMilliseconds)
        }
}
```

For testing with the sandbox:

```kotlin
import com.ops.leaf_authentication.AuthenticationModule
import com.ops.leaf_mp_payment.MercadoPagoCheckoutModule
import com.ops.leaf_mp_payment.providerTestMercadoPagoCheckoutModule

// Call close() on the module when finished to release its HTTP client.
fun sandboxCheckout(auth: AuthenticationModule): MercadoPagoCheckoutModule =
    providerTestMercadoPagoCheckoutModule(
        accessTokens = AuthenticationTokens(auth.validAccessTokens),
    )
```

`baseUrl` defaults to `http://127.0.0.1:8080`. It must be an HTTPS origin, or HTTP only with the local hosts `127.0.0.1`, `localhost`, or `10.0.2.2`, with no path, query, fragment, or credentials.

On iOS, `MercadoPagoPaymentView(backendURL:accessTokens:…)` receives a provider that implements the protocol exported by `LeafMpPaymentUI`. To Swift, a provider created in another Kotlin framework is a different type. Also, the framework does not export `CharArray`, so in 2.0.1 Swift cannot lend a token: it can only return `NoSession`, `Expired`, or `Unavailable`. The iOS test app uses this provider:

```swift
import LeafMercadoPagoPaymentUI
import LeafMpPaymentUI
import SwiftUI

final class NoSessionAccessTokens: NSObject, MercadoPagoAccessTokenProvider {
    func useAccessToken(minimumValidityMilliseconds: Int64, block: any KotlinSuspendFunction1,
                        completionHandler: @escaping ((any MercadoPagoAccessTokenResult)?, (any Error)?) -> Void) {
        completionHandler(MercadoPagoAccessTokenResultNoSession.shared, nil)
    }
}

struct CheckoutScreen: View {
    var body: some View {
        MercadoPagoPaymentView(
            backendURL: "http://127.0.0.1:8080",
            accessTokens: NoSessionAccessTokens(),
            amountMinor: 1_250
        ) { status, orderID in
            // status is a MercadoPagoPaymentStatus
        }
    }
}
```

For authenticated payments on iOS, use `MercadoPagoPaymentView(module:input:onResult:)` with a module built on your own `MercadoPagoCheckoutBackend`, which handles authentication with your server.

### Get the configuration

```kotlin
import com.ops.leaf_mp_payment.PrepareMercadoPagoCheckoutRequest
import com.ops.leaf_mp_payment.MercadoPagoConfigurationOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.prepare, PrepareMercadoPagoCheckoutRequest)

when (outcome) {
    is MercadoPagoConfigurationOutcome.Available -> {
        // outcome.configuration.publicKey for tokenization
        // outcome.configuration.countryCode (ISO alpha-3)
    }
    is MercadoPagoConfigurationOutcome.Rejected -> { /* outcome.reason */ }
    is MercadoPagoConfigurationOutcome.Unavailable -> {
        // retry
    }
}
```

### Submit the payment

```kotlin
import com.ops.leaf_mp_payment.SubmitMercadoPagoCheckoutRequest
import com.ops.leaf_mp_payment.MercadoPagoSubmitOutcome
import com.ops.leaf_mp_payment.MercadoPagoCardToken
import com.ops.leaf_mp_payment.MercadoPagoCardPaymentType
import com.ops.leaf_payment_contracts.Money
import com.ops.leaf_payment_contracts.OrderId
import com.ops.leaf_payment_contracts.PaymentOperationId
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.submit, SubmitMercadoPagoCheckoutRequest(
    orderId = OrderId.of("order-42"),
    amount = Money.of(minorUnits = 1_250, currency = "MXN"),
    paymentOperationId = PaymentOperationId.of("op-1"),
    cardToken = MercadoPagoCardToken.of(tokenFromSdk),
    paymentMethodId = "visa",
    paymentType = MercadoPagoCardPaymentType.CREDIT_CARD,
    installments = 1,
    payerEmail = "buyer@example.com",
))

when (outcome) {
    is MercadoPagoSubmitOutcome.Accepted -> {
        // outcome.order.status is a PaymentStatus
    }
    is MercadoPagoSubmitOutcome.Rejected -> { /* outcome.reason */ }
    is MercadoPagoSubmitOutcome.Unavailable -> {
        // retry
    }
}
```

### Observe status

```kotlin
import com.ops.leaf_mp_payment.ObserveMercadoPagoCheckoutRequest
import com.ops.leaf_mp_payment.MercadoPagoCheckoutObservationOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.observeCheckout, ObserveMercadoPagoCheckoutRequest(
    paymentAttemptId = order.paymentAttemptId,
))

when (outcome) {
    is MercadoPagoCheckoutObservationOutcome.Available -> {
        // outcome.order.status is a PaymentStatus
    }
    is MercadoPagoCheckoutObservationOutcome.Rejected -> { /* outcome.reason */ }
    is MercadoPagoCheckoutObservationOutcome.Unavailable -> {
        // retry
    }
}
```

If the token Port returns `NoSession` or `Expired`, the test factory does not send the request and the Action returns `Rejected` with `AUTHENTICATION_REQUIRED`. If it returns `Unavailable`, the Action returns `Unavailable`. With the test factory, `observeCheckoutOperation` always returns `Rejected` with `NOT_FOUND`; use `observeCheckout` with the `paymentAttemptId`.

## Security

`MercadoPagoPublicKey` and `MercadoPagoCardToken` redact their values in `toString()`. The submit request's `toString()` omits `orderId` and redacts `paymentOperationId`, `cardToken`, and `payerEmail`. `MercadoPagoAccessTokenProvider` lends the token only for the duration of each call; the module does not keep it.

## Platform transport

The test factory uses Ktor's OkHttp engine on Android and the Darwin engine on iOS. The factory with a host-owned backend creates no HTTP client.

::: warning Test environments only
The 2.0.1 artifacts are meant for sandbox use: the public key is created with `MercadoPagoPublicKey.test()`, the Android sheet uses sandbox card fields, and the test factories target the LEAF sandbox backend. Test the full flow with Mercado Pago's sandbox environment: card capture, tokenization, backend, callbacks, authentication, and handling of failed or cancelled results.
:::
