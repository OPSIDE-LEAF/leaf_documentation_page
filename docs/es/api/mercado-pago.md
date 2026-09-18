# Mercado Pago

Mercado Pago 1.0.0 es un módulo Kotlin Multiplatform que implementa un checkout de pagos con Mercado Pago. Expone Actions para obtener la configuración, enviar un pago con tarjeta tokenizada y observar su estado. La app proporciona el backend, la captura y tokenización de tarjeta, y la relación con Authentication.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-mp-payment:1.0.0`. Su código fuente corresponde al tag [`v1.0.0`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v1.0.0), revisión [`7d7efb2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/7d7efb2).

La compatibilidad declarada es LEAF Contracts 3.1.0. Requiere `leaf-authentication` para el acceso autenticado al backend y `leaf-payment-contracts` para los tipos compartidos de pago.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-mp-payment:1.0.0")
}
```

Mercado Pago declara `leaf-contracts`, `leaf-payment-contracts` y `leaf-authentication` como dependencias transitivas (`api`).

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `MercadoPagoCheckoutModule` | Módulo con Actions de checkout: `prepare`, `submit`, `observeCheckout`, `observeCheckoutOperation` |
| `MercadoPagoCheckoutBackend` | Port que la app implementa para conectar con su backend de pagos |
| `mercadoPagoCheckoutModule(backend)` | Factory que crea el módulo con un backend propio del host |
| `providerTestMercadoPagoCheckoutModule(accessTokens)` | Factory de pruebas que crea y posee un cliente HTTP contra el entorno sandbox |

## Responsabilidades del host

La aplicación implementa `MercadoPagoCheckoutBackend` para comunicarse con su servidor de pagos. A diferencia de Stripe, el host es responsable de la captura de tarjeta y la tokenización con el SDK de Mercado Pago. El host proporciona `ValidAccessTokenProvider` del módulo Authentication para las llamadas autenticadas y decide qué hacer con el resultado del pago.

## Uso

### Crear el módulo

```kotlin
import com.ops.leaf_mp_payment.MercadoPagoCheckoutBackend
import com.ops.leaf_mp_payment.mercadoPagoCheckoutModule

val checkout = mercadoPagoCheckoutModule(myMercadoPagoBackend)
```

Para pruebas con el sandbox de Mercado Pago:

```kotlin
import com.ops.leaf_mp_payment.providerTestMercadoPagoCheckoutModule

val checkout = providerTestMercadoPagoCheckoutModule(
    accessTokens = auth.validAccessTokens,
)
```

### Obtener la configuración

```kotlin
import com.ops.leaf_mp_payment.PrepareMercadoPagoCheckoutRequest
import com.ops.leaf_mp_payment.MercadoPagoConfigurationOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.prepare, PrepareMercadoPagoCheckoutRequest)

when (outcome) {
    is MercadoPagoConfigurationOutcome.Available -> {
        // outcome.configuration.publicKey para tokenización
        // outcome.configuration.countryCode (ISO alpha-3)
    }
    is MercadoPagoConfigurationOutcome.Rejected -> { /* outcome.reason */ }
    is MercadoPagoConfigurationOutcome.Unavailable -> { /* reintentar */ }
}
```

### Enviar el pago

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
        // outcome.order.status es un PaymentStatus
    }
    is MercadoPagoSubmitOutcome.Rejected -> { /* outcome.reason */ }
    is MercadoPagoSubmitOutcome.Unavailable -> { /* reintentar */ }
}
```

### Observar el estado

```kotlin
import com.ops.leaf_mp_payment.ObserveMercadoPagoCheckoutRequest
import com.ops.leaf_mp_payment.MercadoPagoCheckoutObservationOutcome
import com.ops.leaf_core.api.Leaf

val outcome = Leaf.run(checkout.observeCheckout, ObserveMercadoPagoCheckoutRequest(
    paymentAttemptId = order.paymentAttemptId,
))

when (outcome) {
    is MercadoPagoCheckoutObservationOutcome.Available -> {
        // outcome.order.status es un PaymentStatus
    }
    is MercadoPagoCheckoutObservationOutcome.Rejected -> { /* outcome.reason */ }
    is MercadoPagoCheckoutObservationOutcome.Unavailable -> { /* reintentar */ }
}
```

## Seguridad

`MercadoPagoPublicKey` y `MercadoPagoCardToken` redactan sus valores en `toString()`. Los datos del request de envío (`orderId`, `cardToken`, `payerEmail`) también se redactan.

::: warning Entorno de pruebas
Antes de usar el módulo en producción, prueba el flujo completo con el entorno sandbox de Mercado Pago. Incluye la captura de tarjeta, la tokenización, el backend, los callbacks, la autenticación y el manejo de resultados fallidos o cancelados.
:::
