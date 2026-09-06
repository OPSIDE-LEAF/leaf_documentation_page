# Roadmap

## Current train: %LEAF_VERSION%

Contracts, Core, Compose, and Login form the coordinated `3.0.0` release. Action and Feature are stable surfaces. Feature's major change is covered by the [migration guide](/en/guide/feature-migration).

Workflow ships in the train artifacts as a **provisional preview**. It retains `@ExperimentalLeafWorkflowApi`, requires opt-in, and gains no stability promise by sharing the `3.0.0` number. See its [guide](/en/guide/workflow) and [reference](/en/api/workflow).

Public Kotlin packages remain under `com.ops.leaf_core.api` and `com.ops.leaf_core.ui.compose`; `3.0.0` does not migrate the namespace.

## Distribution

Release workflows and builds are configured to publish and resolve one GitHub Packages repository per artifact. The configuration requires read credentials. A URL in Gradle does not prove that a version has already been published; the consumer must resolve the required coordinate.

The [installation guide](/en/guide/installation) lists all four train sources. A Maven server with anonymous reads remains a future option with no committed date.

## Later work

- Graduate Workflow only after an explicit stability decision and compatible evidence; until then its API may change.
- Migrate and validate Authentication, Email, Catalog, Stripe payment, and Mercado Pago payment against LEAF 3. Those modules remain independent lines observed on LEAF 2.0.1.
- Reconcile Catalog's declared `leaf-visuals:1.3.0` dependency with the local `1.0.0-alpha02` line before claiming compatibility or publication.
- Validate external Swift/iOS integration against the final release heads; local Kotlin/Native compilation does not replace that gate.

See the [catalog](/en/guide/catalog) to distinguish the release train from independent modules.
