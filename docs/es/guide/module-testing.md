# Autor: testing del módulo

Los tests viven en `commonTest` usando Kotlin Test + `kotlinx-coroutines-test`. Prueba el módulo en el nivel adecuado **antes** de integrarlo.

## Qué probar

1. **Transiciones** — validación y recuperación devuelven `stay`; una salida satisfactoria devuelve `finish` una vez.
2. **Gateway** — el éxito y la invalidación esperable se mapean a resultados de dominio/estado, no a excepciones.
3. **Errores** — una excepción inesperada durante una transición termina como `Failed(TRANSITION_FAILED)` sin filtrar detalle.
4. **Ciclo de vida** — cancelar el scope del host produce `Cancelled`; cerrar dos veces no cambia el resultado.
5. **Presión** — una cola saturada devuelve `REJECTED_OVERFLOW`, termina con `EVENT_QUEUE_OVERFLOW` e incrementa la métrica.
6. **Compose** — recomposición con la misma pareja `(feature, input)` no abre otra sesión; reemplazarla o salir de composición cierra la anterior.
7. **Privacidad** — telemetría/logs no reciben payloads ni secretos; una telemetría que falle no altera el resultado.

## Testing de transiciones (unitario, sin sesión)

La transición de una Feature es una función: puedes invocarla directamente con estado y evento.

```kotlin
class CheckoutModuleTest {

    @Test
    fun `blank field keeps the feature active with an error`() = runTest {
        val transition = module(PaymentResponse.Success("id-1")).checkout.transition(
            CheckoutState(field = ""),
            CheckoutEvent.Submit,
        )
        val stay = assertIs<FeatureTransition.Stay<CheckoutState>>(transition)
        assertEquals("El campo es obligatorio", stay.state.error)
    }

    @Test
    fun `successful operation finishes with typed result`() = runTest {
        val transition = module(PaymentResponse.Success("id-1")).checkout.transition(
            CheckoutState(field = "valid-input"),
            CheckoutEvent.Submit,
        )
        val finish = assertIs<FeatureTransition.Finish<CheckoutResult>>(transition)
        assertEquals(CheckoutResult.Success("id-1"), finish.output)
    }

    private fun module(response: PaymentResponse) = CheckoutModule(
        gateway = object : PaymentGateway {
            override suspend fun execute(param: String) = response
        },
    )
}
```

## Testing de sesión (integración con Core)

Para verificar el comportamiento terminal usa `Leaf.open` dentro de `runTest`:

```kotlin
@Test
fun `unexpected gateway error becomes a failed session`() = runTest {
    val module = CheckoutModule(
        gateway = object : PaymentGateway {
            override suspend fun execute(param: String): PaymentResponse {
                error("network unavailable")
            }
        },
    )
    val session = Leaf.open(module.checkout, input = CheckoutInput())
    session.send(CheckoutEvent.FieldChanged("value"))
    session.send(CheckoutEvent.Submit)
    assertIs<FeatureSessionResult.Failed>(session.result.filterNotNull().first())
}
```

Los fakes de gateways son objetos anónimos o clases simples — no necesitas frameworks de mocking.

## Ejecutar

```shell
./gradlew testDebugUnitTest
```

## Siguiente paso

[Validación y publicación](/es/guide/module-publishing): ABI, clean consumer y publicación por tag.
