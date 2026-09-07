# Implement Action or Workflow

Start from the [contract](/en/guide/module-contract). Before writing logic, name the data that comes in, the outcomes that go out, and the small services the app must provide. This makes code easier to test and explain.

## Action without UI

An Action keeps one complete operation in one place. Its constructor receives only the port it needs and returns a type that represents the business result. Do not add Compose, Visuals, or a session just to solve a task that can answer once.

## Workflow with UI

A Workflow names five things: `Input` to start, `State` for what the screen shows, `Event` for actions, `Effect` for slow work, and `Output` for the final result. `initialize` validates or creates the first state. `reduce` immediately decides whether to continue, request an effect, or finish. `EffectHandler` is the only place that uses capabilities which can take time.

If the module has several screens, `State` can also indicate which one to show and contain the data required by that screen. Events change that state and let the Workflow control its internal navigation. The host does not coordinate those transitions: it opens the Workflow from any suitable point and uses the final `Output` to show a message, go back, or navigate elsewhere in the application.

Keep sensitive data out of `State` when the screen should not be able to show it. State is a description for UI, not a store for secrets.

| Topic | Module | Host app |
| --- | --- | --- |
| Domain, reducer, and types | defines and tests them | uses the public API |
| Network, SDK, vault, and permissions | asks for a small port | implements and provides it |
| UI and internal navigation | defines screens and transitions through state and events | provides the place and lifecycle used to present them |
| External navigation | emits a typed result | chooses destination after completion |
| Cancellation | does not create duplicate work | cancels the session when leaving |

The Route connects a Workflow to its screens. Continue with [Route + Screen](/en/guide/compose-route-screen) to separate lifecycle, internal screen selection, and the UI that is drawn.
