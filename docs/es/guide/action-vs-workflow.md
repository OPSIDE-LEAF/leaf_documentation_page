# Action vs Workflow

La regla de elección es directa:

- Usa **Action** para una operación finita que no proporciona UI.
- Usa **Workflow** para cualquier módulo que proporcione UI, aunque solo tenga una pantalla.

El tamaño del módulo no cambia esta regla. Una operación compleja sin UI sigue siendo una Action. Una pantalla sencilla sigue siendo un Workflow.

| Necesidad | Opción de LEAF |
| --- | --- |
| Recibir un input, ejecutar una operación sin UI y devolver un output | `Action<Input, Output>` |
| Mostrar UI, mantener estado de interacción, recibir eventos o administrar una o varias pantallas | `Workflow<Input, State, Event, Effect, Output>` |

## Cuándo usar Action

Una Action representa una operación que empieza, trabaja y termina con un resultado. La aplicación la ejecuta con `Leaf.run` y espera su output. No abre una sesión de UI ni publica estados intermedios para dibujar una pantalla.

Por ejemplo, una Action puede validar un dato, calcular una cotización, guardar un registro o solicitar información a un servicio. La aplicación decide si muestra progreso, un mensaje o cualquier otra UI alrededor de esa operación; esa UI pertenece al host, no a la Action.

## Cuándo usar Workflow

Un Workflow representa un módulo con UI. Abre una sesión en Core y define:

- el estado que la UI debe mostrar;
- los eventos que puede enviar la persona o el sistema;
- los efectos que realizan trabajo suspendido, como guardar o llamar un servicio;
- el output final que recibe el host.

`initialize` produce el primer paso. `reduce` recibe el estado actual y un evento para decidir el siguiente paso. `EffectHandler` ejecuta el trabajo suspendido y devuelve un nuevo evento al Workflow.

Un Workflow puede tener una sola pantalla o toda una navegación interna. Por ejemplo, su estado puede indicar si debe mostrar una lista, un formulario o una confirmación. El módulo controla los cambios entre esas pantallas; el host no necesita coordinar cada paso interno.

El host puede abrir el Workflow desde cualquier punto que resulte conveniente: una ruta, un botón, una notificación u otra pantalla. Cuando termina, el Workflow entrega un `Output` tipado. El host usa ese output para decidir qué sigue fuera del módulo, como mostrar un mensaje, volver a una pantalla anterior o navegar a otra pantalla de la aplicación.

## Reparto de responsabilidades

El módulo define sus tipos de entrada, estado, eventos, efectos y resultado. También controla su UI y su navegación interna.

El host proporciona las capacidades externas que el módulo necesita, como red, almacenamiento o acceso a un SDK. También decide dónde abrir el Workflow y qué hacer con su output. Core mantiene los eventos en orden, ejecuta los efectos y cierra la sesión al completar, fallar o cancelar.

Para implementar una operación sin UI, continúa con [ejecutar una Action](/es/guide/quickstart-action). Para implementar cualquier módulo con UI, continúa con [abrir un Workflow](/es/guide/quickstart-workflow).
