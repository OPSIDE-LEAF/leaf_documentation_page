import org.gradle.api.initialization.resolve.RepositoriesMode

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenLocal {
            content {
                includeGroup("com.opside-leaf")
            }
        }
        google {
            content {
                excludeGroup("com.opside-leaf")
            }
        }
        mavenCentral {
            content {
                excludeGroup("com.opside-leaf")
            }
        }
    }
}

rootProject.name = "leaf-doc-kotlin-snippets"
