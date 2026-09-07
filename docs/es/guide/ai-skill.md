# Crear e integrar módulos con IA

La skill `leaf-module-builder` reúne las decisiones y prácticas para usar LEAF
desde una idea o código existente hasta su integración en una aplicación Host.
Ayuda a elegir qué reutilizar, definir contratos, implementar lógica y UI cuando
corresponda, y comprobar el resultado. Puede guiarte paso a paso o trabajar con
autonomía dentro del alcance que le indiques.

## Descargar y usar

[Descargar la skill completa en ZIP](/downloads/leaf-module-builder.zip).
También puedes <a href="/skills/leaf-module-builder/SKILL.md" target="_blank" rel="noopener">leer el archivo principal</a>.
El paquete incluye referencias, una plantilla de contrato y tres ejemplos Kotlin.
Conserva la carpeta completa: el archivo principal enlaza esos recursos.

Descomprime `leaf-module-builder` en la carpeta de skills que admita tu herramienta
de IA. La ubicación y la activación dependen de esa herramienta. Si admite invocación
por nombre, usa `$leaf-module-builder`; si no, pídele que lea el `SKILL.md` descargado
y los recursos que correspondan al trabajo. La skill no necesita instalarse globalmente.

Está escrita en español e indica a la IA responder en el idioma del usuario.
No instala dependencias ni ejecuta código por sí sola: proporciona instrucciones
que la herramienta aplica con los archivos y permisos disponibles.

## Qué puedes pedirle

| Necesidad | Qué ayuda a resolver |
| --- | --- |
| Partir de una idea | Elegir capacidad, límites y criterios de aceptación |
| Reutilizar código existente | Extraer reglas y sustituir dependencias de una app por capacidades inyectadas |
| Crear una Action | Operación finita sin UI propia, con Input, Output y errores claros |
| Crear un Workflow | Interacción, pantallas internas, efectos y resultado para el Host |
| Combinar Actions y Workflows | Reutilizar operaciones sin UI dentro de una capacidad interactiva |
| Integrar en Android o iOS | Composición, presentación, lifecycle, resultados y consumidores de ejemplo |
| Preparar la adopción | Pruebas, compatibilidad, seguridad, documentación y distribución acordada |

La guía parte del principio de dependencias mínimas: para implementar una Action
o un Workflow, Contracts es la única dependencia de LEAF necesaria. Core se añade
donde se ejecutan las sesiones, Compose cuando se usa esa presentación y Visuals
si se desea su diseño visual. Otras bibliotecas dependen del problema que resuelves.

## Ejemplos de pedidos

Para crear desde una idea:

```text
Usa $leaf-module-builder para crear un módulo reutilizable de selección de dirección.
Debe mostrar lista y confirmación, permitir volver y devolver la dirección elegida.
El Host aporta las direcciones y decide la pantalla siguiente.
Implementa el contrato, la lógica y ejemplos de integración Android e iOS.
Usa las tecnologías compatibles con este proyecto y justifica cada dependencia.
```

Para combinar lógica e interacción:

```text
Usa $leaf-module-builder para integrar nuestras Actions de preparación y consulta
de pagos en un Workflow de checkout. Reutiliza la lógica existente.
El Workflow debe gestionar la interacción y el Host decidir qué hacer con el Output.
Incluye cancelación, prevención de doble envío y manejo de estados pendientes.
```

Para adaptar código existente:

```text
Usa $leaf-module-builder para extraer esta capacidad del Host a un módulo reutilizable.
Conserva su comportamiento y sus consumidores. Identifica acoplamientos, define
puertos y migra un consumidor completo con pruebas e instrucciones de integración.
```

## Actions y Workflows juntos

Puedes ofrecer Actions reutilizables sin UI y un Workflow que las use desde sus
efectos. Así una aplicación puede consultar un pago sin abrir una pantalla, o usar
un checkout completo que coordine preparación, presentación y resultado.

La skill explica ese patrón a partir de Mercado Pago y Stripe, y distingue cuándo
se inyectan Actions y cuándo se comparten casos de uso. El ejemplo incluido es
neutral: no realiza cobros ni requiere un proveedor.

## Qué comprobar al terminar

Pide contratos documentados, ejemplos que usen API pública y evidencia de las
plataformas que necesitas. La skill diferencia código compilado, aplicación
ejecutada e integración de proveedor comprobada. Las pruebas reducen riesgos;
no garantizan ausencia total de errores o vulnerabilidades.

Maven Local es una opción para probar artefactos. El equipo decide su arquitectura
de despliegue, CI, repositorio de distribución y uso de UI compartida o nativa.
Puedes continuar con [el contrato del módulo](/es/guide/module-contract) o
[la integración con tu app](/es/guide/host-integration).
