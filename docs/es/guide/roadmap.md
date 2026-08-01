# Roadmap

## Tren estable actual: %LEAF_VERSION%

Las coordenadas estables son `leaf-contracts:%LEAF_VERSION%`, `leaf-core:%LEAF_VERSION%` y `leaf-compose:%LEAF_VERSION%`, con `leaf-login:1.0.0` como módulo de referencia.

## Distribución

Hoy los artefactos se distribuyen por **GitHub Packages**, que exige un PAT con `read:packages` incluso para paquetes públicos (limitación del registry Maven de GitHub, sin acceso anónimo). El plan es migrar a un **servidor Maven propio** con lectura anónima: los Hosts consumirán sin credenciales y el token quedará solo del lado de publicación. Mientras tanto aplica el [patrón dual de credenciales](/es/guide/installation).

## En curso

- **leaf-visuals** — sistema de diseño visual compartido (desarrollo inicial).
- **Módulos de pagos** — `leaf-mp-payments` y `leaf-stripe-payments` evolucionarán de stubs a integraciones reales (Mercado Pago para el mercado local, Stripe para el internacional).
- **Migración de módulos legacy** — email, authentication y catalog al modelo tipado 2.x ([guía](/es/guide/legacy-migration)).

## LEAF 3 (futuro)

- **Workflow** — nueva capability para orquestar flujos multi-paso, con `WorkflowSession`, efectos runtime-owned y su propio adaptador Compose. Será una feature de LEAF 3; ver detalle abajo.
- **Migración de namespace** — los paquetes históricos `com.ops.leaf_core.api` y `com.ops.leaf_core.ui.compose` se mantienen durante todo LEAF 2 por compatibilidad binaria; su migración queda reservada para LEAF 3.

### Workflow

`Workflow` será el tercer tipo de capability del ecosistema, pensado para interacciones que hoy no cubren `Action` (operación finita) ni `Feature` (interacción con estado): flujos multi-paso con efectos administrados por el runtime. Tendrá `WorkflowSession` y un adaptador Compose propio — **no es una evolución transparente de `Feature`**, sino un contrato distinto.

::: warning Estado: experimental, fuera del tren %LEAF_VERSION%
Mientras se desarrolla, `Workflow` vive detrás de `@ExperimentalLeafWorkflowApi` (staging `0.0.0-leaf3-experiment.1`) y no forma parte del tren estable:

- No combines contratos `Workflow` (`rememberLeafWorkflowHolder`, etc.) con los módulos y hosts 2.x de esta documentación.
- Evalúalo solo en rama, módulo y consumer **aislados**, con opt-in explícito y validación propia.
- No cambies las coordenadas estables %LEAF_VERSION% ni presentes evidencia experimental como publicación estable.
:::
