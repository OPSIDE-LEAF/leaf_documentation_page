# Payment Contracts

Payment Contracts 0.1.0 define los tipos compartidos que necesita una aplicación de pagos: dinero, pedidos, intentos y estados. No procesa cobros por sí sola y no depende de LEAF, Compose, Authentication, HTTP ni de un SDK de pagos.

## Valores públicos

Estos tipos representan un pago sin depender del proveedor que use la app.

<!-- kotlin-snippet: compiled: payment-contracts -->
```kotlin
import com.ops.leaf_payment_contracts.Money
import com.ops.leaf_payment_contracts.OrderId
import com.ops.leaf_payment_contracts.PaymentOperationId

val amount = Money.of(minorUnits = 1_250, currency = "MXN")
val order = OrderId.of("order-42")
val operation = PaymentOperationId.of("operation-42")
```

Usa `Money.of` para crear un importe. Recibe unidades pequeñas, por ejemplo centavos, y una moneda como `"MXN"`. No acepta una cantidad negativa ni un código de moneda escrito de cualquier forma. `OrderId`, `PaymentOperationId` y `PaymentAttemptId` comprueban que sus identificadores tengan un formato válido. Además, no muestran el valor completo cuando se convierten en texto, para no exponer datos innecesarios en un log.

Un pago puede estar pendiente (`PENDING`), en proceso (`PROCESSING`), terminado con éxito (`SUCCEEDED`), rechazado (`DECLINED`), cancelado (`CANCELLED`) o necesitar revisión (`REQUIRES_RECONCILIATION`). Si falla, `PaymentFailureCode` explica el tipo de fallo. `PaymentProvider` identifica a Stripe o Mercado Pago. Tu app decide cómo llamar la red, qué SDK usar, dónde guardar datos y qué pantalla mostrar.
