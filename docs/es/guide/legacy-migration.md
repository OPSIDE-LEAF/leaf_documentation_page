# Migración histórica: LEAF 1.x a 2.0.1

::: info Alcance histórico
Esta página conserva la transición que eliminó el registro dinámico en LEAF 2.0.1. Sus ejemplos `stay` / `finish` pertenecen deliberadamente a esa versión y no son la API de Feature `3.0.0`. Para código actual usa la [migración de Feature 2 a 3](/es/guide/feature-migration).
:::

## Qué cambió entre Leaf 1.x y Leaf 2.x

La arquitectura anterior se basaba en un **registro dinámico**: los módulos se instalaban en el Core y se invocaban de forma indirecta. Leaf 2.x la reemplaza por la **ruta local tipada**:

| | Legacy (1.x) | Leaf 2.x |
|---|---|---|
| Invocación | Registro + resolución dinámica | Referencia Kotlin directa y tipada |
| Payloads | Mapas / payloads genéricos | Tipos de dominio (`Input`, `State`, `Event`, `Output`) |
| Errores de integración | Runtime | **Compile-time** |
| Instalación de módulos | Requerida | No existe: el host construye el módulo |
| Sesiones | Manuales | `FeatureSession` administrada por Core |

En 2.x quedan prohibidos en la ruta local: `Map<String, Any?>`, payloads genéricos, codecs, casts no comprobados, registry, instalación e invocación manual.

## Estado posterior observado

| Módulo | Paquete posterior | Estado observado en el workspace |
|---|---|---|
| leaf-authentication | `com.ops.leaf_authentication` | Implementación Action tipada `0.1.0` sobre LEAF 2.0.1. |
| leaf-email | `com.opside.leaf.email` | Implementación Action `1.0.0` observada en el `origin/main` fetched. |
| leaf-catalog | `com.opside.leaf.catalog` | Implementación Feature/UI/DSL `1.0.0` observada en el `origin/main` fetched. |

::: warning No mezclar esta sintaxis con LEAF 3
Las implementaciones anteriores declaran LEAF 2.0.1 y no formaron parte del release 3.0.0. Migra y valida cada consumer antes de combinar líneas.
:::

## Estrategia de migración

Esta fue la estrategia usada para llegar al modelo 2.0.1:

1. **Crea el repositorio 2.x** como proyecto independiente con Gradle y ABI validation.
2. **Modela el dominio con tipos**: reemplaza payloads genéricos por `Input`, `State`, `Event` y `Result` (`sealed interface` para eventos y resultados).
3. **Convierte los servicios en ports**: cada dependencia externa se vuelve una interface (gateway) cuya implementación entrega el host.
4. **Reescribe la capability**: la lógica de manejo se convierte en una `Action` (operación finita) o una `Feature` con transiciones `stay`/`finish`.
5. **Mueve los errores de negocio al tipo de salida**: lo que antes era excepción o código de error se vuelve variante del `Result`.
6. **Elimina el registro**: borra cualquier instalación/lookup; el host construye el módulo por constructor.
7. **Agrega UI Route/Screen** si el módulo tiene interfaz.
8. **Tests + ABI + clean consumer** antes de publicar ([validación y publicación](/es/guide/module-publishing)).

## Autenticación como ejemplo didáctico

Una autenticación sin formulario interactivo puede migrar a una `Action`:

```kotlin
class AuthenticationModule(
    private val gateway: AuthenticationGateway,
) : Module {
    override val info = ModuleInfo(
        id = "com.example.authentication",
        version = "1.0.0",
    )

    val authenticate = action<AuthenticationRequest, AuthenticationResult>(
        moduleInfo = info,
    ) { request ->
        gateway.authenticate(request.email, request.secret)
    }
}
```

::: info Ejemplo didáctico
Este ejemplo histórico muestra la frontera de LEAF 2.0.1; no describe la implementación Authentication observada ni una autenticación de producción. En producción añade transporte seguro, protección de credenciales, límites de intento y políticas del proveedor de identidad: LEAF no entrega esas garantías por sí solo.
:::
