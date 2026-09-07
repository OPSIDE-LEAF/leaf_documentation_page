# Combinar módulos Action con Workflows

Una Action encapsula una operación sin UI propia. Un Workflow controla la interacción
y puede utilizar esa operación para completar su trabajo. Son piezas complementarias:
la misma lógica puede usarse desde distintos Workflows, una pantalla del Host o una
operación sin pantalla cuando la plataforma y el contrato lo permitan.

## Ejemplo de una capacidad de pagos

| Parte | Responsabilidad |
| --- | --- |
| Actions de pago | Preparar una operación, enviarla o consultar su estado, según la API del proveedor |
| Workflow de checkout | Recibir importe, mostrar o solicitar datos, coordinar confirmación y presentar el resultado |
| Adaptadores | Conectar backend y SDK; manejar la presentación nativa y los datos que les corresponden |
| Host | Configurar capacidades, abrir el checkout y decidir qué hacer con su Output |

Una app puede usar una Action de consulta para actualizar una orden pendiente sin
abrir el checkout. Otra parte de la app puede abrir el Workflow para realizar la
interacción completa. Ambos consumidores aprovechan la misma lógica probada.

Mercado Pago y Stripe muestran la convivencia de Actions de preparación/consulta
y Workflows de checkout. En las fuentes revisadas, los Workflows ejecutan
CheckoutUseCases mediante puertos de backend y SDK; no llaman necesariamente a las
Actions públicas existentes. La idea reutilizable es separar operaciones e interacción.
No presentes una llamada Workflow → Action como un hecho de esos módulos si el código
de esa versión utiliza casos de uso directamente.

## Dos formas de combinar las piezas

1. **Inyectar Actions en el Workflow.** Recibe las capacidades tipadas que necesita,
   por ejemplo Action<ConsultarPagoInput, ConsultarPagoOutput>. El EffectHandler
   construye el Input, ejecuta la Action y convierte el Output en Event. El reducer
   usa ese Event para cambiar el estado o finalizar.
2. **Compartir un caso de uso.** La Action y el EffectHandler delegan en el mismo
   servicio de aplicación. Conviene cuando sus contratos de entrada/salida difieren
   o ya existe esa implementación. Mantén una única regla de negocio, con adaptaciones
   finas para cada API.

Elige según el contrato que ya puedas reutilizar. Inyectar una Action no exige que
el Workflow conozca el módulo concreto que la creó. Compartir un caso de uso tampoco
exige exponerlo como una nueva Action si nadie lo necesita por separado.

## Ejecución, resultados y cancelación

El reducer nunca ejecuta la Action. Emite un efecto y publica primero el estado
ocupado; Core invoca el EffectHandler dentro de la sesión. Desde ese handler puedes
llamar a Action.execute de forma suspendida: el trabajo conserva el contexto de
cancelación del efecto y el módulo no necesita Core como dependencia adicional.

Si se requieren los servicios de Leaf.run para esa Action, proporciona desde la
capa de integración una capacidad de ejecución o un adaptador que use Core. Documenta
la diferencia y evita añadir Core al dominio solo para obtener telemetría.

Convierte fallos esperables del Output en eventos tipados, conserva la cancelación
y no uses GlobalScope. No crees una segunda sesión Workflow para ejecutar una Action.
Define cómo evitar doble envío y cómo tratar un resultado incierto de red.

Una secuencia de varias Actions no es una transacción automática. Si preparar
funcionó pero confirmar falló, el contrato debe decir cómo consultar, recuperar o
compensar la operación. Cancelar UI no revierte efectos que un servicio ya aceptó.

## Ejemplo y pruebas

[ActionWorkflow.kt](../examples/ActionWorkflow.kt) implementa un Workflow que recibe
una Action de consulta de pago. Es un ejemplo neutral de composición: no cobra ni
incluye SDK, credenciales, backend o UI. La presentación del Host muestra el estado
y envía Check/Close; el EffectHandler transforma la consulta en Checked.

Prueba la Action de forma aislada. Prueba el Workflow inyectando Actions controladas
que produzcan confirmado, pendiente o no disponible. Comprueba además cancelación,
doble consulta y consumo del resultado final en el Host. Cuando conectes un proveedor,
añade pruebas de su adaptador sin atribuir al ejemplo neutral esa validación.
