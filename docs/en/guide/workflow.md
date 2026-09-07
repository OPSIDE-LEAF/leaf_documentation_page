# Workflow in depth

Use Workflow for any module that provides UI. It can contain one screen or a flow with several screens and internal navigation. LEAF %LEAF_VERSION% keeps state, processes events in order, runs effects, and returns a final result to the host.

## Session lifecycle

1. The host calls `Leaf.open(workflow, input)` from a coroutine with a `Job`.
2. Core calls `initialize` with the input. The Workflow returns its first state, requests an effect, or completes immediately.
3. The UI observes `states` and calls `send` when an interaction or system event occurs.
4. Core gives each event and the current state to `reduce`.
5. `Continue` publishes a new state. `Emit` publishes the state and requests an effect. `Complete` ends the session with an output.
6. For `Emit`, Core calls `EffectHandler.handle(effect)`. When the work finishes, the handler returns an event and Core sends it back to `reduce`.
7. The host receives `WorkflowOutcome.Completed`, `WorkflowOutcome.Failed`, or `WorkflowOutcome.Cancelled`.

## Navigation inside and outside the Workflow

Navigation between the module's own screens belongs to the Workflow. State can include a current screen, a stage, or the data needed to decide which content to show. When an event changes that value, the UI displays the next screen without asking the host to coordinate the step.

The host controls external navigation. It can open the Workflow from any suitable point in its application, such as a route, a button, a notification, or the result of another module. When the Workflow completes, its `Output` communicates the result without prescribing how the application must react.

The host interprets that output and decides the next step. It can show a message, close a modal, return to the previous screen, open another host screen, or start another module. This keeps the module responsible for its internal flow and the host responsible for the complete application.

## Event admission

`send` does not wait for the event to be processed. It returns one of these results:

- `ACCEPTED`: Core received the event.
- `REJECTED_OVERFLOW`: the queue is full, but the session is still active.
- `REJECTED_CLOSED`: the session already ended or was cancelled.

Do not automatically send a rejected event again. Before deciding whether to retry it, check the current UI state and the intent of the interaction.

## Effects and failures

While an effect is pending, prevent the UI from requesting another effect. For example, disable Save while saving. If the Workflow requests two effects at the same time, the session ends with `SECOND_EFFECT_WHILE_PENDING`.

Expected domain results should be represented with typed events, states, or outputs. Use `WorkflowFailureReason` for technical problems while initializing, reducing an event, or running an effect. See the [Workflow reference](/en/api/workflow) for all available reasons.
