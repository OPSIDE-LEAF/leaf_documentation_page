# Capítulo I — Contextualización de la problemática

## 1.1 Planteamiento del problema

**Descripción de la problemática.** El desarrollo móvil multiplataforma vive una contradicción estructural: las dos rutas dominantes —desarrollo nativo tradicional y frameworks híbridos— ofrecen ventajas que no pueden coexistir en una sola solución. El desarrollo nativo entrega máxima calidad de experiencia de usuario al precio de duplicar equipos, presupuestos y tiempos. Los frameworks híbridos reducen costos y tiempos al precio de comprometer el rendimiento, la fluidez y la integración orgánica con cada plataforma.

**Dónde se detecta.** Este problema se manifiesta con particular intensidad en la Zona Metropolitana de Guadalajara, polo tecnológico donde las agencias de desarrollo se concentran en atender a corporativos y proyectos de nearshoring con tarifas elevadas. El análisis de mercado realizado sobre datos de Clutch.co y GoodFirms muestra que las agencias locales operan con tarifas entre 25 y 99 USD por hora y costos mínimos de arranque entre 5,000 y 25,000 USD, dejando un vacío significativo en la atención a PyMEs y startups.

**Quiénes se ven afectados.**

- PyMEs locales que requieren digitalizar procesos pero no pueden costear desarrollos nativos tradicionales.
- Startups en etapa temprana que necesitan validar productos rápidamente sin comprometer calidad ni invertir capital escaso en duplicar bases de código.
- Emprendedores individuales que carecen de recursos para contratar equipos paralelos de Android e iOS.
- Equipos técnicos pequeños que sufren la carga de mantenimiento de dos bases de código equivalentes.

**Causas del problema.** (1) La naturaleza estructuralmente duplicada del desarrollo nativo, donde Swift/SwiftUI e iOS por un lado y Kotlin/Jetpack Compose por otro requieren conocimientos, herramientas y procesos distintos; (2) la insuficiencia de los frameworks híbridos para entregar experiencias verdaderamente nativas; (3) la ausencia, en el mercado local, de frameworks o ecosistemas adaptados específicamente al perfil presupuestal y operativo de las PyMEs regionales; (4) la falta de herramientas que permitan reutilizar lógica y componentes entre proyectos de manera sistemática.

**Posibles soluciones.** Frente a este escenario se proponen tres caminos viables: contratar talento ya escaso y caro (no resuelve el problema estructural); adoptar frameworks híbridos comprometiendo calidad (solución parcial e insatisfactoria); o construir un ecosistema modular sobre Kotlin Multiplatform que comparta lógica de negocio entre plataformas conservando el rendimiento nativo. Esta tercera vía es la que el presente proyecto desarrolla.

## Propuesta de solución

Leaf es un ecosistema para desarrollo móvil multiplataforma estructurado alrededor de un Core Orquestador que coordina la integración de módulos funcionales independientes, construido sobre Kotlin Multiplatform y Compose Multiplatform. La solución propone un cambio de paradigma respecto al desarrollo móvil tradicional: en lugar de construir cada aplicación desde cero, los proyectos se ensamblan a partir de módulos pre-construidos, reutilizables y compilables de forma aislada, distribuidos mediante repositorios privados (GitHub Packages).

### Lo que el proyecto SÍ va a hacer

- Diseñar y construir el Core Orquestador en Kotlin Multiplatform, encargado de definir contratos de comunicación, lineamientos arquitectónicos y la integración entre módulos.
- Desarrollar un conjunto inicial de módulos funcionales reutilizables: Login, Catálogo, Autenticación, Email y Pagos (con integración a Stripe y Mercado Pago).
- Construir una aplicación de demostración funcional (App Host) en Android e iOS que ensamble los módulos anteriores y evidencie la eficiencia del modelo.
- Validar la arquitectura mediante métricas de rendimiento, tamaño de binarios, tiempos de compilación y reutilización de código.
- Documentar lineamientos arquitectónicos.

### Lo que el proyecto NO va a hacer

- Publicar la aplicación demostrativa en App Store o Google Play.
- Desarrollar módulos especializados de alta complejidad (mapeo en tiempo real tipo Uber, edición avanzada de video, etc.).
- Comercializar el producto durante esta fase del proyecto.
- Realizar integraciones con servicios de terceros fuera del alcance definido para los módulos iniciales.

### Estructura de Desglose del Trabajo (EDT)

::: info
El diagrama EDT forma parte del documento original del proyecto.
:::

## 1.2 Objetivos

### 1.2.1 Objetivo general

Diseñar, desarrollar, validar y documentar un ecosistema de desarrollo móvil multiplataforma denominado Leaf, basado en una arquitectura modular reutilizable construida sobre Kotlin Multiplatform, que permita reducir los tiempos de desarrollo, mejorar la mantenibilidad del código y facilitar la adaptación a distintos requerimientos de negocio sin sacrificar la experiencia de usuario nativa, durante el ciclo escolar 2026 como parte del proyecto de titulación de Ingeniería en Desarrollo de Software del CETI Plantel Tonalá.

### 1.2.2 Objetivos específicos

1. Diseñar y desarrollar el Core Orquestador que defina los contratos de comunicación, las interfaces de integración y los lineamientos arquitectónicos del ecosistema, durante los meses de marzo y abril de 2026.
2. Implementar Kotlin Multiplatform y Compose Multiplatform como base tecnológica del framework, configurando el sistema de compilación dual para Android e iOS y validando la generación correcta de binarios nativos.
3. Construir un conjunto inicial de módulos funcionales independientes (Login, Catálogo, Email, Autenticación y Pagos), compilables de forma aislada y distribuibles como artefactos reutilizables vía GitHub Packages.
4. Establecer un sistema de gestión de dependencias y compilación aislado que permita versionar y publicar cada módulo de forma independiente sin generar acoplamientos no deseados.
5. Construir una aplicación demostrativa (App Host) en Android e iOS que ensamble los módulos anteriores y evidencie de manera medible la eficiencia del modelo de ensamblaje modular.
6. Validar la arquitectura mediante métricas de tiempo de desarrollo, tamaño de binarios, tiempos de compilación y reutilización de código.
7. Documentar el ecosistema completo: lineamientos arquitectónicos, guía de creación de nuevos módulos, contratos de comunicación y manual de uso del Core Orquestador.

## 1.3 Planteamiento de hipótesis

**Hipótesis principal:**

> El desarrollo e implementación de una arquitectura móvil modular y reutilizable basada en Kotlin Multiplatform, abierta a múltiples usuarios en múltiples contextos tecnológicos, optimizará los ciclos de desarrollo de aplicaciones móviles, reduciendo significativamente los tiempos de entrega y la duplicación de código en comparación con el desarrollo nativo tradicional, sin sacrificar la experiencia de usuario.

**Supuestos sobre los que se sostiene la hipótesis:**

- **Supuesto de mercado.** Existe un vacío en el mercado tecnológico de la Zona Metropolitana de Guadalajara: las agencias se concentran en corporativos y nearshoring con altos costos de entrada, dejando desatendidas a las PyMEs y startups locales que requieren digitalización accesible.
- **Supuesto de adopción.** El modelo open core generará confianza comercial y servirá simultáneamente como recurso educativo, facilitando a la comunidad el aprendizaje de buenas prácticas arquitectónicas y reduciendo la curva de aprendizaje en Kotlin Multiplatform.
- **Supuesto técnico.** Kotlin Multiplatform ha alcanzado madurez de producción validada por adopción en empresas globales (McDonald's, Netflix, Philips, Wolt, 2024), demostrando capacidad para sostener aplicaciones móviles sin comprometer rendimiento nativo. La hipótesis asume que esta madurez es transferible a casos de uso locales (PyMEs de Guadalajara).
- **Supuesto de reutilización.** La arquitectura modular permitirá reutilizar al menos un 40% del código entre proyectos del mismo dominio sin necesidad de modificaciones significativas.

## 1.4 Estudio de viabilidad

El proyecto Leaf presenta una viabilidad integral alta, fundamentada en ejes técnicos, comerciales y operativos:

### Nuevas oportunidades, nichos de mercado y control de costos

- **Nicho desatendido**: el análisis de mercado de Clutch.co y GoodFirms identifica un vacío claro en la atención a PyMEs y startups locales. Las agencias de Guadalajara enfocadas en corporativos cobran entre 25 y 99 USD/hora con costos mínimos de 5,000 a 25,000 USD por proyecto, lo que excluye sistemáticamente al segmento PyME.
- **Control de costos técnicos**: la totalidad del stack técnico (Kotlin, Compose, Gradle, Ktor, kotlinx.*) es de código abierto o de adopción gratuita, lo que reduce las barreras económicas para el desarrollo del framework.
- **Modelo de ingresos con potencial de expansión**: el esquema open core combina ingresos por *setup fee* y licenciamiento (SaaS) de módulos avanzados, con un techo comercial de amplio espectro.

### Límites y capacidades — Análisis FODA resumido

| Fortalezas | Oportunidades |
|---|---|
| Equipo con conocimiento técnico en Kotlin, Android e iOS | Mercado PyME de Guadalajara desatendido y en crecimiento |
| Stack tecnológico maduro y validado en producción por empresas globales | Comunidad open source receptiva a recursos educativos en KMP |
| Diferenciación clara frente a frameworks híbridos (rendimiento nativo) | Tendencia global hacia adopción de KMP en producción |

| Debilidades | Amenazas |
|---|---|
| Equipo reducido (dos integrantes) con tiempo limitado por el calendario académico | Dependencia del ecosistema Kotlin Multiplatform y de las decisiones estratégicas de JetBrains |
| Curva de aprendizaje inicial elevada para nuevos colaboradores | Competencia indirecta de soluciones No-Code y Low-Code |
| Dependencia de la madurez de las herramientas de Compose Multiplatform en iOS | Cambios disruptivos en las APIs de Android o iOS que requieran refactorizaciones del Core |

### Hoja de ruta financiera

Las cifras se basan en el análisis de costos e ingresos realizado durante la Fase 1 del proyecto, utilizando como referencia las tarifas promedio del mercado de desarrollo móvil en la Zona Metropolitana de Guadalajara (datos de Clutch.co y GoodFirms) y los costos reales de las herramientas y servicios requeridos para el desarrollo del prototipo.

**Inversión de desarrollo (costos iniciales)**

| Concepto | Detalle | Costo (USD) |
|---|---|---|
| Licencias y herramientas (Kotlin, Android Studio, GH) | Open Source / gratuitas | $0 |
| Equipo de cómputo | 2 laptops de desarrollo | $2,200 |
| Desarrollo del prototipo (horas-hombre) | 230 hrs × $25 USD/hr × 2 devs | $11,500 |
| **Total inversión inicial** | | **$13,700** |

Desglose de horas de desarrollo (460 horas totales, 230 por integrante):

| Actividad | Horas estimadas |
|---|---|
| Diseño de arquitectura | 60 |
| Desarrollo del núcleo del framework | 120 |
| Desarrollo de módulos funcionales | 100 |
| Integración con aplicación demostrativa | 80 |
| Pruebas y depuración | 60 |
| Documentación técnica | 40 |
| **Total** | **460** |

> La tarifa de $25 USD/hora corresponde a la banda inferior del rango identificado en el análisis de competencia (25–99 USD/hora), reflejando el costo real de desarrollo independiente para un equipo académico.

**Costos de operación anual (post-lanzamiento)**

| Concepto | Costo anual (USD) |
|---|---|
| Hosting de documentación | $60 |
| Servidor repositorio Maven | $300 |
| Dominio | $12 |
| Publicidad inicial | $200 |
| Mantenimiento y actualizaciones | $6,000 |
| **Total anual** | **$6,572** |

**Modelo de ingresos (estrategia de monetización)**

| Vía de ingreso | Estimación / Modelo |
|---|---|
| Open Core + Módulos | Core gratuito. Módulos básicos gratis, avanzados por licencia |
| Suscripción a módulos avanzados | $5 USD mensuales por módulo |
| Setup Fee (configuración e integración) | Cuota inicial por proyecto (variable según alcance) |
| Marketplace de módulos (comisión) | 10% a 20% por cada módulo vendido por terceros |
| Módulos por industria (salud, fintech, retail) | Módulos especializados por nicho recurrente |
| Servicios empresariales (soporte, implementación) | Soporte técnico y personalización bajo demanda |
| Capacitación técnica | Formación para equipos y desarrolladores |
| Consultoría | Migración y optimización de proyectos existentes |

> **Nota estratégica**: cada módulo desarrollado es un activo de propiedad intelectual que se puede licenciar, enseñar, implementar y mantener repetidamente, sin costo de reproducción.

### Conclusión de viabilidad

El proyecto es viable técnica, económica y operativamente. La inversión inicial de $13,700 USD es absorbible por el equipo durante el ciclo académico, considerando que la totalidad del stack técnico (Kotlin, Compose, Gradle, Ktor, kotlinx.*) es de código abierto o de adopción gratuita. Los costos operativos anuales de $6,572 USD son sostenibles mediante el modelo de ingresos open core, que combina módulos gratuitos (confianza y adopción) con módulos avanzados de suscripción y servicios empresariales (sostenibilidad comercial). Los riesgos identificados están mitigados por diseño (la arquitectura es agnóstica a la herramienta), y existe un mercado claramente identificado y documentadamente desatendido en la Zona Metropolitana de Guadalajara para validar la propuesta.
