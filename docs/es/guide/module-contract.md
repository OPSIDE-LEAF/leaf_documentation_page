# Contrato de un módulo

Define el contrato antes de elegir dependencias o implementar la UI. Especifica qué datos recibe el módulo, qué resultado devuelve y qué capacidades debe proporcionar la app host. El módulo implementa las reglas de negocio; la app host integra infraestructura, navegación externa y datos iniciales.

| Parte | Explica con claridad |
| --- | --- |
| Datos requeridos | qué son, qué formato tienen y qué pasa si faltan o son inválidos |
| Datos opcionales | su valor por defecto, qué significa no enviarlos y cuándo dejan de ser opcionales |
| Capacidades de la app | qué interfaz se inyecta, qué puede devolver o fallar y cuánto puede durar |
| API pública | Action: entrada y salida; Workflow: entrada, estado, evento, efecto y salida |
| Responsabilidades | qué guarda el módulo y quién cancela o cierra el flujo |

## Elegir la fachada

- Elige `Action<Input, Output>` para una operación finita que no requiere UI.
- Elige `Workflow<Input, State, Event, Effect, Output>` para cualquier módulo que requiera UI. Puede representar una pantalla o una navegación interna con varias pantallas.

No inyectes en el Workflow un contenedor global con todos los servicios de la aplicación. Define puertos pequeños para cada capacidad requerida. `EffectHandler` recibe un `Effect`, usa el puerto correspondiente y devuelve un `Event` al reducer.

Si una respuesta negativa es parte normal del negocio, exprésala como un evento o resultado tipado. Deja que los problemas técnicos terminen la sesión como un fallo de Core.

Cuando el contrato esté definido, continúa con [la implementación](/es/guide/module-implementation).
