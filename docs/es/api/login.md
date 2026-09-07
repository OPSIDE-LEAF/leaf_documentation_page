# Login

Login 3.0.1 es un módulo Kotlin Multiplatform de referencia para iniciar sesión. Ofrece una Feature estable con UI Compose y una alternativa Workflow experimental; la autenticación real y la navegación permanecen bajo control de la aplicación host.

## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-login:3.0.1`. Su código fuente corresponde al tag [`v3.0.1`](https://github.com/OPSIDE-LEAF/leaf-login/tree/v3.0.1), revisión [`ad5f8be`](https://github.com/OPSIDE-LEAF/leaf-login/commit/ad5f8be).

La compatibilidad declarada es LEAF Contracts/Core/Compose 3.0.0; la integración con leaf-visuals 1.3.0 es opcional.

Login mantiene una versión independiente del tren base de LEAF. Antes de integrarlo, comprueba sus requisitos de compatibilidad y que el artefacto esté disponible en el repositorio Maven configurado por tu organización.

## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `LoginModule` y `login` | Exponen la Feature estable de formulario, validación y autenticación. |
| `AuthGateway` | Define el Port que la aplicación implementa para autenticar correo y contraseña. |
| `LoginRoute` y `LoginScreen` | Conectan la Feature con Compose; la navegación terminal pertenece al host. |
| `createLoginWorkflow` y `LoginWorkflowScreen` | Ofrecen la alternativa Workflow experimental y requieren opt-in explícito. |

## Responsabilidades del host

La aplicación implementa `AuthGateway`, traduce las respuestas esperadas a los resultados del módulo y decide qué ocurre después de una autenticación correcta. También controla el transporte, la persistencia, la telemetría, el tema visual opcional y la navegación fuera de Login.

## Feature y Workflow

La Feature estable usa `LoginInput`, `LoginState`, `LoginEvent` y `LoginResult`. `LoginRoute` observa su resultado y entrega `LoginResult.Authenticated` al callback del host.

El Workflow experimental separa el password de `LoginWorkflowState` mediante `LoginPassword`, emite el efecto de autenticación y termina con `LoginWorkflowOutput.Authenticated` o `LoginWorkflowOutput.Cancelled`. Los fallos recuperables vuelven a un estado editable; la aplicación sigue siendo dueña del Gateway y de las acciones posteriores.

## Seguridad

No registres, persistas ni envíes passwords a telemetría. La ruta Feature conserva el password durante la sesión para procesar el formulario, por lo que el host debe evitar serializar su estado. La ruta Workflow redacta `LoginPassword` al convertirlo en texto y la UI limpia su copia cuando termina o sale de composición.
