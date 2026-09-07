# Payment Contracts

Payment Contracts 0.1.0 defines the shared types required by a payments app: money, orders, attempts, and statuses. It does not process charges by itself and does not depend on LEAF, Compose, Authentication, HTTP, or payment SDKs.

## Public values

These types represent a payment without depending on the provider used by the app.

<!-- kotlin-snippet: compiled: payment-contracts -->
```kotlin
import com.ops.leaf_payment_contracts.Money
import com.ops.leaf_payment_contracts.OrderId
import com.ops.leaf_payment_contracts.PaymentOperationId

val amount = Money.of(minorUnits = 1_250, currency = "MXN")
val order = OrderId.of("order-42")
val operation = PaymentOperationId.of("operation-42")
```

Use `Money.of` to create an amount. It receives small units, such as cents, and a currency such as `"MXN"`. It does not accept a negative amount or a currency code written in an arbitrary form. `OrderId`, `PaymentOperationId`, and `PaymentAttemptId` check that their identifiers have a valid format. They also avoid showing the full value when turned into text, so a log does not expose unnecessary data.

A payment can be pending (`PENDING`), processing (`PROCESSING`), successful (`SUCCEEDED`), declined (`DECLINED`), cancelled (`CANCELLED`), or need review (`REQUIRES_RECONCILIATION`). When it fails, `PaymentFailureCode` explains the kind of failure. `PaymentProvider` identifies Stripe or Mercado Pago. Your app decides how to call the network, which SDK to use, where to store data, and which screen to show.
