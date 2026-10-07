# Evidencia de las recomendaciones

Esta guía se basa en lectura de contratos, builds, implementaciones y pruebas de
módulos LEAF. La revisión describe patrones observados; no es una certificación ni
una afirmación de publicación o funcionamiento de todos los proveedores.

## Qué se observó y qué se recomienda

| Referencia revisada | Evidencia de diseño | Recomendación general | Límite |
| --- | --- | --- | --- |
| Authentication: AuthenticationModule, AuthenticationContracts y build | Núcleo con Contracts y coroutines; HTTP y storage en artefactos opcionales; capacidades de backend, vault y reloj | Núcleo reutilizable y adaptadores optativos; varias Actions de una responsabilidad | La política de auth y la implementación de storage se eligen por producto |
| AuthenticationReuseTest | Escenarios de refresh simultáneo, cancelación, expiración y resultados atrasados | Probar carreras y ownership si varias llamadas modifican una sesión compartida | No todas las capacidades necesitan refresh ni almacenamiento |
| Mercado Pago: checkout/domain, application, gateway y CheckoutWorkflowTest | Reducción separada de I/O, estado ocupado antes del efecto, pruebas de doble envío y pendientes | Workflow con puertos y reglas testeables; resultado desconocido distinto de rechazo | Los contratos del SDK y del backend son propios del proveedor |
| Stripe: StripePaymentModule y StripePaymentLauncher | Workflow con SDK inyectado; presentación nativa directa sin pantalla intermedia obligatoria | Reutilizar lógica y permitir la presentación adecuada a cada Host | No copiar la UI de otra pasarela si el SDK ya la resuelve |
| Login 4.0.1: LoginModule, LoginRoute/LoginScreen y LoginWorkflow | `login` y `register` son Workflows; validación en el reductor y `AuthGateway` como efecto; separación de conexión/pantalla | Reutilizar la separación de responsabilidades y el estado `isSubmitting` antes del efecto | El Workflow alternativo con password redactado no reemplaza a `LoginRoute` como ruta por defecto |
| Catalog 2.0.1 y Email | Catalog es un Workflow con un efecto por carga (página o detalle) y recargas diferidas (`reloadPending`); Email es una Action | Con un solo efecto a la vez, registrar en el estado lo que llega durante una carga y descartar resultados viejos | Email no tiene estado observable; no convertir una Action en Workflow sin UI que lo justifique |
| Payment Contracts | Valores de dominio sin runtime, HTTP ni SDK | Contratos compartidos pueden ser independientes de LEAF | Compartir valores no implica compartir adaptadores de proveedor |

## Reglas que no se transfieren

No se generalizan nombres de carpetas de consumers, servidores de demostración,
credenciales, monedas, cuentas, rutas de desarrollador, triggers de CI ni decisiones
internas de publicación. Tampoco se adoptan dependencias completas de un módulo
solo porque su arquitectura sirvió como referencia.

La existencia de un paquete de adaptadores no prueba que todas sus dependencias
sean opcionales en Gradle. Comprueba el build: los módulos de pago revisados incluyen
dependencias de transporte en el artefacto principal; Authentication muestra una
separación de artefactos más clara para ese objetivo.

## Cómo volver a comprobarlo

Al adaptar la skill a una nueva versión, revisa primero Contracts, Core y el
adaptador de UI realmente instalados. Busca las implementaciones y pruebas
mencionadas solo si están disponibles. Su ausencia no bloquea usar esta guía:
las recomendaciones y plantillas incluidas son autocontenidas.

No confundas cuatro evidencias: código presente, tests presentes, tests ejecutados
y artefacto publicado. Para recomendar una capacidad del catálogo hace falta
verificar el alcance que se quiera afirmar.
