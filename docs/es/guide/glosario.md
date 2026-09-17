# Glosario

## Contratos

| Término | Significado |
| --- | --- |
| Action | una operación tipada que recibe datos y devuelve una respuesta; se ejecuta con `Leaf.run()` |
| Workflow | una interacción tipada con estado, reducción síncrona y effects administrados por el runtime |
| `WorkflowStep` | la decisión síncrona que produce un Workflow: `Continue`, `Emit` o `Complete` |
| Effect | trabajo asíncrono que un Workflow solicita mediante `WorkflowStep.Emit` |
| `EffectHandler` | la interfaz funcional que ejecuta un Effect y devuelve el evento resultante al reducer |
| Outcome | la respuesta terminal de un Workflow: completado, fallido o cancelado (`WorkflowOutcome`) |
| Port | una interfaz que permite a la app entregar red, almacenamiento u otro servicio |
| `Module` | la interfaz que encapsula dependencias y publica capacidades tipadas a través de su `ModuleInfo` |
| `ModuleInfo` | identidad estable de un módulo: `id` + `version` |

## Runtime

| Término | Significado |
| --- | --- |
| `Leaf` | punto de entrada del runtime; `Leaf.run()` ejecuta un Action, `Leaf.open()` abre un Workflow o Feature |
| Session | la instancia en ejecución que Core administra: `WorkflowSession` expone `states`, `send()` y `awaitOutcome()`; `FeatureSession` expone `state`, `send()` y `result` |
| `LeafException` | error técnico redactado que reporta módulo y operación sin exponer payloads de dominio |
| `LeafTelemetry` | interfaz funcional para observar datos técnicos de ejecución (módulo, fase, duración, resultado); las callbacks son best-effort y no afectan la ejecución |

## Compose

| Término | Significado |
| --- | --- |
| `rememberLeaf()` | función composable que abre y observa un Feature para el ciclo de vida de la composición |
| `rememberLeafWorkflowHolder()` | función composable que abre y observa un Workflow para el ciclo de vida de la composición |
| `LeafComposeState` | vista Compose observable (`@Stable`) de una sesión Feature; expone `state`, `result` y `send()` |
| Holder | vista Compose estable (`@Stable`) de una sesión Workflow (`LeafWorkflowHolder`); expone `snapshot`, `outcome` y `send()` |
| `WorkflowSnapshot` | estado Compose de un Workflow: `Initializing` antes del primer estado, `Active(state)` después |

## Visuales

| Término | Significado |
| --- | --- |
| `LeafVisuals` | valores Material 3 inmutables (colores, tipografía, formas) que el host entrega a los módulos con `ProvideLeafVisuals` |
| `ThingsLeafTheme` | wrapper que aplica la identidad visual LEAF Things (verde/lima, serif editorial, formas asimétricas) en una sola llamada |

## Infraestructura

| Término | Significado |
| --- | --- |
| Gateway | interfaz que abstrae un servicio de plataforma nativo; cada módulo define la suya (p. ej. `EmailGateway`, `CatalogGateway`, `MercadoPagoCardGateway`, `StripePaymentGateway`) |
| Maven Local | una carpeta local desde la que se prueban artefactos |

Estos términos describen la API y el runtime. La distribución de artefactos y la configuración de servicios externos son decisiones separadas de cada aplicación.
