# Module testing

Test module rules first without a real screen or service. In `commonTest`, use fake ports and coroutine test tools. This lets you check each case without depending on network, permissions, or a device.

| Part | What is worth checking |
| --- | --- |
| Action | valid data, result, and an expected business rejection |
| Workflow reducer | that `initialize` and each `reduce` give the expected `WorkflowStep` |
| Workflow execution | states, `Completed`, `Failed`, `Cancelled`, and a full queue |
| Effect handler | that an effect returns as an event and exposes no secrets |
| Compose holder | `sessionKey`, the final result, and cancellation when leaving |

If something can go wrong as a normal business case, represent it in the result or an event. Do not turn it into an exception just to make a test fail.

To check that another project can resolve the artifact, use [Maven Local](/en/guide/maven-local) during development or the dependency repository selected by your organization. A consuming library validates resolution and compilation; a sample application can also test execution, lifecycle, and UI.
