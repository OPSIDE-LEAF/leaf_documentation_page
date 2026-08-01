# Host: ejecutar una Action

Como **host** consumes módulos ya construidos: los instancias con sus dependencias y ejecutas sus capabilities. Una `Action<Input, Output>` es la capability más simple: recibe un input, se ejecuta y devuelve un output.

## 1. El módulo (lo publica su Author)

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

Lo que te importa como host: la dependencia (`prefix`) se inyecta **por constructor** (no hay contenedor DI ni registro) y la capability es una `val` tipada — tu IDE te dice exactamente qué recibe y qué devuelve.

## 2. Constrúyelo y ejecútalo

```kotlin
import com.ops.leaf_core.api.Leaf

suspend fun main() {
    val module = GreetingModule(prefix = "Hola,")
    val output = Leaf.run(module.greet, GreetingInput("Ada"))
    println(output.message) // Hola, Ada
}
```

`Leaf.run` es `suspend`: se ejecuta dentro de la corrutina del host y respeta su cancelación.

## 3. Errores

- **Errores de dominio** (esperados) se modelan en el tipo de salida, típicamente una `sealed interface`:

```kotlin
sealed interface PaymentOutcome {
    data class Approved(val id: String) : PaymentOutcome
    data object Declined : PaymentOutcome
    data object Unavailable : PaymentOutcome
}
```

- **Fallos técnicos** (inesperados): si la Action lanza, `Leaf.run` lanza `LeafException` redactada — solo expone la identidad del módulo y la operación, nunca el input ni el mensaje original.
- **Cancelación**: `CancellationException` se re-lanza conservando la semántica estructurada de coroutines.

## Firma estable

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

## Siguientes pasos

- Si la capability muestra estado y recibe intenciones del usuario, es una **Feature**: [abrir una Feature](/es/guide/quickstart-feature).
- ¿Quieres **crear** tus propios módulos? Ve a la [Guía del Author](/es/guide/module-setup).
