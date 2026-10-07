# Mercado Pago

Mercado Pago 2.0.2 es un módulo Kotlin Multiplatform que implementa un checkout de pagos con Mercado Pago. Expone Actions para obtener la configuración, enviar un pago con tarjeta tokenizada y observar su estado. La app proporciona el backend, así como la captura y la tokenización de la tarjeta. El módulo no depende de ningún módulo de autenticación.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-mp-payment:2.0.2`. Su código fuente corresponde al tag [`v2.0.2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v2.0.2), revisión [`d882569`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/d882569).

Mercado Pago mantiene una versión independiente del tren base de LEAF. La compatibilidad declarada es LEAF Contracts 3.1.0. Usa `leaf-payment-contracts` 0.1.0 para los tipos compartidos de pago. La integración con leaf-visuals 1.4.0 es opcional: llega con `leaf-mp-payment-checkout-ui` y `leaf-mp-payment-android-ui`, y el módulo base no la usa.

::: info Cambios en 2.0
- **2.0.0:** el módulo ya no depende de `leaf-authentication`. Las factories de sandbox reciben el token mediante `MercadoPagoAccessTokenProvider`, un Port propio del módulo. Si tu app usaba la 1.0.0 con Authentication, envuelve el `ValidAccessTokenProvider` de Authentication como se muestra en [Implementar el Port del token](#implementar-el-port-del-token).
- **2.0.1:** `leaf-mp-payment-checkout-ui` y `leaf-mp-payment-android-ui` también se publican en GitHub Packages. En iOS, `MercadoPagoPaymentView(backendURL:accessTokens:…)` recibe el Port del token.
- **2.0.2:** no cambia la API. La variante Android de la raíz se publica como `leaf-mp-payment-android` (antes `leaf_mp_payment-android`) y los `ModuleInfo` reportan la versión real del artefacto.
:::

## Dependencia

Mercado Pago es Kotlin Multiplatform: la coordenada `leaf-mp-payment` sirve para Android y para iOS. La hoja de pago lista se distribuye por plataforma: en Android, el artefacto Maven `leaf-mp-payment-android-ui`; en iOS, el paquete Swift `apple-ui` del repositorio.

::: code-group

```kotlin [Android]
dependencies {
    implementation("com.opside-leaf:leaf-mp-payment:2.0.2")
    // Opcional: hoja de pago lista
    implementation("com.opside-leaf:leaf-mp-payment-android-ui:2.0.2")
}
```

```kotlin [Kotlin Multiplatform]
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.opside-leaf:leaf-mp-payment:2.0.2")
        }
        androidMain.dependencies {
            // Opcional: hoja de pago lista para Android
            implementation("com.opside-leaf:leaf-mp-payment-android-ui:2.0.2")
        }
    }
}
```

```swift [iOS (Swift Package)]
// Package.swift de la app. En Xcode: File > Add Package Dependencies > Add Local…
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

Mercado Pago declara `leaf-contracts` y `leaf-payment-contracts` como dependencias transitivas (`api`). Ktor y kotlinx-serialization son dependencias de implementación internas; el host no necesita declararlas por separado. El host necesita `leaf-core` para ejecutar las Actions con `Leaf.run`.

La hoja de pago existe en Android y en iOS:

- **Android:** `leaf-mp-payment-android-ui` es opcional, incluye `leaf-mp-payment-checkout-ui` y usa el SDK Core Methods de Mercado Pago. Si lo usas, declara también el repositorio Maven de Mercado Pago, `https://artifacts.mercadolibre.com/repository/android-releases`.
- **iOS:** el paquete Swift `apple-ui` usa el SDK Core Methods de Mercado Pago para iOS (`sdk-ios` 1.0.0). No se distribuye por Maven: clona el repositorio en el tag `v2.0.2` y genera su XCFramework con `./gradlew :checkout-ui:stageForSwiftPackage` antes de agregar el paquete.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `MercadoPagoCheckoutModule` | Módulo con Actions de checkout: `prepare`, `submit`, `observeCheckout`, `observeCheckoutOperation` |
| `MercadoPagoCheckoutBackend` | Port que la app implementa para conectar con su backend de pagos |
| `mercadoPagoCheckoutModule(backend)` | Factory que crea el módulo con un backend propio del host |
| `providerTestMercadoPagoCheckoutModule(accessTokens, baseUrl)` | Factory de pruebas que crea y posee un cliente HTTP contra el backend sandbox de LEAF |
| `MercadoPagoAccessTokenProvider` | Port del token bearer que usan las factories de sandbox; el host lo conecta con su sesión |
| `MercadoPagoPaymentBottomSheet` | Hoja de pago Compose para Android (`leaf-mp-payment-android-ui`) con campos de tarjeta de sandbox y tokenización con el SDK Core Methods |
| `MercadoPagoPaymentView` | Vista SwiftUI del paquete `apple-ui` para iOS; su inicializador de sandbox recibe `accessTokens` |

## Responsabilidades del host

La aplicación implementa `MercadoPagoCheckoutBackend` para comunicarse con su servidor de pagos. A diferencia de Stripe, el host es responsable de la captura de tarjeta y la tokenización con el SDK de Mercado Pago. También decide qué hacer con el resultado del pago.

Si usa las factories de sandbox, el host implementa `MercadoPagoAccessTokenProvider` con su propia sesión, por ejemplo con Authentication, y llama a `close()` al terminar para liberar el cliente HTTP.

## Uso

### Implementar el backend

`MercadoPagoCheckoutBackend` conecta el módulo con tu servidor de pagos. Cada función devuelve el resultado tipado que obtengas de tu servidor:

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
        TODO("Pide a tu servidor la clave pública y el país")

    override suspend fun submit(request: SubmitMercadoPagoCheckoutRequest): MercadoPagoSubmitOutcome =
        TODO("Envía el pago; request.paymentOperationId es la clave de idempotencia")

    override suspend fun observe(request: ObserveMercadoPagoCheckoutRequest): MercadoPagoCheckoutObservationOutcome =
        TODO("Consulta el estado de request.paymentAttemptId")

    override suspend fun observeOperation(
        request: ObserveMercadoPagoCheckoutOperationRequest,
    ): MercadoPagoCheckoutObservationOutcome =
        TODO("Consulta el estado por request.orderId y request.paymentOperationId")
}
```

### Crear el módulo

```kotlin
import com.ops.leaf_mp_payment.mercadoPagoCheckoutModule

val checkout = mercadoPagoCheckoutModule(MyMercadoPagoBackend())
```

### Implementar el Port del token

Lo necesitan las factories de sandbox: `providerTestMercadoPagoCheckoutModule` y `localFakeMercadoPagoPaymentModule`. Este adaptador conecta el `ValidAccessTokenProvider` de Authentication, que restaura o renueva la sesión antes de prestar el token:

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

Para pruebas con el sandbox:

```kotlin
import com.ops.leaf_authentication.AuthenticationModule
import com.ops.leaf_mp_payment.MercadoPagoCheckoutModule
import com.ops.leaf_mp_payment.providerTestMercadoPagoCheckoutModule

// Llama a close() en el módulo al terminar para liberar su cliente HTTP.
fun sandboxCheckout(auth: AuthenticationModule): MercadoPagoCheckoutModule =
    providerTestMercadoPagoCheckoutModule(
        accessTokens = AuthenticationTokens(auth.validAccessTokens),
    )
```

`baseUrl` es `http://127.0.0.1:8080` por defecto. Debe ser un origen HTTPS, o HTTP solo con los hosts locales `127.0.0.1`, `localhost` o `10.0.2.2`, sin path, query, fragmento ni credenciales.

En iOS, `MercadoPagoPaymentView(backendURL:accessTokens:…)` recibe un provider que implementa el protocolo que exporta `LeafMpPaymentUI`. Para Swift, un provider creado en otro framework Kotlin es un tipo distinto. Además, el framework no exporta `CharArray`, así que en 2.0.x Swift no puede prestar un token: solo puede responder `NoSession`, `Expired` o `Unavailable`. La app iOS de prueba usa este provider:

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
            // status es un MercadoPagoPaymentStatus
        }
    }
}
```

Para cobros autenticados en iOS, usa `MercadoPagoPaymentView(module:input:onResult:)` con un módulo creado sobre tu propio `MercadoPagoCheckoutBackend`, que resuelve la autenticación con tu servidor.

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
    is MercadoPagoConfigurationOutcome.Unavailable -> {
        // reintentar
    }
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
    is MercadoPagoSubmitOutcome.Unavailable -> {
        // reintentar
    }
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
    is MercadoPagoCheckoutObservationOutcome.Unavailable -> {
        // reintentar
    }
}
```

Si el Port del token devuelve `NoSession` o `Expired`, la factory de pruebas no envía la solicitud y la Action devuelve `Rejected` con `AUTHENTICATION_REQUIRED`. Si devuelve `Unavailable`, la Action devuelve `Unavailable`. Con la factory de pruebas, `observeCheckoutOperation` siempre devuelve `Rejected` con `NOT_FOUND`; usa `observeCheckout` con el `paymentAttemptId`.

## Seguridad

`MercadoPagoPublicKey` y `MercadoPagoCardToken` redactan sus valores en `toString()`. El `toString()` del request de envío omite `orderId` y redacta `paymentOperationId`, `cardToken` y `payerEmail`. `MercadoPagoAccessTokenProvider` presta el token solo durante cada llamada; el módulo no lo conserva.

## Transporte por plataforma

La factory de pruebas usa el motor OkHttp de Ktor en Android y el motor Darwin en iOS. La factory con backend propio no crea ningún cliente HTTP.

::: warning Solo entornos de prueba
Los artefactos 2.0.x están pensados para sandbox: la clave pública se crea con `MercadoPagoPublicKey.test()`, la hoja de Android usa campos de tarjeta de sandbox y las factories de pruebas apuntan al backend sandbox de LEAF. Prueba el flujo completo con el entorno sandbox de Mercado Pago: captura de tarjeta, tokenización, backend, callbacks, autenticación y manejo de resultados fallidos o cancelados.
:::
