# Glosario

| Término | Definición |
|---|---|
| **Module** | Objeto local que implementa la interface `Module`, encapsula sus dependencias por constructor y expone capabilities tipadas. No es un contenedor DI ni requiere registro. |
| **ModuleInfo** | Identidad estable de un módulo: `ModuleInfo(id, version)`. Se usa en telemetría y errores. `id` y `version` no pueden estar en blanco. |
| **Capability** | Propiedad `val` tipada dentro de un módulo: una `Action` o una `Feature`. |
| **Action** | `Action<Input, Output>` — operación finita, tipada y cancelable: recibe un input, se ejecuta y devuelve un output. Sin estado observable. |
| **Feature** | `Feature<Input, State, Event, Output>` — interacción con estado observable, eventos del usuario y un resultado terminal único. |
| **Transición** | Respuesta de una Feature a un evento: `stay(state)` publica nuevo estado sin terminar; `finish(output)` produce el resultado terminal exactamente una vez. |
| **Host** | Aplicación (Android/iOS) o componente que construye módulos, ejecuta sus capabilities y conserva la navegación. |
| **FeatureSession** | Sesión propiedad de Core creada por `Leaf.open`: expone `state`, `result` y `metrics` como `StateFlow`, más `send`, `cancel` y `close`. |
| **Gateway (port)** | Interface declarada dentro del módulo que modela una dependencia externa (API, identidad, pagos). La implementación pertenece al host. |
| **Ruta local tipada** | Modelo de invocación de Leaf 2.x: el host llama capabilities con referencias Kotlin tipadas; los errores de tipo fallan al compilar. |
| **Backpressure** | Manejo de presión de eventos: la cola de una Feature es acotada (default 16, máx. 1,024) y `send` falla rápido con `REJECTED_OVERFLOW` en lugar de suspender. |
| **Terminalidad única** | Garantía de que una sesión produce exactamente un resultado terminal (`Finished`, `Cancelled` o `Failed`); los eventos tardíos se rechazan. |
| **Error de dominio** | Resultado de negocio esperado, modelado en el tipo de salida (ej. `LoginResult`, `AuthResponse.InvalidCredentials`). Nunca es una excepción. |
| **Fallo técnico** | Error inesperado normalizado a `LeafException` (redactada: solo expone `moduleInfo` y operación) o a `FeatureTechnicalFailure` en sesiones. |
| **Telemetría sin payload** | Hook best-effort que recibe solo identidad de módulo, fase, duración y resultado técnico. Nunca input, state, event, output, throwable ni PII. |
| **Clean consumer** | Proyecto de validación que compila el uso soportado del módulo contra el artefacto candidato. |
| **ABI validation** | Verificación de que la superficie pública del módulo no cambia de forma inadvertida (`checkKotlinAbi`). |
| **Cancelación estructurada** | La sesión es hija de la corrutina del host: si el host se cancela, la sesión se cancela. `CancellationException` se re-lanza. |
| **App Host** | Aplicación demostrativa que ensambla módulos Leaf para validar el modelo (ej. `hostSimulator`, `leaf_test_app`). |
| **Open core** | Modelo del proyecto: núcleo abierto + módulos avanzados/servicios comerciales. |
