# SGROUP ERP Strategy V20 — HERA Adaptive Architecture

**Notice to All Agents:** This document supersedes V17/V18/V19. ALL agents MUST comply with these constraints.

## Version History
| Version | Focus | Date |
|:-------:|-------|------|
| V17 | Microservices & Revenue-First Roadmap | 2026-04-08 |
| V18 | Auto-Learning (Knowledge Base, 3-Strike Rule) | 2026-04-08 |
| V19 | Guardrails (Branch protection, Agent boundaries) | 2026-04-08 |
| **V20** | **HERA Adaptive Architecture** | **2026-04-14** |

## 1. Business Context: Real Estate Brokerage ERP
*(Unchanged from V17)*
SGROUP is a **real estate brokerage company** (Công ty Môi giới Bất Động Sản). The ERP system must manage:
- **Project & Inventory:** Track real estate projects, units (apartments/land/townhouses), pricing, availability.
- **Sales Pipeline:** Booking → Deposit → Contract (HĐMB) → Handover, with race condition prevention.
- **Commission:** Multi-level commission (Direct Sales 60% / Team Lead 20% / Branch Manager 15% / Company 5%).
- **Agency Network:** F1/F2 distribution partners with tiered commission sharing.
- **Finance:** Invoice, AR/AP, payroll, tax compliance (Vietnamese regulation).
- **HR/Ops:** Staff management, attendance, KPI, performance reviews.

## 2. Architectural Mandate: Fault Isolation
*(Unchanged from V17)*
- **Frontend isolation:** UI modules via React's `TolerantErrorBoundary` inside `core/web-host`.
- **Backend isolation (Microservices):** Standalone Go executables in isolated Docker containers.
- **Inter-service communication:** HTTP/RPC or RabbitMQ event bus, NOT direct Go imports.

## 3. HERA Mandate: Adaptive Agent Orchestration (NEW in V20)

### 3.1 Three-Layer Architecture
All agent operations MUST follow the HERA three-layer model:
1. **Global Orchestrator (JAVIS)** — Dynamic DAG-based task dispatch using 3-Signal Classification
2. **Execution Layer (13 specialist agents)** — Domain experts with self-scoring capability
3. **Feedback Layer (MUSE + Experience Library)** — Post-execution evaluation and continuous learning

### 3.2 Experience-Driven Development
- **BEFORE any task:** Agent MUST check `experience-library/` for past similar trajectories
- **AFTER any task:** MUSE MUST evaluate and capture trajectory
- **Knowledge Base is superseded:** `experience-library/` replaces `knowledge-base/`

### 3.3 Continuous Evolution (RoPE)
- Agent prompts are **living documents** that evolve based on performance data
- MUSE monitors agent scores and triggers prompt evolution when needed
- Evolution requires evidence from trajectories/scorecards (no arbitrary changes)

### 3.4 Tiered Activation
- NOT every task needs all 14 agents — JAVIS activates only what's required
- Complexity T-shirt sizing (XS/S/M/L/XL) determines minimum agent activation
- See `shared/dag-templates.md` for pre-built execution plans

## 4. Delivery Roadmap: The "Revenue-First" Strategy
*(Unchanged from V17)*

- 🎯 **Phase 1: "Sales Engine"** — `real-estate`, `crm`, `customer`, `transaction`
- 🎯 **Phase 2: "Operations Core"** — `hr`, `commission`, `accounting`
- 🎯 **Phase 3: "Legal & Compliance"** — `legal`, `accounting` (advanced)
- 🎯 **Phase 4: "Agency Network"** — `agency`
- 🎯 **Phase 5: "Intelligence"** — `bdh-dashboard`, `reports`, `settings`
- 🎯 **Phase 6: "Ecosystem"** — `marketing`, `s-homes`, `subscription`

## 5. Agent Directives (Updated for HERA V20)

1. **Javis (Adaptive Orchestrator):** Use 3-Signal Classification for every task. Build DAGs, not linear pipelines. Always trigger MUSE post-completion.
2. **MUSE (Evaluator):** Score every completed task. Capture trajectories. Trigger RoPE when thresholds are breached. Maintain Experience Library integrity.
3. **Bella (Lead BA):** Curate cross-module insights in Experience Library. Domain spec MUST exist before code agents start.
4. **Brian (Backend API):** Self-score after every task. Check experience-library before coding. Decimal(18,4) for money, $transaction for writes.
5. **Fiona (Frontend UI):** Self-score after every task. Error boundaries mandatory. Neo-Corporate Light theme default.
6. **Sentry (Security/Auth):** RBAC scales CEO → Director → BM → TL → Sales. Self-score auth coverage.
7. **Nova (UI/Design):** Neo-Corporate Premium theme. Light mode DEFAULT. Self-score design consistency.
8. **Atlas & Quinn (Build/QA):** Verify container isolation. Quinn reports test coverage to MUSE for scoring.
9. **ALL agents:** Read `shared/hera-protocol.md`. Self-score every task. Check Experience Library before starting.

---

*Strategy V20 effective: 2026-04-14 | Approved by: Chairman*
