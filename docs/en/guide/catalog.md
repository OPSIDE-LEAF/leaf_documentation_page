# Module catalog

GitHub organization: [github.com/OPSIDE-LEAF](https://github.com/OPSIDE-LEAF)

## Ecosystem core

| Artifact | Coordinate | Version | Status | Repository |
|---|---|---|---|---|
| leaf-contracts | `com.opside-leaf:leaf-contracts` | `%LEAF_VERSION%` | ✅ Stable | [OPSIDE-LEAF/leaf-contracts](https://github.com/OPSIDE-LEAF/leaf-contracts) |
| leaf-core | `com.opside-leaf:leaf-core` | `%LEAF_VERSION%` | ✅ Stable | [OPSIDE-LEAF/leaf-core](https://github.com/OPSIDE-LEAF/leaf-core) |
| leaf-compose | `com.opside-leaf:leaf-compose` | `%LEAF_VERSION%` | ✅ Stable | [OPSIDE-LEAF/leaf-compose](https://github.com/OPSIDE-LEAF/leaf-compose) |
| leaf-visuals | — | — | 🚧 Early development (design system) | [OPSIDE-LEAF/leaf-visuals](https://github.com/OPSIDE-LEAF/leaf-visuals) |

Core artifacts publish Android (AAR), iOS Arm64, iOS Simulator Arm64, and KMP metadata variants.

## Domain modules (Leaf 2.x)

### leaf-login — ✅ Reference module

- **Coordinate**: `com.opside-leaf:leaf-login:1.0.0` · **Package**: `com.opside.leaf.login` · **Repo**: [OPSIDE-LEAF/leaf-login](https://github.com/OPSIDE-LEAF/leaf-login)
- `LoginModule` exposes `val login: Feature<LoginInput, LoginState, LoginEvent, LoginResult>`
- Includes domain (`LoginModels`), port (`AuthGateway`), UI (`LoginRoute` + `LoginScreen`), and clean consumer
- This is the reference implementation for the 2.x architecture → [full walkthrough](/en/guide/login-reference)

### leaf-email — ✅ Stable

- **Coordinate**: `com.opside-leaf:leaf-email:1.0.0` · **Package**: `com.opside.leaf.email` · **Repo**: [OPSIDE-LEAF/leaf_email](https://github.com/OPSIDE-LEAF/leaf_email)
- `EmailModule` exposes `val send: Action<EmailInput, EmailResult>`
- Background SMTP sending on both platforms (jakarta.mail on Android, NSStream on iOS)
- Internal gateways via `expect/actual`; the host only provides `EmailConfig`
- → [Full walkthrough](/en/guide/email-reference)

### leaf-mp-payments — 🚧 Initial stub

- **Package**: `com.ops.leaf_mp_payment`
- `MercadoPagoPaymentModule` exposes `val pay: Action<MercadoPagoPaymentRequest, MercadoPagoPaymentOutcome>`
- Status: stub that returns `Unavailable`

### leaf-stripe-payments — 🚧 Initial stub

- **Package**: `com.ops.leaf_stripe_payment`
- `StripePaymentModule` exposes `val pay: Action<StripePaymentRequest, StripePaymentOutcome>`
- Status: stub that returns `Unavailable`

## Legacy modules — ⚠️ Previous architecture

| Module | Package | Status |
|---|---|---|
| leaf-authentication | `com.ops.authentication` | Pending migration to 2.x (uses Core 1.0 and old registry) |
| leaf-catalog | `com.ops.catalog` | Pending migration to 2.x |

::: warning Incompatible with LEAF 2
The legacy modules were built with the previous architecture (dynamic registry). Do not combine them with the %LEAF_VERSION% release train. See [Migration from legacy](/en/guide/legacy-migration).
:::

## Artifact repositories

Each artifact is published to its own GitHub Packages repository under the `OPSIDE-LEAF` organization:

```
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-contracts
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-core
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-compose
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-login
```

Common Group ID: `com.opside-leaf`.
