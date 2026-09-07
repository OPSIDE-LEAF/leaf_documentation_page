# Module contract

Define the contract before choosing dependencies or implementing the UI. Specify the data the module receives, the result it returns, and the capabilities the host app must provide. The module implements business rules; the host app integrates infrastructure, external navigation, and initial data.

| Part | Explain clearly |
| --- | --- |
| Required data | what it is, its format, and what happens when it is missing or invalid |
| Optional data | its default, what absence means, and when it stops being optional |
| App capabilities | which interface is injected, what it can return or fail with, and how long it may take |
| Public API | Action: input and output; Workflow: input, state, event, effect, and output |
| Responsibilities | what the module keeps and who cancels or cleans up the flow |

## Choose the facade

- Choose `Action<Input, Output>` for a finite operation that does not require UI.
- Choose `Workflow<Input, State, Event, Effect, Output>` for any module that requires UI. It may represent one screen or internal navigation across several screens.

Do not inject a global container with every application service into a Workflow. Define small ports for each required capability. `EffectHandler` receives an `Effect`, uses the corresponding port, and returns an `Event` to the reducer.

If a negative answer is a normal business case, express it as an event or typed result. Let technical problems end the session as a Core failure.

When the contract is defined, continue with [implementation](/en/guide/module-implementation).
