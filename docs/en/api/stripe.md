# Stripe

Stripe 1.0.0 is a Kotlin Multiplatform module that implements a Stripe payment checkout. It exposes Actions for preparing a checkout, submitting the payment, and observing its status. The app provides the backend, `PaymentSheet` presentation, and the relationship with Authentication.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-stripe-payment:1.0.0`. Its source code corresponds to tag [`v1.0.0`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v1.0.0), revision [`4c19562`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/4c19562).

Declared compatibility is LEAF Contracts 3.1.0. It requires `leaf-authentication` for authenticated backend access and `leaf-payment-contracts` for shared payment types.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-stripe-payment:1.0.0")
}
```

Stripe declares `leaf-contracts`, `leaf-payment-contracts`, and `leaf-authentication` as transitive dependencies (`api`).

## Public surface

| API | Responsibility |
| --- | --- |
| `StripeCheckoutModule` | Module with checkout Actions: `prepare`, `observeCheckout`, `observeCheckoutOperation` |
| `StripeCheckoutBackend` | Port the app implements to connect to its payment backend |
| `stripeCheckoutModule(backend)` | Factory that creates the module with a host-owned backend |
| `providerTestStripeCheckoutModule(accessTokens)` | Test factory that creates and owns an HTTP client against the sandbox environment |

## Host responsibilities

The application implements `StripeCheckoutBackend` to communicate with its payment server. The host handles Stripe `PaymentSheet` presentation, provides `ValidAccessTokenProvider` from the Authentication module for authenticated calls, and decides what to do with the payment result.

## Usage

### Create the module

```kotlin
import com.ops.leaf_stripe_payment.StripeCheckoutBackend
import com.ops.leaf_stripe_payment.stripeCheckoutModule

val checkout = stripeCheckoutModule(myStripeBackend)
```

For testing with Stripe's sandbox:

```kotlin
import com.ops.leaf_stripe_payment.providerTestStripeCheckoutModule

val checkout = providerTestStripeCheckoutModule(
    accessTokens = auth.validAccessTokens,
)
```

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
    is StripePrepareOutcome.Unavailable -> { /* retry */ }
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
    is StripeCheckoutObservationOutcome.Unavailable -> { /* retry */ }
}
```

## Security

`StripePublishableKey` and `StripeClientSecret` redact their values in `toString()`. The `StripePublishableKey.test()` factory only accepts keys with the `pk_test_` prefix.

::: warning Test environment
Before using the module in production, test the full flow with Stripe's sandbox environment. Include the UI, backend, callbacks, authentication, and handling of failed or cancelled results.
:::
