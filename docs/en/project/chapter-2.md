# Chapter II — Theoretical framework

## 2.1 State of the art

The following ten works frame the development of Leaf within the current academic and industrial landscape of cross-platform mobile development:

**1. Kotlin Multiplatform Mobile (KMM) — JetBrains, 2023 [1].** This publication marks the official milestone at which Kotlin Multiplatform reached production stability (v1.0), validating that the technology Leaf builds on moved from experimental to dependable for real commercial use. The November 2023 release consolidates the viability of sharing business logic between Android and iOS, eliminating code duplication in the domain and use-case layers, which accounted for 40% to 60% of development effort in traditional native applications.

**2. Compose Multiplatform — JetBrains, 2024 [2].** Compose Multiplatform 1.6 extended declarative UI to iOS, ensuring that Leaf's proposal of sharing presentation code across native platforms is technically viable without sacrificing fidelity to each operating system's design guidelines. This advance is critical because it pushed reuse beyond business logic into the interface layer, multiplying the potential code economy.

**3. Hexagonal Architecture (Ports & Adapters) in mobile development — Alistair Cockburn [11].** The hexagonal architecture proposed by Alistair Cockburn is the model adopted in Leaf's Core Orchestrator, where business logic lives in an independent core exposed through ports (contracts) and connected outward through adapters. In this scheme the Core orchestrates modules without depending on Android or iOS, while modules and integrations act as interchangeable adapters, enabling high reuse, scalability, and low coupling.

**4. Modularization of Android applications — Google Developers, 2022 [4].** Google's official Android modularization guide (2022) provides industrially validated architectural patterns for compiling modules in isolation and distributing them as AAR (Android Archive), which is exactly the strategy Leaf implements for reusing functional modules. This official documentation establishes the de facto standard for decomposing large applications into independent, versionable, reusable components.

**5. Flutter adoption among Latin American SMEs [5].** This Latin American work shows Flutter to be the dominant option for SMEs in the region, evidencing a proven market for mobile development accessible to smaller companies. At the same time it indicates that Kotlin Multiplatform remains underused in that segment, suggesting an underserved niche where KMP could compete with superior technical advantages but insufficient regional presence.

**6. Modular architectures in Kotlin Multiplatform [6].** This 2024 academic analysis of Kotlin Multiplatform development approaches provides empirical evidence on the impact of architectural decisions in KMP, validating that the modular model Leaf proposes has precedent in recent research on the ecosystem. The publication systematizes software engineering patterns applied to KMP, reducing the technical uncertainty of adopting a modular architecture on the platform.

**7. Comparative performance study: KMP vs React Native vs Flutter [7].** This 2025 comparative study positions Kotlin Multiplatform with significant advantages in performance, code reuse, and build time against Flutter and React Native. The research quantitatively validates Leaf's technical premise: that KMP produces applications indistinguishable from native development, with reduced development time thanks to the modular architecture.

**8. Real-world case: Duolingo in production with KMP [8].** Duolingo's production use of Kotlin Multiplatform demonstrates that companies of global scale and maximum technical demand trust KMP for critical mobile applications with millions of users. Adoption by an enterprise actor removes any doubt about the stability, performance, and reliability of Leaf's base technology.

**9. Open core frameworks in mobile software [9].** This research on open core business models in open source software provides a validated theoretical frame for Leaf's strategy of releasing the Core under an open license while monetizing advanced modules. The model shows it is viable to balance community trust (open source) with commercial sustainability (services and premium modules), letting Leaf grow as an ecosystem without compromising transparency.

**10. The mobile development market in Jalisco and Guadalajara [10a, 10b, 10c].** Analysis of the mobile development market in the Guadalajara Metropolitan Area reveals that the 73 documented local agencies work at rates between 25 and 99 USD per hour with minimum entry costs between 5,000 and 25,000 USD, documentably leaving the SME and startup segment with limited budgets unserved. This primary evidence from the local market, triangulated with Latin American trend analysis (reference 5), precisely delimits the white space where Leaf finds its unique opportunity.

**Conclusion on the state of the art.** The reviewed works show that the path toward modular cross-platform architectures with native quality is technically open and validated in production by global companies. None of them, however, addresses the specific combination of: (1) modular architecture + Kotlin Multiplatform + open core model + a focus on the local SME segment. That intersection is precisely where Leaf finds its space: it leverages the technological maturity demonstrated by the antecedents (references 1, 2, 7, 8), adopts the architectural principles consolidated in the academic literature (references 3, 4, 6), integrates a validated open core business model (reference 9), and applies it to a documentably underserved market niche in the Guadalajara Metropolitan Area (references 10a, 10b, 10c), where the concentration on Flutter among Latin American SMEs (reference 5) indicates that Kotlin Multiplatform remains an underexploited alternative.

## 2.2 Fundamental theory

Leaf rests on four main bodies of theory that guide its design and development:

1. **Hexagonal architecture.** The hexagonal architecture proposed by Alistair Cockburn is the model adopted in Leaf's Core Orchestrator, where business logic lives in an independent core exposed through ports (contracts) and connected outward through adapters. In this scheme the Core orchestrates modules without depending on Android or iOS, while modules and integrations act as interchangeable adapters, enabling high reuse, scalability, and low coupling. *[11]*
2. **Modular design and separation of concerns.** A classic software engineering principle holding that a system should be decomposed into cohesive, loosely coupled modules, each with a clear responsibility and communicating with the rest through well-defined interfaces. In Leaf this principle materializes as modules that compile in isolation and are assembled at build time through the Core Orchestrator. *[12]*
3. **Component-Based Software Engineering.** A paradigm that promotes building systems out of reusable components with explicit communication contracts. Every Leaf module is a component with a stable public API, versioned independently and publishable as an artifact in private repositories. *[13]*
4. **Kotlin Multiplatform as the enabling technology.** A JetBrains technology that allows business logic to be written once in Kotlin and compiled natively for multiple platforms (Android, iOS, JVM, JS, Native). Unlike hybrid frameworks, KMP introduces no runtime abstraction layers: shared code becomes JVM bytecode on Android and a native framework on iOS, preserving performance equivalent to purely native development. *[1] [2]*

**Open core business models.** The project additionally draws on literature about open core models, where a software core is released under an open license while advanced modules or complementary services are offered commercially. The model combines the trust and adoption that open source generates with the economic sustainability of commercial licensing. *[9]*

## 2.3 Applied technologies

| Technology | Description | Use in the project | Version | Official site |
|---|---|---|---|---|
| **Kotlin Multiplatform** | JetBrains technology for sharing code across platforms | Business logic shared between Android and iOS | 2.x (stable) | [kotlinlang.org](https://kotlinlang.org/docs/multiplatform.html) |
| **Compose Multiplatform** | Cross-platform declarative UI framework based on Jetpack Compose | Building shared interfaces | 1.6+ | [jetbrains.com](https://www.jetbrains.com/lp/compose-multiplatform/) |
| **Gradle KMP** | Build system with multiplatform target support | Android and iOS build configuration | 8.x | [gradle.org](https://gradle.org/) |
| **Android SDK** | Native Android SDK | Compiling the Android target | API 34+ | [developer.android.com](https://developer.android.com/) |
| **Xcode / Swift toolchain** | Native iOS toolchain | Compiling the iOS target | 15.x+ | [developer.apple.com](https://developer.apple.com/xcode/) |
| **GitHub Packages** | Private package registry | Distributing modules as versioned artifacts | — | [github.com](https://github.com/features/packages) |
| **Ktor Client** | Cross-platform HTTP client | Communication with external APIs | 2.x | [ktor.io](https://ktor.io/) |
| **kotlinx.coroutines** | Structured concurrency in Kotlin | Cross-platform asynchronous handling | 1.8.x | [github.com/Kotlin](https://github.com/Kotlin/kotlinx.coroutines) |
| **kotlinx.serialization** | Cross-platform JSON serialization | Data models and API communication | 1.6.x | [github.com/Kotlin](https://github.com/Kotlin/kotlinx.serialization) |
| **JUnit / Kotlin Test** | Testing frameworks | Unit and integration testing per module | — | [kotlinlang.org](https://kotlinlang.org/api/latest/kotlin.test/) |
| **Stripe SDK** | Payment processing SDK | Payments module (international market) | Latest stable | [stripe.com](https://stripe.com/docs) |
| **Mercado Pago SDK** | Payment SDK for Latin America | Payments module (local market) | Latest stable | [mercadopago.com.mx](https://www.mercadopago.com.mx/developers) |
| **Git / GitHub** | Version control and remote repository | Source code management | — | [github.com](https://github.com/) |
| **Figma** | UI/UX design tool | Interface design and diagrams | — | [figma.com](https://www.figma.com/) |
