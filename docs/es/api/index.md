# Referencia API

Referencia de la superficie pública estable del tren `%LEAF_VERSION%`, organizada por artefacto.

| Artefacto | Paquete | Contenido |
|---|---|---|
| [leaf-contracts](/es/api/contracts) | `com.ops.leaf_core.api` | `Module`, `ModuleInfo`, `Action`, `Feature`, `FeatureTransition`, DSLs `action`/`feature`/`stay`/`finish`, constantes de capacidad |
| [leaf-core](/es/api/core) | `com.ops.leaf_core.api` | `Leaf.run`, `Leaf.open`, `FeatureSession`, resultados y fallos, `LeafException`, `LeafTelemetry` |
| [leaf-compose](/es/api/compose) | `com.ops.leaf_core.ui.compose` | `Leaf.rememberLeaf`, `LeafComposeState` |

La estabilidad de estas superficies se garantiza con ABI validation (`api/` dumps en cada repositorio). Los paquetes históricos se mantienen durante LEAF 2; la migración de namespace queda para LEAF 3.

## Separación de responsabilidades

| Artefacto | Responsabilidad | No hace |
|---|---|---|
| `leaf-contracts` | Declarar contratos tipados | Ejecutar sesiones o conocer UI |
| `leaf-core` | Ejecutar Actions y poseer sesiones de Features | Conocer reglas de dominio o renderizar UI |
| `leaf-compose` | Observar una sesión y exponer un holder Compose | Crear otra sesión, cola o reducer |
