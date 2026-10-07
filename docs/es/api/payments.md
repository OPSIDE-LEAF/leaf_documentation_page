# Módulos de pago

Stripe 2.0.2 y Mercado Pago 2.0.2 implementan un checkout como Workflow. La UI envía eventos, el módulo publica estados y el Workflow termina con un resultado tipado. La aplicación debe configurar el proveedor, su backend, el SDK correspondiente y, cuando la necesite, la conexión con su sesión mediante el Port del token de cada módulo. Ninguno depende de Authentication.

## Entregas fuente

- Stripe: tag [`v2.0.2`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v2.0.2), revisión [`d0f4c24`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/d0f4c24).
- Mercado Pago: tag [`v2.0.2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v2.0.2), revisión [`d882569`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/d882569).

Ambos módulos declaran compatibilidad con LEAF 3.1.0 y leaf-visuals 1.4.0. Ambos publican en GitHub Packages el módulo, `checkout-ui` y `android-ui`.

## Límite público

Los dos módulos usan `CheckoutEvent` para las acciones de la UI, `CheckoutOutput` para el resultado final y `CheckoutPaymentResult` para el resultado del pago. Cuando un pago termina, llega como `CheckoutOutput.Payment`. Para Stripe, la app proporciona el acceso a su backend y la presentación de `PaymentSheet`. Para Mercado Pago, la app proporciona por separado el backend y la captura de tarjeta. Las credenciales, los callbacks y la configuración del proveedor permanecen en la aplicación o en sus adaptadores.

Los dos módulos están pensados para entornos de prueba (sandbox). Prueba el flujo completo con el entorno de pruebas del proveedor. Incluye la UI, el backend, los callbacks, la autenticación si aplica y el manejo de resultados fallidos o cancelados.
