# Action vs Workflow

The selection rule is direct:

- Use an **Action** for a finite operation that provides no UI.
- Use a **Workflow** for any module that provides UI, even if it has only one screen.

Module size does not change this rule. A complex operation without UI is still an Action. A simple screen is still a Workflow.

| Need | LEAF option |
| --- | --- |
| Receive an input, run an operation without UI, and return an output | `Action<Input, Output>` |
| Show UI, keep interaction state, receive events, or manage one or more screens | `Workflow<Input, State, Event, Effect, Output>` |

## When to use Action

An Action represents an operation that starts, does its work, and ends with a result. The application runs it with `Leaf.run` and waits for its output. It does not open a UI session or publish intermediate states for drawing a screen.

For example, an Action can validate data, calculate a quote, save a record, or request information from a service. The application decides whether to show progress, a message, or any other UI around that operation; that UI belongs to the host, not to the Action.

## When to use Workflow

A Workflow represents a module with UI. It opens a Core session and defines:

- the state the UI must show;
- the events that a person or the system can send;
- the effects that perform suspending work, such as saving or calling a service;
- the final output received by the host.

`initialize` produces the first step. `reduce` receives the current state and an event to decide the next step. `EffectHandler` performs suspending work and returns a new event to the Workflow.

A Workflow can have one screen or a complete internal navigation flow. For example, its state can indicate whether to show a list, a form, or a confirmation. The module controls transitions between those screens; the host does not need to coordinate every internal step.

The host can open the Workflow from any convenient point: a route, a button, a notification, or another screen. When it finishes, the Workflow returns a typed `Output`. The host uses that output to decide what happens outside the module, such as showing a message, returning to a previous screen, or navigating to another application screen.

## Responsibility split

The module defines its input, state, event, effect, and result types. It also controls its UI and internal navigation.

The host supplies the external capabilities needed by the module, such as network, storage, or SDK access. It also decides where to open the Workflow and what to do with its output. Core keeps events ordered, runs effects, and closes the session when it completes, fails, or is cancelled.

To implement an operation without UI, continue with [running an Action](/en/guide/quickstart-action). To implement any module with UI, continue with [opening a Workflow](/en/guide/quickstart-workflow).
