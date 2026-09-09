# Evaluar la adopción

LEAF puede encajar si tu organización quiere convertir capacidades comunes en módulos reutilizables sin obligar a todas las aplicaciones a usar la misma red, UI o almacenamiento. La app host conserva esas decisiones y cada proyecto elige cómo integrar, probar y distribuir los módulos.

Adoptar LEAF no reemplaza las decisiones de producto, backend, seguridad u observabilidad. El Workflow controla la navegación interna de su UI; el host conserva la navegación externa y decide qué ocurre después del resultado.

## Valor del reúso

| Sin un módulo reutilizable | Con un módulo LEAF preparado |
| --- | --- |
| Cada proyecto vuelve a implementar una capacidad común. | El proyecto integra una capacidad mediante un contrato conocido. |
| Las mismas reglas y errores se prueban por separado en cada aplicación. | Las reglas se prueban en el módulo y el host comprueba su integración. |
| Una corrección debe repetirse en varias implementaciones. | La corrección se concentra en el módulo y se distribuye mediante una nueva versión. |
| El arranque del proyecto dedica tiempo a resolver funciones conocidas. | El equipo puede dedicar antes su tiempo a las funciones propias del producto. |

Este reúso puede reducir tiempos de entrega y generar valor antes, pero depende de la calidad del catálogo. Cada módulo debe tener una responsabilidad clara, pruebas suficientes, versiones controladas y revisiones de seguridad acordes con el riesgo que maneja. LEAF facilita la estructura para reutilizarlo; no sustituye esas prácticas.

## Preguntas para el equipo

| Pregunta | Qué conviene tener claro |
| --- | --- |
| ¿Action o Workflow? | Action para una operación sin UI; Workflow para cualquier módulo con UI |
| ¿Qué aporta la app host? | red, almacenamiento, SDK, OAuth, permisos, punto de apertura y navegación externa |
| ¿Qué conserva el módulo? | reglas de negocio, resultados y, para un Workflow, UI y navegación interna |
| ¿Cómo se valida? | pruebas del módulo, una aplicación consumidora y los targets que se pretenden soportar |

Empieza con [arquitectura](/es/guide/arquitectura), define [el contrato](/es/guide/module-contract) y selecciona la estrategia de integración, pruebas y distribución que corresponda a tu producto.
