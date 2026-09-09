# Evaluate adoption

LEAF can fit when an organization wants to turn common capabilities into reusable modules without forcing every application to use the same network, UI, or storage. The host app keeps those decisions, and each project chooses how to integrate, test, and distribute modules.

Adopting LEAF does not replace product, backend, security, or observability decisions. A Workflow controls the internal navigation of its UI; the host keeps external navigation and decides what happens after the result.

## Value from reuse

| Without a reusable module | With a prepared LEAF module |
| --- | --- |
| Each project implements a common capability again. | The project integrates a capability through a known contract. |
| The same rules and errors are tested separately in every application. | Rules are tested in the module and the host checks its integration. |
| A correction must be repeated across several implementations. | The correction is centralized in the module and distributed through a new version. |
| Project startup spends time solving known functions. | The team can focus sooner on product-specific features. |

This reuse can shorten delivery time and create value sooner, but it depends on the quality of the catalog. Each module needs one clear responsibility, sufficient tests, controlled versions, and security reviews that match its risk. LEAF provides the structure for reuse; it does not replace those practices.

## Questions for the team

| Question | What is useful to make clear |
| --- | --- |
| Action or Workflow? | Action for an operation without UI; Workflow for any module with UI |
| What does the host app supply? | network, storage, SDKs, OAuth, permissions, launch point, and external navigation |
| What does the module keep? | business rules, results, and, for a Workflow, UI and internal navigation |
| How is it checked? | module tests, a consuming application, and the targets the project intends to support |

Start with [architecture](/en/guide/architecture), define [the contract](/en/guide/module-contract), and select the integration, testing, and distribution strategy that fits your product.
