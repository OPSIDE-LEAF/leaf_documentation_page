# Metodología y validación

## Enfoque

Metodología **híbrida**: investigación aplicada + desarrollo iterativo tipo Scrum adaptado. Responde a la doble naturaleza del proyecto — rigor investigativo (análisis de mercado, validación arquitectónica, métricas) y construcción incremental con entregas funcionales.

## Fases

| Fase | Periodo | Contenido |
|---|---|---|
| 1. Investigación y análisis | Feb – Mar 2026 | Análisis de mercado (Clutch.co/GoodFirms con Python/Jupyter), estado del arte, arquitectura conceptual, FODA |
| 2. Diseño arquitectónico | Mar – May 2026 | Diseño del Core, contratos entre módulos, estructura de módulos, UI/UX en Figma, entorno multiplataforma |
| 3. Desarrollo del prototipo | May – Sep 2026 | Core, módulos (Login, Catálogo, Email, Pagos), sistema de publicación de artefactos, App Host Android+iOS |
| 4. Validación y documentación | Sep – Oct 2026 | Métricas, pruebas integrales, documentación final, presentación |

## Requerimientos clave

**Funcionales**: contratos de comunicación como único canal entre módulos; compilación independiente por módulo; distribución como artefactos versionados (GitHub Packages, AAR + framework iOS); integración plug-and-play sin afectar Core ni módulos restantes; encapsulación funcional (API pública clara, detalles privados); ejecución multiplataforma del Core desde código compartido.

**No funcionales**: rendimiento equivalente al nativo (variación ≤10% en arranque y latencia); consumo eficiente de recursos (frame rate y batería sin degradación perceptible); mantenibilidad (convenciones Clean Architecture); documentación integrada por módulo; escalabilidad horizontal del ecosistema; versionado semántico independiente; portabilidad del código compartido; compatibilidad con binarios nativos de ambos SDKs.

## Control del proyecto

- Tablero de tareas (GitHub Projects) con seguimiento semanal.
- Reuniones semanales del equipo; quincenales con asesor metodológico.
- Git con ramas por funcionalidad y revisión cruzada antes de merge.
- Hitos formales alineados al cronograma.

## Evaluación de resultados

**Plano de desarrollo** — cumplimiento de entregables del EDT, cobertura de pruebas ≥70%, conformidad con requerimientos funcionales y no funcionales.

**Plano de hipótesis** — medición cuantitativa de:

1. Porcentaje de código compartido entre Android e iOS.
2. Diferencia de rendimiento vs app nativa equivalente (≤10% de variación).
3. Tiempo de ensamblaje de un proyecto nuevo a partir de módulos Leaf vs desarrollo desde cero.

Herramientas: scripts de medición (tamaño de binario, tiempos de compilación), profiling de Android Studio y Xcode Instruments.

## Equipo

| Área | Responsable | Apoyo |
|---|---|---|
| Core y arquitectura | Mario Razo | Moises Pulido |
| Módulos funcionales | Mario Razo | Moises Pulido |
| App Host y validación cross-platform | Moises Pulido | Mario Razo |
| Documentación y entregables académicos | Moises Pulido | Mario Razo |
| Análisis de mercado y FODA | Moises Pulido | Mario Razo |
