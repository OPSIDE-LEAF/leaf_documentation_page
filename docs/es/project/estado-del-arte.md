# Estado del arte

Diez antecedentes enmarcan a Leaf en el panorama académico e industrial del desarrollo móvil multiplataforma:

| # | Antecedente | Aporte a Leaf |
|---|---|---|
| 1 | **Kotlin Multiplatform Mobile — JetBrains, 2023** | KMP alcanzó estabilidad de producción (nov. 2023): compartir lógica entre Android/iOS pasó de experimental a confiable. La capa de dominio representaba 40–60% del esfuerzo duplicado. |
| 2 | **Compose Multiplatform — JetBrains, 2024** | Compose 1.6 extendió la UI declarativa a iOS: la reutilización va más allá de la lógica hacia la capa de presentación. |
| 3 | **Arquitectura Hexagonal (Ports & Adapters) — A. Cockburn** | Modelo adoptado por el Core: núcleo independiente expuesto mediante ports (contratos) y adaptadores intercambiables, sin depender de Android/iOS. |
| 4 | **Modularización de apps Android — Google, 2022** | Patrones validados industrialmente para compilar módulos aislados y distribuirlos (AAR) — la estrategia de distribución de Leaf. |
| 5 | **Adopción de Flutter en PyMEs latinoamericanas** | Confirma mercado de desarrollo móvil accesible para PyMEs en la región, con KMP como alternativa subutilizada: nicho desatendido. |
| 6 | **Arquitecturas modulares en KMP (2024)** | Evidencia empírica del impacto de decisiones arquitectónicas en KMP; precedente académico del modelo modular. |
| 7 | **Comparativo KMP vs React Native vs Flutter (2025)** | Ventajas cuantificadas de KMP en rendimiento, reutilización y compilación: valida la premisa técnica. |
| 8 | **Duolingo en producción con KMP** | Adopción enterprise a escala de millones de usuarios: elimina dudas de estabilidad de la base tecnológica. |
| 9 | **Frameworks open core en software móvil** | Marco teórico del modelo de negocio: núcleo abierto + módulos/servicios comerciales. |
| 10 | **Mercado de desarrollo móvil en Jalisco/GDL** | Evidencia primaria: 73 agencias, tarifas 25–99 USD/h, arranque 5,000–25,000 USD — el espacio blanco de Leaf. |

## La intersección única

Ninguno de los antecedentes aborda la combinación específica de:

**arquitectura modular + Kotlin Multiplatform + modelo open core + segmento PyME local**

Leaf opera en esa intersección: aprovecha la madurez tecnológica (1, 2, 7, 8), adopta principios arquitectónicos consolidados (3, 4, 6), integra un modelo de negocio validado (9) y lo aplica a un nicho documentadamente desatendido (10), donde la concentración de Flutter en PyMEs latinoamericanas (5) indica que KMP permanece subexplotado.

## Teoría fundamental

1. **Arquitectura hexagonal** — lógica de negocio en un núcleo independiente, ports como contratos, adaptadores intercambiables. En Leaf: gateways de módulo implementados por el host.
2. **Diseño modular y separación de responsabilidades** — módulos cohesivos y débilmente acoplados que se comunican por interfaces definidas. En Leaf: módulos compilables de forma aislada.
3. **Ingeniería de software orientada a componentes (CBSE)** — componentes reutilizables con contratos explícitos, API pública estable, versionado independiente y publicación como artefactos.
4. **Kotlin Multiplatform como habilitador** — el código compartido se compila a bytecode JVM (Android) y framework nativo (iOS) sin capas de abstracción en runtime.

Complementariamente, la literatura sobre **modelos open core** sustenta la estrategia de liberar el núcleo bajo licencia abierta y monetizar módulos avanzados y servicios.
