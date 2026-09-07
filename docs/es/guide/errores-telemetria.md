# Errores y telemetría

No todos los resultados difíciles son errores técnicos. Por ejemplo, que una cotización sea rechazada puede ser una respuesta normal del negocio y debe aparecer en tu propio tipo de resultado. Un problema de red inesperado es diferente.

Una Action devuelve su resultado de negocio. Si ocurre una excepción técnica que no es cancelación, `Leaf.run` la convierte en `LeafException`. Un Workflow termina una sola vez con una de estas opciones:

- `Completed(output)`: resultado de dominio.
- `Failed(reason)`: fallo técnico sin payload, por inicialización, reducer, handler o segundo efecto pendiente.
- `Cancelled`: abandono por host o corrutina propietaria.

`LeafTelemetry` permite observar cuándo empieza y termina una Action o un Workflow. Es una ayuda para diagnóstico: si su callback falla, no cambia el estado, el resultado ni la limpieza de la sesión.

No envíes a telemetría secretos, tokens, respuestas completas del backend ni identificadores sensibles. Registra solo lo necesario para entender el problema sin exponer datos de personas.
