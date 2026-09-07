# Build and integrate modules with AI

The `leaf-module-builder` skill brings together decisions and practices for using
LEAF from an idea or existing code through integration into a Host application.
It helps choose what to reuse, define contracts, implement logic and UI when
needed, and verify the result. It can guide you step by step or work autonomously
within the scope you provide.

## Download and use

[Download the complete skill ZIP](/downloads/leaf-module-builder.zip).
You can also <a href="/skills/leaf-module-builder/SKILL.md" target="_blank" rel="noopener">read the main file</a>.
The package includes references, a contract template and three Kotlin examples.
Keep the whole folder: the main file links to those resources.

Extract `leaf-module-builder` into the skills directory supported by your AI tool.
The location and activation depend on that tool. If it supports invoking skills
by name, use `$leaf-module-builder`; otherwise, ask it to read the downloaded
`SKILL.md` and the resources relevant to the task. Global installation is not required.

The skill is written in Spanish and instructs the AI to answer in the user's language.
It does not install dependencies or run code by itself: it provides instructions
that the tool follows with the files and permissions available.

## What you can ask it to do

| Need | What it helps resolve |
| --- | --- |
| Start from an idea | Choose capability, boundaries and acceptance criteria |
| Reuse existing code | Extract rules and replace app dependencies with injected capabilities |
| Create an Action | A finite operation without its own UI, with clear Input, Output and errors |
| Create a Workflow | Interaction, internal screens, effects and a result for the Host |
| Combine Actions and Workflows | Reuse operations without UI inside an interactive capability |
| Integrate with Android or iOS | Composition, presentation, lifecycle, results and sample consumers |
| Prepare for adoption | Tests, compatibility, security, documentation and agreed distribution |

The guide starts with minimal dependencies: Contracts is the only LEAF dependency
needed to implement an Action or Workflow. Core is added where sessions run,
Compose when that presentation is used, and Visuals if its visual design is wanted.
Other libraries depend on the problem being solved.

## Example requests

To build from an idea:

```text
Use $leaf-module-builder to create a reusable address selection module.
It must show a list and confirmation, allow going back and return the chosen address.
The Host supplies addresses and decides the next screen.
Implement the contract, logic and Android and iOS integration examples.
Use technologies compatible with this project and justify each dependency.
```

To combine logic and interaction:

```text
Use $leaf-module-builder to integrate our payment preparation and status Actions
into a checkout Workflow. Reuse the existing logic.
The Workflow should manage interaction and the Host decide what to do with its Output.
Include cancellation, duplicate submission prevention and pending status handling.
```

To adapt existing code:

```text
Use $leaf-module-builder to extract this Host capability into a reusable module.
Preserve its behavior and consumers. Identify coupling, define ports and migrate
one complete consumer with tests and integration instructions.
```

## Actions and Workflows together

You can offer reusable Actions without UI and a Workflow that uses them from its
effects. An application can then check a payment without opening a screen, or use
a full checkout that coordinates preparation, presentation and results.

The skill explains this pattern using Mercado Pago and Stripe, distinguishing
injected Actions from shared use cases. The included example is provider-neutral:
it does not charge payments or require a provider.

## What to check at completion

Ask for documented contracts, examples that use public APIs and evidence for the
platforms you need. The skill distinguishes compiled code, a running application
and verified provider integration. Tests reduce risk; they cannot guarantee the
absence of bugs or vulnerabilities.

Maven Local is an option for testing artifacts. Your team chooses deployment
architecture, CI, distribution repositories and shared or native UI.
Continue with [the module contract](/en/guide/module-contract) or
[integration with your app](/en/guide/host-integration).
