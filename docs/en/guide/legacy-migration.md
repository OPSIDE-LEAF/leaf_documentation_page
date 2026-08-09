# Migration from the legacy architecture

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

## Modules pending migration

| Module | Package | Notes |
|---|---|---|
| leaf-authentication | `com.ops.authentication` | Uses Core `1.0` and the old registry. **Incompatible with LEAF 2.** |
| leaf-email | `com.ops.email` | Previous architecture |
| leaf-catalog | `com.ops.catalog` | Previous architecture |

::: warning Do not mix release trains
Do not combine legacy modules with artifacts from the stable `%LEAF_VERSION%` release train in the same host. Migrate the module first.
:::

## Migration strategy

`leaf_login` is the reference for the target model. To migrate a legacy module:

1. **Create the 2.x repository** following the [Author setup](/en/guide/module-setup) (independent repo, Gradle, ABI).
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
This example shows LEAF's boundary; it is not a migration of the legacy `leaf-authentication` module nor a production-grade authentication. In production, add secure transport, credential protection, attempt limits, and identity provider policies — LEAF does not deliver those guarantees on its own.
:::
