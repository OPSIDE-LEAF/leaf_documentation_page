# Roadmap

## Current stable release train: %LEAF_VERSION%

The stable coordinates are `leaf-contracts:%LEAF_VERSION%`, `leaf-core:%LEAF_VERSION%`, and `leaf-compose:%LEAF_VERSION%`, with `leaf-login:1.0.0` as the reference module.

## Distribution

Today artifacts are distributed via **GitHub Packages**, which requires a PAT with `read:packages` even for public packages (a limitation of GitHub's Maven registry — no anonymous access). The plan is to migrate to a **self-hosted Maven server** with anonymous read access: Hosts will consume without credentials and the token will remain on the publishing side only. In the meantime, apply the [dual credentials pattern](/en/guide/installation).

## In progress

- **leaf-visuals** — shared visual design system (early development).
- **Payment modules** — `leaf-mp-payments` and `leaf-stripe-payments` will evolve from stubs to real integrations (Mercado Pago for the local market, Stripe for the international market).
- **Legacy module migration** — email, authentication, and catalog to the typed 2.x model ([guide](/en/guide/legacy-migration)).

## LEAF 3 (future)

- **Workflow** — a new capability for orchestrating multi-step flows, with `WorkflowSession`, runtime-owned effects, and its own Compose adapter. This will be a LEAF 3 feature; see details below.
- **Namespace migration** — the historical packages `com.ops.leaf_core.api` and `com.ops.leaf_core.ui.compose` will be maintained throughout LEAF 2 for binary compatibility; their migration is reserved for LEAF 3.

### Workflow

`Workflow` will be the third capability type in the ecosystem, designed for interactions that neither `Action` (finite operation) nor `Feature` (stateful interaction) cover today: multi-step flows with runtime-managed effects. It will have `WorkflowSession` and its own Compose adapter — **it is not a transparent evolution of `Feature`**, but a distinct contract.

::: warning Status: experimental, outside the %LEAF_VERSION% release train
While under development, `Workflow` lives behind `@ExperimentalLeafWorkflowApi` (staging `0.0.0-leaf3-experiment.1`) and is not part of the stable release train:

- Do not combine `Workflow` contracts (`rememberLeafWorkflowHolder`, etc.) with the 2.x modules and hosts from this documentation.
- Evaluate it only in an **isolated** branch, module, and consumer, with explicit opt-in and your own validation.
- Do not change the stable coordinates %LEAF_VERSION% or present experimental evidence as a stable release.
:::
