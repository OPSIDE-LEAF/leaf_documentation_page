# Lo que aporta tu app

La app host ejecuta o presenta el módulo y proporciona las capacidades externas que este necesita. El módulo no define cómo la aplicación accede a internet, guarda datos ni navega fuera de su propia UI. Antes de iniciar una Action o un Workflow, define qué aporta cada lado.

| Situación | La app host aporta | El módulo entrega |
| --- | --- | --- |
| Action | datos válidos y una corrutina | un resultado o un error técnico |
| Workflow | datos iniciales, un lugar donde presentarlo y su ciclo de vida | UI, estados, navegación interna y un resultado final |
| Efecto | un puerto que puede hacer trabajo lento | un evento de vuelta mediante el handler |
| Navegación externa | el punto desde el que se abre y el destino posterior | navegación interna y un `Output` tipado para decidir |

El backend, el almacenamiento, OAuth, los SDK, los permisos y la telemetría son partes explícitas de la app host. Pásalos como puertos claros, en vez de esconderlos en el módulo. Así puedes reemplazarlos por una versión de prueba cuando haga falta.

El host puede abrir un Workflow desde una ruta, un botón, una notificación o cualquier otro punto adecuado. No necesita controlar las transiciones entre las pantallas internas. Cuando el Workflow termina, el host interpreta su `Output`; por ejemplo, puede mostrar un mensaje, volver a la pantalla anterior o navegar a otra sección de la aplicación.

Al manejar el final, distingue los casos: `Failed` es un problema técnico y no una respuesta de negocio; `Cancelled` significa que la persona o la pantalla abandonó el flujo y no debe mostrarse como éxito. Implementa cada puerto completo, incluidos sus casos de error y cancelación.

Empieza con [Action](/es/guide/quickstart-action) si el módulo no proporciona UI. Usa [Workflow](/es/guide/quickstart-workflow) para cualquier módulo que proporcione UI.
