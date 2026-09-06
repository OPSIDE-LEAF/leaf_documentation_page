# Migrar Feature de LEAF 2.0.1 a 3.0.0

LEAF 3 cambia el vocabulario público de `Feature` para que una transición y un resultado terminal usen los mismos conceptos. Es un cambio incompatible de fuente: los nombres de LEAF 2 no tienen aliases en `3.0.0`.

| LEAF 2.0.1 histórico | LEAF 3.0.0 | Qué representa |
|---|---|---|
| `FeatureTransition.Stay` | `FeatureTransition.Continue` | Publica estado y mantiene abierta la sesión. |
| `FeatureTransition.Finish` | `FeatureTransition.Complete` | Completa la sesión con un output. |
| `stay(state)` | `continueFeature(state)` | Helper para continuar. |
| `finish(output)` | `completeFeature(output)` | Helper para completar. |
| `FeatureSessionResult.Finished` | `FeatureSessionResult.Completed` | Resultado terminal exitoso. |
| `FeatureSessionTerminalCause.FINISHED` | `FeatureSessionTerminalCause.COMPLETED` | Causa terminal sin payload. |

`Action`, `Feature`, `FeatureSession`, `Leaf.run`, `Leaf.open` y `Leaf.rememberLeaf` conservan su papel. Los paquetes Kotlin públicos continúan siendo `com.ops.leaf_core.api` y `com.ops.leaf_core.ui.compose` en `3.0.0`.

## API histórica de LEAF 2.0.1

Este bloque documenta deliberadamente la línea anterior. Sirve para reconocer código que todavía no se ha migrado; no compila contra Contracts `3.0.0`.

```kotlin
// LEAF 2.0.1 — histórico
when (event) {
    CounterEvent.Increment -> stay(state + 1)
    CounterEvent.Done -> finish(CounterResult.FinalCount(state))
}

if (result is FeatureSessionResult.Finished) {
    use(result.output)
}
```

## Código equivalente en LEAF 3.0.0

```kotlin
// LEAF 3.0.0
when (event) {
    CounterEvent.Increment -> continueFeature(state + 1)
    CounterEvent.Done -> completeFeature(CounterResult.FinalCount(state))
}

if (result is FeatureSessionResult.Completed) {
    use(result.output)
}
```

Actualiza también imports, pruebas de tipo (`assertIs`) y comparaciones de métricas. Una búsqueda útil, limitada al código activo, es:

```shell
rg "FeatureTransition\\.(Stay|Finish)|FeatureSessionResult\\.Finished|FeatureSessionTerminalCause\\.FINISHED|\\bstay\\(|\\bfinish\\(" src consumer samples
```

Excluye documentación marcada como LEAF 2.0.1 histórica y evidencia inmutable: esas apariciones son intencionales.

## Feature y Workflow son contratos distintos

No necesitas convertir una `Feature` en `Workflow` para migrar a LEAF 3. Usa `Workflow` cuando el runtime deba poseer efectos suspendidos que regresan como eventos. La migración de nombres de Feature no cambia su reducer suspendido ni su política de overflow terminal.

Workflow continúa como [preview experimental](/es/guide/workflow) y exige opt-in incluso dentro del tren `3.0.0`.
