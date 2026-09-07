# Comprender Leaf

LEAF %LEAF_VERSION% separa las reglas de un módulo de la infraestructura de una aplicación Kotlin. Contracts define los tipos, Core ejecuta Actions y sesiones de Workflow, y Compose conecta un Workflow con su UI. El módulo controla sus reglas y, cuando proporciona UI, sus pantallas y navegación interna. La app host proporciona red, almacenamiento y otras capacidades externas; además decide dónde abrir el módulo y qué hacer con su resultado.

## Qué es LEAF

Muchas aplicaciones necesitan resolver capacidades que se repiten: autenticación, pagos, formularios, validaciones, búsqueda o selección de datos. Volver a implementar esas capacidades en cada proyecto consume tiempo y obliga a resolver varias veces los mismos errores, pruebas y decisiones de seguridad.

LEAF permite encapsular una capacidad completa en un módulo con un contrato claro. Una vez construido y probado, ese módulo puede integrarse en más de una aplicación. El equipo dedica menos tiempo a repetir trabajo conocido y puede entregar antes las funciones específicas que generan valor para su producto.

El nombre LEAF representa esta idea. Cada módulo es una **hoja** lista para reutilizarse. La app host es el **tronco** que conecta las hojas, les proporciona infraestructura y decide cómo encajan en el producto. El conjunto forma el árbol: una aplicación compuesta por módulos independientes que colaboran mediante contratos públicos.

Reutilizar no significa confiar sin comprobar. Un módulo debe conservar pruebas, versiones, revisión de seguridad y validaciones de integración. Al concentrar la lógica común en un solo lugar, una corrección o mejora puede beneficiar a todas las aplicaciones que consumen una versión actualizada del módulo.

## Secciones recomendadas

1. [Conceptos](/es/guide/arquitectura): entiende qué hace cada parte y cuándo elegir Action o Workflow.
2. [Integrar](/es/guide/installation): agrega las dependencias necesarias y usa una Action o un Workflow en tu app.
3. [Construir](/es/guide/module-contract): define el contrato, implementa la lógica y prueba el módulo.
4. [Evaluar](/es/project/): revisa las responsabilidades y decide si la arquitectura encaja con tu producto.

Usa una Action para una operación finita que no requiere UI. Usa un Workflow cuando el módulo requiere UI, ya sea una sola pantalla o una navegación interna con varias pantallas. Consulta [Action vs Workflow](/es/guide/action-vs-workflow) para ver las diferencias completas.
