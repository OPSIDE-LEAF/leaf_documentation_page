# Mantenimiento del paquete leaf-module-builder

La fuente versionada vive en `docs/public/skills/leaf-module-builder/` dentro de este
repositorio. Se distribuye tal cual, con enlaces relativos internos. Las páginas
`docs/es/guide/ai-skill.md` y `docs/en/guide/ai-skill.md` explican su instalación.

Ejecutar desde la raíz del sitio:

```sh
npm run skills:pack
npm run skills:check
```

`skills:pack` comprueba frontmatter, archivos permitidos, enlaces autocontenidos y
ausencia de rutas personales o requisitos internos. Genera el ZIP en
`docs/public/downloads/leaf-module-builder.zip` y verifica su contenido mediante
descompresión. `docs:dev` y `docs:build` lo ejecutan antes de VitePress; el ZIP es
derivado y no se versiona. Los `.md` de `public/` son assets, no páginas VitePress.

Para comparar una instalación local sin modificarla:

```sh
node docs/.vitepress/scripts/package-skill.mjs --check --compare <directorio-instalado>
```

La comparación ignora finales de línea y espacio al final del archivo. Revisa y
actualiza la copia instalada cuando cambie la fuente, preservando personalizaciones
locales que no pertenezcan a esta actualización. Ningún build instala la skill.

Los tres ejemplos Kotlin se incluyen en el fixture de snippets mediante su source
set. Compilar `docs/.vitepress/kotlin-snippets` verifica su API junto con los ejemplos
existentes. Esto no prueba ejecución de proveedores ni Hosts Android/iOS nuevos.

Después de cambiar contenido, ejecutar build, paridad de idiomas y comprobación de
snippets. Probar además el ZIP servido por HTTP: no basta con verificar el archivo
de origen. La preparación del sitio no equivale a desplegarlo remotamente.
