# Workflow

`Workflow<Input, State, Event, Effect, Output>` defines any module that provides UI. It receives starting data, publishes the state to present, accepts events, can request suspending work, and ends with a result. State can represent one screen or indicate which of several internal screens the module must present. Contracts defines these types and Core processes the session in order.

## Step and effect

Whenever a Workflow decides what comes next, it chooses exactly one of these three steps.

| Decision | Result |
| --- | --- |
| `continueWorkflow(state)` | publishes state and accepts another event |
| `emitEffect(state, effect)` | publishes state and requests one effect |
| `completeWorkflow(output)` | fixes the single successful outcome |

When you choose `Emit`, Core first publishes the state. It then calls `EffectHandler.handle` to do slow work, such as saving or contacting a service. That handler returns an event and Core sends it back to the reducer. While that work is pending, the screen must disable the action that would start another effect. Otherwise Core ends with `WorkflowOutcome.Failed(WorkflowFailureReason.SECOND_EFFECT_WHILE_PENDING)`.

## How it ends

Every flow ends in one of three ways. `WorkflowOutcome.Completed(output)` carries the business result, such as a saved counter. `Failed` reports a technical problem while starting, choosing a next step, running an effect, or requesting two effects at once. `Cancelled` means the screen or its coroutine left the flow before it finished. The app should show these cases differently and call `cancel()` only when it truly leaves an active session.

The [Workflow guide](/en/guide/workflow) explains how to start a session, present one or more screens, send events, and handle the final result from the host.
