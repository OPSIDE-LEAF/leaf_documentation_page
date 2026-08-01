# Migración desde la arquitectura legacy

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

## Módulos pendientes de migración

| Módulo | Paquete | Notas |
|---|---|---|
| leaf-authentication | `com.ops.authentication` | Usa Core `1.0` y el registro antiguo. **Incompatible con LEAF 2.** |
| leaf-email | `com.ops.email` | Arquitectura anterior |
| leaf-catalog | `com.ops.catalog` | Arquitectura anterior |

::: warning No mezclar trenes
No combines módulos legacy con artefactos del tren estable `2.0.1` en el mismo host. Migra el módulo primero.
:::

## Estrategia de migración

`leaf_login` es la referencia del modelo destino. Para migrar un módulo legacy:

1. **Crea el repositorio 2.x** siguiendo el [setup del autor](/es/guide/module-setup) (repos independiente, Gradle, ABI).
2. **Modela el dominio con tipos**: reemplaza payloads genéricos por `Input`, `State`, `Event` y `Result` (`sealed interface` para eventos y resultados).
3. **Convierte los servicios en puertos**: cada dependencia externa se vuelve una interface (gateway) cuya implementación entrega el host.
4. **Reescribe la capacidad**: la lógica de manejo se convierte en una `Action` (operación finita) o una `Feature` con transiciones `stay`/`finish`.
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
Este ejemplo muestra la frontera de LEAF; no es una migración del módulo `leaf-authentication` legacy ni una autenticación de producción. En producción añade transporte seguro, protección de credenciales, límites de intento y políticas del proveedor de identidad — LEAF no entrega esas garantías por sí solo.
:::
