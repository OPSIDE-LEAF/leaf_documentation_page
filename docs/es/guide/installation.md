# Instalación

Agrega únicamente las dependencias que correspondan a la responsabilidad de cada proyecto. Tu organización puede distribuir los artefactos de LEAF mediante el repositorio y el proceso que prefiera; esa decisión no cambia la API de los módulos.

## Dependencia necesaria para crear un módulo

Para crear el contrato público de un módulo **Action** o **Workflow**, solo necesitas `leaf-contracts`. Ese artefacto contiene las interfaces y los tipos con los que el módulo declara su input, output y, para un Workflow, su estado, eventos y efectos.

`leaf-core` y `leaf-compose` no son requisitos para declarar ese contrato. Normalmente los agrega la aplicación host según la forma en que vaya a ejecutar o presentar el módulo.

| Proyecto | Dependencia necesaria |
| --- | --- |
| Módulo que declara una Action o un Workflow | `leaf-contracts` |
| Host que ejecuta Actions o abre sesiones de Workflow | `leaf-core` |
| Host Compose que presenta y observa la UI de un Workflow | `leaf-compose` |

Por ejemplo, un host Android con Compose que ejecuta Actions y presenta Workflows puede declarar las tres dependencias:

<!-- kotlin-snippet: gradle: installation-dependencies -->
```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-contracts:%LEAF_VERSION%")
    implementation("com.opside-leaf:leaf-core:%LEAF_VERSION%")
    implementation("com.opside-leaf:leaf-compose:%LEAF_VERSION%")
}
```

No copies las tres coordenadas en todos los proyectos. El módulo reutilizable puede depender solo de Contracts. Un host sin Compose puede usar Contracts y Core. Agrega Compose únicamente al host que vaya a presentar un Workflow con esa integración.

## Configurar el repositorio

Los artefactos de LEAF se publican en GitHub Packages. Gradle necesita el registro Maven de la organización para resolverlos:

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/OPSIDE-LEAF/leaf_contracts")
            credentials {
                username = providers.gradleProperty("gpr.user").orNull
                    ?: System.getenv("GPR_USER")
                password = providers.gradleProperty("gpr.key").orNull
                    ?: System.getenv("GPR_KEY")
            }
        }
    }
}
```

GitHub Packages requiere autenticación incluso para leer. Crea un token personal (classic) con el permiso `read:packages` y configúralo de una de estas formas:

| Método | Configuración |
| --- | --- |
| Propiedades de Gradle | `gpr.user` y `gpr.key` en `~/.gradle/gradle.properties` |
| Variables de entorno | `GPR_USER` y `GPR_KEY` |

::: warning No incluyas credenciales en el repositorio
Nunca pongas el token directamente en `settings.gradle.kts` ni en archivos que se suban al control de versiones.
:::

## Maven Local para pruebas

Maven Local es una opción para probar cambios antes de distribuir un artefacto. Permite publicar una versión en el repositorio Maven de la máquina de desarrollo y comprobarla desde una aplicación de prueba. No es un requisito de LEAF ni una recomendación para distribuir dependencias dentro de una empresa.

Si necesitas esa comprobación, consulta [probar con Maven Local](/es/guide/maven-local). Para proyectos compartidos, configura el repositorio de dependencias y las reglas de publicación que correspondan a tu organización.
