# Referencia API

Referencia de la superficie pública del tren `%LEAF_VERSION%`, organizada por artefacto. Action y Feature son estables; Workflow se incluye como preview con opt-in.

| Artefacto | Paquete | Contenido |
|---|---|---|
| [leaf-contracts](/es/api/contracts) | `com.ops.leaf_core.api` | `Module`, `ModuleInfo`, `Action`, `Feature`, `FeatureTransition`, DSLs y constantes de capacidad |
| [leaf-core](/es/api/core) | `com.ops.leaf_core.api` | `Leaf.run`, `Leaf.open`, `FeatureSession`, resultados y fallos, `LeafException`, `LeafTelemetry` |
| [leaf-compose](/es/api/compose) | `com.ops.leaf_core.ui.compose` | `Leaf.rememberLeaf`, `LeafComposeState` |
| [Workflow preview](/es/api/workflow) | Contracts, Core y Compose | `Workflow`, steps, `EffectHandler`, sesión, outcome y holder Compose; todo experimental |

Los tres repositorios validan su superficie pública con ABI dumps. Los paquetes históricos `com.ops.leaf_core.*` se conservan en `3.0.0`; este release no migra el namespace. El marcador experimental de Workflow sigue siendo parte de su contrato.

## Separación de responsabilidades

| Artefacto | Responsabilidad | No hace |
|---|---|---|
| `leaf-contracts` | Declarar contratos tipados de Action, Feature y Workflow | Ejecutar sesiones o conocer UI |
| `leaf-core` | Ejecutar Actions y poseer sesiones de Feature/Workflow | Conocer reglas de dominio o renderizar UI |
| `leaf-compose` | Observar una sesión y exponer holders Compose | Crear otra sesión, cola, reducer o handler |
