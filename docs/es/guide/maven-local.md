# Maven Local

Maven Local es un repositorio de artefactos que existe en el equipo de cada desarrollador. Puede usarse para probar una versión de un módulo antes de publicarla en el repositorio de paquetes de una organización.

Su uso es opcional. Una aplicación no necesita Maven Local para trabajar con LEAF: puede obtener las dependencias desde cualquier repositorio Maven que la organización haya elegido. Esta guía solo explica una forma rápida de comprobar cambios durante el desarrollo.

## Cuándo conviene usarlo

Maven Local resulta útil cuando necesitas:

- probar un módulo y una aplicación consumidora en proyectos separados;
- comprobar que el artefacto publicado incluye las clases y los metadatos esperados;
- validar un cambio antes de crear una versión formal;
- trabajar sin subir una compilación temporal a un repositorio compartido.

No lo uses como sistema de distribución para producción ni como reemplazo de un repositorio compartido. Los artefactos de Maven Local solo están disponibles en el equipo donde se publicaron, por lo que otra persona o un servidor de integración continua no los recibirán automáticamente.

## Publicar un artefacto de prueba

El proyecto que produce el módulo debe aplicar y configurar el plugin `maven-publish`. Desde la raíz de ese proyecto, ejecuta la tarea estándar de Gradle:

::: code-group

```shell [macOS / Linux]
./gradlew publishToMavenLocal
```

```powershell [Windows]
.\gradlew.bat publishToMavenLocal
```

:::

La publicación usa el `group`, el nombre del artefacto y la versión declarados por el proyecto. Para una prueba, usa una versión que permita reconocer con claridad el artefacto temporal, por ejemplo `0.1.0-local`. Así reduces el riesgo de confundirlo con una versión formal.

Si pruebas varios módulos y uno depende de otro, publica primero las dependencias y después los módulos que las consumen. Este orden no es específico de LEAF: Gradle necesita encontrar cada dependencia antes de compilar el siguiente proyecto.

## Configurar un proyecto consumidor

En la configuración de repositorios del proyecto que hará la prueba, agrega `mavenLocal()`. Conviene habilitarlo mediante una propiedad o una configuración exclusiva para desarrollo, y mantenerlo desactivado en las compilaciones normales.

Después, declara la dependencia con las coordenadas del artefacto de prueba:

```text
<group>:<artifacto>:<version-de-prueba>
```

Por ejemplo, si una organización publica un módulo como `com.example:customer-access:0.1.0-local`, el consumidor debe solicitar exactamente esas coordenadas. Maven Local no selecciona el módulo por el nombre de su carpeta ni por su ubicación en el disco.

## Comprobar la integración

Ejecuta una tarea real del proyecto consumidor, como su compilación o sus pruebas:

::: code-group

```shell [macOS / Linux]
./gradlew <tarea-de-validacion>
```

```powershell [Windows]
.\gradlew.bat <tarea-de-validacion>
```

:::

La tarea concreta depende del proyecto. En Android puede ser una compilación de una variante; en un módulo Kotlin Multiplatform puede ser una tarea de compilación o de pruebas para los targets que soporte. La comprobación debe ejecutarse desde un consumidor separado, sin sustituir la dependencia por una referencia directa al proyecto productor.

Verifica al menos lo siguiente:

1. El consumidor resuelve las coordenadas esperadas.
2. La API pública del módulo puede compilarse desde otro proyecto.
3. Los targets que necesita el consumidor están incluidos en la publicación.
4. El resultado no depende de archivos que solo existan en el proyecto productor.

Una compilación correcta demuestra que el artefacto puede resolverse y usarse en ese contexto. No demuestra por sí sola que una aplicación Android pueda instalarse, que una aplicación iOS pueda enlazarse y ejecutarse ni que un flujo completo funcione. Esas comprobaciones requieren sus propias pruebas.

## Volver a la configuración normal

Cuando termines la prueba, desactiva `mavenLocal()` en el consumidor y usa el repositorio Maven definido por tu organización. También cambia la dependencia a la versión que corresponda publicar o distribuir.

Este último paso evita que una compilación normal use por accidente un artefacto temporal que solo existe en el equipo de una persona.
