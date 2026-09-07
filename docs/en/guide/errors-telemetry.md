# Errors and telemetry

Not every difficult result is a technical error. For example, a declined quote can be a normal business answer and should appear in your own result type. An unexpected network problem is different.

An Action returns its business result. If a technical exception happens that is not cancellation, `Leaf.run` turns it into `LeafException`. A Workflow ends once with one of these options:

- `Completed(output)`: domain result.
- `Failed(reason)`: payload-free technical failure from initialization, reducer, handler, or a second pending effect.
- `Cancelled`: abandonment by the host or owning coroutine.

`LeafTelemetry` lets you observe when an Action or Workflow starts and finishes. It is only a diagnostic aid: if its callback fails, it does not change state, result, or session cleanup.

Do not send secrets, tokens, full backend responses, or sensitive identifiers to telemetry. Record only what is needed to understand a problem without exposing people's data.
