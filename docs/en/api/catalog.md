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

## Data model

`CatalogItem` is a fixed type, not generic. The host maps its domain objects (movies, products, parts) to `CatalogItem` in the gateway implementation:

```kotlin
data class CatalogItem(
    val id: String,
    val title: String,
    val subtitle: String? = null,
    val imageUrl: String? = null,
    val price: CatalogPrice? = null,
    val badges: List<CatalogBadge> = emptyList(),
    val metadata: Map<String, String> = emptyMap(),
)
```

`metadata` is a free-form map for data that has no dedicated field (category, location, filter attributes). The gateway's filters use `metadata` keys to filter items.

### PageRequest and CatalogPage

The gateway receives a `PageRequest` with the current search, filters, page, and sort. It returns a `CatalogPage` with items for that page:

```kotlin
data class PageRequest(
    val query: String = "",
    val filters: Map<String, String> = emptyMap(),
    val page: Int = 0,
    val pageSize: Int = 20,
    val sort: String? = null,
)

data class CatalogPage(
    val items: List<CatalogItem>,
    val totalCount: Int? = null,
    val hasMore: Boolean = false,
)
```

### CatalogDetail

When the user selects an item and the `detail` slot is enabled, the module calls `getDetail(itemId)`. The host returns the complete information:

```kotlin
data class CatalogDetail(
    val item: CatalogItem,
    val description: String = "",
    val images: List<String> = emptyList(),
    val attributes: Map<String, String> = emptyMap(),
)
```

`images` is combined with `CatalogItem.imageUrl` in the carousel. `attributes` are key/value pairs for the spec sheet (specifications, dimensions).

### CatalogOutputEvent and host actions

`CatalogOutputEvent` is an **open interface** (not `sealed`). The host defines its own action types by extending it:

```kotlin
import com.opside.leaf.catalog.domain.CatalogOutputEvent

sealed interface MovieAction : CatalogOutputEvent {
    data class Select(val movieId: String) : MovieAction
    data class AddToFavorites(val movieId: String) : MovieAction
}
```

When the user triggers an action, the Feature completes with `CatalogResult.ActionPerformed(event)` where `event` is the instance of the type you defined. The module never inspects the concrete type; it only transports it.

## Usage

### Implement the Gateway

The host maps its domain model to `CatalogItem` inside the gateway:

```kotlin
import com.opside.leaf.catalog.domain.CatalogItem
import com.opside.leaf.catalog.domain.CatalogPage
import com.opside.leaf.catalog.domain.CatalogDetail
import com.opside.leaf.catalog.domain.PageRequest
import com.opside.leaf.catalog.gateway.CatalogGateway

class MovieCatalogGateway(private val api: MovieApi) : CatalogGateway {

    override suspend fun getPage(request: PageRequest): CatalogPage {
        val response = api.searchMovies(
            query = request.query,
            page = request.page,
            pageSize = request.pageSize,
        )
        return CatalogPage(
            items = response.movies.map { it.toCatalogItem() },
            totalCount = response.total,
            hasMore = response.hasNextPage,
        )
    }

    override suspend fun getDetail(itemId: String): CatalogDetail {
        val movie = api.getMovie(itemId)
        return CatalogDetail(
            item = movie.toCatalogItem(),
            description = movie.synopsis,
            images = movie.stills,
            attributes = mapOf(
                "Director" to movie.director,
                "Year" to movie.year.toString(),
                "Duration" to "${movie.durationMinutes} min",
            ),
        )
    }
}

private fun Movie.toCatalogItem() = CatalogItem(
    id = id,
    title = title,
    subtitle = "$year · $director",
    imageUrl = posterUrl,
    metadata = mapOf("genre" to genre),
)
```

### Configure the module

The module is configured with a DSL in `CatalogModule.create`:

```kotlin
import com.opside.leaf.catalog.CatalogModule

val catalog = CatalogModule.create(MovieCatalogGateway(api)) {
    layout { grid(columns = 2) }
    search { placeholder = "Search movies…" }
    pagination { pageSize = 20; infinite = true }
    detail { enabled = true; imageCarousel = true }
    actions {
        primary("View") { item -> MovieAction.Select(item.id) }
        secondary("Favorite") { item -> MovieAction.AddToFavorites(item.id) }
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

### Present with Compose

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.opside.leaf.catalog.CatalogModule
import com.opside.leaf.catalog.domain.CatalogInput
import com.opside.leaf.catalog.domain.CatalogResult
import com.opside.leaf.catalog.ui.CatalogRoute

@Composable
fun MovieCatalogScreen(
    onMovieSelected: (String) -> Unit,
) {
    val catalog = remember { createMovieCatalog() }
    CatalogRoute(
        module = catalog,
        input = CatalogInput(),
        imageLoader = { url, desc, mod -> AsyncImage(url, desc, mod) },
        onResult = { result ->
            when (result) {
                is CatalogResult.ActionPerformed -> {
                    when (val action = result.event as MovieAction) {
                        is MovieAction.Select -> onMovieSelected(action.movieId)
                        is MovieAction.AddToFavorites -> { /* ... */ }
                    }
                }
                CatalogResult.Dismissed -> { /* session closed */ }
            }
        },
    )
}
```

The host provides `imageLoader` for rendering remote images (Coil, Kamel, etc.). The module ships no image dependency; when none is provided, it shows a monogram placeholder.

`CatalogRoute` also accepts `visuals` (visual theme, LEAF default), `darkTheme`, `strings` (localization), and `telemetry` (observability).

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
| `ClearFilters` | Clears all active filters and reloads from page 0 |
| `ItemSelected(itemId)` | Navigates to item detail |
| `BackToList` | Returns to list from detail |
| `Retry` | Retries the current load after an error, keeping query/filters/sort |
| `ItemAction(label, item)` | Invokes a host action on an item |
