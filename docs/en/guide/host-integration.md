# What your app provides

The host app runs or presents the module and provides the external capabilities it requires. The module does not define how the application reaches the internet, stores data, or navigates outside its own UI. Before starting an Action or Workflow, define what each side provides.

| Situation | The host app supplies | The module delivers |
| --- | --- | --- |
| Action | valid data and a coroutine | a result or technical error |
| Workflow | starting data, a place to present it, and its lifecycle | UI, states, internal navigation, and a final result |
| Effect | a port that can do slow work | an event returned by the handler |
| External navigation | launch point and later destination | internal navigation and a typed `Output` for the decision |

Backend, storage, OAuth, SDKs, permissions, and telemetry are explicit parts of the host app. Pass them through clear ports instead of hiding them inside the module. This also lets you replace them with test versions when needed.

The host can open a Workflow from a route, button, notification, or any other suitable point. It does not need to control transitions between internal screens. When the Workflow ends, the host interprets its `Output`; for example, it can show a message, return to the previous screen, or navigate to another part of the application.

When handling completion, keep cases separate: `Failed` is a technical problem, not a business answer; `Cancelled` means the person or screen left the flow and must not be presented as success. Implement each port completely, including its error and cancellation cases.

Start with [Action](/en/guide/quickstart-action) when the module provides no UI. Use [Workflow](/en/guide/quickstart-workflow) for any module that provides UI.
