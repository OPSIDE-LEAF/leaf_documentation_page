# Catálogo de módulos

Esta página distingue el tren LEAF 3 del código de módulos independientes observado en el workspace. Describe superficies fuente y versiones declaradas; no confirma que una coordenada esté disponible en un registry remoto.

## Tren LEAF 3.0.0

| Artefacto | Coordenada | API en 3.0.0 | Repositorio |
|---|---|---|---|
| leaf-contracts | `com.opside-leaf:leaf-contracts:%LEAF_VERSION%` | Action y Feature estables; contratos Workflow en preview | [leaf-contracts](https://github.com/OPSIDE-LEAF/leaf-contracts) |
| leaf-core | `com.opside-leaf:leaf-core:%LEAF_VERSION%` | Runtime estable de Action/Feature; sesión Workflow en preview | [leaf-core](https://github.com/OPSIDE-LEAF/leaf-core) |
| leaf-compose | `com.opside-leaf:leaf-compose:%LEAF_VERSION%` | Adapter estable de Feature; holder Workflow en preview | [leaf-compose](https://github.com/OPSIDE-LEAF/leaf-compose) |
| leaf-login | `com.opside-leaf:leaf-login:%LEAF_VERSION%` | Feature/UI estable y Login Workflow/UI con opt-in | [leaf-login](https://github.com/OPSIDE-LEAF/leaf-login) |

Las filas anteriores describen la línea anterior `%LEAF_VERSION%`. La promoción de Contracts, Core y Compose `%LEAF_WORKFLOW_VERSION%` convierte Workflow en API oficial sin opt-in y está disponible **solo en Maven Local**, no en GitHub Packages. Login conserva su versión anterior. Consulta la [guía de Workflow](/es/guide/workflow).

## Líneas independientes observadas

Estos módulos no forman parte del release `3.0.0` y sus builds observados todavía declaran Contracts/Core `2.0.1` cuando dependen de ellos.

| Módulo | Versión declarada | Superficie observada | Estado comprobable en el workspace |
|---|---|---|---|
| Authentication | `0.1.0` | `signIn`, `continueChallenge`, `restoreSession`, `signOut` y `accessTokens` | Implementación KMP tipada; factory `LOCAL_FAKE`. Ya no usa el registro legacy. |
| Email | `1.0.0` | `EmailModule.send: Action<EmailInput, EmailResult>` | La implementación multiplataforma y SMTP nativo aparece en `origin/main` tras el fetch; el checkout local está detrás. |
| Catalog | `1.0.0` | `CatalogModule.browse: Feature<...>`, UI Compose y DSL | La implementación aparece en `origin/main` tras el fetch; el checkout local está dos commits detrás. |
| Stripe payment | `0.1.0` | Actions `createOrReplay` y `observe` | PoC `LOCAL_FAKE`; no prueba integración, SDK, tokenización ni cobro real con Stripe. |
| Mercado Pago payment | `0.1.0` | Actions `createOrReplay` y `observe` | PoC `LOCAL_FAKE`; no prueba integración, SDK, tokenización ni cobro real con Mercado Pago. |
| LeafVisuals | `1.3.0` | Provider Compose opcional, `LeafVisualsMaterialTheme` y la identidad `thingsLeafVisuals()` | Publicado en GitHub Packages en las cuatro variantes KMP. |

El `origin/main` observado de Catalog declara `leaf-visuals:1.3.0`, y esa misma línea `1.3.0` — con el tema de marca `thingsLeafVisuals()` — es la que está en `main` de LeafVisuals y publicada en GitHub Packages. Catalog, en cambio, sigue sin publicar: consumirlo requiere Maven Local.

::: warning Compatibilidad entre líneas
Authentication, Email, Catalog y los pagos no se promovieron con este tren. Antes de combinarlos con LEAF 3, migra su dependencia y vocabulario de Feature cuando corresponda, y ejecuta sus consumers. La [migración de Feature](/es/guide/feature-migration) cubre el cambio de nombres.
:::

## Historia de la arquitectura anterior

El registro dinámico pertenece a LEAF 1.x. Authentication y Catalog tienen implementaciones tipadas posteriores en el workspace, así que ya no deben figurar como módulos legacy pendientes. La [guía histórica de 1.x a 2.0.1](/es/guide/legacy-migration) conserva ese contexto.

## Repositorios de paquetes configurados

Los proyectos del tren configuran un repositorio de GitHub Packages por artefacto:

```text
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-contracts
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-core
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-compose
https://maven.pkg.github.com/OPSIDE-LEAF/leaf-login
```

El Group ID común es `com.opside-leaf`. Configuración de publicación no equivale a comprobación de disponibilidad; valida la coordenada en tu build.
