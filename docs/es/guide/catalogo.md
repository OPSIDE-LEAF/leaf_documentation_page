# Catálogo de módulos

Este catálogo resume las bibliotecas base y los módulos documentados de LEAF. Cada organización puede obtenerlos desde el repositorio Maven que prefiera y definir su propio proceso de publicación. Para conocer las dependencias de cada tipo de proyecto, consulta [Instalación](/es/guide/installation).

## Un punto de partida para nuevos proyectos

El catálogo permite comenzar con capacidades ya implementadas en lugar de reconstruirlas para cada aplicación. Un equipo puede seleccionar los módulos que necesita, conectarlos al host y concentrarse en las reglas específicas de su producto.

Cada entrada debe representar una capacidad reutilizable con contrato, versión y pruebas propias. El catálogo puede crecer de forma independiente: una empresa puede usar los módulos disponibles, crear módulos privados para sus necesidades o compartir nuevos módulos sin cambiar la arquitectura del host.

## Bibliotecas base

| Artefacto | Versión documentada | Cuándo se necesita |
| --- | --- | --- |
| [`leaf-contracts`](/es/api/contracts) | %LEAF_VERSION% | Para declarar una Action o un Workflow. Es la única dependencia necesaria para definir el contrato de un módulo. |
| [`leaf-core`](/es/api/core) | %LEAF_VERSION% | En el host que ejecuta Actions o abre sesiones de Workflow. |
| [`leaf-compose`](/es/api/compose) | %LEAF_VERSION% | En un host Compose que presenta y observa la UI de un Workflow. |
| [`leaf-visuals`](/es/api/visuals) | 1.4.0 | Cuando una app Compose quiere usar el tema visual opcional de LEAF. |
| [Payment Contracts](/es/api/payment-contracts) | 0.1.0 | Para compartir tipos de pagos independientes de un proveedor, como importes, pedidos y estados. |

## Módulos de dominio

| Módulo | Versión documentada | Forma | Qué proporciona | Qué debe proporcionar el host |
| --- | --- | --- | --- | --- |
| [Login](/es/api/login) | 3.0.1 | Feature; Workflow experimental | Formulario y flujo de referencia para autenticar a una persona. | `AuthGateway`, navegación y manejo seguro de credenciales. |
| [Authentication](/es/api/authentication) | 0.2.0 | Actions | Inicio de sesión, continuación de retos, restauración y cierre de sesión. | Los servicios de autenticación, almacenamiento y red que requiera su implementación. |
| [Stripe](/es/api/payments) | 0.3.0 | Workflow | UI y estados para completar un pago con Stripe. | Backend, configuración del proveedor y presentación del SDK cuando corresponda. |
| [Mercado Pago](/es/api/payments) | 0.3.0 | Workflow | UI y estados para completar un pago con Mercado Pago. | Backend, configuración del proveedor y captura segura de los datos que requiera el SDK. |

## Entregas de código fuente verificadas

| Módulo o artefacto | Tag fuente | Revisión |
| --- | --- | --- |
| [Login](/es/api/login) | [`v3.0.1`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v3.0.1) | [`ad5f8be`](https://github.com/OPSIDE-LEAF/leaf-login/commit/ad5f8be) |
| [Authentication](/es/api/authentication) | [`v0.2.0`](https://github.com/OPSIDE-LEAF/leaf_authentication/tree/v0.2.0) | [`5f3acda`](https://github.com/OPSIDE-LEAF/leaf_authentication/commit/5f3acda) |
| [Payment Contracts](/es/api/payment-contracts) | [`v0.1.0`](https://github.com/OPSIDE-LEAF/leaf-payment-contracts/tree/v0.1.0) | [`b1147d0`](https://github.com/OPSIDE-LEAF/leaf-payment-contracts/commit/b1147d0) |
| [Stripe](/es/api/payments) | [`v0.3.0`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v0.3.0) | [`ee451fa`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/ee451fa) |
| [Mercado Pago](/es/api/payments) | [`v0.3.0`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v0.3.0) | [`6ad99c3`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/6ad99c3) |

Un tag fuente fija el código de una entrega. No demuestra por sí solo que el artefacto esté disponible en todos los repositorios Maven; comprueba el repositorio configurado por tu organización antes de consumirlo.

## Cómo elegir e integrar

Usa una Action cuando el módulo no proporciona UI. Usa un Workflow para cualquier módulo que proporcione UI, ya sea una pantalla o una navegación interna con varias pantallas. El host decide desde qué parte de la aplicación lo abre y usa el `Output` para determinar el siguiente paso fuera del módulo.

Las versiones de la tabla son independientes porque los artefactos no tienen que publicarse al mismo tiempo. Antes de combinar versiones, revisa la referencia API de cada artefacto y las reglas de compatibilidad del repositorio desde el que lo obtengas.
