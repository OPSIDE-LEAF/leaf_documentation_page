# Installation

Add only the dependencies required by each project's responsibility. Your organization can distribute LEAF artifacts through any repository and process it prefers; that choice does not change the module API.

## Dependency required to create a module

To create the public contract of an **Action** or **Workflow** module, you only need `leaf-contracts`. This artifact contains the interfaces and types used by the module to declare its input, output, and, for a Workflow, its state, events, and effects.

`leaf-core` and `leaf-compose` are not required to declare that contract. They are normally added by the host application according to how it will run or present the module.

| Project | Required dependency |
| --- | --- |
| Module that declares an Action or Workflow | `leaf-contracts` |
| Host that runs Actions or opens Workflow sessions | `leaf-core` |
| Compose host that presents and observes Workflow UI | `leaf-compose` |

For example, an Android Compose host that runs Actions and presents Workflows can declare all three dependencies:

<!-- kotlin-snippet: gradle: installation-dependencies -->
```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-contracts:%LEAF_VERSION%")
    implementation("com.opside-leaf:leaf-core:%LEAF_VERSION%")
    implementation("com.opside-leaf:leaf-compose:%LEAF_VERSION%")
}
```

Do not copy all three coordinates into every project. The reusable module can depend only on Contracts. A host without Compose can use Contracts and Core. Add Compose only to a host that will present a Workflow through that integration.

## Configure the repository

LEAF artifacts are published on GitHub Packages. Gradle needs the organization's Maven registry to resolve them:

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/OPSIDE-LEAF/leaf_contracts")
            credentials {
                username = providers.gradleProperty("gpr.user").orNull
                    ?: System.getenv("GPR_USER")
                password = providers.gradleProperty("gpr.key").orNull
                    ?: System.getenv("GPR_KEY")
            }
        }
    }
}
```

GitHub Packages requires authentication even for reading. Create a personal access token (classic) with the `read:packages` permission and configure it using one of these methods:

| Method | Configuration |
| --- | --- |
| Gradle properties | `gpr.user` and `gpr.key` in `~/.gradle/gradle.properties` |
| Environment variables | `GPR_USER` and `GPR_KEY` |

::: warning Do not commit credentials
Never put the token directly in `settings.gradle.kts` or in files tracked by version control.
:::

## Maven Local for testing

Maven Local is an option for testing changes before distributing an artifact. It lets you publish a version to the development machine's Maven repository and check it from a test application. It is not a LEAF requirement or a recommendation for distributing dependencies within a company.

If you need that check, see [testing with Maven Local](/en/guide/maven-local). For shared projects, configure the dependency repository and publication rules that suit your organization.
