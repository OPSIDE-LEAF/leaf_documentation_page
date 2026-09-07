import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.library") version "8.11.2"
    id("org.jetbrains.kotlin.android") version "2.3.20"
    id("org.jetbrains.compose") version "1.10.3"
    id("org.jetbrains.kotlin.plugin.compose") version "2.3.20"
}

group = "com.opside-leaf.docs"
version = "1.0.0"

layout.buildDirectory.set(layout.projectDirectory.dir("../cache/kotlin-snippets-build"))

android {
    namespace = "com.opside.leaf.docs.snippets"
    compileSdk = 36

    defaultConfig {
        minSdk = 24
    }

    buildFeatures {
        compose = true
    }

    // Compile the downloadable skill examples against the same verified LEAF API.
    sourceSets["main"].java.srcDir("../../public/skills/leaf-module-builder/examples")

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_11)
    }
}

dependencies {
    implementation("com.opside-leaf:leaf-contracts:3.1.0")
    implementation("com.opside-leaf:leaf-core:3.1.0")
    implementation("com.opside-leaf:leaf-compose:3.1.0")
    implementation("com.opside-leaf:leaf-visuals:1.4.0")
    implementation("com.opside-leaf:leaf-payment-contracts:0.1.0")

    implementation(compose.runtime)
    implementation(compose.foundation)
    implementation(compose.material3)
}
