# Implementar Action o Workflow

Parte del [contrato](/es/guide/module-contract). Antes de escribir lógica, nombra los datos que entran, los resultados que salen y los servicios pequeños que la app debe proporcionar. Eso hace que el código sea más fácil de probar y de explicar.

## Action sin UI

Una Action guarda una operación completa en un lugar. Su constructor recibe solo el puerto que necesita y devuelve un tipo que represente el resultado de negocio. No agregues Compose, Visuals ni una sesión solo para resolver una tarea que puede contestarse de una vez.

## Workflow con UI

Un Workflow nombra cinco cosas: `Input` para comenzar, `State` para lo que la pantalla muestra, `Event` para las acciones, `Effect` para el trabajo lento y `Output` para el resultado final. `initialize` valida o crea el primer estado. `reduce` decide de inmediato si debe continuar, pedir un efecto o terminar. `EffectHandler` es el único lugar que usa capacidades que pueden tardar.

Si el módulo tiene varias pantallas, `State` también puede indicar cuál debe mostrarse y contener los datos necesarios para esa pantalla. Los eventos cambian ese estado y permiten que el Workflow controle su navegación interna. El host no coordina esas transiciones: abre el Workflow desde el punto que prefiera y usa el `Output` final para mostrar un mensaje, volver atrás o navegar a otra parte de la aplicación.

No pongas datos sensibles en `State` si la pantalla no debería poder mostrarlos. El estado es una descripción pensada para UI, no una bodega de secretos.

| Tema | Módulo | App host |
| --- | --- | --- |
| Dominio, reducer y tipos | los define y prueba | usa la API pública |
| Red, SDK, vault y permisos | pide un puerto pequeño | lo implementa y lo entrega |
| UI y navegación interna | define las pantallas y sus transiciones mediante estado y eventos | proporciona el lugar y el ciclo de vida para mostrarlas |
| Navegación externa | emite un resultado tipado | decide el destino al terminar |
| Cancelación | no crea trabajos duplicados | cancela la sesión al salir |

La Route conecta el Workflow con sus pantallas. Continúa con [Route + Screen](/es/guide/compose-route-screen) para separar el ciclo de vida, la selección de la pantalla interna y la UI que se dibuja.
