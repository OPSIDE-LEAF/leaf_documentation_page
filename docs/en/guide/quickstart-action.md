# Host: running an Action

As a **host** you consume pre-built modules: you instantiate them with their dependencies and execute their capabilities. An `Action<Input, Output>` is the simplest capability: it receives an input, executes, and returns an output.

## 1. The module (published by its Author)

```kotlin
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.action

data class GreetingInput(val name: String)
data class GreetingOutput(val message: String)

class GreetingModule(private val prefix: String) : Module {
    override val info = ModuleInfo("com.example.greeting", "1.0.0")

    val greet = action<GreetingInput, GreetingOutput>(info) { input ->
        GreetingOutput("$prefix ${input.name}")
    }
}
```

What matters to you as a host: the dependency (`prefix`) is injected **via the constructor** (no DI container or registry) and the capability is a typed `val` — your IDE tells you exactly what it receives and what it returns.

## 2. Build and run it

```kotlin
import com.ops.leaf_core.api.Leaf

suspend fun main() {
    val module = GreetingModule(prefix = "Hola,")
    val output = Leaf.run(module.greet, GreetingInput("Ada"))
    println(output.message) // Hola, Ada
}
```

`Leaf.run` is `suspend`: it runs inside the host's coroutine and respects its cancellation.

## 3. Errors

- **Domain errors** (expected) are modeled in the output type, typically a `sealed interface`:

```kotlin
sealed interface PaymentOutcome {
    data class Approved(val id: String) : PaymentOutcome
    data object Declined : PaymentOutcome
    data object Unavailable : PaymentOutcome
}
```

- **Technical failures** (unexpected): if the Action throws, `Leaf.run` throws a redacted `LeafException` — it only exposes the module identity and the operation, never the input or the original message.
- **Cancellation**: `CancellationException` is re-thrown, preserving structured coroutine semantics.

## Stable signature

```kotlin
fun <Input, Output> action(
    moduleInfo: ModuleInfo,
    execute: suspend (Input) -> Output
): Action<Input, Output>

suspend fun <Input, Output> Leaf.Companion.run(
    action: Action<Input, Output>,
    input: Input,
    telemetry: LeafTelemetry = LeafTelemetry.None
): Output
```

## Next steps

- If the capability shows state and receives user intents, it is a **Feature**: [opening a Feature](/en/guide/quickstart-feature).
- Want to **create** your own modules? Go to the [Author Guide](/en/guide/module-setup).
