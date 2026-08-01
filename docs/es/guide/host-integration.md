# Host: integrar módulos publicados

Esta página cubre el flujo completo de un host que integra un módulo del [catálogo](/es/guide/catalogo): instalar, implementar los ports, ejecutar y navegar.

## 1. Instala la dependencia

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.opside-leaf:leaf-login:1.0.0")
            implementation("com.opside-leaf:leaf-core:2.0.1")
            implementation("com.opside-leaf:leaf-compose:2.0.1") // si tu host es Compose
        }
    }
}
```

Ver [Instalación](/es/guide/installation) para repositorios y credenciales.

## 2. Implementa los gateways del módulo

Cada módulo declara sus dependencias externas como **ports** (interfaces). Como host, tú aportas la implementación real:

```kotlin
// El módulo declara el port:
interface AuthGateway {
    suspend fun authenticate(email: String, password: String): AuthResponse
}

// Tu host aporta el adaptador de infraestructura:
class HttpAuthGateway(private val client: HttpClient) : AuthGateway {
    override suspend fun authenticate(email: String, password: String): AuthResponse =
        // llamada real a tu backend / proveedor de identidad
}
```

En desarrollo o pruebas puedes usar un fake:

```kotlin
class FakeAuthGateway : AuthGateway {
    override suspend fun authenticate(email: String, password: String) =
        AuthResponse.Success(userId = "fake-id")
}
```

## 3. Construye el módulo y ejecútalo

El host construye el módulo **explícitamente** — sin registro, sin DI global:

```kotlin
val loginModule = LoginModule(HttpAuthGateway(client))

// Host Compose: el módulo trae su Route
LoginRoute(
    module = loginModule,
    onAuthenticated = { result -> navigateToHome(result.userId) },
)
```

El Route del módulo entrega el resultado terminal a tu callback. **La navegación es tuya**: el módulo nunca navega por sí mismo.

Para módulos con `Action` (ej. pagos):

```kotlin
val payments = MercadoPagoPaymentModule(/* gateways */)

when (val outcome = Leaf.run(payments.pay, request)) {
    is MercadoPagoPaymentOutcome.Approved -> showReceipt(outcome)
    // ... resto de variantes de dominio
}
```

## 4. Distingue dominio de fallo técnico

- **Resultados de dominio** (variantes del output) → decisiones de negocio y estados de UI.
- **`LeafException` / `Failed`** → estado técnico seguro, sin exponer detalle. Ver [Errores y telemetría](/es/guide/errores-telemetria).

## Checklist de integración

- [ ] El host construye el módulo explícitamente y conserva la navegación.
- [ ] Los gateways del módulo tienen implementación del host (real o fake según entorno).
- [ ] Hay una única sesión Core por Feature; no hay reducer o cola duplicados en el host.
- [ ] El host distingue resultados de negocio de fallos técnicos.
- [ ] No hay secretos en logs, telemetría ni persistencia del host.
- [ ] Las dependencias son exclusivamente el tren estable `2.0.1` cuando este es el objetivo de publicación.

## Reglas del host

- ❌ No implementes reducers, colas o sesiones paralelas — Core es dueño de la sesión.
- ❌ No guardes sesiones en ViewModels ni las abras en `LaunchedEffect`.
- ❌ No uses excepciones para leer resultados de negocio.
- ✅ Observa `state`/`result`, envía eventos, decide con el output.
