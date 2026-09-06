# Sandbox backend: the test environment

::: info Proof of concept
This page describes the LEAF sandbox Ktor backend ([repo](https://github.com/OPSIDE-LEAF/leaf-sandbox-backend)). It is a PoC: its payment behavior is synthetic `LOCAL_FAKE`, with no provider SDK, no credentials and no external network. **It integrates neither Stripe nor Mercado Pago.**
:::

The sandbox backend is the server the authentication and payment modules are tested against in `LOCAL_FAKE` mode. It is a JVM 17 project built with Ktor, Gradle and Flyway, independent of the `%LEAF_VERSION%` train.

## What it is and what it is not

| Yes | No |
|---|---|
| Local authentication with rotating tokens | A real identity provider |
| Two authenticated payment-order routes | Charges, tokenization or webhooks |
| Durable state with versioned migrations | Production reconciliation |
| Mode and egress diagnostics | Provider-specific routes |

## Runtime modes

The `LEAF_MODE` variable selects the deployment shape. Payment behavior stays `LOCAL_FAKE` in both modes: only the listener and the storage change.

| `LEAF_MODE` | Listener | Storage |
|---|---|---|
| absent, `DEVELOPMENT` or `LOCAL_FAKE` (default) | `127.0.0.1` | fixed local H2 file |
| `PRODUCTION` | `0.0.0.0` | PostgreSQL from `DB_URL`, `DB_USER`, `DB_PASSWORD` |

::: warning Fails closed
Configuration is validated before Netty starts. `LEAF_SANDBOX_MODE` still accepts only `LOCAL_FAKE`; in `PRODUCTION` the only accepted bind hosts are `0.0.0.0` and `127.0.0.1`; `DB_URL` must use the `jdbc:postgresql` scheme; and the three `DB_*` variables are required together. Lower- or mixed-case names are rejected.
:::

## Configuration through `.env`

Variables are read from the process environment, overlaid on an optional `.env` file in the working directory. **The real environment always wins** over the file, so a container started with `--env-file` overrides whatever the repository holds. The file is git-ignored; `.env.example` documents every recognized name.

```bash
LEAF_MODE=PRODUCTION
DB_URL=jdbc:postgresql://postgres-leaf:5432/leaf_db
DB_USER=leaf_admin
DB_PASSWORD=the-real-password
```

::: danger The internal port is not the published one
`LEAF_SANDBOX_PORT` is the port **inside** the container (default `8080`), and `docker run -p <host>:8080` is what publishes it outward. Setting it to the host port makes the mapping target a dead port and the service answers *connection refused*. Leave it undefined in a container `.env`.
:::

## Endpoints

Everything hangs off `/api/v1`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | — | Status and mode diagnostic |
| GET | `/sandbox` | — | Mode and provider-egress flag |
| POST | `/authentication/password` | — | Sign in with identifier and password |
| POST | `/authentication/oauth-exchange` | — | OAuth exchange with PKCE |
| POST | `/authentication/challenges/continue` | — | Continue a challenge (`secret` or `approved`) |
| POST | `/authentication/refresh` | — | Rotate the refresh token |
| POST | `/authentication/revoke` | — | Revoke the token family (204) |
| POST | `/payment-orders` | Bearer | Create or replay an idempotent order |
| GET | `/payment-orders/{paymentAttemptId}` | Bearer | Read it back, restricted to the token owner |

`provider` accepts `STRIPE` or `MERCADO_PAGO`. There are no webhook, reconciliation or provider-specific routes. The test credentials are local fixtures that live in the source and are deliberately not published here.

The full contract lives in `src/main/resources/openapi/openapi-v1-skeleton.yaml`, whose checksum a test enforces.

## Persistence and migrations

Flyway applies versioned V1–V5 migrations in both modes, from **two separate catalogs**: the common one for H2 and a fresh-history one for PostgreSQL. Startup picks the catalog by mode; they never share a schema history.

::: tip Fat-jar packaging
Flyway discovers each database engine through `META-INF/services` registrations. Packing the fat jar requires **merging** those files (`mergeServiceFiles()` on the `shadowJar` task), or startup fails with `Unsupported Database` even though the same classpath migrates correctly under Gradle.
:::

## Docker deployment

The image builds the fat jar and defaults to `PRODUCTION`, so the published port is actually reachable. Credentials never reach the image: `.env` is excluded by `.dockerignore` and injected at run time.

The backend and PostgreSQL must share a Docker network; the host in `DB_URL` is the database **container name**, not `localhost`.

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

::: warning `--env-file` is read at creation, not at restart
Editing `.env` and running `docker restart` does **not** apply the new values: the container keeps the environment it was created with. It has to be removed and recreated.
:::
