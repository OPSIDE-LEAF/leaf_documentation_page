# Visuals: identidad visual opcional

::: info Línea independiente
Esta página describe LeafVisuals `1.3.0` ([repo](https://github.com/OPSIDE-LEAF/leaf-visuals)). No forma parte del release `%LEAF_VERSION%` y **no está publicado en GitHub Packages**: la evidencia disponible es local, vía `publishToMavenLocal`.
:::

`leaf-visuals` (`com.opside-leaf:leaf-visuals`, paquete `com.opside.leaf.visuals`) es el puente opcional de Material 3 entre el host y los renderers de las Features. Resuelve un problema concreto: un módulo con UI no debe imponer su propio tema, pero tampoco puede adivinar el del host.

El módulo es **transporte, no política**. Publica valores visuales que el host posee; cada Feature decide si los consume.

## El recorrido

```text
Host elige la identidad
        |
LeafVisuals.create(light, dark, typography, shapes)   o   thingsLeafVisuals()
        |
ProvideLeafVisuals(visuals, darkTheme) { ... }        ← el host publica los valores
        |
LeafVisualsMaterialTheme { CatalogRoute(...) }        ← el renderer los aplica
        |
Sin provider → la Feature hereda el MaterialTheme ambiente del host
```

## API pública

| Declaración | Para qué |
|---|---|
| `LeafVisuals.create(lightColorScheme, darkColorScheme, typography, shapes = Shapes())` | Construye los valores visuales. El constructor es privado a propósito: la clase es opaca e inmutable. |
| `ProvideLeafVisuals(content)` | Captura el Material 3 **ya visible** y lo republica. No instala ningún tema. |
| `ProvideLeafVisuals(visuals, darkTheme, content)` | Publica una selección explícita del host. La política de modo oscuro la decide el host. |
| `ProvideLeafVisuals(visuals, darkTheme, enabled, content)` | Igual que la anterior, pero con `enabled = false` **enmascara** cualquier provider externo y no resuelve nada. |
| `isLeafVisualsProvided(): Boolean` | `true` solo si hay un provider en este subárbol de composición. |
| `LeafVisualsMaterialTheme(content)` | Aplica los valores del provider más cercano. Sin provider, deja intactos colores, tipografía y formas. |

## La identidad LEAF Things

Además del transporte, el módulo trae una identidad de marca lista para usar — el estándar de diseño **LEAF Things**: espaciado generoso, tipografía sobria y formas redondeadas.

| Declaración | Para qué |
|---|---|
| `thingsLeafVisuals(): LeafVisuals` | Los valores LEAF completos (claro + oscuro, tipografía y formas). |
| `ThingsLeafTheme(darkTheme = isSystemInDarkTheme()) { }` | Atajo: provee la identidad y la aplica en una sola llamada. |
| `LeafBrandLightColors` / `LeafBrandDarkColors` | Esquemas de color por separado, para hosts que quieran ajustar roles puntuales. |
| `LeafBrandTypography` / `LeafBrandShapes` | Tipografía y formas de marca por separado. |

Los colores son los mismos que usa este sitio de documentación:

| Token | Valor | Rol |
|---|---|---|
| `#095637` | Verde oscuro | Base del degradado de marca |
| `#0B6B45` | Verde LEAF | `primary` en modo claro |
| `#4C9038` | Verde medio | Transición del degradado |
| `#A0CB38` | Lima | `primary` en modo oscuro |
| `#C3E26A` | Lima claro | Realces suaves |
| `#ED7D31` | Naranja | Acento |
| `#E33838` | Rojo | Acento de error/alerta |

## Comportamiento global: cerrar el teclado

`LeafVisualsMaterialTheme` envuelve el contenido de forma que **un toque en espacio vacío quita el foco y baja el teclado**. Es un comportamiento global de toda Feature renderizada a través del wrapper, para que cada módulo no tenga que cablearlo.

::: tip Qué no rompe
Se usa `detectTapGestures`, que solo dispara ante un toque real: el scroll y los clics de hijos interactivos (botones, chips, el propio campo de texto) siguen funcionando igual. Bajo `LocalInspectionMode` (previews y tests headless) el wrapper se omite.
:::

## Uso desde un host

::: code-group

```kotlin [Heredar el tema del host]
MaterialTheme(colorScheme = miEsquema) {
    ProvideLeafVisuals {              // captura lo que ya es visible
        LeafVisualsMaterialTheme {
            CatalogRoute(module, onResult = ::route)
        }
    }
}
```

```kotlin [Imponer la identidad LEAF]
ThingsLeafTheme {                    // provee + aplica en una llamada
    CatalogRoute(module, onResult = ::route)
}
```

```kotlin [Identidad propia del host]
val visuals = LeafVisuals.create(
    lightColorScheme = miEsquemaClaro,
    darkColorScheme = miEsquemaOscuro,
    typography = miTipografia,
    shapes = misFormas,
)

ProvideLeafVisuals(visuals, darkTheme = isSystemInDarkTheme()) {
    LeafVisualsMaterialTheme { CatalogRoute(module, onResult = ::route) }
}
```

:::

## Relación con leaf-catalog

`CatalogRoute` expone un parámetro `visuals: LeafVisuals?` cuyo default es `thingsLeafVisuals()`, así que el catálogo se ve con la identidad LEAF sin configuración. Pasar `null` lo hace adoptar el `MaterialTheme` del host. Los detalles están en [Catálogo: módulo de ejemplo](/es/guide/catalog-reference).

## Consumo

Mientras el módulo no esté en GitHub Packages, la única vía comprobada es Maven Local:

```bash
# En el repositorio leaf-visuals
./gradlew publishToMavenLocal

# En el consumidor
./gradlew build -Pleaf.useMavenLocal=true
```

```kotlin
implementation("com.opside-leaf:leaf-visuals:1.3.0")
```

::: warning Disponibilidad
`leaf-visuals` versiona aparte del tren estable: su `1.3.0` no se corresponde con `%LEAF_VERSION%`. Antes de depender de él desde un módulo que sí publiques, verifica que esté disponible en el repositorio de paquetes que usa tu build.
:::
