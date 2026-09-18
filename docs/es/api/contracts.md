# `leaf-contracts`

`leaf-contracts` %LEAF_VERSION% define las interfaces públicas de `Action`, `Workflow` y los tipos que controlan sus transiciones. No abre sesiones, no hace llamadas de red y no incluye una implementación de UI.

## Action

Una `Action` representa una tarea de una sola vez. Recibe un dato, hace su trabajo y devuelve una respuesta. Por ejemplo, puede recibir una cantidad y devolver una cotización. No conserva el estado de una pantalla ni coordina varios pasos.

<!-- kotlin-snippet: reference: contracts-action -->
```kotlin
interface Action<Input, Output> {
    val moduleInfo: ModuleInfo
    suspend fun execute(input: Input): Output
}

fun <Input, Output> action(
    moduleInfo: ModuleInfo,
    execute: suspend (Input) -> Output,
): Action<Input, Output>
```

## Workflow

Usa `Workflow` como contrato público cuando el módulo requiera UI. Sus tipos permiten representar el estado y los eventos de una pantalla o de una navegación interna con varias pantallas. El `Output` comunica el resultado final a la app host.

<!-- kotlin-snippet: reference: contracts-workflow -->
```kotlin
interface Workflow<in Input, State, Event, Effect, out Output> {
    val moduleInfo: ModuleInfo
    val eventBufferCapacity: Int
    fun initialize(input: Input): WorkflowStep<State, Effect, Output>
    fun reduce(state: State, event: Event): WorkflowStep<State, Effect, Output>
    val effectHandler: EffectHandler<Effect, Event>
}

fun interface EffectHandler<Effect, Event> {
    suspend fun handle(effect: Effect): Event
}
```

Un Workflow responde con uno de tres pasos. `initialize` y `reduce` deciden el paso de inmediato; no esperan red ni base de datos.

| Decisión | Resultado |
| --- | --- |
| `continueWorkflow(state)` | publica estado y admite otro evento |
| `emitEffect(state, effect)` | publica estado y solicita un efecto |
| `completeWorkflow(output)` | fija el único outcome exitoso |

Cuando eliges `Emit`, Core primero publica el estado. Después llama a `EffectHandler.handle` para hacer el trabajo lento (guardar, consultar un servicio). Ese handler devuelve un evento y Core lo vuelve a pasar al reducer. Mientras ese trabajo está pendiente, la pantalla debe desactivar la acción que iniciaría otro efecto. Si se intenta un segundo efecto, Core termina con `WorkflowOutcome.Failed`.

### Cómo termina un Workflow

| Outcome | Significado |
| --- | --- |
| `Completed(output)` | Entrega el resultado de negocio |
| `Failed(reason)` | Problema técnico al iniciar, reducir, ejecutar un efecto o por doble efecto |
| `Cancelled` | La pantalla o su corrutina dejó el flujo antes de terminar |

`eventBufferCapacity` debe estar entre 1 y `MAX_FEATURE_EVENT_CAPACITY`. La [guía de Workflow](/es/guide/workflow) explica cómo iniciar una sesión, presentar pantallas, enviar eventos y procesar el resultado.

Contracts también incluye `Feature<Input, State, Event, Output>` como API anterior. Su `reducer` devuelve `FeatureTransition`. Para módulos nuevos con UI, usa `Workflow`.
