# Módulos reutilizables y `ModuleInfo`

Un módulo encapsula una capacidad concreta y completa que una aplicación necesita. Puede resolver autenticación, pagos, validaciones, formularios u otra función que normalmente aparecería en varios proyectos. En lugar de volver a implementar esa lógica, una aplicación integra el módulo mediante su contrato público.

## Por qué reutilizar módulos

Las capacidades comunes son buenas candidatas para convertirse en módulos porque suelen requerir las mismas reglas, casos de error y medidas de seguridad en distintas aplicaciones. Resolverlas una vez permite reutilizar el trabajo y evita que cada equipo comience desde cero.

El ahorro no está solo en escribir menos código. También se reutilizan decisiones de diseño, pruebas, manejo de errores y controles de seguridad. Esto reduce el tiempo necesario para entregar una capacidad conocida y permite dedicar más esfuerzo a las funciones que diferencian al producto y generan valor para sus usuarios.

LEAF facilita este reúso mediante contratos pequeños y explícitos. Un módulo con una responsabilidad clara puede evolucionar y probarse de forma independiente. La aplicación que lo consume mantiene el control de su infraestructura, apariencia y navegación externa.

## Hojas y árbol

Cada módulo LEAF funciona como una **hoja** lista para conectarse a una aplicación. El host funciona como el **tronco**: construye los módulos, proporciona red, almacenamiento, SDK y otras capacidades externas, y decide cómo se relacionan dentro del producto. El conjunto forma un árbol sin obligar a todas las hojas a depender entre sí.

Modularizar no consiste en convertir cada función pequeña en un proyecto separado. Conviene extraer una capacidad cuando tiene una responsabilidad completa, un contrato estable y una posibilidad real de reutilizarse. Así el catálogo puede crecer con módulos útiles y no con fragmentos difíciles de integrar.

## Qué hace confiable a un módulo

Un módulo reutilizable debe incluir pruebas de sus reglas, casos de error y límites de seguridad. También necesita un contrato versionado y pruebas de integración desde una aplicación consumidora. Para módulos con UI, deben probarse sus estados, eventos, navegación interna y resultados. Para módulos que manejan datos sensibles, también deben revisarse la exposición de datos, las dependencias y los permisos.

Ningún software puede garantizar la ausencia total de bugs o vulnerabilidades. El objetivo es reducir ese riesgo al concentrar la lógica común, probarla de forma repetible y corregirla en un único módulo. Las aplicaciones reciben esas mejoras cuando actualizan a la versión corregida.

## Identidad y API pública

Un módulo implementa `Module` y expone mediante propiedades las funciones que otros proyectos pueden usar. `ModuleInfo(id, version)` identifica el módulo y su versión en errores y telemetría.

<!-- kotlin-snippet: compiled: modules-action -->
```kotlin
import com.ops.leaf_core.api.Action
import com.ops.leaf_core.api.Module
import com.ops.leaf_core.api.ModuleInfo
import com.ops.leaf_core.api.action

data class QuoteRequest(val quantity: Int)
data class Quote(val totalMinorUnits: Long)

class QuoteModule(
    private val calculate: suspend (QuoteRequest) -> Quote,
) : Module {
    override val info = ModuleInfo("com.example.quote", "1.0.0")
    val quote: Action<QuoteRequest, Quote> = action(info, calculate)
}
```

## Límites del módulo

El constructor declara las capacidades externas que necesita el módulo. El host las proporciona; el módulo no debe obtener servicios globales ni imponer una tecnología de red, almacenamiento o permisos.

Si el módulo no proporciona UI, expón una Action. Si proporciona cualquier UI, expón un Workflow y define en el contrato sus estados, eventos, efectos y output. El Workflow puede controlar una o varias pantallas y su navegación interna. El host controla dónde se abre el módulo y qué ocurre fuera de él cuando recibe el output.
