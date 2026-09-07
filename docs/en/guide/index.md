# Understand Leaf

LEAF %LEAF_VERSION% separates module rules from the infrastructure of a Kotlin application. Contracts defines types, Core runs Actions and Workflow sessions, and Compose connects a Workflow to its UI. The module controls its rules and, when it provides UI, its screens and internal navigation. The host app provides network, storage, and other external capabilities; it also decides where to open the module and what to do with its result.

## What LEAF is

Many applications need the same kinds of capabilities: authentication, payments, forms, validation, search, or data selection. Reimplementing them in every project takes time and forces teams to solve the same errors, tests, and security decisions repeatedly.

LEAF lets a complete capability be encapsulated in a module with a clear contract. After that module is built and tested, it can be integrated into more than one application. The team spends less time repeating known work and can deliver the product-specific features that create value sooner.

The name LEAF represents this idea. Each module is a reusable **leaf**. The host app is the **trunk** that connects the leaves, provides their infrastructure, and decides how they fit into the product. Together they form the tree: an application composed of independent modules that collaborate through public contracts.

Reuse does not mean trusting a module without checking it. A module should keep its tests, versions, security review, and integration checks. By placing common logic in one location, a correction or improvement can benefit every application that adopts an updated module version.

## Recommended sections

1. [Concepts](/en/guide/architecture): learn what each part does and when to choose Action or Workflow.
2. [Integrate](/en/guide/installation): add the required dependencies and use an Action or Workflow in your app.
3. [Build](/en/guide/module-contract): define the contract, implement the rules, and test the module.
4. [Evaluate](/en/project/): review responsibilities and decide whether the architecture fits your product.

Use an Action for a finite operation that does not require UI. Use a Workflow whenever the module requires UI, whether that UI contains one screen or internal navigation across several screens. See [Action vs Workflow](/en/guide/action-vs-workflow) for the complete differences.
