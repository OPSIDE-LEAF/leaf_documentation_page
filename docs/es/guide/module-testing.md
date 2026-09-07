# Pruebas de módulo

Prueba primero las reglas del módulo sin una pantalla real ni un servicio real. En `commonTest` usa puertos fake y corrutinas de prueba. Así puedes comprobar qué pasa en cada caso sin depender de red, permisos o un dispositivo.

| Parte | Qué conviene comprobar |
| --- | --- |
| Action | datos válidos, resultado y un rechazo esperado del negocio |
| Reducer del Workflow | que `initialize` y cada `reduce` den el `WorkflowStep` esperado |
| Ejecución de Workflow | estados, `Completed`, `Failed`, `Cancelled` y cola llena |
| Effect handler | que un efecto vuelva como evento y no exponga secretos |
| Holder de Compose | la clave `sessionKey`, el resultado final y la cancelación al salir |

Si algo puede salir mal como parte normal del negocio, represéntalo en el resultado o en un evento. No lo conviertas en excepción solo para que una prueba falle.

Para comprobar que otro proyecto puede resolver el artefacto, puedes usar [Maven Local](/es/guide/maven-local) durante el desarrollo o el repositorio de dependencias elegido por tu organización. Una library consumidora valida resolución y compilación; una aplicación de ejemplo también permite probar ejecución, ciclo de vida y UI.
