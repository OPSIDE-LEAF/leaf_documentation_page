# Login

Login 3.1.0 is a reference Kotlin Multiplatform sign-in module. It provides a Compose UI Workflow on the official LEAF 3 capability and retains a compatible Feature path; real authentication and navigation remain under the host application's control.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-login:3.1.0`. Its source corresponds to tag [`v3.1.0`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v3.1.0), revision [`edd0bf0`](https://github.com/OPSIDE-LEAF/leaf-login/commit/edd0bf0).

Declared compatibility is LEAF Contracts/Core/Compose 3.1.0; integration with leaf-visuals 1.4.0 is optional.

Login has a version independent of the base LEAF release train. Before integrating it, check its compatibility requirements and confirm that the artifact is available from the Maven repository configured by your organization.

## Public surface

| API | Responsibility |
| --- | --- |
| `LoginModule` and `login` | Expose the stable form, validation, and authentication Feature. |
| `AuthGateway` | Defines the Port implemented by the application to authenticate an email and password. |
| `LoginRoute` and `LoginScreen` | Connect the Feature to Compose; terminal navigation belongs to the host. |
| `createLoginWorkflow` and `LoginWorkflowScreen` | Expose the reference Workflow; the published Kotlin API still requires explicit opt-in. |

## Host responsibilities

The application implements `AuthGateway`, maps expected responses to the module's results, and decides what happens after successful authentication. It also controls transport, persistence, telemetry, the optional visual theme, and navigation outside Login.

## Feature and Workflow

The stable Feature uses `LoginInput`, `LoginState`, `LoginEvent`, and `LoginResult`. `LoginRoute` observes its result and delivers `LoginResult.Authenticated` to the host callback.

The Workflow keeps the password out of `LoginWorkflowState` through `LoginPassword`, emits the authentication effect, and completes with `LoginWorkflowOutput.Authenticated` or `LoginWorkflowOutput.Cancelled`. Recoverable failures return to an editable state; the application remains responsible for the Gateway and subsequent actions.

## Security

Do not log, persist, or send passwords to telemetry. The Feature path retains the password during the session to process the form, so the host must not serialize its state. The Workflow path redacts `LoginPassword` when converted to text, and the UI clears its copy when it completes or leaves composition.
