# Instalación

## Prerrequisitos

| Requisito | Detalle |
|---|---|
| JDK de build | 17 (toolchain usada por Gradle/CI) |
| Gradle | 8.14.3 (vía wrapper) |
| Kotlin | 2.3.20 |
| Android SDK | compileSdk 36, minSdk 24 |
| Xcode | Para targets iOS (Arm64, Simulator Arm64) |
| GitHub PAT | Token clásico con `read:packages` (consumir) y `write:packages` (publicar) |

## 1. Configurar credenciales

Los proyectos de LEAF configuran GitHub Packages como destino y fuente Maven; al resolver desde ese registry se requiere autenticación incluso para lectura. La disponibilidad de cada versión se comprueba al resolverla. Leaf usa un patrón **dual** de credenciales:

1. **Desarrollo local** — `local.properties` (no se commitea)
2. **CI/CD** — variables de entorno `GPR_USER` y `GPR_GIT_KEY`

Crea `local.properties` en la raíz del proyecto:

```properties
gpr.user=TU_USUARIO_GITHUB
gpr.key=TU_PERSONAL_ACCESS_TOKEN
```

::: danger Nunca commitees credenciales
`local.properties` debe estar siempre en `.gitignore`. Nunca hardcodees usuario o token en archivos versionados.
:::

## 2. Configurar repositorios

En `settings.gradle.kts`:

```kotlin
import java.io.FileInputStream

val localProperties = java.util.Properties()
val localPropertiesFile = File(rootDir, "local.properties")
if (localPropertiesFile.exists()) {
    localProperties.load(FileInputStream(localPropertiesFile))
}

dependencyResolutionManagement {
    repositories {
        if (providers.gradleProperty("leaf.useMavenLocal").orNull == "true") {
            mavenLocal()
        }
        listOf("leaf-contracts", "leaf-core", "leaf-compose", "leaf-login").forEach { repository ->
            maven {
                name = "GitHubPackages-$repository"
                url = uri("https://maven.pkg.github.com/OPSIDE-LEAF/$repository")
                credentials {
                    username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER")
                    password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_GIT_KEY")
                }
                content { includeGroup("com.opside-leaf") }
            }
        }
        google()
        mavenCentral()
    }
}
```

## 3. Agregar dependencias

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            api("com.opside-leaf:leaf-contracts:%LEAF_VERSION%")
            implementation("com.opside-leaf:leaf-core:%LEAF_VERSION%")    // Solo si necesitas Leaf.run/open
            implementation("com.opside-leaf:leaf-compose:%LEAF_VERSION%") // Solo si tienes UI Compose
        }
    }
}
```

| Coordenada | Contenido | Cuándo la necesitas |
|---|---|---|
| `com.opside-leaf:leaf-contracts:%LEAF_VERSION%` | `Module`, `ModuleInfo`, `Action`, `Feature`, DSLs | Siempre (como `api` si expones tipos Leaf) |
| `com.opside-leaf:leaf-core:%LEAF_VERSION%` | `Leaf.run`, `Leaf.open`, `FeatureSession` | Hosts que ejecutan capabilities |
| `com.opside-leaf:leaf-compose:%LEAF_VERSION%` | `Leaf.rememberLeaf` | Hosts con UI Compose |
| `com.opside-leaf:leaf-login:%LEAF_VERSION%` | Módulo de referencia (Feature/UI estable y Workflow/UI experimental) | Opcional |

::: tip leaf-contracts como dependencia `api`
Si tu módulo expone tipos de Leaf en su superficie pública (lo normal), usa `api("com.opside-leaf:leaf-contracts:...")` para que tus consumidores los resuelvan.
:::

::: info JDK 17 y target JVM 11
JDK 17 ejecuta Gradle, AGP y los jobs de CI. Los artefactos Android continúan compilando con `jvmTarget = JVM_11` y compatibilidad de bytecode Java 11. Son dos decisiones distintas.
:::

## 4. Maven Local (desarrollo)

Para probar artefactos sin publicarlos, los proyectos soportan `mavenLocal()` condicionalmente con la propiedad `leaf.useMavenLocal=true`:

```shell
./gradlew publishToMavenLocal -Pleaf.useMavenLocal=true
./gradlew :consumer:assembleDebug -Pleaf.useMavenLocal=true --refresh-dependencies
```

## Verifica

```shell
./gradlew build
```

Si la resolución de dependencias falla con 401/403, revisa que el PAT tenga `read:packages` y que `local.properties` esté en la raíz correcta.

## Siguiente paso

Tu primer módulo: [Quickstart con Action](/es/guide/quickstart-action).
