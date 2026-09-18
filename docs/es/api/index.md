# Referencia API

LEAF %LEAF_VERSION% separa los contratos públicos, la ejecución y la integración con Compose en artefactos distintos.

| Artefacto | Responsabilidad |
| --- | --- |
| [leaf-contracts](/es/api/contracts) | define entradas, salidas y pasos |
| [leaf-core](/es/api/core) | ejecuta acciones y sesiones |
| [leaf-compose](/es/api/compose) | lleva una sesión Workflow a Compose |
| [leaf-visuals](/es/api/visuals) | aporta un tema Material 3 opcional |
| [Payment Contracts](/es/api/payment-contracts) | define tipos de pago independientes del proveedor |

## Módulos con versión independiente

| Módulo | Versión documentada | Responsabilidad |
| --- | --- | --- |
| [Login](/es/api/login) | 3.1.0 | proporciona un Workflow de login y una ruta Feature compatible |
| [Authentication](/es/api/authentication) | 1.0.0 | proporciona Actions para autenticación, sesiones y tokens |
| [Catalog](/es/api/catalog) | 1.1.1 | proporciona catálogo, búsqueda y detalle como Feature reutilizable |
| [Email](/es/api/email) | 1.1.1 | proporciona una Action autónoma de envío SMTP |
| [Stripe](/es/api/stripe) | 1.0.0 | implementa un checkout de pagos con Stripe |
| [Mercado Pago](/es/api/mercado-pago) | 1.0.0 | implementa un checkout de pagos con Mercado Pago |

Estas versiones y sus requisitos de integración son independientes del tren base de LEAF. Consulta cada referencia antes de elegir dependencias para tu aplicación.
