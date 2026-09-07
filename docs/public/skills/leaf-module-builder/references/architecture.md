# Arquitectura y tecnologías

## Elegir el límite del módulo

Una capacidad merece un módulo cuando agrupa reglas que distintas aplicaciones
pueden necesitar y permite definir una entrada y un resultado comprensibles.
Autenticación, selección de dirección o checkout son ejemplos. La ruta del menú,
el texto de bienvenida de una marca o el orden de pantallas del producto suelen
pertenecer al Host.

Pregúntate: ¿otro Host puede usarlo cambiando sus adaptadores, sin modificar el
dominio? Si necesita importar una Activity concreta, rutas de la app o su backend
de pruebas, el límite aún depende de ese Host.

Un módulo puede agrupar varias Actions de una misma capacidad: iniciar sesión,
restaurarla y cerrarla. No mezcles autenticación, facturación y navegación global
solo porque una pantalla las use juntas.

## Arquitectura recomendada, proporcional al caso

| Parte | Qué contiene | Qué evita |
| --- | --- | --- |
| Contrato público | Inputs, outputs, errores, capacidades y configuración | Tipos internos de un SDK o del Host |
| Dominio | Invariantes, valores y decisiones de negocio | Android Context, UIKit, HTTP y Compose |
| Aplicación | Casos de uso, Actions o reducción del Workflow | Presentar pantallas o configurar un servidor |
| Puertos | Interfaces pequeñas para backend, storage, reloj o presentación externa | Una interfaz gigante que replique toda una app |
| Adaptadores | HTTP, almacenamiento, SDK y conversión de datos | Imponer su implementación a todos los consumidores |
| Presentación | Pantallas y enlace de estado/eventos | Repetir la lógica de negocio |
| Host | Configuración, composición, lifecycle y navegación externa | Acceso a detalles privados del módulo |

Comienza con paquetes en un módulo Gradle. Extrae subproyectos cuando permita
distribuir adaptadores opcionales, aislar dependencias pesadas o tener una UI
intercambiable. Una estructura posible, no obligatoria:

```text
module/
  src/commonMain/kotlin/.../
    api/
    domain/
    application/
    ports/
  src/commonTest/kotlin/.../
adapters/http/       (solo si se ofrece ese adaptador)
adapters/storage/    (solo si se necesita persistencia)
ui/                 (solo si el módulo ofrece presentación compartida)
samples/android/    (Host de ejemplo)
samples/ios/        (Host de ejemplo)
```

Los nombres se adaptan al repositorio. No crees directorios o capas vacías.

## Dependencias por decisión

| Fase o necesidad | Primera opción | Cuándo elegir otra |
| --- | --- | --- |
| Contratos y lógica compartida | Kotlin Multiplatform y Contracts | Función o modelo puro puede no necesitar LEAF |
| Ejecución y cancelación de sesiones | Core en la composición del Host | Una Action permite ejecución directa si el Host asume su lifecycle; documenta lo que no usa del runtime |
| UI compartida | Compose Multiplatform + adaptador LEAF Compose | SwiftUI/UIKit o Android Views cuando el producto conserva UI nativa |
| Diseño visual | Tema del Host | Visuals si el equipo quiere sus primitivas; es opcional |
| Trabajo suspendido y pruebas | Coroutines y coroutines-test cuando se necesitan | No agregues scopes globales para eludir ownership |
| HTTP | Puerto propio y cliente existente del proyecto | Ktor si se requiere un adaptador HTTP KMP |
| Serialización | Tipos del dominio separados del protocolo HTTP | kotlinx.serialization en el adaptador que usa JSON |
| Persistencia | Puerto pequeño y solución existente | Almacenamiento seguro de plataforma para credenciales; DB solo para datos que necesitan consultas/persistencia |
| Inyección | Constructor o fábrica explícita | Contenedor DI existente cuando reduzca trabajo en el Host |
| APIs nativas | Adaptadores Android/iOS; expect/actual cuando corresponda | SDK de proveedor tras una interfaz, fuera del dominio |
| Pruebas | kotlin.test; dobles deterministas para puertos | Pruebas de adaptador o UI según los riesgos del comportamiento |

Confirma compatibilidad entre Kotlin, Gradle, Android Gradle Plugin, Compose,
JDK, SDK Android y Xcode con la configuración y documentación vigentes. No
selecciones automáticamente las últimas versiones ni copies el build de otro módulo.

Si Contracts aparece en firmas públicas, normalmente requiere `api` para que el
consumidor vea sus tipos. Usa `implementation` para detalles privados. Revisa
metadatos y exportación Apple: visibilidad Gradle no equivale por sí sola a exportar
todos los tipos a Swift.

## Workflow y presentación

Workflow corresponde a una capacidad con UI propia. Puede tener una única hoja
nativa o varias pantallas con navegación interna. Define ese recorrido mediante
State y Event: por ejemplo Elegir → Revisar → Confirmar, con Back dentro del módulo.

La reducción síncrona devuelve Continue, Emit o Complete en la API actual.
No hace red ni lanza coroutines. El EffectHandler ejecuta el efecto y devuelve
el evento con su resultado; Core se encarga de ejecutarlo y de ordenar la reducción.

Durante una operación externa, publica primero el estado ocupado. Define qué
eventos siguen permitidos. La API revisada admite un efecto pendiente por sesión:
un segundo Emit concurrente puede terminar con SECOND_EFFECT_WHILE_PENDING.
Evita dobles envíos y comprueba la semántica de la versión que se vaya a consumir.

Route conecta la sesión con la UI. Screen recibe estado y callbacks: permite
probar y cambiar el aspecto sin reconstruir la lógica. Con UI nativa, el mismo
principio se aplica al controlador o al ViewModel que observa la sesión.

## Compatibilidad y madurez

Comprueba tres cosas separadas: API disponible, artefacto resoluble y validación
de integración. Un contrato oficial no convierte en estable a todos sus módulos.

Usa una línea soportada como referencia de código nuevo. Si una dependencia exige
opt-in experimental, conserva esa advertencia y sus riesgos de cambio. En un módulo
legacy, primero identifica la API y tests reales; propón una migración explícita.
No renombres Feature a Workflow de forma mecánica: cambia el modelo de ejecución.

Consulta [los patrones revisados](patterns.md) para entender por qué se recomiendan
estos límites. Son evidencia de diseño, no una lista de módulos certificados.
