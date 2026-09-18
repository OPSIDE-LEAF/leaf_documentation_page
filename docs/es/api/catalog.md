# Catalog

Catalog 1.1.1 es un módulo Kotlin Multiplatform que proporciona un catálogo paginado con búsqueda, filtros, ordenamiento, detalle y acciones configurables. Expone un Feature que el host conecta a su fuente de datos mediante `CatalogGateway`.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-catalog:1.1.1`. Su código fuente corresponde al tag [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_catalog/tree/v1.1.1), revisión [`414ef99`](https://github.com/OPSIDE-LEAF/leaf_catalog/commit/414ef99).

La compatibilidad declarada es LEAF Contracts/Core/Compose 3.1.0; la integración con leaf-visuals 1.4.0 es opcional.

## Dependencia

```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-catalog:1.1.1")
}
```

Catalog declara `leaf-contracts` y `leaf-visuals` como dependencias transitivas (`api`). `leaf-compose` es una dependencia de implementación interna; el host no necesita declararla por separado.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `CatalogModule` | Módulo con factory `create(gateway, builder)` que expone el Feature `browse` |
| `CatalogGateway` | Port que el host implementa para entregar datos paginados, detalle, filtros y opciones de orden |
| `CatalogDsl` | DSL para configurar layout, búsqueda, filtros, paginación, orden, detalle y acciones |
| `CatalogRoute` | Conecta el Feature con Compose; gestiona lista y detalle |

## Responsabilidades del host

La aplicación implementa `CatalogGateway` con al menos `getPage(request)`. Opcionalmente implementa `getDetail`, `getFilters` y `getSortOptions`. También proporciona un `CatalogImageLoader` para renderizar imágenes remotas, controla la navegación exterior y define las acciones de negocio sobre los items.

## Gateway

```kotlin
interface CatalogGateway {
    suspend fun getPage(request: PageRequest): CatalogPage
    suspend fun getDetail(itemId: String): CatalogDetail // opcional
    suspend fun getFilters(): List<CatalogFilter>         // opcional
    suspend fun getSortOptions(): List<SortOption>         // opcional
}
```

Solo `getPage` es obligatorio. Los métodos opcionales tienen implementaciones por defecto que devuelven listas vacías o lanzan `NotImplementedError`.

## Modelo de datos

`CatalogItem` es un tipo fijo, no genérico. El host mapea sus objetos de dominio (películas, productos, partes) a `CatalogItem` en la implementación del gateway:

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

`metadata` es un mapa libre para datos que no tienen campo propio (categoría, ubicación, atributos de filtro). Los filtros del gateway usan las claves de `metadata` para filtrar items.

### PageRequest y CatalogPage

El gateway recibe un `PageRequest` con la búsqueda, filtros, página y orden actuales. Devuelve un `CatalogPage` con los items de esa página:

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

Cuando el usuario selecciona un item y el slot `detail` está habilitado, el módulo llama a `getDetail(itemId)`. El host devuelve la información completa:

```kotlin
data class CatalogDetail(
    val item: CatalogItem,
    val description: String = "",
    val images: List<String> = emptyList(),
    val attributes: Map<String, String> = emptyMap(),
)
```

`images` se combina con `CatalogItem.imageUrl` en el carrusel. `attributes` son pares clave/valor para la ficha técnica (especificaciones, dimensiones).

### CatalogOutputEvent y acciones del host

`CatalogOutputEvent` es una **interfaz abierta** (no `sealed`). El host define sus propios tipos de acción extendiéndola:

```kotlin
import com.opside.leaf.catalog.domain.CatalogOutputEvent

sealed interface MovieAction : CatalogOutputEvent {
    data class Select(val movieId: String) : MovieAction
    data class AddToFavorites(val movieId: String) : MovieAction
}
```

Cuando el usuario ejecuta una acción, el Feature termina con `CatalogResult.ActionPerformed(event)` donde `event` es la instancia del tipo que definiste. El módulo nunca inspecciona el tipo concreto; solo lo transporta.

## Uso

### Implementar el Gateway

El host mapea su modelo de dominio a `CatalogItem` dentro del gateway:

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
                "Año" to movie.year.toString(),
                "Duración" to "${movie.durationMinutes} min",
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

### Configurar el módulo

El módulo se configura con un DSL en `CatalogModule.create`:

```kotlin
import com.opside.leaf.catalog.CatalogModule

val catalog = CatalogModule.create(MovieCatalogGateway(api)) {
    layout { grid(columns = 2) }
    search { placeholder = "Buscar películas…" }
    pagination { pageSize = 20; infinite = true }
    detail { enabled = true; imageCarousel = true }
    actions {
        primary("Ver") { item -> MovieAction.Select(item.id) }
        secondary("Favorito") { item -> MovieAction.AddToFavorites(item.id) }
    }
}
```

::: details Slots del DSL

| Slot | Configuración |
| --- | --- |
| `layout { }` | Presets: `list()`, `grid(columns)`, `adaptive(minWidth)`, `fixedSize(w, h)`. Scroll: `vertical()`, `horizontal()` |
| `card { }` | Orientación: `vertical()`, `horizontal()` |
| `search { }` | `enabled`, `placeholder`, `debounceMs` |
| `detail { }` | `enabled`, `imageCarousel` |
| `pagination { }` | `pageSize`, `infinite`, `showCount` |
| `filters { }` | `enabled`, `chip()`, `sheet()` |
| `sort { }` | `enabled` |
| `actions { }` | `primary(label, handler)`, `secondary(label, handler)` |
:::

### Presentar con Compose

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
                CatalogResult.Dismissed -> { /* sesión cerrada */ }
            }
        },
    )
}
```

El host proporciona `imageLoader` para renderizar imágenes remotas (Coil, Kamel, etc.). El módulo no incluye dependencia de imágenes; cuando no se proporciona, muestra un placeholder con monograma.

`CatalogRoute` también acepta `visuals` (tema visual, por defecto el de LEAF), `darkTheme`, `strings` (localización) y `telemetry` (observabilidad).

## Feature

El Feature usa `CatalogInput`, `CatalogState`, `CatalogEvent` y `CatalogResult`.

**Eventos principales:**

| Evento | Efecto |
| --- | --- |
| `LoadInitial` | Carga la primera página con filtros y orden |
| `SearchChanged(query)` | Reinicia a página 0 con la nueva búsqueda |
| `LoadMore` | Solicita la siguiente página y la agrega |
| `FilterChanged(id, value)` | Activa o limpia un filtro, recarga desde página 0 |
| `SortChanged(sortId)` | Cambia el orden, recarga desde página 0 |
| `ClearFilters` | Limpia todos los filtros activos y recarga desde página 0 |
| `ItemSelected(itemId)` | Navega al detalle del item |
| `BackToList` | Regresa a la lista desde el detalle |
| `Retry` | Reintenta la carga actual tras un error, conservando query/filtros/orden |
| `ItemAction(label, item)` | Invoca una acción del host sobre un item |
