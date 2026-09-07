# Workflow a fondo

Usa Workflow para cualquier módulo que proporcione UI. Puede tratarse de una sola pantalla o de un flujo con varias pantallas y navegación interna. LEAF %LEAF_VERSION% mantiene el estado, procesa los eventos en orden, ejecuta efectos y entrega un resultado final al host.

## Ciclo de una sesión

1. El host llama `Leaf.open(workflow, input)` desde una corrutina con `Job`.
2. Core llama `initialize` con el input. El Workflow devuelve su primer estado, solicita un efecto o completa de inmediato.
3. La UI observa `states` y llama `send` cuando ocurre una interacción o un evento del sistema.
4. Core entrega cada evento a `reduce`, junto con el estado actual.
5. `Continue` publica un nuevo estado. `Emit` publica el estado y solicita un efecto. `Complete` termina la sesión con un output.
6. Para `Emit`, Core llama `EffectHandler.handle(effect)`. Cuando el trabajo termina, el handler devuelve un evento y Core lo envía de nuevo a `reduce`.
7. El host recibe `WorkflowOutcome.Completed`, `WorkflowOutcome.Failed` o `WorkflowOutcome.Cancelled`.

## Navegación dentro y fuera del Workflow

La navegación entre pantallas propias del módulo pertenece al Workflow. El estado puede incluir una pantalla actual, una etapa o los datos necesarios para decidir qué contenido mostrar. Cuando un evento cambia ese valor, la UI presenta la siguiente pantalla sin pedir al host que coordine el paso.

El host controla la navegación externa. Puede abrir el Workflow desde cualquier punto adecuado de su aplicación, como una ruta, un botón, una notificación o el resultado de otro módulo. Cuando el Workflow completa, su `Output` comunica el resultado sin indicar cómo debe reaccionar la aplicación.

El host interpreta ese output y decide el siguiente paso. Puede mostrar un mensaje, cerrar un modal, volver a la pantalla anterior, abrir otra pantalla del host o iniciar otro módulo. Así, el módulo conserva su flujo interno y el host mantiene el control de la aplicación completa.

## Admisión de eventos

`send` no espera a que el evento sea procesado. Devuelve uno de estos resultados:

- `ACCEPTED`: Core recibió el evento.
- `REJECTED_OVERFLOW`: la cola está llena, pero la sesión sigue activa.
- `REJECTED_CLOSED`: la sesión ya terminó o fue cancelada.

No reenvíes automáticamente un evento rechazado. Antes de decidir si debe repetirse, comprueba el estado actual de la UI y la intención de la interacción.

## Efectos y fallos

Mientras hay un efecto pendiente, evita que la UI solicite otro efecto. Por ejemplo, desactiva Guardar mientras se está guardando. Si el Workflow solicita dos efectos al mismo tiempo, la sesión termina con `SECOND_EFFECT_WHILE_PENDING`.

Los resultados esperados del dominio deben representarse con eventos, estados u outputs tipados. Usa `WorkflowFailureReason` para problemas técnicos al inicializar, reducir un evento o ejecutar un efecto. Consulta [la referencia de Workflow](/es/api/workflow) para ver todas las razones disponibles.
