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
| [Login](/es/api/login) | 3.0.1 | proporciona una Feature de login y un Workflow experimental de referencia |
| [Authentication](/es/api/authentication) | 0.2.0 | proporciona Actions y adaptadores opcionales para autenticación |
| [Payment Contracts](/es/api/payment-contracts) | 0.1.0 | define tipos de pago independientes del proveedor |
| [Módulos de pago](/es/api/payments) | 0.3.0 | implementan checkouts Workflow para Stripe y Mercado Pago |

Estas versiones y sus requisitos de integración son independientes del tren base de LEAF. Consulta cada referencia antes de elegir dependencias para tu aplicación.
