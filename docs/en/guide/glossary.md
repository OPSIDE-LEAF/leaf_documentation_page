# Glossary

Workflow is official without opt-in in the local `%LEAF_WORKFLOW_VERSION%` Contracts, Core and Compose promotion. It is not published to GitHub Packages. See [Workflow](/en/guide/workflow).

| Term | Definition |
|---|---|
| **Module** | A local object that implements the `Module` interface, encapsulates its dependencies via constructor, and exposes typed capabilities. It is not a DI container and does not require registration. |
| **ModuleInfo** | Stable identity of a module: `ModuleInfo(id, version)`. Used in telemetry and errors. `id` and `version` cannot be blank. |
| **Capability** | A typed `val` property within a module: an `Action`, a `Feature`, or `Workflow`. |
| **Action** | `Action<Input, Output>` — a finite, typed, and cancellable operation: receives an input, executes, and returns an output. No observable state. |
| **Feature** | `Feature<Input, State, Event, Output>` — an interaction with observable state, user events, and a single terminal result. |
| **Transition** | A Feature's response to an event: `continueFeature(state)` publishes state without completing; `completeFeature(output)` produces the terminal result exactly once. |
| **Workflow** | Official API with synchronous reduction and suspending effects managed by Core. |
| **WorkflowStep** | Synchronous `Continue`, `Emit`, or `Complete` decision produced by `initialize` or `reduce`. |
| **Host** | An application (Android/iOS) or component that constructs modules, executes their capabilities, and retains navigation. |
| **FeatureSession** | A session owned by Core, created by `Leaf.open`: exposes `state`, `result`, and `metrics` as `StateFlow`, plus `send`, `cancel`, and `close`. |
| **Gateway (port)** | An interface declared within the module that models an external dependency (API, identity, payments). The implementation belongs to the host. |
| **Typed local route** | Current invocation model: the host calls capabilities with typed Kotlin references; type errors fail at compile time. |
| **Backpressure** | Event pressure handling: a Feature's queue is bounded (default 16, max 1,024) and `send` fails fast with `REJECTED_OVERFLOW` instead of suspending. |
| **Single terminality** | The guarantee that a session produces exactly one terminal result (`Completed`, `Cancelled`, or `Failed`); late events are rejected. |
| **Domain error** | An expected business result, modeled in the output type (e.g., `LoginResult`, `AuthResponse.InvalidCredentials`). Never an exception. |
| **Technical failure** | An unexpected error normalized to `LeafException` (redacted: exposes `moduleInfo`; operation is internal) or to a payload-free session reason. |
| **Payload-free telemetry** | A best-effort hook that receives only module identity, phase, duration, and technical result. Never input, state, event, output, throwable, or PII. |
| **Clean consumer** | A validation project that compiles the supported usage of a module against the candidate artifact. |
| **ABI validation** | Verification that the module's public surface does not change inadvertently (`checkKotlinAbi`). |
| **Structured cancellation** | The session is a child of the host's coroutine: if the host is cancelled, the session is cancelled. `CancellationException` is re-thrown. |
| **App Host** | A demo application that assembles Leaf modules to validate the model (e.g., `hostSimulator`, `leaf_test_app`). |
| **Open core** | The project's model: open core + advanced modules/commercial services. |
