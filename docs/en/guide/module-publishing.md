# Test before distribution

Before distributing a module, check that its public API can be consumed without access to internal code. Each project can choose its own distribution strategy, such as a private or public Maven repository, an organization package catalog, a composite build, or another Gradle-compatible mechanism.

1. Run the module's unit and contract tests.
2. Generate the artifact with the same configuration you intend to distribute.
3. Consume it from a sample application, an existing application, or an isolated project.
4. Compile the targets you plan to support and run the required integration tests.
5. Verify the version, coordinates, and transitive dependencies before publishing.

If you want to test the artifact without uploading it to a repository, [Maven Local](/en/guide/maven-local) provides a quick option. It checks local dependency resolution; it does not replace application tests, UI review, or validation on every supported platform.
