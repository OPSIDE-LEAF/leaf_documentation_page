# Historical migration: LEAF 1.x to 2.0.1

::: info Historical scope
This page preserves the transition that removed the dynamic registry in LEAF 2.0.1. Its `stay` / `finish` examples deliberately belong to that version and are not the `3.0.0` Feature API. For current code use the [Feature 2 to 3 migration](/en/guide/feature-migration).
:::

## What changed between Leaf 1.x and Leaf 2.x

The previous architecture was based on a **dynamic registry**: modules were installed into the Core and invoked indirectly. Leaf 2.x replaces it with the **typed local route**:

| | Legacy (1.x) | Leaf 2.x |
|---|---|---|
| Invocation | Registry + dynamic resolution | Direct, typed Kotlin reference |
| Payloads | Maps / generic payloads | Domain types (`Input`, `State`, `Event`, `Output`) |
| Integration errors | Runtime | **Compile-time** |
| Module installation | Required | Does not exist: the host constructs the module |
| Sessions | Manual | `FeatureSession` managed by Core |

In 2.x the following are prohibited on the local route: `Map<String, Any?>`, generic payloads, codecs, unchecked casts, registry, installation, and manual invocation.

## Later status observed

| Module | Later package | Status observed in the workspace |
|---|---|---|
| leaf-authentication | `com.ops.leaf_authentication` | Typed Action implementation `0.1.0` on LEAF 2.0.1. |
| leaf-email | `com.opside.leaf.email` | Action implementation `1.0.0` observed on fetched `origin/main`. |
| leaf-catalog | `com.opside.leaf.catalog` | Feature/UI/DSL implementation `1.0.0` observed on fetched `origin/main`. |

::: warning Do not mix this syntax with LEAF 3
The later implementations declare LEAF 2.0.1 and were not part of the 3.0.0 release. Migrate and validate each consumer before combining lines.
:::

## Migration strategy

This was the strategy used to reach the 2.0.1 model:

1. **Create the 2.x repository** as an independent Gradle project with ABI validation.
2. **Model the domain with types**: replace generic payloads with `Input`, `State`, `Event`, and `Result` (`sealed interface` for events and results).
3. **Convert services into ports**: each external dependency becomes an interface (gateway) whose implementation is provided by the host.
4. **Rewrite the capability**: the handling logic becomes an `Action` (finite operation) or a `Feature` with `stay`/`finish` transitions.
5. **Move business errors to the output type**: what was previously an exception or error code becomes a variant of `Result`.
6. **Remove the registry**: delete any installation/lookup; the host constructs the module via constructor.
7. **Add UI Route/Screen** if the module has an interface.
8. **Tests + ABI + clean consumer** before publishing ([validation and publishing](/en/guide/module-publishing)).

## Authentication as a didactic example

An authentication without an interactive form can migrate to an `Action`:

```kotlin
class AuthenticationModule(
    private val gateway: AuthenticationGateway,
) : Module {
    override val info = ModuleInfo(
        id = "com.example.authentication",
        version = "1.0.0",
    )

    val authenticate = action<AuthenticationRequest, AuthenticationResult>(
        moduleInfo = info,
    ) { request ->
        gateway.authenticate(request.email, request.secret)
    }
}
```

::: info Didactic example
This historical example shows the LEAF 2.0.1 boundary; it does not describe the observed Authentication implementation or production-grade authentication. In production, add secure transport, credential protection, attempt limits, and identity provider policies: LEAF does not deliver those guarantees on its own.
:::
