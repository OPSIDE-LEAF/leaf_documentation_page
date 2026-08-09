# Author: validation and publishing

Before publishing, the module passes three validations: tests, ABI, and clean consumer.

## 1. ABI validation

Every publishable module includes `abiValidation`. The dump in `api/` is the committed public surface:

```shell
./gradlew checkKotlinAbi     # verifies that the surface has not changed
./gradlew updateKotlinAbi    # regenerates the dump (first time or intentional change)
```

An unintentional ABI change breaks consumers: if `checkKotlinAbi` fails, consciously decide whether it warrants a major version bump.

## 2. Clean consumer

The consumer is a **non-publishable** Android app that compiles the supported usage of the module as a real dependency:

```
consumer/
└── android-clean-consumer/
    ├── build.gradle.kts
    └── src/
        ├── androidMain/    → MainActivity, manifest, styles
        └── commonMain/     → Consumer<Module>Host.kt
```

The example host owns the infrastructure adapter (fake) and the post-completion action:

```kotlin
class FakeGateway : PaymentGateway {
    override suspend fun execute(param: String): PaymentResponse =
        PaymentResponse.Success(id = "fake-id")
}

@Composable
fun ConsumerCheckoutHost(
    onSuccess: (CheckoutResult.Success) -> Unit,
) {
    val module = remember { CheckoutModule(FakeGateway()) }
    CheckoutRoute(
        module = module,
        input = CheckoutInput(),
        onSuccess = onSuccess,
    )
}
```

Enable it in `settings.gradle.kts`:

```kotlin
include(":consumer")
project(":consumer").projectDir = file("consumer/android-clean-consumer")
```

## 3. Full validation

```shell
# Tests + ABI + local publishing
./gradlew testDebugUnitTest checkKotlinAbi publishToMavenLocal -Pleaf.useMavenLocal=true

# The consumer compiles against the local artifact
./gradlew :consumer:assembleDebug -Pleaf.useMavenLocal=true --refresh-dependencies
```

If both pass, the candidate artifact is consumable exactly as hosts will receive it.

## 4. First commit

```shell
git init
git add .
git commit -m "feat: initial module setup"
git remote add origin git@github.com:<OWNER>/leaf-<modulo>.git
git push -u origin main
```

`<OWNER>` is your GitHub user or organization (e.g. `my-user`, `my-org`, `OPSIDE-LEAF`). The repository can be in any account -- it does not need to belong to OPSIDE-LEAF.

## 5. Tag-based publishing

Publishing occurs **exclusively** from a `v<version>` tag that matches the Gradle catalog version (`libs.versions.toml`):

```shell
git tag v0.1.0
git push origin v0.1.0
```

CI/CD (GitHub Actions) runs tests, validates ABI, and publishes to the Maven repository configured in `build.gradle.kts`. Credentials (`GPR_USER` / `GPR_GIT_KEY` for GitHub Packages, or whichever ones correspond to your Maven server) must be set as secrets in the repo.

::: info Publishing destination
The destination is defined by the URL in `publishing.repositories.maven` in your `build.gradle.kts`. It can be the module's own repo, a centralized distribution repo, or any compatible Maven server. See the options in [repository setup -- Where do I publish my artifacts?](/en/guide/module-setup).
:::

::: warning Tag <-> catalog
If the tag does not match `leaf-<module>` in `libs.versions.toml`, publishing must not proceed. Versioning is semantic and independent per module.
:::

## Author checklist

```
- [ ] Domain models (Input, State, Event, Result) defined
- [ ] Ports/gateways as interfaces; no infrastructure implementations in the module
- [ ] Module with stable, non-empty ModuleInfo
- [ ] Unit tests in commonTest passing
- [ ] checkKotlinAbi green (or conscious updateKotlinAbi)
- [ ] Clean consumer compiles against the local artifact
- [ ] README, LICENSE, CHANGELOG, CONTRIBUTING, SECURITY present
- [ ] local.properties excluded from repo (.gitignore)
- [ ] Tag v<version> == libs.versions.toml
```
