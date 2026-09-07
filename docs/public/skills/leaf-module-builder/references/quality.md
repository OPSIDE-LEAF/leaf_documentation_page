# Calidad, seguridad y distribución

## Pruebas que reducen riesgos

Elige pruebas por comportamiento. Evita suites que solo comprueban la estructura
del código o vuelven a escribir su misma implementación.

| Qué se prueba | Escenarios útiles |
| --- | --- |
| Contrato y dominio | Requeridos ausentes, defaults, formatos, límites, invariantes y fallos tipados |
| Action | Resultado correcto, rechazo, dependencia no disponible y cancelación |
| Workflow | Inicialización, transiciones válidas/inválidas, navegación interna, Back, cancelación y salida única |
| Efectos | Estado ocupado antes de I/O, doble envío, cancelación y resultados tardíos |
| Servicio externo | Timeout ambiguo, reintento/idempotencia, identificación de operaciones y consulta de pendientes |
| Adaptadores | Mapeo de respuestas, errores, permisos, storage y cierre de recursos |
| Host | Solo API pública, presentación, manejo del resultado y liberación del lifecycle |
| Distribución | Resolución del artefacto, variantes/targets y compatibilidad del consumidor |

Usa kotlin.test y, si hay coroutines, coroutines-test con reloj y puertos controlados.
Evita depender de red real para probar una regla del dominio.
Las pruebas de integración y UI complementan las unitarias cuando la tarea y el
entorno lo permiten. Respeta restricciones explícitas del usuario o del proyecto.

## Seguridad aplicada al caso

Minimiza datos sensibles en inputs, estados, eventos, outputs, logs y telemetría.
Una credencial necesaria debe viajar por un canal estrecho y documentado: define
quién la posee, cuánto tiempo se conserva y cómo se libera. No la copies a un
resultado público de sesión ni la registres con toString.

Mantén secretos de servidor fuera de apps cliente. Inyecta una capacidad autorizada
en lugar de repartir credenciales entre módulos. Revisa permisos mínimos, validación
en límites y errores de terceros antes de mostrarlos o registrarlos.

Para autenticación, revisa expiración, revocación, storage seguro y carreras entre
operaciones cuando formen parte del alcance. Para pagos, deja los campos sensibles
al SDK/adaptador adecuado y confirma el estado con la fuente autorizada.
No generalices estos controles a módulos que no manejan esos datos.

Revisa dependencias y sus avisos de seguridad vigentes antes de una entrega que las
incorpore. Comprueba entradas no confiables, retención de datos y el aislamiento entre
usuarios cuando corresponda. Corrige riesgos observados y documenta los límites.
Tests y revisión reducen riesgo; no certifican ausencia total de vulnerabilidades.

## Validación de plataforma

Obtén las tareas reales del build antes de ejecutarlas. Comprueba compilación,
pruebas y API/ABI si el proyecto las mantiene. Para apps Android, verifica Debug
y Release cuando formen parte de la distribución; R8 puede descubrir problemas que
Debug no muestra. No asumas que una biblioteca usa las mismas variantes que una app.

Para iOS verifica el framework, enlace del Host Swift y ejecución en macOS/Xcode
cuando estén disponibles. Incluye dispositivo/simulador y configuración comprobados.
Si ese entorno falta, entrega los archivos y comandos reproducibles y marca esas
validaciones como pendientes; no uses un build Kotlin como sustituto.

## Probar artefactos con Maven Local

Maven Local es una recomendación opcional para comprobar cómo un Host consume una
biblioteca empaquetada antes de distribuirla. El desarrollo con dependencias de
proyecto o builds compuestos también es válido; cada uno demuestra algo distinto.

Si se usa Maven Local:

1. Verifica `maven-publish`, coordenadas, versión y publicaciones por target.
2. Ejecuta las tareas locales reales, por ejemplo `./gradlew publishToMavenLocal`
   o `.\gradlew.bat publishToMavenLocal`, según plataforma y proyecto.
3. Publica la cadena modificada en orden de dependencias. Comprueba qué variantes
   produjo el entorno; una publicación raíz no contiene por sí sola todos los binarios.
4. Habilita `mavenLocal()` para esa prueba en el consumidor. Evita que artefactos
   locales oculten versiones remotas durante builds normales.
5. Confirma resolución por coordenadas sin sustituciones por fuentes internas.
   No atribuyas un resultado a un artefacto nuevo si su publicación falló.
6. Para Apple, verifica además el framework/paquete y el enlace Swift por el
   mecanismo real del proyecto.

No uses `publish` como sustituto de `publishToMavenLocal`: puede tener destinos
remotos. No copies flags privados de otro repositorio.

## Versionado, CI y distribución

Versiona el contrato y documenta cambios incompatibles, nuevas capacidades y defaults
que cambian comportamiento. Sigue la política semántica del proyecto y verifica API,
ABI y consumidores afectados; no sincronices todas las bibliotecas por costumbre.

La automatización depende del equipo: PR, ramas, tags o ejecución manual son
alternativas. Conserva su configuración o propone una apropiada al pedido.
La publicación debe depender de las validaciones necesarias, usar credenciales
del entorno de CI y confirmar coordenadas/versiones. No fuerces GitHub ni tags.

Los jobs aislados no comparten Maven Local. Cada job debe resolver o preparar sus
dependencias. Usa macOS para las comprobaciones Apple que lo requieren.
Preparar un workflow no demuestra que haya corrido ni autoriza activarlo.

El equipo decide repositorio público/privado, licencia, permisos y calendario de
release. Para una publicación autorizada, verifica el destino y la versión remotos
antes de informar que están disponibles.

## Cierre y mantenimiento

Entrega contrato, ejemplos Host, comandos, resultados y límites conocidos. Diferencia
compilación, ejecución, instalación y publicación. Incluye cómo actualizar la
dependencia y cómo reportar un defecto sin adjuntar secretos.

Para anunciar un módulo en un catálogo, describe capacidad, tipo Action/Workflow,
plataformas verificadas, versión resoluble, adaptadores opcionales y configuración.
Indica si es demostración, experimental o apto para el alcance validado. Conserva
correcciones y pruebas de regresión en el módulo para que los Hosts puedan reutilizarlas.

Fuentes de plataforma: [publicación KMP](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html),
[interoperabilidad Swift](https://kotlinlang.org/docs/native-objc-interop.html) e
[integración Compose/SwiftUI](https://kotlinlang.org/docs/multiplatform/compose-swiftui-integration.html).
