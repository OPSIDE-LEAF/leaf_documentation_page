# Arquitectura y responsabilidades

| Capa | Se encarga de | No se encarga de |
| --- | --- | --- |
| Contracts | los tipos y las funciones públicas | sesiones, red o UI |
| Core | ejecutar Actions y administrar sesiones, eventos, efectos y resultados de Workflow | las reglas de negocio o la UI del módulo |
| Compose | conectar una sesión de Workflow con UI Compose | las reglas de negocio o la navegación externa de la app |
| Módulo | las reglas de negocio y, si es Workflow, su UI y navegación interna | infraestructura de la app o navegación fuera del módulo |
| App host | red, almacenamiento, ciclo de vida, punto de apertura y navegación externa | el reducer o las transiciones internas del módulo |

La regla principal es que el módulo no dependa de detalles propios de una aplicación. La aplicación usa su API pública y proporciona mediante puertos las capacidades externas que necesita, como backend, SDK, OAuth, almacenamiento o permisos.

Una Action no proporciona UI. Cualquier módulo que proporcione UI se define como Workflow, incluso si solo tiene una pantalla. El Workflow puede controlar varias pantallas y sus transiciones internas. El host decide desde dónde abrirlo y, cuando recibe su `Output`, determina el siguiente paso de la aplicación.

Esta separación permite probar las reglas de negocio sin usar servicios reales y evita que el módulo dependa de una arquitectura específica del host. [El contrato de módulo](/es/guide/module-contract) explica qué debe definirse antes de implementar.
