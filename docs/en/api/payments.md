# Payment modules

Stripe 2.0.1 and Mercado Pago 2.0.1 implement checkout as a Workflow. The UI sends events, the module publishes states, and the Workflow ends with a typed result. The application must configure the provider, its backend, the corresponding SDK, and, when needed, the connection to its session through each module's token Port. Neither depends on Authentication.

## Source releases

- Stripe: tag [`v2.0.1`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/tree/v2.0.1), revision [`10a1af7`](https://github.com/OPSIDE-LEAF/leaf_stripe_payment/commit/10a1af7).
- Mercado Pago: tag [`v2.0.1`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/tree/v2.0.1), revision [`88760f0`](https://github.com/OPSIDE-LEAF/leaf_mp_payment/commit/88760f0).

Both modules declare compatibility with LEAF 3.1.0 and leaf-visuals 1.4.0. Both publish the module, `checkout-ui`, and `android-ui` to GitHub Packages.

## Public boundary

Both modules use `CheckoutEvent` for UI actions, `CheckoutOutput` for the final result, and `CheckoutPaymentResult` for the payment result. A completed payment arrives as `CheckoutOutput.Payment`. For Stripe, the app provides backend access and `PaymentSheet` presentation. For Mercado Pago, the app provides the backend and card capture separately. Credentials, callbacks, and provider configuration remain in the application or its adapters.

Both modules are meant for test (sandbox) environments. Test the complete flow with the provider's test environment. Include the UI, backend, callbacks, authentication when applicable, and handling for failed or cancelled results.
