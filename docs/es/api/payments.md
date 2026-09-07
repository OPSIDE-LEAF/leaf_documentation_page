# Módulos de pago

Los módulos de Stripe y Mercado Pago 0.3.0 implementan un checkout como Workflow. La UI envía eventos, el módulo publica estados y el Workflow termina con un resultado tipado. La aplicación debe configurar el proveedor, su backend, el SDK correspondiente y la relación con Authentication cuando la necesite.

## Límite público

Los dos módulos usan `CheckoutEvent` para las acciones de la UI, `CheckoutOutput` para el resultado final y `CheckoutPaymentResult` para el resultado del pago. Cuando un pago termina, llega como `CheckoutOutput.Payment`. Para Stripe, la app proporciona el acceso a su backend y la presentación de `PaymentSheet`. Para Mercado Pago, la app proporciona por separado el backend y la captura de tarjeta. Las credenciales, los callbacks y la configuración del proveedor permanecen en la aplicación o en sus adaptadores.

Antes de usar cualquiera de los módulos en producción, prueba el flujo completo con el entorno de pruebas del proveedor. Incluye la UI, el backend, los callbacks, la autenticación si aplica y el manejo de resultados fallidos o cancelados.
