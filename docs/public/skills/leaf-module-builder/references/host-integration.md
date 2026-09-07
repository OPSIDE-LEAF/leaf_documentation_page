# Integración con el Host

## Acuerdo común

El Host compone las dependencias: implementa o elige adaptadores, construye el módulo,
proporciona Input y posee el lifecycle de su ejecución. El módulo conserva sus reglas
y su navegación interna; devuelve un resultado tipado sin conocer rutas de la app.

El contrato de una capacidad y la tecnología visual del Host son decisiones distintas.
Una app Android Kotlin/Java o una app Swift pueden consumir código KMP si existen
targets, artefactos y puentes adecuados. Verifica esa integración en el lenguaje real
del Host; KMP no convierte automáticamente cualquier API Kotlin en una API cómoda
para Java o Swift.

## Action de principio a fin

1. Construye el módulo con capacidades reales del Host.
2. Crea el Input y valida la entrada de usuario según el contrato.
3. Ejecuta la Action con `Leaf.run(action, input)` en un scope de vida definido,
   usando el resultado y fallos del runtime de la versión instalada.
4. Maneja el Output de dominio: éxito, rechazo, indisponibilidad u otras variantes.
5. Cancela al finalizar su propietario cuando corresponda y libera recursos de
   adaptadores si ese propietario es responsable de ellos.

En la API revisada `Leaf.run` devuelve directamente `Output`; los fallos inesperados
se convierten en LeafException y la cancelación se propaga. Confirma la firma de
la versión elegida. Un Output puede contener un rechazo esperado aunque la ejecución
técnica haya terminado correctamente.

La llamada directa a `Action.execute` existe en Contracts. Si se elige, el Host
asume ejecución, cancelación y errores sin los servicios de Core. No implementes
un runtime adicional para un Workflow como atajo de integración.

## Workflow: navegación interna y salida al Host

El Host puede abrir el módulo desde un botón, un enlace o cualquier pantalla que
tenga los datos necesarios. No tiene que conocer cada pantalla interna.

Para elegir una dirección, el módulo puede mostrar lista, detalle y confirmación.
Back recorre esas pantallas; Cancel cierra la capacidad según su contrato.
Al completar, devuelve por ejemplo Selected(addressId) o Dismissed. El Host usa
ese Output para mostrar un mensaje, actualizar una selección o ir a su pantalla
de entrega. No se devuelve una ruta fija que solo tenga sentido en una app.

Con Core, la API revisada abre una sesión con `Leaf.open(workflow, input)`.
Observa `session.states`, envía eventos con `session.send(event)`, espera
`session.awaitOutcome()` y usa `session.cancel()` para cancelar.

Separa el Output de dominio del resultado técnico: WorkflowOutcome.Completed
transporta el Output; Failed indica fallo de ejecución y Cancelled cancelación
de sesión. Dismissed es una salida de negocio solo si el contrato la define.

La sesión pertenece al Job que la abre. Mantén ese propietario vivo mientras
necesites el flujo y evita scopes globales. Libera suscripciones y recursos al
cerrarlo. Evita procesar dos veces un resultado retenido al volver a observarlo.

## Android Kotlin, Java y UI

En Kotlin, usa el artefacto Android compatible y las APIs públicas. Un consumer
ejecutable necesita aplicación, Activity launcher y configuración de build; una
biblioteca que compila no demuestra instalación.

Con Compose, `Leaf.rememberLeafWorkflowHolder(workflow, input, sessionKey)`
ofrece snapshot, outcome, send y cancel en la API revisada. Confirma parámetros
y valores por defecto. Mantén estable la instancia del Workflow entre
recomposiciones y cambia deliberadamente la clave para comenzar otra sesión.
No crees una sesión nueva cada vez que se redibuja una pantalla.

Separa Route, que conecta el holder, de Screen, que recibe estado y callbacks.
Procesa la finalización como un efecto del Host, no durante el dibujo.
Visuals puede aplicarse al tema si se elige; las reglas del módulo no dependen de él.

En Android Views, observa la sesión desde un propietario adecuado al lifecycle
y actualiza las vistas en el hilo principal. No añadas Compose si no se utiliza.

Si el Host es Java, proporciona un pequeño puente Kotlin cuando suspend, genéricos
o resultados sellados dificulten el consumo. Expón callbacks tipados y cancelación
cuando hagan falta; no bloquees el hilo principal ni prometas llamadas suspend
directas desde Java. Compila también un consumidor Java antes de afirmar soporte.

## iOS SwiftUI o UIKit

Prepara los targets Apple acordados y genera un framework/XCFramework o usa el
mecanismo de integración compatible del proyecto. Swift consume ese framework;
Maven Local no sustituye el enlace en Xcode.

Ofrece una fachada de integración con operaciones y resultados fáciles de consumir.
Confirma las declaraciones exportadas a Swift: suspend, Flow, genéricos, sealed
classes y excepciones necesitan revisar el puente concreto.

Para Workflow, Core incluye en la API revisada LeafAppleWorkflowSession, con
observeStates, observeOutcome, send y cancel. Usa la fábrica/puente real exportado;
no inventes constructores ni dupliques su cola o reducer en Swift. Una Action
puede necesitar un puente de callbacks propio según su exportación.

Con SwiftUI/UIKit nativo, presenta las pantallas a partir del estado y envía eventos.
Con UI compartida Compose, expón un UIViewController mediante la integración
compatible y embébelo en el Host. Compose no se invoca como una función SwiftUI.
Los SDK que presentan UI deben recibir el contexto/controlador nativo adecuado.

Libera los tokens de observación, cancela según lifecycle y comprueba entrega en
el hilo principal. El ejemplo iOS debe incluir una app con entrada y un proyecto
reproducible, además del framework. Compilar Kotlin para iOS no acredita compilación
Swift, enlace, firma o ejecución; esas comprobaciones requieren su entorno Apple.

## Demostraciones de adopción

Para cada plataforma ofrecida entrega un ejemplo que solo use API pública. Puede
vivir en el repositorio o en un Host de pruebas existente: no exige nombres de
carpetas ni herramientas de generación particulares.

Muestra composición → Input → inicio → estado/resultado → error/cancelación → cierre.
Documenta dependencias, configuración no sensible, build y ejecución.
Un fake de backend sirve para probar el módulo; una integración de proveedor
necesita además su validación específica.

Antes de entregar, revisa [calidad y distribución](quality.md). No conviertas
la ausencia de un Mac en una afirmación de soporte iOS comprobado.
