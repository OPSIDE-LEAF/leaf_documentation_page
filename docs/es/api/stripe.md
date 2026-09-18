# Stripe

Stripe 1.0.0 es un módulo Kotlin Multiplatform que implementa un checkout de pagos con Stripe. Expone Actions para preparar un checkout, enviar el pago y observar su estado. La app proporciona el backend, la presentación de `PaymentSheet` y la relación con Authentication.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-stripe-payment:1.0.0`. Su código fuente corresponde al tag [`v1.0.0`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v1.0.0), revisión [`4c19562`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/4c19562).

La compatibilidad declarada es LEAF Contracts 3.1.0. Requiere `leaf-authentication` para el acceso autenticado al backend y `leaf-payment-contracts` para los tipos compartidos de pago.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-stripe-payment:1.0.0")
}
```

Stripe declara `leaf-contracts`, `leaf-payment-contracts` y `leaf-authentication` como dependencias transitivas (`api`).

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `StripeCheckoutModule` | Módulo con Actions de checkout: `prepare`, `observeCheckout`, `observeCheckoutOperation` |
| `StripeCheckoutBackend` | Port que la app implementa para conectar con su backend de pagos |
| `stripeCheckoutModule(backend)` | Factory que crea el módulo con un backend propio del host |
| `providerTestStripeCheckoutModule(accessTokens)` | Factory de pruebas que crea y posee un cliente HTTP contra el entorno sandbox |

## Responsabilidades del host

La aplicación implementa `StripeCheckoutBackend` para comunicarse con su servidor de pagos. El host maneja la presentación de `PaymentSheet` de Stripe, proporciona `ValidAccessTokenProvider` del módulo Authentication para las llamadas autenticadas, y decide qué hacer con el resultado del pago.

## Uso

### Crear el módulo

```kotlin
import com.ops.leaf_stripe_payment.StripeCheckoutBackend
import com.ops.leaf_stripe_payment.stripeCheckoutModule

val checkout = stripeCheckoutModule(myStripeBackend)
```

Para pruebas con el sandbox de Stripe:

```kotlin
import com.ops.leaf_stripe_payment.providerTestStripeCheckoutModule

val checkout = providerTestStripeCheckoutModule(
    accessTokens = auth.validAccessTokens,
)
```

### Preparar un checkout

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
        // outcome.session contiene publishableKey y clientSecret
        // para presentar PaymentSheet
    }
    is StripePrepareOutcome.Rejected -> { /* outcome.reason */ }
    is StripePrepareOutcome.Unavailable -> { /* reintentar */ }
}
```

### Observar el estado

```kotlin
import com.ops.leaf_stripe_payment.ObserveStripeCheckoutRequest
import com.ops.leaf_stripe_payment.StripeCheckoutObservationOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.observeCheckout, ObserveStripeCheckoutRequest(
    paymentAttemptId = session.paymentAttemptId,
))

when (outcome) {
    is StripeCheckoutObservationOutcome.Available -> {
        // outcome.observation.status es un PaymentStatus
    }
    is StripeCheckoutObservationOutcome.Rejected -> { /* outcome.reason */ }
    is StripeCheckoutObservationOutcome.Unavailable -> { /* reintentar */ }
}
```

## Seguridad

`StripePublishableKey` y `StripeClientSecret` redactan sus valores en `toString()`. La factory `StripePublishableKey.test()` solo acepta claves con prefijo `pk_test_`.

::: warning Entorno de pruebas
Antes de usar el módulo en producción, prueba el flujo completo con el entorno sandbox de Stripe. Incluye la UI, el backend, los callbacks, la autenticación y el manejo de resultados fallidos o cancelados.
:::
