# Roadmap

## Tren actual: %LEAF_VERSION%

Contracts, Core, Compose y Login forman el release coordinado `3.0.0`. Action y Feature son superficies estables. El cambio mayor de Feature está descrito en la [guía de migración](/es/guide/feature-migration).

Workflow se incluye en los artefactos del tren como **preview provisional**. Conserva `@ExperimentalLeafWorkflowApi`, requiere opt-in y no adquiere una promesa estable por compartir el número `3.0.0`. Consulta su [guía](/es/guide/workflow) y [referencia](/es/api/workflow).

Los paquetes Kotlin públicos continúan en `com.ops.leaf_core.api` y `com.ops.leaf_core.ui.compose`; `3.0.0` no realiza una migración de namespace.

## Distribución

Los workflows de release y los builds están configurados para publicar y resolver un repositorio GitHub Packages por artefacto. La configuración requiere credenciales de lectura. La presencia de una URL en Gradle no demuestra que una versión ya esté publicada; el consumer debe resolver la coordenada requerida.

La [instalación](/es/guide/installation) enumera las cuatro fuentes del tren. Un servidor Maven con lectura anónima continúa como opción futura sin fecha comprometida.

## Trabajo posterior

- Graduar Workflow solo después de una decisión explícita de estabilidad y evidencia compatible; mientras tanto su API puede cambiar.
- Migrar y validar Authentication, Email, Catalog, Stripe payment y Mercado Pago payment contra LEAF 3. Esos módulos conservan líneas independientes observadas sobre LEAF 2.0.1.
- Reconciliar la dependencia `leaf-visuals:1.3.0` declarada por Catalog con la línea local `1.0.0-alpha02` antes de afirmar compatibilidad o publicación.
- Validar la integración Swift/iOS externa sobre los heads finales del release; la compilación Kotlin/Native local no sustituye ese gate.

Consulta el [catálogo](/es/guide/catalogo) para distinguir el tren de release de los módulos independientes.
