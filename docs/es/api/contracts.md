# leaf-contracts

Workflow es oficial sin opt-in en la promoción local `%LEAF_WORKFLOW_VERSION%` de Contracts, Core y Compose. No está publicada en GitHub Packages. Ver [Workflow](/es/guide/workflow).

`com.opside-leaf:leaf-contracts:%LEAF_VERSION%` · paquete `com.ops.leaf_core.api` · [repo](https://github.com/OPSIDE-LEAF/leaf-contracts)

Declara los contratos tipados del ecosistema. No ejecuta sesiones ni conoce UI. La superficie estable incluye Action y Feature; Workflow se documenta aparte como [API oficial en Maven Local](/es/api/workflow).

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
    data class Continue<State>(val state: State) : FeatureTransition<State, Nothing>
    data class Complete<Output>(val output: Output) : FeatureTransition<Nothing, Output>
}

fun <State> continueFeature(state: State): FeatureTransition<State, Nothing>
fun <Output> completeFeature(output: Output): FeatureTransition<Nothing, Output>
```

- `continueFeature(state)` publica nuevo estado sin terminar la sesión.
- `completeFeature(output)` produce exactamente un resultado terminal.

Los nombres anteriores de LEAF 2.0.1 se retiraron; consulta la [migración](/es/guide/feature-migration).

## Constantes

```kotlin
DEFAULT_FEATURE_EVENT_CAPACITY // 16
MAX_FEATURE_EVENT_CAPACITY     // 1024
```
