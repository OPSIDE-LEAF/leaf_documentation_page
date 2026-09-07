# Construir desde una idea o código existente

## Desde una idea

Transforma el pedido en una capacidad observable. Por ejemplo, «elegir una dirección»
necesita saber qué direcciones recibe, si puede crear una nueva, qué valida y qué
devuelve al cancelar. No necesita conocer la ruta del carrito del Host.

1. Escribe alcance y criterios de aceptación con la [plantilla](../templates/module-spec.md).
2. Revisa catálogo y dependencias disponibles; decide reutilizar, adaptar o crear.
3. Define tipos de entrada, resultado y capacidades. Incluye defaults y fallos.
4. Implementa primero un recorrido completo con puertos y datos sintéticos de prueba.
5. Añade variantes, errores y cancelación; después conecta los adaptadores necesarios.
6. Integra un Host real de ejemplo y prueba que sus decisiones se basan en la API pública.

Si falta el servidor, un fake puede desbloquear las pruebas del contrato. Señala
que es una simulación, qué comportamiento cubre y cuál será el adaptador real.

## Desde código existente

Antes de extraerlo, encuentra sus consumidores y su comportamiento actual. Identifica
acoplamientos a UI, almacenamiento, red, reloj, singletons y rutas de navegación.

Añade pruebas del comportamiento que se debe conservar cuando no existan.
Extrae primero una capacidad pequeña y completa. Sustituye dependencias concretas
por puertos e implementa un adaptador sobre el código actual. Migra un consumidor
para verificar que no cambió el resultado esperado.

Conserva APIs utilizadas mientras se acuerda su migración. Evita reescribir reglas
de negocio al mismo tiempo que cambias su ubicación. Retira duplicados solo después
de comprobar que los consumidores usan el nuevo contrato.

## Implementar una Action

Usa ModuleInfo como identidad y expón una Action tipada con `action(info)` o la
interfaz de la versión seleccionada. Ejecuta trabajo finito y devuelve un Output.

Modela fallos del dominio: datos inválidos, recurso no encontrado o indisponibilidad.
La pantalla del Host decide cómo representarlos. No añadas State/Event de UI solo
para que una operación pequeña parezca un Workflow.

Inyecta capacidades variables por constructor. Un reloj inyectable ayuda a probar
expiración; un gateway permite sustituir un servicio; ninguno exige un framework DI.

[NormalizeNameAction.kt](../examples/NormalizeNameAction.kt) muestra el contrato
mínimo completo. Es deliberadamente pequeño para enseñar la API; por sí sola, una
normalización simple normalmente puede ser una función compartida.

## Implementar un Workflow

Define Input, State, Event, Effect y Output antes del layout. El ejemplo
[SelectionWorkflow.kt](../examples/SelectionWorkflow.kt) pasa de una lista a una
confirmación, permite volver y termina con Selected o Dismissed. No necesita red,
Compose, Visuals ni Core en el código del contrato.

Para una capacidad con trabajo externo:

1. `initialize(input)` valida la entrada y produce estado inicial, efecto inicial
   o terminación, según la necesidad.
2. `reduce(state, event)` decide el próximo paso sin suspender ni hacer I/O.
3. `emitEffect(busyState, effect)` publica el estado ocupado y solicita el trabajo.
4. `EffectHandler.handle(effect)` llama al puerto y convierte su resultado en Event.
5. El reducer consume ese Event y vuelve a un estado interactivo o termina.
6. `completeWorkflow(output)` entrega el resultado del módulo al runtime.

Modela errores recuperables como eventos y estado accionable. Propaga
CancellationException; no la captures como un fallo de negocio. Si necesitas
limpieza usa finally y conserva el lifecycle del runtime.

## Reintentos, tiempo y datos

Un timeout puede significar que el servidor aceptó una operación y se perdió su
respuesta. Distingue rechazo confirmado de resultado desconocido. En operaciones
con efectos externos, usa identificadores e idempotencia según el contrato del
servicio. Consulta el mismo intento cuando corresponda; no crees otro a ciegas.

Define qué sobrevive al cierre de pantalla y qué a la muerte del proceso. Una sesión
en memoria no es almacenamiento persistente. Cancelar una coroutine no revierte
una compra, un correo enviado ni otro efecto ya aceptado por un servidor.

Los defaults de negocio deben documentarse. Direcciones de servidor, cuentas de
demostración, importes de prueba y políticas de una aplicación viven en el Host
de ejemplo o su configuración, no como requisitos ocultos del módulo.

## Documentación que acompaña al código

Entrega un README que permita instalar, configurar, invocar y cerrar la capacidad.
Incluye puertos que debe implementar el Host, datos requeridos/opcionales, ejemplos
tipados de éxito/error/cancelación y compatibilidad comprobada.

Los ejemplos presentados como ejecutables deben usar imports y firmas reales,
sin TODO ni cuerpos omitidos. Identifica como pseudocódigo cualquier bosquejo.
No expongas tokens, contraseñas o datos personales en ejemplos ni mensajes de error.
