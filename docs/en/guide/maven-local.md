# Maven Local

Maven Local is an artifact repository stored on each developer's computer. It can be used to test a module version before publishing it to an organization's package repository.

Using it is optional. An application does not need Maven Local to work with LEAF: it can obtain dependencies from any Maven repository selected by the organization. This guide only describes a quick way to check changes during development.

## When it is useful

Maven Local is useful when you need to:

- test a module and a consuming application in separate projects;
- confirm that a published artifact contains the expected classes and metadata;
- validate a change before creating a formal version;
- work without uploading a temporary build to a shared repository.

Do not use it as a production distribution system or as a replacement for a shared repository. Maven Local artifacts are available only on the computer where they were published, so another developer or a continuous integration server will not receive them automatically.

## Publish a test artifact

The project that produces the module must apply and configure the `maven-publish` plugin. From that project's root, run Gradle's standard task:

::: code-group

```shell [macOS / Linux]
./gradlew publishToMavenLocal
```

```powershell [Windows]
.\gradlew.bat publishToMavenLocal
```

:::

The publication uses the `group`, artifact name, and version declared by the project. For a test, use a version that clearly identifies the temporary artifact, such as `0.1.0-local`. This reduces the risk of confusing it with a formal version.

If you are testing several modules and one depends on another, publish the dependencies first and then the modules that consume them. This order is not specific to LEAF: Gradle must find each dependency before it can compile the next project.

## Configure a consumer project

Add `mavenLocal()` to the repository configuration of the project used for the test. It is best to enable it through a property or a development-only configuration and keep it disabled for normal builds.

Then declare the dependency with the test artifact's coordinates:

```text
<group>:<artifact>:<test-version>
```

For example, if an organization publishes a module as `com.example:customer-access:0.1.0-local`, the consumer must request those exact coordinates. Maven Local does not select the module by its folder name or its location on disk.

## Check the integration

Run a real task from the consumer project, such as its build or tests:

::: code-group

```shell [macOS / Linux]
./gradlew <validation-task>
```

```powershell [Windows]
.\gradlew.bat <validation-task>
```

:::

The exact task depends on the project. For Android, it may build a variant; for a Kotlin Multiplatform module, it may compile or test the targets supported by that project. Run the check from a separate consumer without replacing the dependency with a direct reference to the producer project.

Verify at least the following:

1. The consumer resolves the expected coordinates.
2. The module's public API compiles from another project.
3. The publication includes the targets needed by the consumer.
4. The result does not depend on files that exist only in the producer project.

A successful build shows that the artifact can be resolved and used in that context. By itself, it does not show that an Android application can be installed, that an iOS application can be linked and run, or that a complete flow works. Those checks require their own tests.

## Return to the normal configuration

After the test, disable `mavenLocal()` in the consumer and use the Maven repository selected by your organization. Also change the dependency to the version intended for publication or distribution.

This last step prevents a normal build from accidentally using a temporary artifact that exists only on one person's computer.
