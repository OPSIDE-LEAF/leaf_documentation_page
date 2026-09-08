# Payment modules

Stripe 0.4.0 and Mercado Pago 0.4.1 implement checkout as a Workflow. The UI sends events, the module publishes states, and the Workflow ends with a typed result. The application must configure the provider, its backend, the corresponding SDK, and any required connection to Authentication.

## Source releases

- Stripe: tag [`v0.4.0`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v0.4.0), revision [`8eea56e`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/8eea56e).
- Mercado Pago: tag [`v0.4.1`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v0.4.1), revision [`fc97be2`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/fc97be2).

Both modules declare compatibility with LEAF 3.1.0 and leaf-visuals 1.4.0. The tags identify source code; they do not prove a remote Maven publication.

## Public boundary

Both modules use `CheckoutEvent` for UI actions, `CheckoutOutput` for the final result, and `CheckoutPaymentResult` for the payment result. A completed payment arrives as `CheckoutOutput.Payment`. For Stripe, the app provides backend access and `PaymentSheet` presentation. For Mercado Pago, the app provides the backend and card capture separately. Credentials, callbacks, and provider configuration remain in the application or its adapters.

Before using either module in production, test the complete flow with the provider's test environment. Include the UI, backend, callbacks, authentication when applicable, and handling for failed or cancelled results.
