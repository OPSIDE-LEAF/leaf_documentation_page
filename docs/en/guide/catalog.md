# Module catalog

This catalog summarizes the documented LEAF base libraries and modules. Each organization can obtain them from its preferred Maven repository and define its own publication process. See [Installation](/en/guide/installation) for the dependencies required by each type of project.

## A starting point for new projects

The catalog lets teams begin with implemented capabilities instead of rebuilding them for every application. A team can select the modules it needs, connect them to the host, and focus on the rules specific to its product.

Each entry should represent a reusable capability with its own contract, version, and tests. The catalog can grow independently: an organization can use the available modules, create private modules for its needs, or share new modules without changing the host architecture.

## Base libraries

| Artifact | Documented version | When it is needed |
| --- | --- | --- |
| [`leaf-contracts`](/en/api/contracts) | %LEAF_VERSION% | To declare an Action or Workflow. It is the only dependency required to define a module contract. |
| [`leaf-core`](/en/api/core) | %LEAF_VERSION% | In the host that runs Actions or opens Workflow sessions. |
| [`leaf-compose`](/en/api/compose) | %LEAF_VERSION% | In a Compose host that presents and observes Workflow UI. |
| [`leaf-visuals`](/en/api/visuals) | 1.4.0 | When a Compose app wants to use the optional LEAF visual theme. |
| [Payment Contracts](/en/api/payment-contracts) | 0.1.0 | To share provider-independent payment types such as amounts, orders, and statuses. |

## Domain modules

| Module | Documented version | Form | What it provides | What the host must provide |
| --- | --- | --- | --- | --- |
| [Login](/en/api/login) | 3.1.0 | Workflow; compatible Feature | A reference form and flow for authenticating a person. | `AuthGateway`, navigation, and secure credential handling. |
| [Authentication](/en/api/authentication) | 0.2.0 | Actions | Sign-in, challenge continuation, session restoration, and sign-out. | The authentication, storage, and network services required by its implementation. |
| [Catalog](https://github.com/OPSIDE-LEAF/leaf_catalog) | 1.1.1 | Feature | Configurable catalog, search, detail, and actions. | `CatalogGateway`, data, external navigation, and business actions. |
| [Email](https://github.com/OPSIDE-LEAF/leaf_email) | 1.1.1 | Action | Autonomous email delivery on Android and iOS. | SMTP configuration, sender, and recipients. |
| [Stripe](/en/api/payments) | 0.4.0 | Workflow | UI and states for completing a Stripe payment. | Backend, provider configuration, and SDK presentation when required. |
| [Mercado Pago](/en/api/payments) | 0.4.1 | Workflow | UI and states for completing a Mercado Pago payment. | Backend, provider configuration, and secure capture of the data required by the SDK. |

## Verified source releases

| Module or artifact | Source tag | Revision |
| --- | --- | --- |
| [Contracts](/en/api/contracts) | [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-contracts/tree/v3.1.0) | [`d864df4`](https://github.com/OPSIDE-LEAF/leaf-contracts/commit/d864df4) |
| [Core](/en/api/core) | [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-core/tree/v3.1.0) | [`97c683d`](https://github.com/OPSIDE-LEAF/leaf-core/commit/97c683d) |
| [Compose](/en/api/compose) | [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-compose/tree/v3.1.0) | [`b69b479`](https://github.com/OPSIDE-LEAF/leaf-compose/commit/b69b479) |
| [Visuals](/en/api/visuals) | [`v1.4.0`](https://github.com/OPSIDE-LEAF/leaf-visuals/tree/v1.4.0) | [`8031846`](https://github.com/OPSIDE-LEAF/leaf-visuals/commit/8031846) |
| [Login](/en/api/login) | [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v3.1.0) | [`edd0bf0`](https://github.com/OPSIDE-LEAF/leaf-login/commit/edd0bf0) |
| [Authentication](/en/api/authentication) | [`v0.2.0`](https://github.com/OPSIDE-LEAF/leaf_authentication/tree/v0.2.0) | [`5f3acda`](https://github.com/OPSIDE-LEAF/leaf_authentication/commit/5f3acda) |
| [Payment Contracts](/en/api/payment-contracts) | [`v0.1.0`](https://github.com/OPSIDE-LEAF/leaf-payment-contracts/tree/v0.1.0) | [`b1147d0`](https://github.com/OPSIDE-LEAF/leaf-payment-contracts/commit/b1147d0) |
| [Catalog](https://github.com/OPSIDE-LEAF/leaf_catalog) | [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_catalog/tree/v1.1.1) | [`414ef99`](https://github.com/OPSIDE-LEAF/leaf_catalog/commit/414ef99) |
| [Email](https://github.com/OPSIDE-LEAF/leaf_email) | [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_email/tree/v1.1.1) | [`232e521`](https://github.com/OPSIDE-LEAF/leaf_email/commit/232e521) |
| [Stripe](/en/api/payments) | [`v0.4.0`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v0.4.0) | [`8eea56e`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/8eea56e) |
| [Mercado Pago](/en/api/payments) | [`v0.4.1`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v0.4.1) | [`fc97be2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/fc97be2) |

A source tag fixes the code for a release. It does not by itself prove that the artifact is available from every Maven repository; check the repository configured by your organization before consuming it.

## How to choose and integrate

Use an Action when the module provides no UI. Use a Workflow for any module that provides UI, whether it has one screen or internal navigation across several screens. The host decides where to open it and uses its `Output` to determine the next step outside the module.

The versions in the table are independent because the artifacts do not have to be released at the same time. Before combining versions, check each artifact's API reference and the compatibility rules of the repository from which you obtain it.
