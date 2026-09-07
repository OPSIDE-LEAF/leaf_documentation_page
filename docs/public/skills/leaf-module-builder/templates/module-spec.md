# Especificación e integración del módulo

Completa esta plantilla con información real. Puede formar parte del README; no
necesita convertirse en un documento adicional. En una petición de planificación
registra aquí la propuesta sin afirmar implementación ni pruebas ejecutadas.

## Capacidad y alcance

- Problema que resuelve y quién lo reutilizaría:
- Capacidad existente evaluada y motivo para reutilizar/adaptar/crear:
- Elección: código Host, biblioteca pura, Action o Workflow:
- Qué aporta el módulo:
- Qué aporta el Host:
- Plataformas y lenguaje de los Hosts:
- Versión de módulo, línea LEAF y estado soportado/experimental/legacy:

## Contrato público

| Campo | Tipo y formato/unidad | Requerido o default | Validación y resultado si es inválido |
| --- | --- | --- | --- |
| Completar con datos reales | | | |

| Capacidad inyectada | Operaciones y resultados | Quién la crea/libera | Configuración necesaria |
| --- | --- | --- | --- |
| Completar con puertos reales | | | |

- Output de éxito:
- Rechazos y fallos recuperables:
- Cancelación y cierre:
- Datos sensibles, uso permitido y retención:
- Reintento, idempotencia y resultado desconocido, si aplican:

## Workflow, solo cuando hay UI propia

- Pantallas internas y navegación:
- Estado inicial y estados ocupados:
- Eventos válidos por estado, Back y Cancel:
- Efectos y resultados que regresan como eventos:
- Qué produce la terminación:
- Qué hará el Host con cada Output:
- Qué ocurre al recrear la pantalla o morir el proceso:
- Diseño, accesibilidad, traducciones y opciones visuales:

## Arquitectura y dependencias

| Dependencia | Parte que la utiliza | Por qué es necesaria | Alternativa o condición para omitirla |
| --- | --- | --- | --- |
| Completar con artefactos/versiones verificados | | | |

- Paquetes/subproyectos necesarios:
- Adaptadores opcionales:
- API pública y detalles internos:
- Comportamiento previo que se debe conservar, si se adapta código:

## Cómo integrar y ejecutar

- Instalación y coordenadas verificadas:
- Construcción del módulo y de capacidades Host:
- Ejemplo con Input, inicio, Output, error y cancelación:
- Consumer Android: build, ejecución y configuración:
- Consumer iOS: framework, proyecto, build y ejecución:
- Qué sigue en el Host después de completar:
- Recursos y lifecycle:
- Distribución local opcional y publicación acordada:

## Criterios y evidencia

| Escenario | Resultado esperado | Comprobación | Resultado real o pendiente |
| --- | --- | --- | --- |
| Recorrido principal | | | |
| Entrada inválida | | | |
| Dependencia no disponible, si aplica | | | |
| Cancelación/cierre | | | |
| Consumo desde Host | | | |

- Versionado y compatibilidad:
- Riesgos conocidos y limitaciones:
- Comandos ejecutados:
- Cómo repetir las comprobaciones pendientes:
- Cambios de documentación/catálogo necesarios:
