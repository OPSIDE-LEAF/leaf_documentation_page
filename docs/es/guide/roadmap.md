# Roadmap

## Tren estable actual: 2.0.1

Las coordenadas estables son `leaf-contracts:2.0.1`, `leaf-core:2.0.1` y `leaf-compose:2.0.1`, con `leaf-login:1.0.0` como módulo de referencia.

## En curso

- **leaf-visuals** — sistema de diseño visual compartido (desarrollo inicial).
- **Módulos de pagos** — `leaf-mp-payments` y `leaf-stripe-payments` evolucionarán de stubs a integraciones reales (Mercado Pago para el mercado local, Stripe para el internacional).
- **Migración de módulos legacy** — email, authentication y catalog al modelo tipado 2.x ([guía](/es/guide/legacy-migration)).

## LEAF 3 (futuro)

- **Migración de namespace** — los paquetes históricos `com.ops.leaf_core.api` y `com.ops.leaf_core.ui.compose` se mantienen durante todo LEAF 2 por compatibilidad binaria; su migración queda reservada para LEAF 3.

## Workflow: experimento aislado

::: danger No es parte del tren estable
`Workflow` es un experimento distinto, protegido por `@ExperimentalLeafWorkflowApi` (staging `0.0.0-leaf3-experiment.1`), con `WorkflowSession`, efectos runtime-owned y un adaptador Compose diferente. **No es una evolución transparente de `Feature`.**
:::

Al momento de esta verificación no existe código de `Workflow` en el workspace; la advertencia se conserva por si el experimento se reintroduce:

- No combines contratos `Workflow` (`rememberLeafWorkflowHolder`, `LoginWorkflow`, etc.) con los módulos y hosts de esta documentación.
- Si se evalúa, hazlo en rama, módulo y consumer **aislados**, con opt-in explícito y validación propia.
- No cambies las coordenadas estables 2.0.1 ni presentes evidencia experimental local como publicación estable.
