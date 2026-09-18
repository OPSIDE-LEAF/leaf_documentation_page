# API reference

LEAF %LEAF_VERSION% separates public contracts, execution, and Compose integration into different artifacts.

| Artifact | Responsibility |
| --- | --- |
| [leaf-contracts](/en/api/contracts) | defines inputs, outputs, and steps |
| [leaf-core](/en/api/core) | runs Actions and sessions |
| [leaf-compose](/en/api/compose) | brings a Workflow session to Compose |
| [leaf-visuals](/en/api/visuals) | provides an optional Material 3 theme |
| [Payment Contracts](/en/api/payment-contracts) | defines provider-independent payment types |

## Modules with independent versions

| Module | Documented version | Responsibility |
| --- | --- | --- |
| [Login](/en/api/login) | 3.1.0 | provides a login Workflow and a compatible Feature path |
| [Authentication](/en/api/authentication) | 1.0.0 | provides Actions for authentication, sessions, and tokens |
| [Catalog](/en/api/catalog) | 1.1.1 | provides reusable catalog, search, and detail as a Feature |
| [Email](/en/api/email) | 1.1.1 | provides an autonomous SMTP sending Action |
| [Stripe](/en/api/stripe) | 1.0.0 | implements a Stripe payment checkout |
| [Mercado Pago](/en/api/mercado-pago) | 1.0.0 | implements a Mercado Pago payment checkout |

These versions and their integration requirements are independent of the base LEAF release train. Review each reference before selecting dependencies for your application.
