# Catalog

Catalog 1.1.1 is a Kotlin Multiplatform module that provides a paginated catalog with search, filters, sorting, detail, and configurable actions. It exposes a Feature that the host connects to its data source through `CatalogGateway`.

## Release and compatibility

The artifact is `com.opside-leaf:leaf-catalog:1.1.1`. Its source code corresponds to tag [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_catalog/tree/v1.1.1), revision [`414ef99`](https://github.com/OPSIDE-LEAF/leaf_catalog/commit/414ef99).

Declared compatibility is LEAF Contracts/Core/Compose 3.1.0; integration with leaf-visuals 1.4.0 is optional.

## Dependency

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-catalog:1.1.1")
}
```

Catalog declares `leaf-contracts` and `leaf-visuals` as transitive dependencies (`api`). `leaf-compose` is an internal implementation dependency; the host does not need to declare it separately.

## Public surface

| API | Responsibility |
| --- | --- |
| `CatalogModule` | Module with `create(gateway, builder)` factory that exposes the `browse` Feature |
| `CatalogGateway` | Port the host implements to deliver paginated data, detail, filters, and sort options |
| `CatalogDsl` | DSL for configuring layout, search, filters, pagination, sorting, detail, and actions |
| `CatalogRoute` | Connects the Feature to Compose; manages list and detail |

## Host responsibilities

The application implements `CatalogGateway` with at least `getPage(request)`. It optionally implements `getDetail`, `getFilters`, and `getSortOptions`. It also provides a `CatalogImageLoader` for rendering remote images, controls external navigation, and defines business actions on items.

## Gateway

```kotlin
interface CatalogGateway {
    suspend fun getPage(request: PageRequest): CatalogPage
    suspend fun getDetail(itemId: String): CatalogDetail // optional
    suspend fun getFilters(): List<CatalogFilter>         // optional
    suspend fun getSortOptions(): List<SortOption>         // optional
}
```

Only `getPage` is required. Optional methods have default implementations that return empty lists or throw `NotImplementedError`.

## DSL configuration

The module is configured in `CatalogModule.create`:

```kotlin
val catalog = CatalogModule.create(gateway) {
    layout { adaptive(minWidth = 160) }
    search { placeholder = "Search products…" }
    pagination { pageSize = 20; infinite = true }
    filters { chip() }
    sort { enabled = true }
    detail { enabled = true; imageCarousel = true }
    actions {
        primary("Add") { item -> AddToCart(item.id) }
    }
}
```

::: details DSL slots

| Slot | Configuration |
| --- | --- |
| `layout { }` | Presets: `list()`, `grid(columns)`, `adaptive(minWidth)`, `fixedSize(w, h)`. Scroll: `vertical()`, `horizontal()` |
| `card { }` | Orientation: `vertical()`, `horizontal()` |
| `search { }` | `enabled`, `placeholder`, `debounceMs` |
| `detail { }` | `enabled`, `imageCarousel` |
| `pagination { }` | `pageSize`, `infinite`, `showCount` |
| `filters { }` | `enabled`, `chip()`, `sheet()` |
| `sort { }` | `enabled` |
| `actions { }` | `primary(label, handler)`, `secondary(label, handler)` |
:::

## Feature

The Feature uses `CatalogInput`, `CatalogState`, `CatalogEvent`, and `CatalogResult`.

**Main events:**

| Event | Effect |
| --- | --- |
| `LoadInitial` | Loads the first page with filters and sort |
| `SearchChanged(query)` | Resets to page 0 with the new search |
| `LoadMore` | Requests the next page and appends it |
| `FilterChanged(id, value)` | Sets or clears a filter, reloads from page 0 |
| `SortChanged(sortId)` | Changes sort order, reloads from page 0 |
| `ItemSelected(itemId)` | Navigates to item detail |
| `BackToList` | Returns to list from detail |
| `ClearFilters` | Clears all active filters and reloads from page 0 |
| `Retry` | Retries the current load after an error, keeping query/filters/sort |
| `ItemAction(label, item)` | Invokes a host action on an item |

**Terminal results:**

| Result | Meaning |
| --- | --- |
| `ActionPerformed(event)` | A host action fired; `event` is the host's `CatalogOutputEvent` |
| `Dismissed` | Session closed without action |

## Compose

```kotlin
CatalogRoute(
    module = catalog,
    input = CatalogInput(),
    visuals = thingsLeafVisuals(),   // optional
    imageLoader = { url, desc, mod -> AsyncImage(url, desc, mod) },
    strings = CatalogStrings(),       // localization
    telemetry = CatalogTelemetry(),   // observability
    onResult = { result -> /* ... */ },
)
```

The host provides `imageLoader` for rendering remote images. The module ships no image dependency; when none is provided, it shows a monogram placeholder.
