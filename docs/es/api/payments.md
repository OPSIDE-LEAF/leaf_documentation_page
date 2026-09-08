# Módulos de pago

Stripe 0.4.0 y Mercado Pago 0.4.1 implementan un checkout como Workflow. La UI envía eventos, el módulo publica estados y el Workflow termina con un resultado tipado. La aplicación debe configurar el proveedor, su backend, el SDK correspondiente y la relación con Authentication cuando la necesite.

## Entregas fuente

- Stripe: tag [`v0.4.0`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v0.4.0), revisión [`8eea56e`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/8eea56e).
- Mercado Pago: tag [`v0.4.1`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v0.4.1), revisión [`fc97be2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/fc97be2).

Ambos módulos declaran compatibilidad con LEAF 3.1.0 y leaf-visuals 1.4.0. Los tags identifican el código fuente; no acreditan una publicación Maven remota.

## Límite público

Los dos módulos usan `CheckoutEvent` para las acciones de la UI, `CheckoutOutput` para el resultado final y `CheckoutPaymentResult` para el resultado del pago. Cuando un pago termina, llega como `CheckoutOutput.Payment`. Para Stripe, la app proporciona el acceso a su backend y la presentación de `PaymentSheet`. Para Mercado Pago, la app proporciona por separado el backend y la captura de tarjeta. Las credenciales, los callbacks y la configuración del proveedor permanecen en la aplicación o en sus adaptadores.

Antes de usar cualquiera de los módulos en producción, prueba el flujo completo con el entorno de pruebas del proveedor. Incluye la UI, el backend, los callbacks, la autenticación si aplica y el manejo de resultados fallidos o cancelados.
