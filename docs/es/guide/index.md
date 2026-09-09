# ¿Qué es Leaf?

**Leaf** es un ecosistema para desarrollo móvil multiplataforma construido sobre **Kotlin Multiplatform** y **Compose Multiplatform**. Permite estructurar aplicaciones como conjuntos de módulos independientes, reutilizables y desacoplados, que se comparten entre Android e iOS conservando el rendimiento nativo.

::: tip <kbd>LEAF %LEAF_VERSION%</kbd>
Separa las reglas de un módulo de la infraestructura de una aplicación Kotlin. Contracts define los tipos, Core ejecuta Actions y sesiones de Workflow, y Compose conecta un Workflow con su UI. El módulo controla sus reglas y, cuando proporciona UI, sus pantallas y navegación interna. La app host proporciona red, almacenamiento y otras capacidades externas; además decide dónde abrir el módulo y qué hacer con su resultado.
:::

El nombre LEAF representa esta idea. Cada módulo es una **hoja** lista para reutilizarse. La app host es el **tronco** que conecta las hojas, les proporciona infraestructura y decide cómo encajan en el producto. El conjunto forma el árbol: una aplicación compuesta por módulos independientes que colaboran mediante contratos públicos.

![LEAF: la metáfora del árbol](/images/guide/fig-metafora-arbol.svg)

## El problema que resuelve

Muchas aplicaciones necesitan resolver capacidades que se repiten: autenticación, pagos, formularios, validaciones, búsqueda o selección de datos. Volver a implementar esas capacidades en cada proyecto consume tiempo y obliga a resolver varias veces los mismos errores, pruebas y decisiones de seguridad.

**LEAF** permite encapsular una capacidad completa en un módulo con un contrato claro. Una vez construido y probado, ese módulo puede integrarse en más de una aplicación. El equipo dedica menos tiempo a repetir trabajo conocido y puede entregar antes las funciones específicas que generan valor para su producto.

El desarrollo móvil vive una contradicción estructural:

| Ruta | Ventaja | Costo |
|---|---|---|
| **Nativo tradicional** | Máxima calidad de UX | Duplica equipos, presupuestos y tiempos (Swift/iOS + Kotlin/Android) |
| **Frameworks híbridos** (Flutter, React Native) | Reduce costos y tiempos | Capas de abstracción intermedias que comprometen rendimiento e integración orgánica con cada plataforma |

Leaf opera en la intersección que ninguna de las dos alternativas cubre: **código compartido que produce aplicaciones indistinguibles de las desarrolladas con los SDKs nativos**. Kotlin Multiplatform no introduce capas de abstracción en runtime — el código compartido se compila a bytecode JVM para Android y a framework nativo para iOS.

Reutilizar no significa confiar sin comprobar. Un módulo debe conservar pruebas, versiones, revisión de seguridad y validaciones de integración. Al concentrar la lógica común en un solo lugar, una corrección o mejora puede beneficiar a todas las aplicaciones que consumen una versión actualizada del módulo.

## Propuesta de valor

En lugar de construir cada aplicación desde cero, los proyectos se ensamblan a partir de **módulos pre-construidos, reutilizables y compilables de forma aislada**, distribuidos como artefactos versionados.

Cada módulo:

- Encapsula sus dependencias por constructor y expone capabilities listas para usar (`Action` o `Workflow`).
- Se compila, prueba y publica de forma independiente (semantic versioning propio).
- Modela sus dependencias externas como ports (interfaces) que el host implementa.

## ¿Para quién es?

- **Equipos y agencias** que necesitan entregar Android + iOS sin duplicar bases de código.
- **Startups** que buscan reducir time-to-market sin comprometer la experiencia nativa.
- **Empresas** que buscan reducir costos de desarrollo y mantenimiento de aplicaciones móviles.
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

## Secciones recomendadas

1. [Conceptos](/es/guide/arquitectura): entiende qué hace cada parte y cuándo elegir Action o Workflow.
2. [Integrar](/es/guide/installation): agrega las dependencias necesarias y usa una Action o un Workflow en tu app.
3. [Construir](/es/guide/module-contract): define el contrato, implementa la lógica y prueba el módulo.
4. [Evaluar](/es/guide/adopcion): revisa las responsabilidades y decide si la arquitectura encaja con tu producto.

Usa una Action para una operación finita que no requiere UI. Usa un Workflow cuando el módulo requiere UI, ya sea una sola pantalla o una navegación interna con varias pantallas. Consulta [Action vs Workflow](/es/guide/action-vs-workflow) para ver las diferencias completas.
