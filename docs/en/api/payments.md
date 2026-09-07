# Payment modules

The Stripe and Mercado Pago 0.3 modules implement checkout as a Workflow. The UI sends events, the module publishes states, and the Workflow ends with a typed result. The application must configure the provider, its backend, the corresponding SDK, and any required connection to Authentication.

## Public boundary

Both modules use `CheckoutEvent` for UI actions, `CheckoutOutput` for the final result, and `CheckoutPaymentResult` for the payment result. A completed payment arrives as `CheckoutOutput.Payment`. For Stripe, the app provides backend access and `PaymentSheet` presentation. For Mercado Pago, the app provides the backend and card capture separately. Credentials, callbacks, and provider configuration remain in the application or its adapters.

Before using either module in production, test the complete flow with the provider's test environment. Include the UI, backend, callbacks, authentication when applicable, and handling for failed or cancelled results.
