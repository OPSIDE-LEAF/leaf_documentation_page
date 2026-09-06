# Sandbox backend: entorno de pruebas

::: info Prueba de concepto
Esta página describe el backend Ktor del sandbox LEAF ([repo](https://github.com/OPSIDE-LEAF/leaf-sandbox-backend)). Es una PoC: su comportamiento de pago es sintético `LOCAL_FAKE`, sin SDK de proveedor, sin credenciales y sin red externa. **No integra Stripe ni Mercado Pago.**
:::

El sandbox backend es el servidor contra el que se prueban los módulos de autenticación y pagos en modo `LOCAL_FAKE`. Es un proyecto JVM 17 con Ktor, Gradle y Flyway, independiente del tren `%LEAF_VERSION%`.

## Qué es y qué no es

| Sí | No |
|---|---|
| Autenticación local con tokens rotativos | Proveedor de identidad real |
| Dos rutas de órdenes de pago autenticadas | Cobros, tokenización ni webhooks |
| Estado durable con migraciones versionadas | Reconciliación en producción |
| Diagnóstico de modo y egress | Rutas específicas de proveedor |

## Modos de ejecución

La variable `LEAF_MODE` selecciona la forma del despliegue. El comportamiento de pago sigue siendo `LOCAL_FAKE` en ambos modos: lo único que cambia es el listener y el almacenamiento.

| `LEAF_MODE` | Listener | Almacenamiento |
|---|---|---|
| ausente, `DEVELOPMENT` o `LOCAL_FAKE` (default) | `127.0.0.1` | archivo H2 local fijo |
| `PRODUCTION` | `0.0.0.0` | PostgreSQL desde `DB_URL`, `DB_USER`, `DB_PASSWORD` |

::: warning Fallo cerrado
La configuración se valida antes de que Netty arranque. `LEAF_SANDBOX_MODE` sigue aceptando solo `LOCAL_FAKE`; en `PRODUCTION` los únicos bind hosts admitidos son `0.0.0.0` y `127.0.0.1`; `DB_URL` debe usar el esquema `jdbc:postgresql`; y las tres variables `DB_*` son obligatorias juntas. Los nombres en minúscula o mixtos se rechazan.
:::

## Configuración con `.env`

Las variables se leen del entorno del proceso, superpuesto sobre un archivo `.env` opcional en el directorio de trabajo. **El entorno real siempre gana** sobre el archivo, de modo que un contenedor arrancado con `--env-file` manda sobre lo que esté en el repositorio. El archivo está en `.gitignore`; `.env.example` documenta cada nombre reconocido.

```bash
LEAF_MODE=PRODUCTION
DB_URL=jdbc:postgresql://postgres-leaf:5432/leaf_db
DB_USER=leaf_admin
DB_PASSWORD=el-password-real
```

::: danger El puerto interno no es el publicado
`LEAF_SANDBOX_PORT` es el puerto **dentro** del contenedor (default `8080`), y `docker run -p <host>:8080` es el que publica hacia fuera. Ponerle el puerto del host hace que el mapeo apunte a un puerto muerto y el servicio responda *connection refused*. Déjalo sin definir en el `.env` de un contenedor.
:::

## Endpoints

Todos cuelgan de `/api/v1`.

| Método | Ruta | Auth | Qué hace |
|---|---|---|---|
| GET | `/health` | — | Diagnóstico de estado y modo |
| GET | `/sandbox` | — | Modo y bandera de egress al proveedor |
| POST | `/authentication/password` | — | Inicio de sesión con identificador y contraseña |
| POST | `/authentication/oauth-exchange` | — | Intercambio OAuth con PKCE |
| POST | `/authentication/challenges/continue` | — | Continuación de un challenge (`secret` o `approved`) |
| POST | `/authentication/refresh` | — | Rotación del refresh token |
| POST | `/authentication/revoke` | — | Revocación de la familia de tokens (204) |
| POST | `/payment-orders` | Bearer | Crea o repite una orden idempotente |
| GET | `/payment-orders/{paymentAttemptId}` | Bearer | Consulta, restringida al dueño del token |

`provider` acepta `STRIPE` o `MERCADO_PAGO`. No existen rutas de webhooks, reconciliación ni de proveedor. Las credenciales de prueba son fixtures locales que viven en el código fuente y no se publican aquí a propósito.

El contrato completo está en `src/main/resources/openapi/openapi-v1-skeleton.yaml`, cuyo checksum verifica un test.

## Persistencia y migraciones

Flyway aplica migraciones versionadas V1–V5 en ambos modos, con **dos catálogos separados**: el común para H2 y uno de historia fresca para PostgreSQL. El arranque elige el catálogo según el modo; nunca comparten historial de esquema.

::: tip Empaquetado en fat jar
Flyway descubre cada motor mediante registros en `META-INF/services`. Al empaquetar el fat jar hay que **fusionar** esos archivos (`mergeServiceFiles()` en la tarea `shadowJar`), o el arranque falla con `Unsupported Database` aunque el mismo classpath migre bien bajo Gradle.
:::

## Despliegue con Docker

La imagen construye el fat jar y su modo por defecto es `PRODUCTION`, para que el puerto publicado sea realmente alcanzable. Las credenciales nunca se copian a la imagen: `.env` está excluido por `.dockerignore` y se inyecta en tiempo de ejecución.

El backend y PostgreSQL deben compartir una red de Docker; el host de `DB_URL` es el **nombre del contenedor** de la base, no `localhost`.

```bash
docker network create leaf-net
docker network connect leaf-net postgres-leaf

docker run -d --name servidor-leaf \
  --network leaf-net \
  --env-file .env \
  --restart unless-stopped \
  -p 8082:8080 \
  backend-leaf
```

::: warning `--env-file` se lee al crear, no al reiniciar
Cambiar el `.env` y hacer `docker restart` **no** aplica los valores nuevos: el contenedor conserva el entorno con el que se creó. Hay que borrarlo y volver a crearlo.
:::
