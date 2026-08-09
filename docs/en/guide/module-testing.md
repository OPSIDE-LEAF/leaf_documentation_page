# Author: module testing

Tests live in `commonTest` using Kotlin Test + `kotlinx-coroutines-test`. Test the module at the appropriate level **before** integrating it.

## What to test

1. **Transitions** -- validation and recovery return `stay`; a successful exit returns `finish` once.
2. **Gateway** -- success and expected invalidation map to domain results/state, not exceptions.
3. **Errors** -- an unexpected exception during a transition ends up as `Failed(TRANSITION_FAILED)` without leaking details.
4. **Lifecycle** -- canceling the host scope produces `Cancelled`; closing twice does not change the result.
5. **Backpressure** -- a saturated queue returns `REJECTED_OVERFLOW`, terminates with `EVENT_QUEUE_OVERFLOW`, and increments the metric.
6. **Compose** -- recomposition with the same `(feature, input)` pair does not open another session; replacing it or leaving composition closes the previous one.
7. **Privacy** -- telemetry/logs do not receive payloads or secrets; a telemetry failure does not alter the result.

## Transition testing (unit, no session)

A Feature's transition is a function: you can invoke it directly with state and event.

```kotlin
class CheckoutModuleTest {

    @Test
    fun `blank field keeps the feature active with an error`() = runTest {
        val transition = module(PaymentResponse.Success("id-1")).checkout.transition(
            CheckoutState(field = ""),
            CheckoutEvent.Submit,
        )
        val stay = assertIs<FeatureTransition.Stay<CheckoutState>>(transition)
        assertEquals("El campo es obligatorio", stay.state.error)
    }

    @Test
    fun `successful operation finishes with typed result`() = runTest {
        val transition = module(PaymentResponse.Success("id-1")).checkout.transition(
            CheckoutState(field = "valid-input"),
            CheckoutEvent.Submit,
        )
        val finish = assertIs<FeatureTransition.Finish<CheckoutResult>>(transition)
        assertEquals(CheckoutResult.Success("id-1"), finish.output)
    }

    private fun module(response: PaymentResponse) = CheckoutModule(
        gateway = object : PaymentGateway {
            override suspend fun execute(param: String) = response
        },
    )
}
```

## Session testing (integration with Core)

To verify terminal behavior use `Leaf.open` inside `runTest`:

```kotlin
@Test
fun `unexpected gateway error becomes a failed session`() = runTest {
    val module = CheckoutModule(
        gateway = object : PaymentGateway {
            override suspend fun execute(param: String): PaymentResponse {
                error("network unavailable")
            }
        },
    )
    val session = Leaf.open(module.checkout, input = CheckoutInput())
    session.send(CheckoutEvent.FieldChanged("value"))
    session.send(CheckoutEvent.Submit)
    assertIs<FeatureSessionResult.Failed>(session.result.filterNotNull().first())
}
```

Gateway fakes are anonymous objects or simple classes -- you do not need mocking frameworks.

## Action testing (stateless)

Modules with `Action` are tested with `Leaf.run` directly -- there is no session, state, or events:

```kotlin
class NotificationModuleTest {

    @Test
    fun `successful send returns Delivered`() = runTest {
        val module = NotificationModule(FakeNotificationGateway(result = NotificationOutcome.Delivered))
        val result = Leaf.run(module.notify, NotificationRequest(to = "user", message = "hi"))
        assertEquals(NotificationOutcome.Delivered, result)
    }

    @Test
    fun `invalid input returns domain error - not exception`() = runTest {
        val module = NotificationModule(FakeNotificationGateway())
        val result = Leaf.run(module.notify, NotificationRequest(to = "", message = "hi"))
        assertIs<NotificationOutcome.Failed>(result)
    }

    @Test
    fun `unexpected gateway error surfaces as LeafException`() = runTest {
        val module = NotificationModule(
            FakeNotificationGateway(throwable = RuntimeException("network down"))
        )
        assertFailsWith<LeafException> {
            Leaf.run(module.notify, NotificationRequest(to = "user", message = "hi"))
        }
    }
}
```

The three levels of an Action: successful business result, validation rejection, and unexpected technical failure.

## Run

```shell
./gradlew testDebugUnitTest
```

## Next step

[Validation and publishing](/en/guide/module-publishing): ABI, clean consumer, and tag-based publishing.
