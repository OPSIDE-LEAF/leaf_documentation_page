# Estructura y dependencias

Un módulo es un componente KMP con una API pública definida. Puede vivir en el mismo repositorio que la aplicación o en un repositorio separado; esa organización depende de cada proyecto. Incluye únicamente las dependencias necesarias para su responsabilidad.

| Si necesitas | Usa |
| --- | --- |
| tipos y una API pública | `leaf-contracts` |
| ejecutar una Action o Workflow | `leaf-core` en la parte que los ejecuta |
| observar un Workflow desde Compose | `leaf-compose` |
| el tema Material 3 opcional de LEAF | `leaf-visuals` |

Pon las reglas de negocio y los contratos compartidos en `commonMain`. Pon las pruebas del reducer y de los puertos en `commonTest`. Mantén los adaptadores de red, almacenamiento y SDK fuera de esas reglas, del lado de la app.

Puedes comprobar la integración desde una aplicación de ejemplo, una aplicación existente o un proyecto de prueba. Si el proyecto Android usa `com.android.library`, valida compilación pero no genera una aplicación instalable.

[Maven Local](/es/guide/maven-local) es una opción para probar un artefacto durante el desarrollo. También puedes usar el sistema de dependencias y distribución que defina tu proyecto. Las credenciales y secretos deben permanecer fuera del módulo y de los ejemplos.
