# Catálogo de módulos

Organización en GitHub: [github.com/OPSIDE-LEAF](https://github.com/OPSIDE-LEAF)

## Core del ecosistema

| Artefacto | Coordenada | Versión | Estado | Repositorio |
|---|---|---|---|---|
| leaf-contracts | `com.opside-leaf:leaf-contracts` | `%LEAF_VERSION%` | ✅ Estable | [OPSIDE-LEAF/leaf-contracts](https://github.com/OPSIDE-LEAF/leaf-contracts) |
| leaf-core | `com.opside-leaf:leaf-core` | `%LEAF_VERSION%` | ✅ Estable | [OPSIDE-LEAF/leaf-core](https://github.com/OPSIDE-LEAF/leaf-core) |
| leaf-compose | `com.opside-leaf:leaf-compose` | `%LEAF_VERSION%` | ✅ Estable | [OPSIDE-LEAF/leaf-compose](https://github.com/OPSIDE-LEAF/leaf-compose) |
| leaf-visuals | — | — | 🚧 En desarrollo inicial (sistema de diseño) | [OPSIDE-LEAF/leaf-visuals](https://github.com/OPSIDE-LEAF/leaf-visuals) |

Los artefactos del core publican variantes Android (AAR), iOS Arm64, iOS Simulator Arm64 y metadata KMP.

## Módulos de dominio (Leaf 2.x)

### leaf-login — ✅ Módulo de referencia

- **Coordenada**: `com.opside-leaf:leaf-login:1.0.0` · **Paquete**: `com.opside.leaf.login` · **Repo**: [OPSIDE-LEAF/leaf-login](https://github.com/OPSIDE-LEAF/leaf-login)
- `LoginModule` expone `val login: Feature<LoginInput, LoginState, LoginEvent, LoginResult>`
- Incluye dominio (`LoginModels`), port (`AuthGateway`), UI (`LoginRoute` + `LoginScreen`) y clean consumer
- Es la implementación de referencia para la arquitectura 2.x → [walkthrough completo](/es/guide/login-reference)

### leaf-email — ✅ Estable

- **Coordenada**: `com.opside-leaf:leaf-email:1.0.0` · **Paquete**: `com.opside.leaf.email` · **Repo**: [OPSIDE-LEAF/leaf_email](https://github.com/OPSIDE-LEAF/leaf_email)
- `EmailModule` expone `val send: Action<EmailInput, EmailResult>`
- Envío SMTP en background en ambas plataformas (jakarta.mail en Android, NSStream en iOS)
- Gateways internos vía `expect/actual`; el host solo proporciona `EmailConfig`
- → [Walkthrough completo](/es/guide/email-reference)

### leaf-mp-payments — 🚧 Stub inicial

- **Paquete**: `com.ops.leaf_mp_payment`
- `MercadoPagoPaymentModule` expone `val pay: Action<MercadoPagoPaymentRequest, MercadoPagoPaymentOutcome>`
- Estado: stub que retorna `Unavailable`

### leaf-stripe-payments — 🚧 Stub inicial

- **Paquete**: `com.ops.leaf_stripe_payment`
- `StripePaymentModule` expone `val pay: Action<StripePaymentRequest, StripePaymentOutcome>`
- Estado: stub que retorna `Unavailable`

## Módulos legacy — ⚠️ Arquitectura anterior

| Módulo | Paquete | Estado |
|---|---|---|
| leaf-authentication | `com.ops.authentication` | Pendiente de migración a 2.x (usa Core 1.0 y registro antiguo) |
| leaf-catalog | `com.ops.catalog` | Pendiente de migración a 2.x |

::: warning Incompatibles con LEAF 2
Los módulos legacy fueron creados con la arquitectura anterior (registro dinámico). No los combines con el tren %LEAF_VERSION%. Ver [Migración desde legacy](/es/guide/legacy-migration).
:::

## Repositorios de artefactos

Cada artefacto se publica en su propio repositorio de GitHub Packages bajo la organización `OPSIDE-LEAF`:

```
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-contracts
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-core
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-compose
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-login
```

Group ID común: `com.opside-leaf`.
