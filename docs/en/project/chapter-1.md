# Chapter I — Framing the problem

## 1.1 Problem statement

**Describing the problem.** Cross-platform mobile development lives with a structural contradiction: the two dominant routes — traditional native development and hybrid frameworks — offer advantages that cannot coexist in a single solution. Native development delivers the highest quality of user experience at the price of duplicating teams, budgets, and timelines. Hybrid frameworks cut cost and time at the price of compromising performance, fluidity, and organic integration with each platform.

**Where it shows up.** The problem is especially acute in the Guadalajara Metropolitan Area, a technology hub whose development agencies concentrate on corporate clients and nearshoring projects at high rates. Market analysis on Clutch.co and GoodFirms data shows local agencies working at 25 to 99 USD per hour with minimum entry costs between 5,000 and 25,000 USD, leaving a significant gap in service to SMEs and startups.

**Who is affected.**

- Local SMEs that need to digitize processes but cannot afford traditional native development.
- Early-stage startups that need to validate products quickly without compromising quality or spending scarce capital on duplicating codebases.
- Individual entrepreneurs who lack the resources to hire parallel Android and iOS teams.
- Small technical teams carrying the maintenance burden of two equivalent codebases.

**Causes of the problem.** (1) The structurally duplicated nature of native development, where Swift/SwiftUI on iOS and Kotlin/Jetpack Compose on Android demand different knowledge, tooling, and processes; (2) the inability of hybrid frameworks to deliver genuinely native experiences; (3) the absence, in the local market, of frameworks or ecosystems tailored to the budget and operating profile of regional SMEs; (4) the lack of tools for systematically reusing logic and components across projects.

**Possible solutions.** Three routes are viable in this scenario: hiring talent that is already scarce and expensive (which does not resolve the structural problem); adopting hybrid frameworks at the cost of quality (a partial, unsatisfying solution); or building a modular ecosystem on Kotlin Multiplatform that shares business logic across platforms while preserving native performance. This project develops that third route.

## Proposed solution

Leaf is a cross-platform mobile development ecosystem structured around a Core Orchestrator that coordinates the integration of independent functional modules, built on Kotlin Multiplatform and Compose Multiplatform. The solution proposes a paradigm shift relative to traditional mobile development: instead of building each application from scratch, projects are assembled from pre-built, reusable modules that compile in isolation and are distributed through private repositories (GitHub Packages).

### What the project WILL do

- Design and build the Core Orchestrator in Kotlin Multiplatform, responsible for defining communication contracts, architectural guidelines, and integration between modules.
- Develop an initial set of reusable functional modules: Login, Catalog, Authentication, Email, and Payments (integrating Stripe and Mercado Pago).
- Build a working demonstration application (Host App) on Android and iOS that assembles those modules and evidences the model's efficiency.
- Validate the architecture through metrics on performance, binary size, build times, and code reuse.
- Document the architectural guidelines.

### What the project will NOT do

- Publish the demonstration application on the App Store or Google Play.
- Develop highly complex specialized modules (Uber-style real-time mapping, advanced video editing, and the like).
- Commercialize the product during this phase of the project.
- Integrate third-party services beyond the scope defined for the initial modules.

### Work Breakdown Structure (WBS)

::: info
The WBS diagram is part of the project's original document.
:::

## 1.2 Objectives

### 1.2.1 General objective

To design, develop, validate, and document a cross-platform mobile development ecosystem named Leaf, based on a reusable modular architecture built on Kotlin Multiplatform, that reduces development time, improves code maintainability, and eases adaptation to different business requirements without sacrificing the native user experience, during the 2026 school year as part of the Software Engineering degree project at CETI Tonalá Campus.

### 1.2.2 Specific objectives

1. Design and develop the Core Orchestrator that defines the communication contracts, integration interfaces, and architectural guidelines of the ecosystem, during March and April 2026.
2. Adopt Kotlin Multiplatform and Compose Multiplatform as the framework's technological base, configuring the dual build system for Android and iOS and validating correct native binary generation.
3. Build an initial set of independent functional modules (Login, Catalog, Email, Authentication, and Payments) that compile in isolation and are distributable as reusable artifacts through GitHub Packages.
4. Establish an isolated dependency and build management system that allows each module to be versioned and published independently without creating unwanted coupling.
5. Build a demonstration application (Host App) on Android and iOS that assembles those modules and measurably evidences the efficiency of the modular assembly model.
6. Validate the architecture through metrics on development time, binary size, build times, and code reuse.
7. Document the complete ecosystem: architectural guidelines, a guide to creating new modules, communication contracts, and a Core Orchestrator usage manual.

## 1.3 Hypothesis

**Main hypothesis:**

> Developing and implementing a modular, reusable mobile architecture based on Kotlin Multiplatform, open to multiple users across multiple technological contexts, will optimize mobile application development cycles, significantly reducing delivery times and code duplication compared with traditional native development, without sacrificing the user experience.

**Assumptions the hypothesis rests on:**

- **Market assumption.** A gap exists in the technology market of the Guadalajara Metropolitan Area: agencies concentrate on corporate clients and nearshoring with high entry costs, leaving local SMEs and startups that need affordable digitization unserved.
- **Adoption assumption.** The open core model will generate commercial trust while serving as an educational resource, helping the community learn architectural best practices and lowering the Kotlin Multiplatform learning curve.
- **Technical assumption.** Kotlin Multiplatform has reached production maturity, validated by adoption at global companies (McDonald's, Netflix, Philips, Wolt, 2024), demonstrating that it can sustain mobile applications without compromising native performance. The hypothesis assumes this maturity transfers to local use cases (Guadalajara SMEs).
- **Reuse assumption.** The modular architecture will allow at least 40% of code to be reused between projects in the same domain without significant modification.

## 1.4 Feasibility study

Leaf shows high overall feasibility, grounded in technical, commercial, and operational axes:

### New opportunities, market niches, and cost control

- **Underserved niche**: the Clutch.co and GoodFirms market analysis identifies a clear gap in service to local SMEs and startups. Guadalajara agencies focused on corporate clients charge between 25 and 99 USD/hour with minimum costs of 5,000 to 25,000 USD per project, systematically excluding the SME segment.
- **Technical cost control**: the entire technical stack (Kotlin, Compose, Gradle, Ktor, kotlinx.*) is open source or free to adopt, which lowers the economic barrier to developing the framework.
- **Revenue model with room to grow**: the open core scheme combines *setup fee* revenue with licensing (SaaS) of advanced modules, giving it a broad commercial ceiling.

### Limits and capabilities — SWOT summary

| Strengths | Opportunities |
|---|---|
| Team with technical knowledge of Kotlin, Android, and iOS | An underserved, growing SME market in Guadalajara |
| Mature technology stack, validated in production by global companies | Open source community receptive to KMP educational resources |
| Clear differentiation from hybrid frameworks (native performance) | Global trend toward KMP adoption in production |

| Weaknesses | Threats |
|---|---|
| Small team (two members) with time limited by the academic calendar | Dependence on the Kotlin Multiplatform ecosystem and JetBrains' strategic decisions |
| Steep initial learning curve for new collaborators | Indirect competition from No-Code and Low-Code solutions |
| Dependence on the maturity of Compose Multiplatform tooling on iOS | Disruptive Android or iOS API changes requiring Core refactors |

### Financial roadmap

The figures come from the cost and revenue analysis performed during Phase 1, using as reference the average rates of the mobile development market in the Guadalajara Metropolitan Area (Clutch.co and GoodFirms data) and the real cost of the tools and services required to build the prototype.

**Development investment (initial costs)**

| Item | Detail | Cost (USD) |
|---|---|---|
| Licenses and tooling (Kotlin, Android Studio, GH) | Open source / free | $0 |
| Computer equipment | 2 development laptops | $2,200 |
| Prototype development (person-hours) | 230 hrs × $25 USD/hr × 2 devs | $11,500 |
| **Total initial investment** | | **$13,700** |

Breakdown of development hours (460 total, 230 per member):

| Activity | Estimated hours |
|---|---|
| Architecture design | 60 |
| Framework core development | 120 |
| Functional module development | 100 |
| Integration with the demonstration app | 80 |
| Testing and debugging | 60 |
| Technical documentation | 40 |
| **Total** | **460** |

> The $25 USD/hour rate corresponds to the lower band of the range identified in the competitive analysis (25–99 USD/hour), reflecting the real cost of independent development for an academic team.

**Annual operating costs (post-launch)**

| Item | Annual cost (USD) |
|---|---|
| Documentation hosting | $60 |
| Maven repository server | $300 |
| Domain | $12 |
| Initial advertising | $200 |
| Maintenance and updates | $6,000 |
| **Annual total** | **$6,572** |

**Revenue model (monetization strategy)**

| Revenue stream | Estimate / Model |
|---|---|
| Open Core + Modules | Free Core. Basic modules free, advanced ones licensed |
| Subscription to advanced modules | $5 USD per module per month |
| Setup fee (configuration and integration) | Initial per-project fee (varies with scope) |
| Module marketplace (commission) | 10% to 20% per module sold by third parties |
| Industry modules (health, fintech, retail) | Specialized modules for recurring niches |
| Enterprise services (support, implementation) | Technical support and customization on demand |
| Technical training | Training for teams and developers |
| Consulting | Migration and optimization of existing projects |

> **Strategic note**: every module developed is an intellectual property asset that can be licensed, taught, implemented, and maintained repeatedly, at no reproduction cost.

### Feasibility conclusion

The project is technically, economically, and operationally feasible. The initial investment of $13,700 USD is absorbable by the team during the academic year, given that the entire technical stack (Kotlin, Compose, Gradle, Ktor, kotlinx.*) is open source or free to adopt. Annual operating costs of $6,572 USD are sustainable through the open core revenue model, which combines free modules (trust and adoption) with subscription-based advanced modules and enterprise services (commercial sustainability). The identified risks are mitigated by design (the architecture is tool-agnostic), and there is a clearly identified, documentably underserved market in the Guadalajara Metropolitan Area against which to validate the proposal.
