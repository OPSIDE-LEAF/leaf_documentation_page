# Crear un módulo: setup del repositorio

Un módulo Leaf es un **repositorio independiente** que expone capabilities tipadas consumibles por cualquier host Android/iOS. Esta guía cubre la infraestructura; la [implementación del código](/es/guide/module-implementation) viene después.

::: tip Referencia
`leaf_login` es el módulo de referencia completo y validado. Ante cualquier duda de estructura o configuración, consulta su código.
:::

## 1. Crear el repositorio

- Repositorio en tu cuenta u organización de GitHub (o cualquier hosting Git) con nombre `leaf-<modulo>` (ej. `leaf-checkout`). No necesita estar en la organización OPSIDE-LEAF.
- Directorio local `leaf_<modulo>` por convención.

## 2. Archivos del primer commit

**Infraestructura (obligatorios):** `.gitignore`, `.gitattributes`, `settings.gradle.kts`, `build.gradle.kts`, `gradle.properties`, `gradle/libs.versions.toml`, `gradle/wrapper/gradle-wrapper.properties`, `gradlew`, `gradlew.bat`, `README.md`, `LICENSE` (Apache 2.0), `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`.

**Código (mínimo funcional):**

```
src/commonMain/kotlin/com/opside/leaf/<modulo>/
├── <Modulo>Module.kt              → Module con Feature o Action
├── domain/<Modulo>Models.kt       → Input, State, Event, Result
└── gateway/                       → Ports (interfaces)
src/commonTest/kotlin/com/opside/leaf/<modulo>/
└── <Modulo>ModuleTest.kt          → Tests unitarios
```

**Opcionales (recomendados):** `ui/<Modulo>Route.kt` + `ui/<Modulo>Screen.kt` (si tiene UI), `consumer/android-clean-consumer/`, `api/` (ABI dumps).

## 3. Configuración Gradle

### `gradle/libs.versions.toml`

```toml
[versions]
kotlin = "2.3.20"
agp = "8.11.2"
compose = "1.10.3"
android-compileSdk = "36"
android-minSdk = "24"
kotlinx-coroutines = "1.10.2"
leaf = "%LEAF_VERSION%"
leaf-<modulo> = "0.1.0"  # ← Versión inicial del módulo

[libraries]
leaf-contracts = { module = "com.opside-leaf:leaf-contracts", version.ref = "leaf" }
leaf-core = { module = "com.opside-leaf:leaf-core", version.ref = "leaf" }
leaf-compose = { module = "com.opside-leaf:leaf-compose", version.ref = "leaf" }
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinx-coroutines" }
kotlinx-coroutines-test = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-test", version.ref = "kotlinx-coroutines" }

[plugins]
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
androidApplication = { id = "com.android.application", version.ref = "agp" }
composeMultiplatform = { id = "org.jetbrains.compose", version.ref = "compose" }
composeCompiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
```

### `settings.gradle.kts`

Proyecto root standalone con GitHub Packages y credenciales duales (el mismo patrón de [Instalación](/es/guide/installation)), más el consumer comentado:

```kotlin
rootProject.name = "leaf-<modulo>"

// ... repositorios GitHub Packages con credenciales dual ...

// Descomentar cuando se agregue el consumer:
// include(":consumer")
// project(":consumer").projectDir = file("consumer/android-clean-consumer")
```

### `build.gradle.kts` (esqueleto)

```kotlin
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.androidLibrary) apply false
    alias(libs.plugins.androidApplication) apply false
    id("maven-publish")
}

apply(plugin = "com.android.library")

group = "com.opside-leaf"
version = libs.versions.leaf.<modulo>.get()

kotlin {
    @OptIn(ExperimentalAbiValidation::class)
    abiValidation { enabled.set(true) }

    androidTarget {
        compilerOptions { jvmTarget.set(JvmTarget.JVM_11) }
        publishLibraryVariants("release")
    }
    listOf(iosArm64(), iosSimulatorArm64()).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "Leaf<Modulo>"  // PascalCase
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            api(libs.leaf.contracts)
            implementation(libs.kotlinx.coroutines.core)
            // Solo si el módulo tiene UI:
            // api(compose.runtime)
            // api(compose.ui)
            // implementation(libs.leaf.compose)
            // implementation(compose.foundation)
            // implementation(compose.material3)
        }
        commonTest.dependencies {
            implementation(libs.kotlin.test)
            implementation(libs.kotlinx.coroutines.test)
        }
    }
}

extensions.configure<LibraryExtension> {
    namespace = "com.opside.leaf.<modulo>"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    defaultConfig { minSdk = libs.versions.android.minSdk.get().toInt() }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

publishing {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/<OWNER>/<REPO>")
            credentials {
                username = System.getenv("GPR_USER")
                password = System.getenv("GPR_GIT_KEY")
            }
        }
    }
    // publications.withType<MavenPublication> { pom { ... } }
}
```

::: tip ¿Dónde publico mis artefactos?
La URL de `publishing.repositories.maven` determina **dónde** se almacenan los artefactos. El `group` y `version` del módulo no cambian — solo cambia el destino.

No necesitas pertenecer a la organización OPSIDE-LEAF ni usar sus repos. Cualquier desarrollador puede crear módulos Leaf y publicarlos en su propia cuenta, organización o servidor Maven. Lo único que importa es que el módulo respete la arquitectura Leaf y que los consumidores sepan dónde encontrarlo.

**Opción A — Repo centralizado de distribución (recomendado para organizaciones):**
Todos los módulos publican al mismo repo. Los consumidores solo configuran una fuente.
```kotlin
url = uri("https://maven.pkg.github.com/MI-ORG/packages-distribution")
```

**Opción B — El mismo repo del módulo:**
Cada módulo publica en su propio repo. Simple, pero los consumidores deben agregar una URL por cada módulo que usen.
```kotlin
url = uri("https://maven.pkg.github.com/MI-USUARIO/mi-modulo-leaf")
```

**Opción C — Repositorio Maven privado o público:**
Cualquier servidor Maven compatible (Sonatype Nexus, JFrog Artifactory, Maven Central, etc.).
```kotlin
url = uri("https://my-nexus.example.com/repository/maven-releases/")
```

En todos los casos, los consumidores deben agregar el repositorio correspondiente en su `settings.gradle.kts` para resolver las dependencias. OPSIDE-LEAF usa la Opción A con el repo [`packages-distribution`](https://github.com/OPSIDE-LEAF/packages-distribution).
:::

### `gradle.properties`

```properties
kotlin.code.style=official
kotlin.daemon.jvmargs=-Xmx3072M
org.gradle.jvmargs=-Xmx4096M -Dfile.encoding=UTF-8
org.gradle.configuration-cache=true
org.gradle.caching=true
android.nonTransitiveRClass=true
android.useAndroidX=true
```

## 4. Credenciales y primera compilación

Crea `local.properties` (NO se commitea) con `gpr.user` / `gpr.key`, y valida:

```shell
./gradlew build
```

## Convenciones del módulo

| Aspecto | Convención |
|---|---|
| Paquete | `com.opside.leaf.<modulo>` |
| Group ID | `com.opside-leaf` |
| Artifact ID | `leaf-<modulo>` |
| Framework iOS | `Leaf<Modulo>` (PascalCase) |
| Versionado | Semántico e independiente |

## Siguiente paso

[Implementar el módulo](/es/guide/module-implementation): modelos, gateways, Module y UI.
