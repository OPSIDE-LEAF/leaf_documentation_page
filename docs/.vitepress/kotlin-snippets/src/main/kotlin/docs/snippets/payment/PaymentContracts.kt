package docs.snippets.payment

import com.ops.leaf_payment_contracts.Money
import com.ops.leaf_payment_contracts.OrderId
import com.ops.leaf_payment_contracts.PaymentOperationId

val amount = Money.of(minorUnits = 1_250, currency = "MXN")
val order = OrderId.of("order-42")
val operation = PaymentOperationId.of("operation-42")
