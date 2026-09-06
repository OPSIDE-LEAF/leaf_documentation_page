# Visuals: optional visual identity

::: info Independent line
This page describes LeafVisuals `1.3.0` ([repo](https://github.com/OPSIDE-LEAF/leaf-visuals)). It is not part of the `%LEAF_VERSION%` release and is **not published to GitHub Packages**: the available evidence is local, through `publishToMavenLocal`.
:::

`leaf-visuals` (`com.opside-leaf:leaf-visuals`, package `com.opside.leaf.visuals`) is the optional Material 3 bridge between a host and its Feature renderers. It solves one concrete problem: a module with UI must not impose its own theme, yet it cannot guess the host's either.

The module is **transport, not policy**. It publishes visual values the host owns; each Feature decides whether to consume them.

## The path

```text
Host picks the identity
        |
LeafVisuals.create(light, dark, typography, shapes)   or   thingsLeafVisuals()
        |
ProvideLeafVisuals(visuals, darkTheme) { ... }        ← the host publishes the values
        |
LeafVisualsMaterialTheme { CatalogRoute(...) }        ← the renderer applies them
        |
No provider → the Feature inherits the host's ambient MaterialTheme
```

## Public API

| Declaration | Purpose |
|---|---|
| `LeafVisuals.create(lightColorScheme, darkColorScheme, typography, shapes = Shapes())` | Builds the visual values. The constructor is private on purpose: the class is opaque and immutable. |
| `ProvideLeafVisuals(content)` | Captures the Material 3 values **already visible** and republishes them. It installs no theme. |
| `ProvideLeafVisuals(visuals, darkTheme, content)` | Publishes an explicit host-owned selection. Dark-mode policy stays with the host. |
| `ProvideLeafVisuals(visuals, darkTheme, enabled, content)` | Same as above, but `enabled = false` **masks** any outer provider and resolves nothing. |
| `isLeafVisualsProvided(): Boolean` | `true` only when a provider exists in this composition subtree. |
| `LeafVisualsMaterialTheme(content)` | Applies the nearest provider's values. Without a provider it leaves colors, typography and shapes untouched. |

## The LEAF Things identity

Beyond transport, the module ships a ready-made brand identity — the **LEAF Things** design standard: generous spacing, restrained type and soft rounded shapes.

| Declaration | Purpose |
|---|---|
| `thingsLeafVisuals(): LeafVisuals` | The complete LEAF values (light + dark, typography and shapes). |
| `ThingsLeafTheme(darkTheme = isSystemInDarkTheme()) { }` | Shortcut: provides the identity and applies it in one call. |
| `LeafBrandLightColors` / `LeafBrandDarkColors` | The color schemes on their own, for hosts that want to tweak individual roles. |
| `LeafBrandTypography` / `LeafBrandShapes` | Brand typography and shapes on their own. |

The colors are the same ones this documentation site uses:

| Token | Value | Role |
|---|---|---|
| `#095637` | Dark green | Base of the brand gradient |
| `#0B6B45` | LEAF green | `primary` in light mode |
| `#4C9038` | Mid green | Gradient transition |
| `#A0CB38` | Lime | `primary` in dark mode |
| `#C3E26A` | Light lime | Soft highlights |
| `#ED7D31` | Orange | Accent |
| `#E33838` | Red | Error/alert accent |

## Global behavior: dismissing the keyboard

`LeafVisualsMaterialTheme` wraps its content so that **a tap on empty space clears focus and hides the keyboard**. It is a global behavior for every Feature rendered through the wrapper, so no module has to wire it up itself.

::: tip What it does not break
It uses `detectTapGestures`, which only fires on a real tap: scrolling and clicks on interactive children (buttons, chips, the text field itself) keep working unchanged. Under `LocalInspectionMode` (previews and headless tests) the wrapper is skipped.
:::

## Using it from a host

::: code-group

```kotlin [Inherit the host theme]
MaterialTheme(colorScheme = myScheme) {
    ProvideLeafVisuals {              // captures what is already visible
        LeafVisualsMaterialTheme {
            CatalogRoute(module, onResult = ::route)
        }
    }
}
```

```kotlin [Impose the LEAF identity]
ThingsLeafTheme {                    // provides + applies in one call
    CatalogRoute(module, onResult = ::route)
}
```

```kotlin [The host's own identity]
val visuals = LeafVisuals.create(
    lightColorScheme = myLightScheme,
    darkColorScheme = myDarkScheme,
    typography = myTypography,
    shapes = myShapes,
)

ProvideLeafVisuals(visuals, darkTheme = isSystemInDarkTheme()) {
    LeafVisualsMaterialTheme { CatalogRoute(module, onResult = ::route) }
}
```

:::

## Relationship with leaf-catalog

`CatalogRoute` exposes a `visuals: LeafVisuals?` parameter defaulting to `thingsLeafVisuals()`, so the catalog renders in the LEAF identity with no configuration. Passing `null` makes it adopt the host's `MaterialTheme`. The details live in [Catalog: example module](/en/guide/catalog-reference).

## Consuming it

While the module is absent from GitHub Packages, Maven Local is the only verified route:

```bash
# In the leaf-visuals repository
./gradlew publishToMavenLocal

# In the consumer
./gradlew build -Pleaf.useMavenLocal=true
```

```kotlin
implementation("com.opside-leaf:leaf-visuals:1.3.0")
```

::: warning Availability
`leaf-visuals` versions independently of the stable train: its `1.3.0` does not correspond to `%LEAF_VERSION%`. Before depending on it from a module you actually publish, verify it is available in the package repository your build uses.
:::
