# Module catalog

This page distinguishes the LEAF 3 train from independent module code observed in the workspace. It describes source surfaces and declared versions; it does not confirm that a coordinate is available from a remote registry.

## LEAF 3.0.0 train

| Artifact | Coordinate | API in 3.0.0 | Repository |
|---|---|---|---|
| leaf-contracts | `com.opside-leaf:leaf-contracts:%LEAF_VERSION%` | Stable Action and Feature; preview Workflow contracts | [leaf-contracts](https://github.com/OPSIDE-LEAF/leaf-contracts) |
| leaf-core | `com.opside-leaf:leaf-core:%LEAF_VERSION%` | Stable Action/Feature runtime; preview Workflow session | [leaf-core](https://github.com/OPSIDE-LEAF/leaf-core) |
| leaf-compose | `com.opside-leaf:leaf-compose:%LEAF_VERSION%` | Stable Feature adapter; preview Workflow holder | [leaf-compose](https://github.com/OPSIDE-LEAF/leaf-compose) |
| leaf-login | `com.opside-leaf:leaf-login:%LEAF_VERSION%` | Stable Feature/UI and opt-in Login Workflow/UI | [leaf-login](https://github.com/OPSIDE-LEAF/leaf-login) |

Workflow retains `@ExperimentalLeafWorkflowApi` even though it ships inside the stable train. See the [Workflow guide](/en/guide/workflow).

## Independent lines observed

These modules are not part of the `3.0.0` release. Their observed builds still declare Contracts/Core `2.0.1` where applicable.

| Module | Declared version | Observed surface | Workspace-backed status |
|---|---|---|---|
| Authentication | `0.1.0` | `signIn`, `continueChallenge`, `restoreSession`, `signOut`, and `accessTokens` | Typed KMP implementation with a `LOCAL_FAKE` factory. It no longer uses the legacy registry. |
| Email | `1.0.0` | `EmailModule.send: Action<EmailInput, EmailResult>` | Multiplatform implementation and native SMTP appear on `origin/main` after fetch; the local checkout is behind. |
| Catalog | `1.0.0` | `CatalogModule.browse: Feature<...>`, Compose UI, and DSL | The implementation appears on `origin/main` after fetch; the local checkout is two commits behind. |
| Stripe payment | `0.1.0` | `createOrReplay` and `observe` Actions | `LOCAL_FAKE` PoC; it does not prove a real Stripe integration, SDK, tokenization, or charge. |
| Mercado Pago payment | `0.1.0` | `createOrReplay` and `observe` Actions | `LOCAL_FAKE` PoC; it does not prove a real Mercado Pago integration, SDK, tokenization, or charge. |
| LeafVisuals | local `1.0.0-alpha02` | Optional Compose provider and `LeafVisualsMaterialTheme` | Local/Maven Local evidence; remote publication was not verified. |

The observed Catalog `origin/main` declares `leaf-visuals:1.3.0`, while the local LeafVisuals repository is at `1.0.0-alpha02`. This documentation makes no compatibility or availability claim between those versions.

::: warning Compatibility across lines
Authentication, Email, Catalog, and payment modules were not promoted with this train. Before combining them with LEAF 3, migrate their dependency and Feature vocabulary where applicable, then run their consumers. The [Feature migration](/en/guide/feature-migration) covers the renamed API.
:::

## Previous architecture history

The dynamic registry belongs to LEAF 1.x. Authentication and Catalog have later typed implementations in the workspace, so they must no longer be listed as legacy modules awaiting migration. The [historical 1.x to 2.0.1 guide](/en/guide/legacy-migration) preserves that context.

## Configured package repositories

Train projects configure one GitHub Packages repository per artifact:

```text
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-contracts
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-core
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-compose
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-login
```

The common Group ID is `com.opside-leaf`. Publication configuration is not proof of availability; verify the coordinate in your build.
