# API reference

LEAF %LEAF_VERSION% separates public contracts, execution, and Compose integration into different artifacts.

| Artifact | Responsibility |
| --- | --- |
| [leaf-contracts](/en/api/contracts) | defines inputs, outputs, and steps |
| [leaf-core](/en/api/core) | runs Actions and sessions |
| [leaf-compose](/en/api/compose) | brings a Workflow session to Compose |
| [Workflow](/en/api/workflow) | explains a stateful interaction step by step |
| [leaf-visuals](/en/api/visuals) | provides an optional Material 3 theme |

## Modules with independent versions

| Module or artifact | Documented version | Responsibility |
| --- | --- | --- |
| [Login](/en/api/login) | 3.0.1 | provides a reference login Feature and experimental Workflow |
| [Authentication](/en/api/authentication) | 0.2.0 | provides Actions and optional adapters for authentication |
| [Payment Contracts](/en/api/payment-contracts) | 0.1.0 | defines provider-independent payment types |
| [Payment modules](/en/api/payments) | 0.3.0 | implement Workflow checkouts for Stripe and Mercado Pago |

These versions and their integration requirements are independent of the base LEAF release train. Review each reference before selecting dependencies for your application.
