# Glossary

## Contracts

| Term | Meaning |
| --- | --- |
| Action | a typed operation that receives data and returns an answer; executed with `Leaf.run()` |
| Workflow | a typed interaction with state, synchronous reduction, and runtime-owned effects |
| `WorkflowStep` | the synchronous decision a Workflow produces: `Continue`, `Emit`, or `Complete` |
| Effect | asynchronous work a Workflow requests via `WorkflowStep.Emit` |
| `EffectHandler` | the functional interface that executes an Effect and returns the resulting event to the reducer |
| Outcome | the terminal answer of a Workflow: completed, failed, or cancelled (`WorkflowOutcome`) |
| Port | an interface through which the app provides network, storage, or another service |
| `Module` | the interface that encapsulates dependencies and publishes typed capabilities through its `ModuleInfo` |
| `ModuleInfo` | stable identity of a module: `id` + `version` |

## Runtime

| Term | Meaning |
| --- | --- |
| `Leaf` | runtime entry point; `Leaf.run()` executes an Action, `Leaf.open()` opens a Workflow or Feature |
| Session | the running instance Core manages: `WorkflowSession` exposes `states`, `send()`, and `awaitOutcome()`; `FeatureSession` exposes `state`, `send()`, and `result` |
| `LeafException` | redacted technical error that reports module and operation without exposing domain payloads |
| `LeafTelemetry` | functional interface for observing technical execution data (module, phase, duration, result); callbacks are best-effort and do not affect execution |

## Compose

| Term | Meaning |
| --- | --- |
| `rememberLeaf()` | composable function that opens and observes a Feature for the composition lifetime |
| `rememberLeafWorkflowHolder()` | composable function that opens and observes a Workflow for the composition lifetime |
| `LeafComposeState` | observable Compose view (`@Stable`) of a Feature session; exposes `state`, `result`, and `send()` |
| Holder | stable Compose view (`@Stable`) of a Workflow session (`LeafWorkflowHolder`); exposes `snapshot`, `outcome`, and `send()` |
| `WorkflowSnapshot` | Compose-facing Workflow state: `Initializing` before the first state, `Active(state)` after |

## Visuals

| Term | Meaning |
| --- | --- |
| `LeafVisuals` | immutable Material 3 values (colors, typography, shapes) the host delivers to modules via `ProvideLeafVisuals` |
| `ThingsLeafTheme` | wrapper that applies the LEAF Things visual identity (green/lime, editorial serif, asymmetric shapes) in a single call |

## Infrastructure

| Term | Meaning |
| --- | --- |
| Gateway | interface that abstracts a native platform service; each module defines its own (e.g. `EmailGateway`, `CatalogGateway`, `MercadoPagoCardGateway`, `StripePaymentGateway`) |
| Maven Local | a local folder from which artifacts are tested |

These terms describe the API and runtime. Artifact distribution and third-party service configuration are separate application decisions.
