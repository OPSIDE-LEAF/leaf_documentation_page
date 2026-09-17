# Catalog

Catalog 1.1.1 es un módulo Kotlin Multiplatform que proporciona un catálogo paginado con búsqueda, filtros, ordenamiento, detalle y acciones configurables. Expone un Feature que el host conecta a su fuente de datos mediante `CatalogGateway`.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-catalog:1.1.1`. Su código fuente corresponde al tag [`v1.1.1`](https://github.com/OPSIDE-LEAF/leaf_catalog/tree/v1.1.1), revisión [`414ef99`](https://github.com/OPSIDE-LEAF/leaf_catalog/commit/414ef99).

La compatibilidad declarada es LEAF Contracts/Core/Compose 3.1.0; la integración con leaf-visuals 1.4.0 es opcional.

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

## Configuración por DSL

El módulo se configura en `CatalogModule.create`:

```kotlin
val catalog = CatalogModule.create(gateway) {
    layout { adaptive(minWidth = 160) }
    search { placeholder = "Buscar productos…" }
    pagination { pageSize = 20; infinite = true }
    filters { chip() }
    sort { enabled = true }
    detail { enabled = true; imageCarousel = true }
    actions {
        primary("Agregar") { item -> AddToCart(item.id) }
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
| `ItemSelected(itemId)` | Navega al detalle del item |
| `BackToList` | Regresa a la lista desde el detalle |
| `ItemAction(label, item)` | Invoca una acción del host sobre un item |

**Resultados terminales:**

| Resultado | Significado |
| --- | --- |
| `ActionPerformed(event)` | Una acción del host se ejecutó; `event` es el `CatalogOutputEvent` del host |
| `Dismissed` | La sesión se cerró sin acción |

## Compose

```kotlin
CatalogRoute(
    module = catalog,
    input = CatalogInput(),
    visuals = thingsLeafVisuals(),   // opcional
    imageLoader = { url, desc, mod -> AsyncImage(url, desc, mod) },
    strings = CatalogStrings(),       // localización
    telemetry = CatalogTelemetry(),   // observabilidad
    onResult = { result -> /* ... */ },
)
```

El host proporciona `imageLoader` para renderizar imágenes remotas. El módulo no incluye dependencia de imágenes; cuando no se proporciona, muestra un placeholder con monograma.
