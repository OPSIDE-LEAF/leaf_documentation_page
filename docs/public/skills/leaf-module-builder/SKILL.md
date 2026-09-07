---
name: leaf-module-builder
description: >-
  Guía la adopción de LEAF con IA. Decide qué reutilizar, crea o adapta módulos
  Kotlin Multiplatform desde una idea o código existente, diseña contratos Action
  o Workflow, elige dependencias y conecta módulos con un Host Android o iOS.
  Úsala para planificar, implementar, integrar o revisar módulos LEAF.
---

# LEAF module builder

LEAF facilita reutilizar capacidades que aparecen en muchos productos: autenticación,
pagos, formularios, validaciones o selección de datos. Cada módulo encapsula una
responsabilidad y ofrece una API que distintas aplicaciones pueden usar. Los módulos
son las hojas; el Host es el tronco que las conecta para construir la aplicación.

El objetivo es entregar valor antes: reutilizar lógica, pruebas y correcciones,
y dedicar más trabajo a lo que distingue al producto. La confiabilidad se construye
con contratos claros, pruebas, revisión de seguridad y mantenimiento. No existe una
garantía de ausencia total de bugs o vulnerabilidades.

Esta skill es portable. Funciona sin el repositorio donde fue escrita y no requiere
una estructura de empresa, un backend, un proveedor de IA ni un proceso de CI concreto.
Respeta las instrucciones del usuario y del proyecto donde se use. Explica decisiones
con lenguaje directo y ejemplos concretos; responde en el idioma del usuario.

## Cómo trabajar

1. Identifica si la petición es explicar, planificar, revisar, crear, adaptar o integrar.
   Una explicación o un plan producen propuestas; una implementación autorizada
   continúa hasta el alcance acordado, incluyendo pruebas y conexión con el Host.
2. Inspecciona lo disponible: código, instrucciones del proyecto, build, catálogos de
   dependencias, targets y API pública. En repositorios Git comprueba rama y cambios
   locales. Conserva el trabajo existente.
3. Obtén los datos que cambian el diseño: capacidad, usuarios, plataformas, UI,
   origen de los datos, Host objetivo y criterios de aceptación. Deduce lo evidente
   del proyecto; pregunta solo por decisiones que no puedas resolver con esa evidencia.
4. Si basta el contexto, propone supuestos breves y avanza con decisiones reversibles.
   Si falta un servicio externo, desarrolla el contrato y dobles de prueba para seguir;
   deja identificada la integración que aún requiere ese servicio.
5. Lee las referencias necesarias antes de ejecutar cada fase. No cargues todo el
   paquete para una consulta puntual ni exijas formularios o aprobaciones por cada paso.
6. Trabaja en incrementos completos: contrato, lógica, pruebas y consumo público.
   Corrige los fallos que encuentres dentro del alcance. No declares terminada una
   integración solo porque compiló la biblioteca.
7. No cambies repositorios externos, publiques paquetes ni actives servicios de pago
   como consecuencia implícita de generar código. Respeta la autorización vigente
   y las restricciones reales del proyecto, sin inventar un procedimiento empresarial.

## Referencias por fase

| Cuando necesitas… | Lee |
| --- | --- |
| Decidir límites, arquitectura o dependencias | [Arquitectura y tecnologías](references/architecture.md) |
| Crear desde una idea, extraer código o implementar contratos | [Construcción](references/building.md) |
| Integrar una Action o un Workflow en Android/iOS | [Integración con el Host](references/host-integration.md) |
| Probar, revisar seguridad, versionar o distribuir | [Calidad y distribución](references/quality.md) |
| Entender la evidencia detrás de las recomendaciones | [Patrones observados](references/patterns.md) |
| Escribir el acuerdo de integración y el README | [Plantilla de módulo](templates/module-spec.md) |
| Ver una Action mínima completa | [Action de normalización](examples/NormalizeNameAction.kt) |
| Ver navegación interna sin red ni SDK | [Workflow de selección](examples/SelectionWorkflow.kt) |
| Combinar lógica Action con interacción Workflow | [Composición](references/action-workflow-composition.md) y [ejemplo completo](examples/ActionWorkflow.kt) |

Los ejemplos son código de módulo sobre Contracts. No incluyen aplicaciones Host
ni configuración Gradle. Confirma la API de la versión elegida antes de incorporarlos.

## 1. Decidir qué construir o reutilizar

Busca primero si una capacidad existente cumple el contrato necesario. Evalúa su
compatibilidad, licencia, pruebas, límites y mantenimiento antes de recomendarla.
Un nombre en un catálogo no prueba que esté publicada o lista para producción.

| Necesidad | Decisión recomendada |
| --- | --- |
| Conectar pantallas propias, elegir la siguiente ruta o aplicar una política exclusiva de una app | Código del Host |
| Compartir valores o una función pura pequeña | Biblioteca o código compartido; LEAF puede ser innecesario |
| Reutilizar una operación finita sin UI propia | Módulo con una o varias Actions coherentes |
| Reutilizar una capacidad que necesita UI o interacción propia | Módulo con Workflow como entrada pública |
| Encapsular lógica existente con dependencias de una app | Extraerla gradualmente y adaptar sus límites |
| Mantener una API anterior o experimental | Preservar compatibilidad y evaluar la migración como cambio explícito |

Una Action invocada por un botón sigue siendo Action si la pantalla pertenece al
Host. Un módulo que controla un formulario, varias pantallas o una presentación
interactiva usa Workflow. Puede ofrecer Actions adicionales para operaciones sin UI.

Un Workflow puede tener navegación interna completa: lista, detalle, formulario,
confirmación y resultado. El Host lo abre desde cualquier punto conveniente y usa
su Output para mostrar un mensaje, abrir otra pantalla o iniciar otra capacidad.
Las rutas concretas de esa aplicación no forman parte del contrato reutilizable.

Action y Workflow también se combinan: un módulo Action aporta operaciones sin UI
reutilizables y un Workflow las coordina desde sus efectos para ofrecer una capacidad
interactiva. El Host puede usar las Actions por separado o abrir el Workflow completo.
Estudia la [composición y los ejemplos de pagos](references/action-workflow-composition.md)
cuando una misma lógica deba usarse con y sin UI.

Modulariza responsabilidades coherentes que puedan probarse y evolucionar juntas.
No conviertas cada función en un artefacto ni construyas un framework de abstracciones
antes de que existan necesidades reales de reúso.

## 2. Elegir versión y dependencias mínimas

Verifica la versión instalada o resoluble, sus APIs y sus targets. Usa documentación
y ejemplos de esa línea. Distingue API soportada, experimental con opt-in y legacy;
no copies una anotación o un contrato antiguo sin verificar su vigencia.

Para definir e implementar una Action o un Workflow solo se necesita **Contracts
como dependencia de LEAF**. Red, almacenamiento o presentación pueden necesitar
sus propias bibliotecas. Construir el contrato no requiere Core, Compose ni Visuals.

| Pieza | Cuándo incorporarla |
| --- | --- |
| `com.opside-leaf:leaf-contracts` | Definir Module, Action, Workflow y sus contratos |
| `com.opside-leaf:leaf-core` | Ejecutar con el runtime LEAF; normalmente en el Host o adaptador de ejecución |
| `com.opside-leaf:leaf-compose` | Conectar sesiones LEAF con una presentación Compose |
| `com.opside-leaf:leaf-visuals` | Adoptar opcionalmente sus colores, tipografía y formas en UI Compose |
| Red, serialización, base de datos, SDK o DI | Solo si la capacidad o su adaptador lo necesita |

Core puede usarse en pruebas sin convertirse en dependencia de producción del módulo.
Visuals es independiente y opcional: el equipo puede usar su propio diseño.
SwiftUI/UIKit no requieren Compose si presentan la UI de forma nativa.
No impongas Ktor, Koin, Room, un servidor ni un proveedor de pagos a todos los módulos.

## 3. Diseñar el contrato antes de la implementación

Completa la [plantilla](templates/module-spec.md) con tipos reales y ejemplos:

- Input: datos requeridos, formatos, unidades e invariantes.
- Opcionales: defaults, significado de ausencia y momento en que deben completarse.
- Capacidades inyectadas: qué debe aportar el Host, qué devuelve cada interfaz y
  quién crea, conserva y libera su implementación.
- Action: Output y fallos esperables. Workflow: State, Event, Effect y Output.
- Límites: responsabilidades del módulo y del Host, cancelación, cierre, reintentos
  y datos que pueden conservarse.
- Aceptación: escenarios observables de éxito, error y cancelación por plataforma.

Usa tipos específicos en los límites. Separa datos de entrada de servicios inyectados.
No ocultes requisitos detrás de valores de demostración o de un `null` sin explicación.
Los errores esperables deben poder manejarse por tipo, sin analizar mensajes de texto.

## 4. Construir e integrar

Sigue [Construcción](references/building.md). Mantén reglas del dominio independientes
de SDK, servidor, UI y navegación externa. Inyecta las capacidades que varían entre
Hosts y coloca sus implementaciones concretas en adaptadores.

En Workflow, la reducción decide el siguiente estado; el EffectHandler hace el
trabajo externo. Core posee la sesión, orden de eventos, efectos y cancelación.
La presentación observa y envía eventos. Evita un segundo coordinador de negocio en
el ViewModel o en Swift.

Usa la dirección visual existente. Si no hay una y el diseño es parte del encargo,
propón una presentación mínima accesible y configurable, indicando el supuesto.
Pregunta cuando la identidad visual o una interacción pendiente cambie el alcance.

Implementa ejemplos Host ejecutables para las plataformas acordadas. Por defecto,
un módulo ofrecido para Android e iOS debe tener demostraciones para ambas. Si la
tarea se limita explícitamente a una plataforma o a un plan, adapta los entregables.
La guía de [integración](references/host-integration.md) explica composición, lifecycle,
navegación interna, consumo del Output y puentes de plataforma.

## 5. Comprobar y entregar

Aplica [Calidad y distribución](references/quality.md) con pruebas proporcionadas al
comportamiento y a las plataformas. Maven Local es una opción para probar consumo
por coordenadas, no un requisito de LEAF ni una política de publicación universal.
El CI y la distribución siguen las necesidades del proyecto.

Entrega código y documentación coherentes, con comandos realmente comprobados.
Explica qué se reutilizó, arquitectura, dependencias justificadas, contrato e
integración. Indica qué compiló, qué se ejecutó y qué requiere otro entorno.

Una tarea de implementación queda completa cuando el alcance funcional está
implementado, los contratos y pruebas concuerdan y el Host consume la API pública.
Si falta una validación externa, identifica exactamente cuál y cómo realizarla.
Un módulo probado con dobles no acredita una integración real con un proveedor.
