# Creating a module: repository setup

A Leaf module is a **standalone repository** that exposes typed capabilities consumable by any Android/iOS host. This guide covers the infrastructure; the [code implementation](/en/guide/module-implementation) comes next.

::: tip Reference
`leaf_login` is the complete, validated reference module. For any questions about structure or configuration, check its code.
:::

## 1. Create the repository

- Repository in your GitHub account or organization (or any Git hosting) named `leaf-<module>` (e.g. `leaf-checkout`). It does not need to be in the OPSIDE-LEAF organization.
- Local directory `leaf_<module>` by convention.

## 2. First commit files

**Infrastructure (required):** `.gitignore`, `.gitattributes`, `settings.gradle.kts`, `build.gradle.kts`, `gradle.properties`, `gradle/libs.versions.toml`, `gradle/wrapper/gradle-wrapper.properties`, `gradlew`, `gradlew.bat`, `README.md`, `LICENSE` (Apache 2.0), `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`.

**Code (minimum functional):**

```
src/commonMain/kotlin/com/opside/leaf/<module>/
├── <Module>Module.kt              → Module with Feature or Action
├── domain/<Module>Models.kt       → Input, State, Event, Result
└── gateway/                       → Ports (interfaces)
src/commonTest/kotlin/com/opside/leaf/<module>/
└── <Module>ModuleTest.kt          → Unit tests
```

**Optional (recommended):** `ui/<Module>Route.kt` + `ui/<Module>Screen.kt` (if it has UI), `consumer/android-clean-consumer/`, `api/` (ABI dumps).

## 3. Gradle configuration

### `gradle/libs.versions.toml`

```toml
[versions]
kotlin = "2.3.20"
agp = "8.11.2"
compose = "1.10.3"
android-compileSdk = "36"
android-minSdk = "24"
kotlinx-coroutines = "1.10.2"
leaf = "%LEAF_VERSION%"
leaf-<modulo> = "0.1.0"  # ← Initial module version

[libraries]
leaf-contracts = { module = "com.opside-leaf:leaf-contracts", version.ref = "leaf" }
leaf-core = { module = "com.opside-leaf:leaf-core", version.ref = "leaf" }
leaf-compose = { module = "com.opside-leaf:leaf-compose", version.ref = "leaf" }
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinx-coroutines" }
kotlinx-coroutines-test = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-test", version.ref = "kotlinx-coroutines" }

[plugins]
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
androidApplication = { id = "com.android.application", version.ref = "agp" }
composeMultiplatform = { id = "org.jetbrains.compose", version.ref = "compose" }
composeCompiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
```

### `settings.gradle.kts`

Standalone root project with GitHub Packages and dual credentials (the same pattern from [Installation](/en/guide/installation)), plus the consumer commented out:

```kotlin
rootProject.name = "leaf-<modulo>"

// ... GitHub Packages repositories with dual credentials ...

// Uncomment when adding the consumer:
// include(":consumer")
// project(":consumer").projectDir = file("consumer/android-clean-consumer")
```

### `build.gradle.kts` (skeleton)

```kotlin
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.androidLibrary) apply false
    alias(libs.plugins.androidApplication) apply false
    id("maven-publish")
}

apply(plugin = "com.android.library")

group = "com.opside-leaf"
version = libs.versions.leaf.<modulo>.get()

kotlin {
    @OptIn(ExperimentalAbiValidation::class)
    abiValidation { enabled.set(true) }

    androidTarget {
        compilerOptions { jvmTarget.set(JvmTarget.JVM_11) }
        publishLibraryVariants("release")
    }
    listOf(iosArm64(), iosSimulatorArm64()).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "Leaf<Modulo>"  // PascalCase
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            api(libs.leaf.contracts)
            implementation(libs.kotlinx.coroutines.core)
            // Only if the module has UI:
            // api(compose.runtime)
            // api(compose.ui)
            // implementation(libs.leaf.compose)
            // implementation(compose.foundation)
            // implementation(compose.material3)
        }
        commonTest.dependencies {
            implementation(libs.kotlin.test)
            implementation(libs.kotlinx.coroutines.test)
        }
    }
}

extensions.configure<LibraryExtension> {
    namespace = "com.opside.leaf.<modulo>"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    defaultConfig { minSdk = libs.versions.android.minSdk.get().toInt() }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

publishing {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/<OWNER>/<REPO>")
            credentials {
                username = System.getenv("GPR_USER")
                password = System.getenv("GPR_GIT_KEY")
            }
        }
    }
    // publications.withType<MavenPublication> { pom { ... } }
}
```

::: tip Where do I publish my artifacts?
The `publishing.repositories.maven` URL determines **where** artifacts are stored. The module's `group` and `version` do not change -- only the destination changes.

You do not need to belong to the OPSIDE-LEAF organization or use their repos. Any developer can create Leaf modules and publish them to their own account, organization, or Maven server. The only requirement is that the module follows the Leaf architecture and that consumers know where to find it.

**Option A -- Centralized distribution repo (recommended for organizations):**
All modules publish to the same repo. Consumers only configure one source.
```kotlin
url = uri("https://maven.pkg.github.com/MY-ORG/packages-distribution")
```

**Option B -- The module's own repo:**
Each module publishes to its own repo. Simple, but consumers must add one URL per module they use.
```kotlin
url = uri("https://maven.pkg.github.com/MY-USER/my-leaf-module")
```

**Option C -- Private or public Maven repository:**
Any compatible Maven server (Sonatype Nexus, JFrog Artifactory, Maven Central, etc.).
```kotlin
url = uri("https://my-nexus.example.com/repository/maven-releases/")
```

In all cases, consumers must add the corresponding repository in their `settings.gradle.kts` to resolve dependencies. OPSIDE-LEAF uses Option A with the [`packages-distribution`](https://github.com/OPSIDE-LEAF/packages-distribution) repo.
:::

### `gradle.properties`

```properties
kotlin.code.style=official
kotlin.daemon.jvmargs=-Xmx3072M
org.gradle.jvmargs=-Xmx4096M -Dfile.encoding=UTF-8
org.gradle.configuration-cache=true
org.gradle.caching=true
android.nonTransitiveRClass=true
android.useAndroidX=true
```

## 4. Credentials and first build

Create `local.properties` (do NOT commit) with `gpr.user` / `gpr.key`, and validate:

```shell
./gradlew build
```

## Module conventions

| Aspect | Convention |
|---|---|
| Package | `com.opside.leaf.<module>` |
| Group ID | `com.opside-leaf` |
| Artifact ID | `leaf-<module>` |
| iOS Framework | `Leaf<Module>` (PascalCase) |
| Versioning | Semantic and independent |

## Next step

[Implement the module](/en/guide/module-implementation): models, gateways, Module, and UI.
