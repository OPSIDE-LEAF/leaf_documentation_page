# Installation

## Prerequisites

| Requirement | Detail |
|---|---|
| JDK | 11+ |
| Gradle | 8.14.3 (via wrapper) |
| Kotlin | 2.3.20 |
| Android SDK | compileSdk 36, minSdk 24 |
| Xcode | For iOS targets (Arm64, Simulator Arm64) |
| GitHub PAT | Classic token with `read:packages` (consume) and `write:packages` (publish) |

## 1. Configure credentials

Artifacts are distributed via GitHub Packages, which requires authentication even for reads (a limitation of GitHub's Maven registry, even with public repos). This is the current stage: the [roadmap](/en/guide/roadmap) plans to migrate to a self-hosted Maven server with anonymous reads. In the meantime, Leaf uses a **dual** credential pattern:

1. **Local development** — `local.properties` (not committed)
2. **CI/CD** — environment variables `GPR_USER` and `GPR_GIT_KEY`

Create `local.properties` in the project root:

```properties
gpr.user=YOUR_GITHUB_USERNAME
gpr.key=YOUR_PERSONAL_ACCESS_TOKEN
```

::: danger Never commit credentials
`local.properties` must always be in `.gitignore`. Never hardcode username or token in versioned files.
:::

## 2. Configure repositories

In `settings.gradle.kts`:

```kotlin
import java.io.FileInputStream

val localProperties = java.util.Properties()
val localPropertiesFile = File(rootDir, "local.properties")
if (localPropertiesFile.exists()) {
    localProperties.load(FileInputStream(localPropertiesFile))
}

dependencyResolutionManagement {
    repositories {
        if (providers.gradleProperty("leaf.useMavenLocal").orNull == "true") {
            mavenLocal()
        }
        listOf("leaf-contracts", "leaf-core", "leaf-compose").forEach { repository ->
            maven {
                name = "GitHubPackages-$repository"
                url = uri("https://maven.pkg.github.com/OPSIDE-LEAF/$repository")
                credentials {
                    username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER")
                    password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_GIT_KEY")
                }
                content { includeGroup("com.opside-leaf") }
            }
        }
        google()
        mavenCentral()
    }
}
```

## 3. Add dependencies

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            api("com.opside-leaf:leaf-contracts:%LEAF_VERSION%")
            implementation("com.opside-leaf:leaf-core:%LEAF_VERSION%")    // Only if you need Leaf.run/open
            implementation("com.opside-leaf:leaf-compose:%LEAF_VERSION%") // Only if you have Compose UI
        }
    }
}
```

| Coordinate | Contents | When you need it |
|---|---|---|
| `com.opside-leaf:leaf-contracts:%LEAF_VERSION%` | `Module`, `ModuleInfo`, `Action`, `Feature`, DSLs | Always (as `api` if you expose Leaf types) |
| `com.opside-leaf:leaf-core:%LEAF_VERSION%` | `Leaf.run`, `Leaf.open`, `FeatureSession` | Hosts that execute capabilities |
| `com.opside-leaf:leaf-compose:%LEAF_VERSION%` | `Leaf.rememberLeaf` | Hosts with Compose UI |
| `com.opside-leaf:leaf-login:1.0.0` | Reference module (login Feature + UI) | Optional |

::: tip leaf-contracts as an `api` dependency
If your module exposes Leaf types in its public surface (the usual case), use `api("com.opside-leaf:leaf-contracts:...")` so that your consumers can resolve them.
:::

## 4. Maven Local (development)

To test artifacts without publishing them, the projects support `mavenLocal()` conditionally via the property `leaf.useMavenLocal=true`:

```shell
./gradlew publishToMavenLocal -Pleaf.useMavenLocal=true
./gradlew :consumer:assembleDebug -Pleaf.useMavenLocal=true --refresh-dependencies
```

## Verify

```shell
./gradlew build
```

If dependency resolution fails with 401/403, check that the PAT has `read:packages` and that `local.properties` is in the correct root.

## Next step

Your first module: [Quickstart with Action](/en/guide/quickstart-action).
