# Glossary

| Term | Definition |
|---|---|
| **Module** | A local object that implements the `Module` interface, encapsulates its dependencies via constructor, and exposes typed capabilities. It is not a DI container and does not require registration. |
| **ModuleInfo** | Stable identity of a module: `ModuleInfo(id, version)`. Used in telemetry and errors. `id` and `version` cannot be blank. |
| **Capability** | A typed `val` property within a module: an `Action` or a `Feature`. |
| **Action** | `Action<Input, Output>` — a finite, typed, and cancellable operation: receives an input, executes, and returns an output. No observable state. |
| **Feature** | `Feature<Input, State, Event, Output>` — an interaction with observable state, user events, and a single terminal result. |
| **Transition** | A Feature's response to an event: `stay(state)` publishes new state without finishing; `finish(output)` produces the terminal result exactly once. |
| **Host** | An application (Android/iOS) or component that constructs modules, executes their capabilities, and retains navigation. |
| **FeatureSession** | A session owned by Core, created by `Leaf.open`: exposes `state`, `result`, and `metrics` as `StateFlow`, plus `send`, `cancel`, and `close`. |
| **Gateway (port)** | An interface declared within the module that models an external dependency (API, identity, payments). The implementation belongs to the host. |
| **Typed local route** | Leaf 2.x invocation model: the host calls capabilities with typed Kotlin references; type errors fail at compile time. |
| **Backpressure** | Event pressure handling: a Feature's queue is bounded (default 16, max 1,024) and `send` fails fast with `REJECTED_OVERFLOW` instead of suspending. |
| **Single terminality** | The guarantee that a session produces exactly one terminal result (`Finished`, `Cancelled`, or `Failed`); late events are rejected. |
| **Domain error** | An expected business result, modeled in the output type (e.g., `LoginResult`, `AuthResponse.InvalidCredentials`). Never an exception. |
| **Technical failure** | An unexpected error normalized to `LeafException` (redacted: only exposes `moduleInfo` and operation) or to `FeatureTechnicalFailure` in sessions. |
| **Payload-free telemetry** | A best-effort hook that receives only module identity, phase, duration, and technical result. Never input, state, event, output, throwable, or PII. |
| **Clean consumer** | A validation project that compiles the supported usage of a module against the candidate artifact. |
| **ABI validation** | Verification that the module's public surface does not change inadvertently (`checkKotlinAbi`). |
| **Structured cancellation** | The session is a child of the host's coroutine: if the host is cancelled, the session is cancelled. `CancellationException` is re-thrown. |
| **App Host** | A demo application that assembles Leaf modules to validate the model (e.g., `hostSimulator`, `leaf_test_app`). |
| **Open core** | The project's model: open core + advanced modules/commercial services. |
