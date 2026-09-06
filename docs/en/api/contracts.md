# leaf-contracts

`com.opside-leaf:leaf-contracts:%LEAF_VERSION%` · package `com.ops.leaf_core.api` · [repo](https://github.com/OPSIDE-LEAF/leaf-contracts)

Declares the typed contracts of the ecosystem. It does not execute sessions or know about UI. The stable surface includes Action and Feature; Workflow is documented separately as an [experimental preview](/en/api/workflow).

## Module

```kotlin
interface Module {
    val info: ModuleInfo
}
```

Module contract. Encapsulates dependencies (via constructor) and exposes typed capabilities as `val` properties.

## ModuleInfo

```kotlin
data class ModuleInfo(val id: String, val version: String)
```

Stable identity for telemetry and errors. Validates that `id` and `version` are not blank.

## Action

```kotlin
interface Action<Input, Output> {
    val moduleInfo: ModuleInfo
    suspend fun execute(input: Input): Output
}
```

Finite, typed, and cancellable operation.

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

Typed interaction with observable state, events, and a terminal result.

### Constructor DSL

```kotlin
fun <Input, State, Event, Output> feature(
    moduleInfo: ModuleInfo,
    eventCapacity: Int = 16,
    initialState: (Input) -> State,
    transition: suspend (State, Event) -> FeatureTransition<State, Output>
): Feature<Input, State, Event, Output>
```

`eventCapacity` must be in `1..1024`.

## FeatureTransition

```kotlin
sealed interface FeatureTransition<out State, out Output> {
    data class Continue<State>(val state: State) : FeatureTransition<State, Nothing>
    data class Complete<Output>(val output: Output) : FeatureTransition<Nothing, Output>
}

fun <State> continueFeature(state: State): FeatureTransition<State, Nothing>
fun <Output> completeFeature(output: Output): FeatureTransition<Nothing, Output>
```

- `continueFeature(state)` publishes new state without terminating the session.
- `completeFeature(output)` produces exactly one terminal result.

The former LEAF 2.0.1 names were removed; see the [migration guide](/en/guide/feature-migration).

## Constants

```kotlin
DEFAULT_FEATURE_EVENT_CAPACITY // 16
MAX_FEATURE_EVENT_CAPACITY     // 1024
```
