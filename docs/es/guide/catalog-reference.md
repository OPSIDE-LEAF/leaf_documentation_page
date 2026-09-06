# Catálogo: módulo de ejemplo (Feature con UI)

::: warning Línea LEAF 2.0.1
Esta página conserva la API del módulo Catalog `1.0.0` observada en su `origin/main`, que declara LEAF `2.0.1`. Sus nombres y DSL no deben interpretarse como una referencia de Feature `3.0.0`. El módulo no forma parte del release LEAF 3.
:::

`leaf-catalog` (`com.opside-leaf:leaf-catalog:1.0.0`, paquete `com.opside.leaf.catalog`, [repo](https://github.com/OPSIDE-LEAF/leaf-catalog)) es un módulo de dominio **Feature con UI Compose** para navegar colecciones paginadas: grilla/lista, búsqueda, filtros, orden, detalle y acciones. Sigue **Pattern A (Host Gateway)**: el host implementa la fuente de datos, el módulo trae la UI, la lógica y un **DSL** para activar y configurar cada parte.

## El recorrido de la Feature

```text
CatalogGateway (datos del host)  +  DSL (config)
        |
CatalogModule.create(gateway) { … } : Module
        |
val browse: Feature<CatalogInput, CatalogState, CatalogEvent, CatalogResult>
        |
CatalogRoute(module, onResult = …)   ← conector Compose
        |
browse ↔ detail (navegación interna)  →  onResult:
   CatalogResult.ActionPerformed(event)   // una acción de item disparó
   CatalogResult.Dismissed                // sesión cancelada por el host
```

## El puerto: `CatalogGateway`

El host implementa la fuente de datos. Solo `getPage` es obligatoria; el resto trae defaults, así que un host de solo lectura (sin detalle, filtros ni orden) implementa una sola función.

```kotlin
interface CatalogGateway {
    suspend fun getPage(request: PageRequest): CatalogPage
    suspend fun getDetail(itemId: String): CatalogDetail = /* default: NotImplementedError */
    suspend fun getFilters(): List<CatalogFilter> = emptyList()
    suspend fun getSortOptions(): List<SortOption> = emptyList()
}
```

`getPage` recibe un **`PageRequest`** en lugar de parámetros posicionales: así el request puede crecer con campos nuevos (cursor, multi-orden, rango de precio…) **sin romper** las implementaciones existentes del gateway.

```kotlin
data class PageRequest(
    val query: String = "",
    val filters: Map<String, String> = emptyMap(),
    val page: Int = 0,
    val pageSize: Int = 20,
    val sort: String? = null,   // id del SortOption activo, o null = orden por defecto
)
```

## Modelos

```kotlin
data class CatalogItem(
    val id: String,
    val title: String,
    val subtitle: String? = null,
    val imageUrl: String? = null,
    val price: CatalogPrice? = null,          // opcional — dominios no-comercio lo omiten
    val badges: List<CatalogBadge> = emptyList(),
    val metadata: Map<String, String> = emptyMap(),   // escape hatch de datos del host
)

data class CatalogPrice(val amount: Double, val currency: String, val formatted: String)
data class CatalogBadge(val label: String, val type: BadgeType = BadgeType.Info)
enum class BadgeType { Info, Success, Warning, Error }

data class CatalogPage(val items: List<CatalogItem>, val totalCount: Int? = null, val hasMore: Boolean = false)

data class CatalogDetail(
    val item: CatalogItem,
    val description: String = "",
    val images: List<String> = emptyList(),           // carrusel (si imageCarousel)
    val attributes: Map<String, String> = emptyMap(),
)

data class CatalogFilter(val id: String, val label: String, val options: List<FilterOption>)
data class FilterOption(val value: String, val label: String, val count: Int? = null)
data class SortOption(val id: String, val label: String)
```

## El DSL

Cada slot es independiente, con default, y agregar uno nuevo no rompe a nadie (campo con default en `CatalogConfig`).

```kotlin
val module = CatalogModule.create(gateway) {
    layout { grid(columns = 2); vertical() }   // ver «Layout» abajo
    card   { vertical() }                      // orden interno de la card
    search { placeholder = "Buscar…"; debounceMs = 300 }
    filters { chip() }                         // o sheet()
    sort   { enabled = true }                  // usa getSortOptions()
    detail { enabled = true; imageCarousel = true }
    pagination { pageSize = 20; infinite = true; showCount = true }
    actions {
        primary("Agregar")   { item -> AddToCart(item.id) }
        secondary("Favorito") { item -> ToggleFavorite(item.id) }
    }
}
```

### Layout — dos ejes ortogonales + scroll

El layout se modela como **`tracks` × `cell`** (cuántas pistas × cómo se dimensiona la card), más la **dirección de scroll**. El DSL ofrece presets (azúcar) y setters granulares:

```kotlin
layout {
    // Presets
    list()                       // 1 pista, cards que se estiran
    grid(columns = 2)            // N pistas fijas
    adaptive(minWidth = 160)     // pistas automáticas, card ≥ minWidth (default)
    fixedSize(width = 160)       // pistas automáticas, card de tamaño exacto
    fixed(count = 2, width = 160, height = 240)  // N pistas + tamaño exacto (rígido)

    // Granular
    columns(2); auto()                          // tracks
    stretch(); minWidth(160); cardSize(160, 240) // cell

    // Scroll
    vertical()    // o horizontal() — en horizontal, `count` son filas
}
```

| Preset | Cuenta | Tamaño |
|---|---|---|
| `list` | 1 | se estira |
| `grid(n)` | eliges N | se estira |
| `adaptive` | auto | mínimo, se estira |
| `fixedSize` | auto | exacto |
| `fixed(count,…)` | eliges N | exacto (rígido) |

### Card — orientación interna (independiente del layout)

```kotlin
card { vertical() }     // imagen arriba, texto/acciones abajo
card { horizontal() }   // imagen a la izquierda, texto/acciones a la derecha
// sin card { }  → auto: horizontal para list, vertical para el resto
```

## Acciones y resultado

Las acciones son **definidas por el host**: cualquier cantidad, cada una produce un `CatalogOutputEvent` propio. El módulo nunca inspecciona el payload; lo entrega por `onResult`.

```kotlin
// El host declara sus eventos subclaseando la interfaz ABIERTA:
data class AddToCart(val id: String) : CatalogOutputEvent
data class ToggleFavorite(val id: String) : CatalogOutputEvent

sealed interface CatalogResult {
    data class ActionPerformed(val event: CatalogOutputEvent) : CatalogResult
    data object Dismissed : CatalogResult
}
```

::: tip
`CatalogOutputEvent` es una interfaz **abierta** (no `sealed`) a propósito: el host declara sus propios subtipos en su código. Una acción hace `finish()` → termina la sesión de browse; el host reinicia con `key(…)` si quiere seguir navegando.
:::

## Renderizado y puntos de extensión del host

```kotlin
CatalogRoute(
    module = module,
    onResult = { result -> route(result) },

    // Todos opcionales:
    imageLoader = { url, cd, m -> AsyncImage(model = url, contentDescription = cd, modifier = m) },
    strings = CatalogStrings(resultsSuffix = "resultados", loadMore = "Cargar más", /* … */),
    telemetry = CatalogTelemetry(onSearch = { /* analytics */ }, onItemOpen = { /* … */ }),
    visuals = thingsLeafVisuals(),   // default: identidad LEAF Things; null = hereda el tema del host
)
```

| Punto | Tipo | Para qué |
|---|---|---|
| `imageLoader` | `CatalogImageLoader` = `@Composable (url, contentDescription, Modifier) -> Unit` | El módulo **no** trae cargador de imágenes; el host enchufa Coil/Kamel/el suyo. Sin él → placeholder |
| `strings` | `CatalogStrings` | Labels de UI overridables (i18n) |
| `telemetry` | `CatalogTelemetry` | Hooks: `onSearch`, `onFilterChange`, `onSort`, `onItemOpen` |
| `visuals` | `LeafVisuals?` | Tema del catálogo. Default `thingsLeafVisuals()` (LEAF Things, desde [`leaf-visuals`](https://github.com/OPSIDE-LEAF/leaf-visuals)); `null` = adopta el `MaterialTheme` del host |

## Debug

`module.configSummary(): List<Pair<String, String>>` devuelve un resumen legible de la configuración **resuelta** (layout, search, filters, pagination, sort, detail, actions) — útil para paneles de debug/telemetría; refleja lo que produjo el DSL.

## Estado

Feature-complete, validado en `leaf_test_app` con **dos consumidores** de dominios distintos (una tienda de productos y una "Cineteca" de películas), lo que prueba su reusabilidad. Publica variantes Android (AAR), iOS Arm64, iOS Simulator Arm64 y metadata KMP.
