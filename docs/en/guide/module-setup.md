# Structure and dependencies

A module is a KMP component with a defined public API. It may live in the same repository as the application or in a separate repository; each project can choose its own organization. Include only the dependencies required for its responsibility.

| If you need | Use |
| --- | --- |
| types and a public API | `leaf-contracts` |
| to run an Action or Workflow | `leaf-core` in the part that runs it |
| to watch a Workflow from Compose | `leaf-compose` |
| LEAF's optional Material 3 theme | `leaf-visuals` |

Put shared business rules and contracts in `commonMain`. Put reducer and port tests in `commonTest`. Keep network, storage, and SDK adapters outside those rules, on the app side.

You can check integration from a sample application, an existing application, or a test project. An Android project using `com.android.library` validates compilation but does not produce an installable application.

[Maven Local](/en/guide/maven-local) is one option for testing an artifact during development. You may also use the dependency and distribution system selected for your project. Credentials and secrets must remain outside the module and its examples.
