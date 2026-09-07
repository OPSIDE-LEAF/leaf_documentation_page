# Architecture: who does what

| Layer | Handles | Does not handle |
| --- | --- | --- |
| Contracts | types and public functions | sessions, network, or UI |
| Core | running Actions and managing Workflow sessions, events, effects, and outcomes | module business rules or UI |
| Compose | connecting a Workflow session to Compose UI | business rules or the app's external navigation |
| Module | business rules and, for a Workflow, its UI and internal navigation | app infrastructure or navigation outside the module |
| Host app | network, storage, lifecycle, launch point, and external navigation | the reducer or internal module transitions |

The main rule is that a module must not depend on details specific to one application. The application uses its public API and provides required external capabilities through ports, such as backend access, SDKs, OAuth, storage, or permissions.

An Action provides no UI. Any module that provides UI is a Workflow, even when it has only one screen. The Workflow can control several screens and their internal transitions. The host decides where to open it and, after receiving its `Output`, determines the application's next step.

This separation lets teams test business rules without real services and prevents a module from depending on a specific host architecture. [The module contract](/en/guide/module-contract) explains what to define before implementation.
