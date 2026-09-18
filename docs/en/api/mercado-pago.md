# Mercado Pago

Mercado Pago 1.0.0 is a Kotlin Multiplatform module that implements a Mercado Pago payment checkout. It exposes Actions for obtaining the configuration, submitting a payment with a tokenized card, and observing its status. The app provides the backend, card capture and tokenization, and the relationship with Authentication.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-mp-payment:1.0.0`. Its source code corresponds to tag [`v1.0.0`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v1.0.0), revision [`7d7efb2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/7d7efb2).

Declared compatibility is LEAF Contracts 3.1.0. It requires `leaf-authentication` for authenticated backend access and `leaf-payment-contracts` for shared payment types.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-mp-payment:1.0.0")
}
```

Mercado Pago declares `leaf-contracts`, `leaf-payment-contracts`, and `leaf-authentication` as transitive dependencies (`api`).

## Public surface

| API | Responsibility |
| --- | --- |
| `MercadoPagoCheckoutModule` | Module with checkout Actions: `prepare`, `submit`, `observeCheckout`, `observeCheckoutOperation` |
| `MercadoPagoCheckoutBackend` | Port the app implements to connect to its payment backend |
| `mercadoPagoCheckoutModule(backend)` | Factory that creates the module with a host-owned backend |
| `providerTestMercadoPagoCheckoutModule(accessTokens)` | Test factory that creates and owns an HTTP client against the sandbox environment |

## Host responsibilities

The application implements `MercadoPagoCheckoutBackend` to communicate with its payment server. Unlike Stripe, the host is responsible for card capture and tokenization with the Mercado Pago SDK. The host provides `ValidAccessTokenProvider` from the Authentication module for authenticated calls and decides what to do with the payment result.

## Usage

### Create the module

```kotlin
import com.ops.leaf_mp_payment.MercadoPagoCheckoutBackend
import com.ops.leaf_mp_payment.mercadoPagoCheckoutModule

val checkout = mercadoPagoCheckoutModule(myMercadoPagoBackend)
```

For testing with Mercado Pago's sandbox:

```kotlin
import com.ops.leaf_mp_payment.providerTestMercadoPagoCheckoutModule

val checkout = providerTestMercadoPagoCheckoutModule(
    accessTokens = auth.validAccessTokens,
)
```

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
    is MercadoPagoConfigurationOutcome.Unavailable -> { /* retry */ }
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
    is MercadoPagoSubmitOutcome.Unavailable -> { /* retry */ }
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
    is MercadoPagoCheckoutObservationOutcome.Unavailable -> { /* retry */ }
}
```

## Security

`MercadoPagoPublicKey` and `MercadoPagoCardToken` redact their values in `toString()`. Submit request data (`orderId`, `cardToken`, `payerEmail`) is also redacted.

::: warning Test environment
Before using the module in production, test the full flow with Mercado Pago's sandbox environment. Include card capture, tokenization, backend, callbacks, authentication, and handling of failed or cancelled results.
:::
