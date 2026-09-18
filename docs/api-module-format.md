# Formato estándar para páginas API de módulos

Todas las páginas de referencia API de módulos independientes siguen esta estructura.
El objetivo es que un developer entienda rápidamente qué es el módulo, cómo instalarlo y cómo usarlo.

## Estructura obligatoria

### 1. Título + introducción

```markdown
# Nombre del módulo

[1-2 oraciones: qué hace, qué patrón LEAF usa (Action, Workflow, Feature) y qué controla el host.]
```

### 2. Entrega y compatibilidad

```markdown
## Entrega y compatibilidad

El artefacto es `com.opside-leaf:leaf-{nombre}:{versión}`. Su código fuente corresponde al tag [...], revisión [...].

La compatibilidad declarada es LEAF Contracts/Core/Compose {versión}; la integración con leaf-visuals {versión} es {obligatoria|opcional}.
```

- Incluir link al tag y al commit en GitHub.
- Si el módulo tiene versión independiente del tren base de LEAF, mencionarlo.

### 3. Dependencia

```markdown
## Dependencia

\```kotlin
dependencies {
    implementation("com.opside-leaf:leaf-{nombre}:{versión}")
}
\```

{Nombre} declara `X` y `Y` como dependencias transitivas. `Z` es una dependencia de implementación interna; el host no necesita declararla por separado.
```

- Siempre incluir el snippet Gradle copy-paste.
- Indicar qué dependencias son transitivas (`api`) y cuáles internas (`implementation`).

### 4. Superficie pública

```markdown
## Superficie pública

| API | Responsabilidad |
| --- | --- |
| `NombreModule` | Describe qué expone |
| `NombreGateway` | Describe el Port que implementa el host |
| `NombreRoute` / `NombreScreen` | Describe la conexión con Compose |
```

- Tabla concisa: nombre de la API → qué hace.
- Solo APIs que el host ve y usa directamente.

### 5. Responsabilidades del host

```markdown
## Responsabilidades del host

La aplicación implementa `Gateway`, proporciona [...] y decide qué ocurre después de [...].
```

- 1-2 párrafos máximo.
- Enumerar qué implementa, qué configura y qué controla la app.

### 6. Uso

```markdown
## Uso

### Implementar el Gateway/Port

[Código mostrando cómo implementar la interfaz que pide el módulo]

### Conectar el módulo

[Código mostrando cómo instanciar el módulo y presentarlo con Compose]

### Consumir el resultado

[Código o tabla mostrando los posibles resultados y cómo manejarlos]
```

- Imports completos en cada snippet.
- Código verificado contra el fuente real (no inventado).
- Si el módulo tiene varias rutas (Feature + Workflow), mostrar cada una como subsección.

### 7. Secciones específicas (opcionales)

Solo incluir si aplican al módulo:

- **Validación** — si el módulo valida la entrada y puede rechazarla.
- **Seguridad** — si maneja secretos, passwords o datos sensibles.
- **Transporte por plataforma** — si tiene implementaciones `expect`/`actual` distintas por OS.
- **Configuración por DSL** — si el módulo se configura con un builder DSL.

## Reglas generales

- Escribir en ambos idiomas (ES y EN) con el mismo contenido.
- Usar `%LEAF_VERSION%` solo para artefactos del tren base (contracts, core, compose). Los módulos independientes usan su versión literal.
- Los contenedores VitePress permitidos: `::: tip`, `::: info`, `::: warning`, `::: details`, `::: code-group`.
- Los snippets de código deben tener imports completos y verificados contra el código fuente real.
- No inventar APIs. Si no estás seguro, lee el fuente antes de documentar.

## Sidebar

En el sidebar de la sección API:

- **Referencia API** — solo "Visión general".
- **Plataforma LEAF** — leaf-contracts, leaf-core, leaf-compose, Workflow, leaf-visuals, Payment Contracts (y cualquier otro artefacto de contratos/tipos compartidos).
- **Módulos** — cada módulo independiente con su propia página (Login, Authentication, Catalog, Email, Stripe, Mercado Pago, etc.).
