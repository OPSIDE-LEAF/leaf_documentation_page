# leaf-contracts

`com.opside-leaf:leaf-contracts:%LEAF_VERSION%` · paquete `com.ops.leaf_core.api` · [repo](https://github.com/OPSIDE-LEAF/leaf-contracts)

Declara los contratos tipados del ecosistema. No ejecuta sesiones ni conoce UI.

## Module

```kotlin
interface Module {
    val info: ModuleInfo
}
```

Contrato de módulo. Encapsula dependencias (por constructor) y expone capabilities tipadas como propiedades `val`.

## ModuleInfo

```kotlin
data class ModuleInfo(val id: String, val version: String)
```

Identidad estable para telemetría y errores. Valida que `id` y `version` no estén en blanco.

## Action

```kotlin
interface Action<Input, Output> {
    val moduleInfo: ModuleInfo
    suspend fun execute(input: Input): Output
}
```

Operación finita, tipada y cancelable.

### Constructor DSL

```kotlin
fun <Input, Output> action(
    moduleInfo: ModuleInfo,
    execute: suspend (Input) -> Output
): Action<Input, Output>
```

## Feature

```kotlin
interface Feature<Input, State, Event, Output> {
    val moduleInfo: ModuleInfo
    val eventCapacity: Int
    fun initialState(input: Input): State
    suspend fun transition(state: State, event: Event): FeatureTransition<State, Output>
}
```

Interacción tipada con estado observable, eventos y resultado terminal.

### Constructor DSL

```kotlin
fun <Input, State, Event, Output> feature(
    moduleInfo: ModuleInfo,
    eventCapacity: Int = 16,
    initialState: (Input) -> State,
    transition: suspend (State, Event) -> FeatureTransition<State, Output>
): Feature<Input, State, Event, Output>
```

`eventCapacity` debe estar en `1..1024`.

## FeatureTransition

```kotlin
sealed interface FeatureTransition<out State, out Output> {
    data class Stay<State>(val state: State) : FeatureTransition<State, Nothing>
    data class Finish<Output>(val output: Output) : FeatureTransition<Nothing, Output>
}

fun <State> stay(state: State): FeatureTransition<State, Nothing>
fun <Output> finish(output: Output): FeatureTransition<Nothing, Output>
```

- `stay(state)` publica nuevo estado sin terminar la sesión.
- `finish(output)` produce exactamente un resultado terminal.

## Constantes

```kotlin
DEFAULT_FEATURE_EVENT_CAPACITY // 16
MAX_FEATURE_EVENT_CAPACITY     // 1024
```
