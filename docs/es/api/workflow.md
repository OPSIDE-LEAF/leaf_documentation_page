# Workflow

`Workflow<Input, State, Event, Effect, Output>` define cualquier módulo que proporcione UI. Recibe datos al comenzar, publica el estado que debe mostrarse, acepta eventos, puede solicitar trabajo suspendido y termina con un resultado. El estado puede representar una sola pantalla o indicar cuál de varias pantallas internas debe presentar el módulo. Contracts define estos tipos y Core procesa la sesión en orden.

## Paso y efecto

Cada vez que el Workflow decide qué sigue, elige exactamente uno de estos tres pasos.

| Decisión | Resultado |
| --- | --- |
| `continueWorkflow(state)` | publica estado y admite otro evento |
| `emitEffect(state, effect)` | publica estado y solicita un efecto |
| `completeWorkflow(output)` | fija el único outcome exitoso |

Cuando eliges `Emit`, Core primero publica el estado. Después llama a `EffectHandler.handle` para hacer el trabajo lento, por ejemplo guardar algo o consultar un servicio. Ese handler devuelve un evento y Core lo vuelve a pasar al reducer. Mientras ese trabajo está pendiente, la pantalla debe desactivar la acción que iniciaría otro efecto. Si no lo hace y se intenta un segundo efecto, Core termina con `WorkflowOutcome.Failed(WorkflowFailureReason.SECOND_EFFECT_WHILE_PENDING)`.

## Cómo termina

Al final siempre hay una de tres respuestas. `WorkflowOutcome.Completed(output)` entrega el resultado de negocio, por ejemplo un contador guardado. `Failed` avisa de un problema técnico: al iniciar, al decidir el siguiente paso, al ejecutar un efecto o por pedir dos efectos al mismo tiempo. `Cancelled` significa que la pantalla o su corrutina dejó el flujo antes de terminar. La app debe mostrar cada caso de forma distinta y usar `cancel()` solo cuando realmente abandona una sesión que sigue activa.

La [guía de Workflow](/es/guide/workflow) explica cómo iniciar una sesión, presentar una o varias pantallas, enviar eventos y procesar el resultado final desde el host.
