# Autor: validación y publicación

Antes de publicar, el módulo pasa tres validaciones: tests, ABI y clean consumer.

## 1. Validación ABI

Todo módulo publicable incluye `abiValidation`. El dump en `api/` es la superficie pública comprometida:

```shell
./gradlew checkKotlinAbi     # verifica que la superficie no cambió
./gradlew updateKotlinAbi    # regenera el dump (primera vez o cambio intencional)
```

Un cambio de ABI no intencional rompe a los consumidores: si `checkKotlinAbi` falla, decide conscientemente si es un cambio de versión mayor.

## 2. Clean consumer

El consumer es una app Android **no publicable** que compila el uso soportado del módulo como dependencia real:

```
consumer/
└── android-clean-consumer/
    ├── build.gradle.kts
    └── src/
        ├── androidMain/    → MainActivity, manifest, estilos
        └── commonMain/     → Consumer<Modulo>Host.kt
```

El host de ejemplo posee el adaptador de infraestructura (fake) y la acción post-completado:

```kotlin
class FakeGateway : PaymentGateway {
    override suspend fun execute(param: String): PaymentResponse =
        PaymentResponse.Success(id = "fake-id")
}

@Composable
fun ConsumerCheckoutHost(
    onSuccess: (CheckoutResult.Success) -> Unit,
) {
    val module = remember { CheckoutModule(FakeGateway()) }
    CheckoutRoute(
        module = module,
        input = CheckoutInput(),
        onSuccess = onSuccess,
    )
}
```

Habilítalo en `settings.gradle.kts`:

```kotlin
include(":consumer")
project(":consumer").projectDir = file("consumer/android-clean-consumer")
```

## 3. Validación completa

```shell
# Tests + ABI + publicación local
./gradlew testDebugUnitTest checkKotlinAbi publishToMavenLocal -Pleaf.useMavenLocal=true

# El consumer compila contra el artefacto local
./gradlew :consumer:assembleDebug -Pleaf.useMavenLocal=true --refresh-dependencies
```

Si ambas pasan, el artefacto candidato es consumible tal como lo recibirán los hosts.

## 4. Primer commit

```shell
git init
git add .
git commit -m "feat: initial module setup"
git remote add origin git@github.com:OPSIDE-LEAF/leaf-<modulo>.git
git push -u origin main
```

## 5. Publicación por tag

La publicación ocurre **exclusivamente** desde un tag `v<versión>` que coincida con la versión del catálogo Gradle (`libs.versions.toml`):

```shell
git tag v0.1.0
git push origin v0.1.0
```

El CI/CD (GitHub Actions) ejecuta tests, valida ABI y publica a GitHub Packages con `GPR_USER` / `GPR_GIT_KEY`.

::: warning Tag ↔ catálogo
Si el tag no coincide con `leaf-<modulo>` en `libs.versions.toml`, la publicación no debe proceder. El versionado es semántico e independiente por módulo.
:::

## Checklist del autor

```
- [ ] Modelos de dominio (Input, State, Event, Result) definidos
- [ ] Puertos/gateways como interfaces; sin implementaciones de infraestructura en el módulo
- [ ] Module con ModuleInfo estable no vacío
- [ ] Tests unitarios en commonTest pasando
- [ ] checkKotlinAbi en verde (o updateKotlinAbi consciente)
- [ ] Clean consumer compila contra el artefacto local
- [ ] README, LICENSE, CHANGELOG, CONTRIBUTING, SECURITY presentes
- [ ] local.properties fuera del repo (.gitignore)
- [ ] Tag v<versión> == libs.versions.toml
```
