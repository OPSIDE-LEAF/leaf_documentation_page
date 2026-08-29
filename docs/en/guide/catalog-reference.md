# Catalog: example module (Feature with UI)

`leaf-catalog` (`com.opside-leaf:leaf-catalog:1.0.0`, package `com.opside.leaf.catalog`, [repo](https://github.com/OPSIDE-LEAF/leaf-catalog)) is a **Feature-with-Compose-UI** domain module for browsing paginated collections: grid/list, search, filters, sorting, detail and actions. It follows **Pattern A (Host Gateway)**: the host implements the data source, the module owns the UI and logic, and a **DSL** enables and configures each part.

## The Feature flow

```text
CatalogGateway (host data)  +  DSL (config)
        |
CatalogModule.create(gateway) { … } : Module
        |
val browse: Feature<CatalogInput, CatalogState, CatalogEvent, CatalogResult>
        |
CatalogRoute(module, onResult = …)   ← Compose connector
        |
browse ↔ detail (internal navigation)  →  onResult:
   CatalogResult.ActionPerformed(event)   // an item action fired
   CatalogResult.Dismissed                // session cancelled by the host
```

## The port: `CatalogGateway`

The host implements the data source. Only `getPage` is required; the rest carry defaults, so a display-only host (no detail, filters or sort) implements a single function.

```kotlin
interface CatalogGateway {
    suspend fun getPage(request: PageRequest): CatalogPage
    suspend fun getDetail(itemId: String): CatalogDetail = /* default: NotImplementedError */
    suspend fun getFilters(): List<CatalogFilter> = emptyList()
    suspend fun getSortOptions(): List<SortOption> = emptyList()
}
```

`getPage` takes a **`PageRequest`** instead of positional parameters: the request can grow new fields (cursor, multi-sort, price range…) **without breaking** existing gateway implementations.

```kotlin
data class PageRequest(
    val query: String = "",
    val filters: Map<String, String> = emptyMap(),
    val page: Int = 0,
    val pageSize: Int = 20,
    val sort: String? = null,   // id of the active SortOption, or null = source default
)
```

## Models

```kotlin
data class CatalogItem(
    val id: String,
    val title: String,
    val subtitle: String? = null,
    val imageUrl: String? = null,
    val price: CatalogPrice? = null,          // optional — non-commerce domains omit it
    val badges: List<CatalogBadge> = emptyList(),
    val metadata: Map<String, String> = emptyMap(),   // host data escape hatch
)

data class CatalogPrice(val amount: Double, val currency: String, val formatted: String)
data class CatalogBadge(val label: String, val type: BadgeType = BadgeType.Info)
enum class BadgeType { Info, Success, Warning, Error }

data class CatalogPage(val items: List<CatalogItem>, val totalCount: Int? = null, val hasMore: Boolean = false)

data class CatalogDetail(
    val item: CatalogItem,
    val description: String = "",
    val images: List<String> = emptyList(),           // carousel (when imageCarousel)
    val attributes: Map<String, String> = emptyMap(),
)

data class CatalogFilter(val id: String, val label: String, val options: List<FilterOption>)
data class FilterOption(val value: String, val label: String, val count: Int? = null)
data class SortOption(val id: String, val label: String)
```

## The DSL

Each slot is independent, with a default, and adding a new one is non-breaking (a field with a default on `CatalogConfig`).

```kotlin
val module = CatalogModule.create(gateway) {
    layout { grid(columns = 2); vertical() }   // see «Layout» below
    card   { vertical() }                      // card content orientation
    search { placeholder = "Search…"; debounceMs = 300 }
    filters { chip() }                         // or sheet()
    sort   { enabled = true }                  // uses getSortOptions()
    detail { enabled = true; imageCarousel = true }
    pagination { pageSize = 20; infinite = true; showCount = true }
    actions {
        primary("Add")      { item -> AddToCart(item.id) }
        secondary("Favorite") { item -> ToggleFavorite(item.id) }
    }
}
```

### Layout — two orthogonal axes + scroll

Layout is modelled as **`tracks` × `cell`** (how many tracks × how each card is sized), plus the **scroll direction**. The DSL offers presets (sugar) and granular setters:

```kotlin
layout {
    // Presets
    list()                       // 1 track, cards stretch
    grid(columns = 2)            // N fixed tracks
    adaptive(minWidth = 160)     // auto tracks, card ≥ minWidth (default)
    fixedSize(width = 160)       // auto tracks, exact-size card
    fixed(count = 2, width = 160, height = 240)  // N tracks + exact size (rigid)

    // Granular
    columns(2); auto()                          // tracks
    stretch(); minWidth(160); cardSize(160, 240) // cell

    // Scroll
    vertical()    // or horizontal() — when horizontal, `count` means rows
}
```

| Preset | Count | Size |
|---|---|---|
| `list` | 1 | stretch |
| `grid(n)` | you pick N | stretch |
| `adaptive` | auto | minimum, stretch |
| `fixedSize` | auto | exact |
| `fixed(count,…)` | you pick N | exact (rigid) |

### Card — content orientation (independent of layout)

```kotlin
card { vertical() }     // image on top, text/actions below
card { horizontal() }   // image on the left, text/actions on the right
// no card { }  → auto: horizontal for list, vertical otherwise
```

## Actions and result

Actions are **host-defined**: any number, each producing its own `CatalogOutputEvent`. The module never inspects the payload; it hands it back via `onResult`.

```kotlin
// The host declares its events by subclassing the OPEN interface:
data class AddToCart(val id: String) : CatalogOutputEvent
data class ToggleFavorite(val id: String) : CatalogOutputEvent

sealed interface CatalogResult {
    data class ActionPerformed(val event: CatalogOutputEvent) : CatalogResult
    data object Dismissed : CatalogResult
}
```

::: tip
`CatalogOutputEvent` is an **open** interface (not `sealed`) on purpose: the host declares its own subtypes in its own code. An action calls `finish()` → it ends the browse session; the host restarts it with `key(…)` to keep browsing.
:::

## Rendering and host extension points

```kotlin
CatalogRoute(
    module = module,
    onResult = { result -> route(result) },

    // All optional:
    imageLoader = { url, cd, m -> AsyncImage(model = url, contentDescription = cd, modifier = m) },
    strings = CatalogStrings(resultsSuffix = "results", loadMore = "Load more", /* … */),
    telemetry = CatalogTelemetry(onSearch = { /* analytics */ }, onItemOpen = { /* … */ }),
    visuals = thingsLeafVisuals(),   // default: LEAF Things identity; null = inherit the host theme
)
```

| Point | Type | Purpose |
|---|---|---|
| `imageLoader` | `CatalogImageLoader` = `@Composable (url, contentDescription, Modifier) -> Unit` | The module ships **no** image loader; the host plugs in Coil/Kamel/its own. Absent → placeholder |
| `strings` | `CatalogStrings` | Host-overridable UI labels (i18n) |
| `telemetry` | `CatalogTelemetry` | Hooks: `onSearch`, `onFilterChange`, `onSort`, `onItemOpen` |
| `visuals` | `LeafVisuals?` | The catalog theme. Default `thingsLeafVisuals()` (LEAF Things, from [`leaf-visuals`](https://github.com/OPSIDE-LEAF/leaf-visuals)); `null` = adopt the host `MaterialTheme` |

## Debug

`module.configSummary(): List<Pair<String, String>>` returns a readable summary of the **resolved** configuration (layout, search, filters, pagination, sort, detail, actions) — handy for debug/telemetry panels; it reflects whatever the DSL produced.

## Status

Feature-complete, validated in `leaf_test_app` with **two consumers** across different domains (a product store and a movie "Cineteca"), proving its reusability. It publishes Android (AAR), iOS Arm64, iOS Simulator Arm64 variants and KMP metadata.
