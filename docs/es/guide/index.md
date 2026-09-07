# ¿Qué es Leaf?

Workflow es oficial sin opt-in en la promoción local `%LEAF_WORKFLOW_VERSION%` de Contracts, Core y Compose. No está publicada en GitHub Packages. Ver [Workflow](/es/guide/workflow).

**Leaf** es un ecosistema para desarrollo móvil multiplataforma construido sobre **Kotlin Multiplatform** y **Compose Multiplatform**. Permite estructurar aplicaciones como conjuntos de módulos independientes, reutilizables y desacoplados, que se comparten entre Android e iOS conservando el rendimiento nativo.

Su núcleo provee capabilities **locales y directas**. Los Authors exponen `Action` o `Feature`; LEAF 3 añade `Workflow` como API oficial para reducción síncrona con efectos administrados por Core. Los hosts consumen referencias Kotlin mediante `Leaf.run`, `Leaf.open` o los adaptadores Compose.

```kotlin
// El Author define la capability
val login: Feature<LoginInput, LoginState, LoginEvent, LoginResult>

// El host la ejecuta en una sentencia
val leaf = Leaf.rememberLeaf(module.login, LoginInput())
```

::: tip La ruta principal es local y directa
No requiere registro de módulos, mapas de payload, codecs ni generación de código. Integrar un módulo es instanciarlo y llamarlo — y si algo no encaja, lo ves al compilar.
:::

## El problema que resuelve

El desarrollo móvil vive una contradicción estructural:

| Ruta | Ventaja | Costo |
|---|---|---|
| **Nativo tradicional** | Máxima calidad de UX | Duplica equipos, presupuestos y tiempos (Swift/iOS + Kotlin/Android) |
| **Frameworks híbridos** (Flutter, React Native) | Reduce costos y tiempos | Capas de abstracción intermedias que comprometen rendimiento e integración orgánica con cada plataforma |

Leaf opera en la intersección que ninguna de las dos alternativas cubre: **código compartido que produce aplicaciones indistinguibles de las desarrolladas con los SDKs nativos**. Kotlin Multiplatform no introduce capas de abstracción en runtime — el código compartido se compila a bytecode JVM para Android y a framework nativo para iOS.

## Propuesta de valor

En lugar de construir cada aplicación desde cero, los proyectos se ensamblan a partir de **módulos pre-construidos, reutilizables y compilables de forma aislada**, distribuidos como artefactos versionados vía GitHub Packages.

Cada módulo:

- Encapsula sus dependencias por constructor y expone capabilities listas para usar (`Action`, `Feature` o, con opt-in, `Workflow`).
- Se compila, prueba y publica de forma independiente (semantic versioning propio).
- Modela sus dependencias externas como ports (interfaces) que el host implementa.
- Valida su superficie pública con ABI validation y un *clean consumer*.

## ¿Para quién es?

- **Equipos y agencias** que necesitan entregar Android + iOS sin duplicar bases de código.
- **Startups** que buscan reducir time-to-market sin comprometer la experiencia nativa.
- **Authors de módulos** que quieren distribuir capabilities reutilizables con contratos estables.
- **Desarrolladores KMP** que buscan una arquitectura modular de referencia.

## Comparativa rápida

| | Nativo x2 | Flutter / RN | **Leaf (KMP)** |
|---|---|---|---|
| Rendimiento nativo | ✅ | ⚠️ Capa intermedia | ✅ Compilación nativa |
| Código compartido | ❌ | ✅ | ✅ Lógica + UI (Compose MP) |
| Mantenimiento | Dos bases de código | Una base + puentes nativos | **Una base compartida** |
| Módulos reutilizables versionados | Manual | Manual | ✅ Nativo del ecosistema |
| Duplicación de equipos | ✅ Requerida | ❌ | ❌ |

## Siguientes pasos

- [Arquitectura y principios](/es/guide/arquitectura) — cómo está construido el ecosistema.
- [Instalación](/es/guide/installation) — configura credenciales y dependencias.
- [Tu primera Action](/es/guide/quickstart-action) — Hello World en 5 minutos.
- [Workflow](/es/guide/workflow) — reducción, efectos y sesiones administradas por Core.
- [Migrar Feature desde 2.0.1](/es/guide/feature-migration) — equivalencias del cambio incompatible.
