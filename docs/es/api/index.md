# Referencia API

LEAF %LEAF_VERSION% separa los contratos públicos, la ejecución y la integración con Compose en artefactos distintos.

| Artefacto | Responsabilidad |
| --- | --- |
| [leaf-contracts](/es/api/contracts) | define entradas, salidas y pasos |
| [leaf-core](/es/api/core) | ejecuta acciones y sesiones |
| [leaf-compose](/es/api/compose) | lleva una sesión Workflow a Compose |
| [Workflow](/es/api/workflow) | explica una interacción con estado paso a paso |
| [leaf-visuals](/es/api/visuals) | aporta un tema Material 3 opcional |

## Módulos con versión independiente

| Módulo o artefacto | Versión documentada | Responsabilidad |
| --- | --- | --- |
| [Login](/es/api/login) | 3.1.0 | proporciona un Workflow de login y una ruta Feature compatible |
| [Authentication](/es/api/authentication) | 1.0.0 | proporciona Actions y adaptadores opcionales para autenticación |
| [Payment Contracts](/es/api/payment-contracts) | 0.1.0 | define tipos de pago independientes del proveedor |
| [Catalog](/es/api/catalog) | 1.1.1 | proporciona catálogo, búsqueda y detalle como Feature reutilizable |
| [Email](/es/api/email) | 1.1.1 | proporciona una Action autónoma de envío SMTP |
| [Módulos de pago](/es/api/payments) | Stripe 1.0.0 · Mercado Pago 1.0.0 | implementan checkouts Workflow para cada proveedor |

Estas versiones y sus requisitos de integración son independientes del tren base de LEAF. Consulta cada referencia antes de elegir dependencias para tu aplicación.
