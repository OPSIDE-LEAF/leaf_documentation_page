# Stripe

Stripe 2.0.1 es un módulo Kotlin Multiplatform que implementa un checkout de pagos con Stripe. Expone Actions para preparar un checkout y observar su estado. La app proporciona el backend y la presentación de `PaymentSheet`. El módulo no depende de ningún módulo de autenticación.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-stripe-payment:2.0.1`. Su código fuente corresponde al tag [`v2.0.1`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v2.0.1), revisión [`10a1af7`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/10a1af7).

Stripe mantiene una versión independiente del tren base de LEAF. La compatibilidad declarada es LEAF Contracts 3.1.0. Usa `leaf-payment-contracts` 0.1.0 para los tipos compartidos de pago. La integración con leaf-visuals 1.4.0 es opcional: llega con `leaf-stripe-payment-checkout-ui` y `leaf-stripe-payment-android-ui`, y el módulo base no la usa.

::: info Cambios en 2.0
- **2.0.0:** el módulo ya no depende de `leaf-authentication`. Las factories de sandbox reciben el token mediante `StripeAccessTokenProvider`, un Port propio del módulo. Si tu app usaba la 1.0.0 con Authentication, envuelve el `ValidAccessTokenProvider` de Authentication como se muestra en [Implementar el Port del token](#implementar-el-port-del-token).
- **2.0.1:** en iOS, `StripePaymentView(backendURL:accessTokens:…)` recibe el Port del token. Los artefactos Kotlin no cambian respecto a 2.0.0.
:::

## Dependencia

Stripe es Kotlin Multiplatform: la coordenada `leaf-stripe-payment` sirve para Android y para iOS. La UI de pago lista se distribuye por plataforma: en Android, el artefacto Maven `leaf-stripe-payment-android-ui`; en iOS, el paquete Swift `apple-ui` del repositorio.

::: code-group

```kotlin [Android]
dependencies {
    implementation("com.opside-leaf:leaf-stripe-payment:2.0.1")
    // Opcional: UI de pago lista (PaymentSheet de Stripe)
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
            // Opcional: UI de pago lista para Android (PaymentSheet de Stripe)
            implementation("com.opside-leaf:leaf-stripe-payment-android-ui:2.0.1")
        }
    }
}
```

```swift [iOS (Swift Package)]
// Package.swift de la app. En Xcode: File > Add Package Dependencies > Add Local…
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

Stripe declara `leaf-contracts` y `leaf-payment-contracts` como dependencias transitivas (`api`). Ktor y kotlinx-serialization son dependencias de implementación internas; el host no necesita declararlas por separado. El host necesita `leaf-core` para ejecutar las Actions con `Leaf.run`.

`PaymentSheet` es el formulario de pago oficial de Stripe: recoge los datos de la tarjeta, resuelve la autenticación 3D Secure y confirma el pago con el `clientSecret`. Existe en Android y en iOS:

- **Android:** `leaf-stripe-payment-android-ui` es opcional e incluye `leaf-stripe-payment-checkout-ui` y el SDK de Stripe para Android.
- **iOS:** el paquete Swift `apple-ui` presenta la `PaymentSheet` del SDK de Stripe para iOS (`stripe-ios-spm` 26.4.1). No se distribuye por Maven: clona el repositorio en el tag `v2.0.1` y genera su XCFramework con `./gradlew :checkout-ui:stageForSwiftPackage` antes de agregar el paquete.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `StripeCheckoutModule` | Módulo con Actions de checkout: `prepare`, `observeCheckout`, `observeCheckoutOperation` |
| `StripeCheckoutBackend` | Port que la app implementa para conectar con su backend de pagos |
| `stripeCheckoutModule(backend)` | Factory que crea el módulo con un backend propio del host |
| `providerTestStripeCheckoutModule(accessTokens, baseUrl)` | Factory de pruebas que crea y posee un cliente HTTP contra el backend sandbox de LEAF |
| `StripeAccessTokenProvider` | Port del token bearer que usan las factories de sandbox; el host lo conecta con su sesión |
| `StripePaymentLauncher` | Lanzador Compose para Android (`leaf-stripe-payment-android-ui`) que presenta `PaymentSheet` |
| `StripePaymentView` | Vista SwiftUI del paquete `apple-ui` para iOS; su inicializador de sandbox recibe `accessTokens` |

## Responsabilidades del host

La aplicación implementa `StripeCheckoutBackend` para comunicarse con su servidor de pagos. El host maneja la presentación de `PaymentSheet` de Stripe y decide qué hacer con el resultado del pago.

Si usa las factories de sandbox, el host implementa `StripeAccessTokenProvider` con su propia sesión, por ejemplo con Authentication, y llama a `close()` al terminar para liberar el cliente HTTP.

## Uso

### Implementar el backend

`StripeCheckoutBackend` conecta el módulo con tu servidor de pagos. Cada función devuelve el resultado tipado que obtengas de tu servidor:

```kotlin
import com.ops.leaf_stripe_payment.ObserveStripeCheckoutOperationRequest
import com.ops.leaf_stripe_payment.ObserveStripeCheckoutRequest
import com.ops.leaf_stripe_payment.PrepareStripeCheckoutRequest
import com.ops.leaf_stripe_payment.StripeCheckoutBackend
import com.ops.leaf_stripe_payment.StripeCheckoutObservationOutcome
import com.ops.leaf_stripe_payment.StripePrepareOutcome

class MyStripeBackend : StripeCheckoutBackend {
    override suspend fun prepare(request: PrepareStripeCheckoutRequest): StripePrepareOutcome =
        TODO("Crea el PaymentIntent; request.paymentOperationId es la clave de idempotencia")

    override suspend fun observe(request: ObserveStripeCheckoutRequest): StripeCheckoutObservationOutcome =
        TODO("Consulta el estado de request.paymentAttemptId")

    override suspend fun observeOperation(
        request: ObserveStripeCheckoutOperationRequest,
    ): StripeCheckoutObservationOutcome =
        TODO("Consulta el estado por request.orderId y request.paymentOperationId")
}
```

### Crear el módulo

```kotlin
import com.ops.leaf_stripe_payment.stripeCheckoutModule

val checkout = stripeCheckoutModule(MyStripeBackend())
```

### Implementar el Port del token

Lo necesitan las factories de sandbox: `providerTestStripeCheckoutModule` y `localFakeStripePaymentModule`. Este adaptador conecta el `ValidAccessTokenProvider` de Authentication, que restaura o renueva la sesión antes de prestar el token:

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

Para pruebas con el sandbox:

```kotlin
import com.ops.leaf_authentication.AuthenticationModule
import com.ops.leaf_stripe_payment.StripeCheckoutModule
import com.ops.leaf_stripe_payment.providerTestStripeCheckoutModule

// Llama a close() en el módulo al terminar para liberar su cliente HTTP.
fun sandboxCheckout(auth: AuthenticationModule): StripeCheckoutModule =
    providerTestStripeCheckoutModule(
        accessTokens = AuthenticationTokens(auth.validAccessTokens),
    )
```

`baseUrl` es `http://127.0.0.1:8080` por defecto. Debe ser un origen HTTPS, o HTTP solo con los hosts locales `127.0.0.1`, `localhost` o `10.0.2.2`, sin path, query, fragmento ni credenciales.

En iOS, `StripePaymentView(backendURL:accessTokens:…)` recibe un provider que implementa el protocolo que exporta `LeafStripeCheckoutUI`. Para Swift, un provider creado en otro framework Kotlin es un tipo distinto. Además, el framework no exporta `CharArray`, así que en 2.0.1 Swift no puede prestar un token: solo puede responder `NoSession`, `Expired` o `Unavailable`. La app iOS de prueba usa este provider:

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
            merchantDisplayName: "Mi tienda"
        ) { status, paymentAttemptID in
            // status es un StripePaymentStatus
        }
    }
}
```

Para cobros autenticados en iOS, usa `StripePaymentView(module:input:merchantDisplayName:onResult:)` con un módulo creado sobre tu propio `StripeCheckoutBackend`, que resuelve la autenticación con tu servidor.

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
    is StripePrepareOutcome.Unavailable -> {
        // reintentar
    }
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
    is StripeCheckoutObservationOutcome.Unavailable -> {
        // reintentar
    }
}
```

Si el Port del token devuelve `NoSession` o `Expired`, la factory de pruebas no envía la solicitud y la Action devuelve `Rejected` con `AUTHENTICATION_REQUIRED`. Si devuelve `Unavailable`, la Action devuelve `Unavailable`. Con la factory de pruebas, `observeCheckoutOperation` siempre devuelve `Rejected` con `NOT_FOUND`; usa `observeCheckout` con el `paymentAttemptId`.

## Seguridad

`StripePublishableKey` y `StripeClientSecret` redactan sus valores en `toString()`. La factory `StripePublishableKey.test()` solo acepta claves con prefijo `pk_test_`. `StripeAccessTokenProvider` presta el token solo durante cada llamada; el módulo no lo conserva.

## Transporte por plataforma

La factory de pruebas usa el motor OkHttp de Ktor en Android y el motor Darwin en iOS. La factory con backend propio no crea ningún cliente HTTP.

::: warning Solo entornos de prueba
Los artefactos 2.0.1 están pensados para pruebas: `StripePublishableKey.test()` solo acepta claves `pk_test_` y las factories de pruebas apuntan al backend sandbox de LEAF. Prueba el flujo completo con el entorno sandbox de Stripe: la UI, el backend, los callbacks, la autenticación y el manejo de resultados fallidos o cancelados.
:::
