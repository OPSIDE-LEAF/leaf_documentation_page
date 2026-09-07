# Referencia API

Referencia del tren `%LEAF_VERSION%` y de la promoción local `%LEAF_WORKFLOW_VERSION%`, organizada por artefacto. Workflow es API oficial sin opt-in en esta última; se valida solo con Maven Local, no con GitHub Packages.

| Artefacto | Paquete | Contenido |
|---|---|---|
| [leaf-contracts](/es/api/contracts) | `com.ops.leaf_core.api` | `Module`, `ModuleInfo`, `Action`, `Feature`, `FeatureTransition`, DSLs y constantes de capacidad |
| [leaf-core](/es/api/core) | `com.ops.leaf_core.api` | `Leaf.run`, `Leaf.open`, `FeatureSession`, resultados y fallos, `LeafException`, `LeafTelemetry` |
| [leaf-compose](/es/api/compose) | `com.ops.leaf_core.ui.compose` | `Leaf.rememberLeaf`, `LeafComposeState` |
| [Workflow](/es/api/workflow) | Contracts, Core y Compose `%LEAF_WORKFLOW_VERSION%` (Maven Local) | `Workflow`, steps, `EffectHandler`, sesión, outcome y holder Compose oficiales |

Los tres repositorios validan su superficie pública con ABI dumps. Los paquetes `com.ops.leaf_core.*` se conservan. El marcador anterior existe por compatibilidad, pero no anota Workflow en la promoción local.

## Separación de responsabilidades

| Artefacto | Responsabilidad | No hace |
|---|---|---|
| `leaf-contracts` | Declarar contratos tipados de Action, Feature y Workflow | Ejecutar sesiones o conocer UI |
| `leaf-core` | Ejecutar Actions y poseer sesiones de Feature/Workflow | Conocer reglas de dominio o renderizar UI |
| `leaf-compose` | Observar una sesión y exponer holders Compose | Crear otra sesión, cola, reducer o handler |
