# Chapter III — Design and development of the project

## 3.1 Project requirements

Leaf defines an essential set of requirements that secure the ecosystem's architectural viability. They are organized into functional requirements (what the system must do) and non-functional requirements (how the system must behave). Each requirement ties directly to the project's specific objectives and to the core of the proposal: a cross-platform modular ecosystem that reduces development time without sacrificing native performance.

::: warning Historical record of the initial design
The tables in this section preserve the academic requirements written before LEAF 2.0.1 was closed. RF001 and RF006 describe a Core with dynamic registration and resolution that was superseded by the typed local route. In LEAF 2 and 3 the host builds modules and calls their capabilities directly; Core manages the execution and lifecycle of each session, not a registry of instances. The performance NFRs remain evaluation targets while Chapter IV has no results to report.
:::

### Functional requirements

| Ref. | Requirement | Description | Priority |
|---|---|---|---|
| RF001 | Runtime module orchestration | The Core Orchestrator registers, resolves, and executes modules at runtime through standardized contracts | 1 |
| RF002 | Definition of communication contracts | The Core exposes public interfaces that act as the only communication channel between modules, avoiding direct dependencies among them | 1 |
| RF003 | Independent module compilation | Every module in the ecosystem compiles, tests, and packages in isolation, without requiring the source of any other module | 1 |
| RF004 | Module distribution through a remote repository | The framework publishes and consumes modules as versioned artifacts through GitHub Packages, supporting AAR for Android and a framework for iOS | 1 |
| RF005 | Plug-and-play module integration | The host application adds, replaces, or removes modules without affecting the Core or the remaining modules, thanks to the contracts defined in the core | 1 |
| RF006 | Dependency lifecycle management | The Core supports different lifecycles for the instances of registered modules, based on a runtime | 2 |
| RF007 | Functional encapsulation of each module | Every module exposes a clear, predictable public API while keeping its persistence, validation, and external integration details private | 1 |
| RF008 | Cross-platform Core execution | The Core runs its orchestration logic on both Android and iOS applications from a shared codebase built on Kotlin Multiplatform | 1 |

### Traceability against the implemented architecture

| Historical requirement | Current status | Contract that replaces it |
|---|---|---|
| RF001 — dynamic registration, resolution, and execution | Superseded | Typed Kotlin references and direct calls to `Leaf.run`, `Leaf.open`, and the Compose adapters. |
| RF006 — lifecycle of registered modules | Superseded | The host owns the Module instances; Core owns the structured lifecycle of `FeatureSession` and `WorkflowSession`. |

The rest of the table preserves the language of the academic project and is not by itself evidence of compliance or publication.

### Non-functional requirements

| Ref. | Requirement | Description | Priority |
|---|---|---|---|
| RNF001 | Performance equivalent to native development | Applications built with Leaf keep startup times and interaction latency within a maximum 10% variation from pure native development in Swift and Kotlin | 1 |
| RNF002 | Efficient device resource consumption | The framework preserves frame rate, animation fluidity, and battery consumption with no degradation perceptible to the end user | 1 |
| RNF003 | Source code maintainability | The Core and its modules follow Clean Architecture conventions that let any developer on the team read, understand, and modify the code without an extensive learning curve | 1 |
| RNF004 | Integrated technical documentation | Every module and Core component includes inline documentation and usage guides published alongside the distributed artifact | 2 |
| RNF005 | Horizontal scalability of the ecosystem | The framework allows new modules to be added without compromising the stability or performance of previously integrated ones | 1 |
| RNF006 | Independent versioning of each module | Each module is versioned autonomously through semantic versioning, letting system components evolve at different speeds | 2 |
| RNF007 | Cross-platform portability of shared code | The framework shares business logic and the presentation layer between Android and iOS through Kotlin Multiplatform and Compose Multiplatform | 1 |
| RNF008 | Compatibility with native binaries | The dual build system produces valid native binaries for both target platforms, ensuring correct integration with the official Android and iOS SDKs | 2 |

## 3.2 General project description — Timeline

| Phase | Activity | Start | End |
|---|---|---|---|
| **1. Research and analysis** | Market analysis (Clutch + GoodFirms) | Feb 2026 | Feb 2026 |
| | State-of-the-art review | Feb 2026 | Mar 2026 |
| | SWOT and hypothesis validation | Mar 2026 | Mar 2026 |
| **2. Architectural design** | Core Orchestrator design | Mar 2026 | May 2026 |
| | Definition of contracts between modules | Mar 2026 | May 2026 |
| | UI/UX design in Figma | Apr 2026 | May 2026 |
| **3. Prototype development** | Core implementation | May 2026 | Jun 2026 |
| | Login and Authentication module | Jun 2026 | Jul 2026 |
| | Catalog module | Jun 2026 | Aug 2026 |
| | Email module | Jul 2026 | Aug 2026 |
| | Payments module (Stripe + Mercado Pago) | Jul 2026 | Sep 2026 |
| | Host App for Android + iOS | Aug 2026 | Sep 2026 |
| **4. Validation and documentation** | Metric collection | Sep 2026 | Oct 2026 |
| | Integration testing | Sep 2026 | Oct 2026 |
| | Final report write-up | Sep 2026 | Oct 2026 |
| | Presentation preparation | Oct 2026 | Oct 2026 |

## 3.3 Design and experimentation — Methodology

**Choice of methodology.** The project adopts a hybrid methodology combining applied research with iterative, adapted Scrum-agile development. That combination answers the project's dual nature: it demands research rigor (market analysis, architectural validation, metrics) on one side, and incremental software construction with periodic working deliveries on the other.

### Stages or phases

- **Phase 1. Research and analysis (Feb – Mar 2026).** Analysis of the Guadalajara mobile development market, state-of-the-art review, definition of the conceptual architecture, SWOT analysis, and initial validation of the market hypothesis.
- **Phase 2. Architectural design (Mar – Apr 2026).** Detailed design of the Core Orchestrator, definition of contracts between modules, specification of each functional module's structure, UI/UX design in Figma, and setup of the cross-platform development environment.
- **Phase 3. Prototype development (Apr – Jul 2026).** Iterative Core implementation, development of the functional modules (Login, Catalog, Email, Payments), configuration of the artifact publishing system, and construction of the demonstration Host App.
- **Phase 4. Validation and documentation (Jul – Aug 2026).** Metric collection, integration testing on Android and iOS, final documentation write-up, preparation of the degree presentation, and report delivery.

### Distribution of team responsibilities

| Area | Lead | Support |
|---|---|---|
| Core Orchestrator and architecture | Mario Razo | Moises Pulido |
| Functional modules (Login, Catalog, Email, Payments) | Mario Razo | Moises Pulido |
| Host App and cross-platform validation | Moises Pulido | Mario Razo |
| Documentation and academic deliverables | Moises Pulido | Mario Razo |
| Market analysis and SWOT | Moises Pulido | Mario Razo |

### Methods and tools per stage

- **Phase 1**: quantitative analysis of Clutch.co and GoodFirms data (Python / Jupyter Notebook), SWOT analysis, literature review.
- **Phase 2**: architectural modeling (Figma for diagrams, Markdown for documentation), Gradle KMP for the initial setup.
- **Phase 3**: Android Studio + IntelliJ IDEA for development, Xcode for iOS builds, Git/GitHub for version control, GitHub Actions for basic CI/CD.
- **Phase 4**: metric measurement scripts (binary size, build times), Android Studio profiling tools and Xcode Instruments.

### Techniques for reaching each objective

Every specific objective is approached through: (1) review of official technical literature (JetBrains, Google, Apple), (2) iterative prototyping with frequent commits and peer review inside the team, (3) continuous validation through automated tests, (4) incremental documentation as each component is developed.

### Project control

- Task board in GitHub Projects or Notion for weekly tracking.
- Weekly progress meetings among team members and a biweekly meeting with the methodology advisor.
- Strict version control in Git, with feature branches and cross-review before merging.
- Formal milestones aligned to the timeline for validation with the technical advisor.

## 3.4 Project testing — Evaluating results

Evaluation happens on two planes:

**Development plane**: completion of the WBS deliverables, test coverage (≥70%), and conformance with the functional and non-functional requirements.

**Hypothesis plane**: quantitative measurement of (a) the percentage of code shared between Android and iOS, (b) the performance difference against an equivalent native app (≤10% variation), (c) the time to assemble a new project from Leaf modules compared with the estimated time to develop it from scratch.
