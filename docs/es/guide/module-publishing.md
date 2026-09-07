# Probar antes de distribuir

Antes de distribuir un módulo, comprueba que su API pública puede consumirse sin depender de código interno. La estrategia de distribución depende de cada proyecto: puede ser un repositorio Maven privado o público, un catálogo corporativo, un build compuesto o cualquier mecanismo compatible con Gradle.

1. Ejecuta las pruebas unitarias y de contrato del módulo.
2. Genera el artefacto con la misma configuración que usarás para distribuirlo.
3. Consúmelo desde una aplicación de ejemplo, una aplicación existente o un proyecto aislado.
4. Compila los targets que vas a soportar y ejecuta las pruebas de integración necesarias.
5. Verifica la versión, las coordenadas y las dependencias transitivas antes de publicar.

Si quieres probar el artefacto sin subirlo a un repositorio, [Maven Local](/es/guide/maven-local) ofrece una opción rápida. Es una prueba de resolución local; no sustituye las pruebas de la aplicación, la revisión de la UI ni la validación de cada plataforma soportada.
