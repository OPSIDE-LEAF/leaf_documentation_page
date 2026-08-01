# El proyecto Leaf

Leaf nace como proyecto de titulación de Ingeniería en Desarrollo de Software (CETI Plantel Tonalá, ciclo 2026). Esta sección resume su planteamiento académico; las demás secciones del sitio documentan el resultado técnico.

## Justificación

El desarrollo de aplicaciones móviles nativas es históricamente costoso y redundante: mantener bases de código independientes para Android e iOS duplica esfuerzos en desarrollo, pruebas y mantenimiento. Las alternativas híbridas (Flutter, React Native) mitigan la duplicidad mediante capas de abstracción intermedias que comprometen el rendimiento nativo y la integración orgánica con los lineamientos de diseño de cada sistema operativo.

La problemática se agudiza en las PyMEs y startups de la **Zona Metropolitana de Guadalajara**: el análisis de mercado sobre datos de Clutch.co y GoodFirms muestra que las agencias locales (73 documentadas) operan con tarifas de **25–99 USD/hora** y costos mínimos de arranque de **5,000–25,000 USD**, dejando sistemáticamente desatendido al segmento con presupuestos limitados.

## Planteamiento del problema

Las dos rutas dominantes ofrecen ventajas que no coexisten: el desarrollo nativo entrega máxima calidad de UX al precio de duplicar equipos; los híbridos reducen costos al precio de comprometer rendimiento. Las causas: (1) la naturaleza estructuralmente duplicada del desarrollo nativo, (2) la insuficiencia de los híbridos para entregar experiencias verdaderamente nativas, (3) la ausencia de ecosistemas adaptados al perfil presupuestal de las PyMEs regionales, (4) la falta de herramientas para reutilizar lógica y componentes entre proyectos de manera sistemática.

## Objetivo general

Diseñar, desarrollar, validar y documentar un ecosistema de desarrollo móvil multiplataforma basado en una arquitectura modular reutilizable construida sobre Kotlin Multiplatform, que reduzca los tiempos de desarrollo, mejore la mantenibilidad y facilite la adaptación a distintos requerimientos de negocio sin sacrificar la experiencia de usuario nativa.

## Objetivos específicos

1. Diseñar y desarrollar el Core que defina los contratos de comunicación y lineamientos arquitectónicos del ecosistema.
2. Implementar Kotlin Multiplatform y Compose Multiplatform como base tecnológica, con compilación dual Android/iOS y binarios nativos validados.
3. Construir un conjunto inicial de módulos funcionales independientes (Login, Catálogo, Email, Autenticación y Pagos), compilables de forma aislada y distribuibles vía GitHub Packages.
4. Establecer un sistema de gestión de dependencias y compilación aislado con versionado y publicación independiente por módulo.
5. Construir una aplicación demostrativa (App Host) en Android e iOS que ensamble los módulos.
6. Validar la arquitectura con métricas de tiempo de desarrollo, tamaño de binarios, tiempos de compilación y reutilización de código.
7. Documentar el ecosistema completo.

## Hipótesis

> El desarrollo e implementación de una arquitectura móvil modular y reutilizable basada en Kotlin Multiplatform optimizará los ciclos de desarrollo de aplicaciones móviles, reduciendo significativamente los tiempos de entrega y la duplicación de código en comparación con el desarrollo nativo tradicional, sin sacrificar la experiencia de usuario.

Supuestos: existe un vacío de mercado en la ZMG (mercado); el modelo open core genera confianza y valor educativo (adopción); la madurez de producción de KMP —validada por McDonald's, Netflix, Philips, Wolt— es transferible a casos locales (técnico); la arquitectura modular permitirá reutilizar **al menos 40%** del código entre proyectos del mismo dominio (reutilización).

## Alcance

**Sí incluye**: Core en KMP, módulos iniciales (Login, Catálogo, Autenticación, Email, Pagos con Stripe y Mercado Pago), App Host demostrativa Android/iOS, validación con métricas y documentación arquitectónica.

**No incluye**: publicación en tiendas, módulos de alta complejidad (mapeo en tiempo real, edición de video), comercialización en esta fase, ni integraciones fuera del alcance de los módulos iniciales.

::: info Evolución de la arquitectura
El planteamiento original describía un "Core Orquestador" con registro de módulos en runtime. Durante el desarrollo, la arquitectura evolucionó a la **ruta local tipada** de Leaf 2.x — invocación directa con tipos verificados en compilación, sin registry — que endurece los mismos objetivos (desacoplamiento, integración plug-and-play) con mayores garantías. Ver [Arquitectura](/es/guide/arquitectura).
:::
