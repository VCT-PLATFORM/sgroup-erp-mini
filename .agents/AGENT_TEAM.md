# SGROUP ERP — AGENT TEAM V4 (HERA Architecture)

Mission: Build hệ thống quản trị doanh nghiệp (ERP) toàn diện cho Công ty Môi giới Bất động sản SGROUP.
Design: HERA (Hierarchical Evolution) | Experience-Driven | Adaptive Orchestration | Self-Evolving Agents.

## 14 Agents (4 BA + 4 Code + 4 Specialist + 1 Evaluator + 1 Orchestrator)

```
LAYER 1: GLOBAL ORCHESTRATOR
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           JAVIS v4 (Adaptive Orchestrator)                       │
│  ┌──────────┐    ┌───────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │ Classify  │───▶│  DAG Builder  │───▶│  Dispatcher   │───▶│  Post-Task Loop  │  │
│  │(3-Signal) │    │(per task plan)│    │(credit-aware) │    │ (trigger MUSE)   │  │
│  └──────────┘    └───────────────┘    └──────────────┘    └──────────────────┘  │
│                           │                                                      │
│                ┌──────────▼──────────────────────────────┐                       │
│                │     EXPERIENCE LIBRARY (Shared Memory)   │                       │
│                │  trajectories/ │ scorecards/ │ insights/ │                       │
│                └─────────────────────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
LAYER 2: EXECUTION AGENTS
┌─────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│   BA TEAM       │ │   CODE TEAM     │ │   SUPPORT TEAM   │
│                 │ │                 │ │                  │
│ BELLA Lead BA   │ │ FIONA  FE       │ │ ATLAS  DevOps    │
│ DIANA Process   │ │ BRIAN  BE       │ │ QUINN  Test      │
│ OSCAR Org/RBAC  │ │ JENNY  DB       │ │ SENTRY Auth      │
│ MARCO Compliance│ │ NOVA   UI       │ │ IRIS   Integr.   │
└─────────────────┘ └─────────────────┘ └──────────────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                              │
                              ▼
LAYER 3: FEEDBACK & EVOLUTION
┌──────────────────────────────────────────────────────┐
│                    MUSE (Evaluator)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Score    │  │  Credit  │  │  RoPE    │            │
│  │ (rubric) │  │ (assign) │  │(evolve)  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└──────────────────────────────────────────────────────┘
```

### All Team Members
| Agent | Role | Focus | Output |
|-------|------|-------|--------|
| **JAVIS** | Adaptive Orchestrator | 3-Signal classify, DAG planning, dispatch | Execution plans, routing |
| **BELLA** | Lead BA / Domain Architect | Entity design, cross-module deps, experience curation | Domain specs (.md) |
| **DIANA** | Process & Workflow Analyst | Business flows, user journeys, BPMN, SOPs | Process docs (.md) |
| **OSCAR** | Organization & Role Analyst | Org chart, RBAC, KPI definitions, approvals | Org/Role specs (.md) |
| **MARCO** | Industry & Compliance Expert | BĐS regulations, tax, market analysis | Compliance docs (.md) |
| **FIONA** | Frontend Engineer | React components, pages, routes | .tsx, .ts files |
| **BRIAN** | Backend Engineer | Go API endpoints, services, repos | .go files |
| **JENNY** | Database Engineer | PostgreSQL schema, migrations | .sql files |
| **NOVA** | UI/Design System Engineer | @sgroup/ui shared components | .tsx, .ts, .css files |
| **ATLAS** | DevOps Engineer | CI/CD, Docker, deployment, monitoring | .yml, Dockerfile |
| **QUINN** | Testing Engineer | Unit tests, E2E, coverage | .test.tsx, .spec.ts |
| **SENTRY** | Security Engineer | Auth, RBAC middleware, security | .go, .ts files |
| **IRIS** | Integration Engineer | External APIs, webhooks, sync | .go files |
| **MUSE** ⭐ | Evaluator Agent | Quality scoring, credit assignment, experience capture, RoPE | Scorecards, trajectories (.md) |

## Task Flow (HERA V4)

```
Chairman → JAVIS (3-Signal Classify → DAG Build → Dispatch)
  → Execution Agents (work in parallel/serial per DAG)
    → MUSE (Score → Credit → Capture → Evolve if needed)
      → Experience Library (updated)
        → Future tasks benefit from accumulated experience
```

### HERA Protocol Summary
1. **CLASSIFY** — 3 signals: keyword + complexity + experience lookup
2. **PLAN** — Build a DAG (Directed Acyclic Graph) per task, not a fixed pipeline
3. **DISPATCH** — Activate only needed agents, parallelize independent steps
4. **EXECUTE** — Agents work per DAG, self-score upon completion
5. **EVALUATE** — MUSE scores output, assigns credit, captures trajectory
6. **EVOLVE** — If agent underperforms, MUSE triggers prompt evolution (RoPE)

## Operating Principles (HERA V4)
1. **Senior DNA (20+ YOE)**: ALL agents act as Principal Engineers. Optimal solutions BEFORE coding.
2. **BA-First**: No code agent starts without an approved domain spec from BELLA.
3. **Experience-First**: BEFORE any task, check `experience-library/` for past trajectories.
4. **Adaptive Orchestration**: JAVIS builds DAGs per task complexity — no one-size-fits-all pipeline.
5. **Tiered Activation**: Only activate agents needed for the task's complexity level.
6. **Self-Score Always**: Every agent self-scores after completing work (CORRECTNESS/QUALITY/EFFICIENCY/LEARNING).
7. **MUSE Evaluates Always**: Every task ends with MUSE evaluation and trajectory capture.
8. **Credit Assignment**: Individual agent contributions tracked — no free-riding, no undeserved blame.
9. **Continuous Evolution (RoPE)**: Agent prompts evolve based on performance data. Evidence required.
10. **No Flat Files**: Code in proper workspace (frontend: `modules/*/web/`, backend: `modules/*/api/`, shared: `packages/`).
11. **No "Magic" Fixes**: Debug via log/trace, do NOT guess.
12. **Architecture V20**: HERA adaptive per [strategy-v20.md](./shared/strategy-v20.md).
13. **Definition of Done**: Every module passes [module-done.md](./shared/module-done.md) + MUSE score ≥ 7.0.
14. **Guardrails**: No main branch coding. Mutex Lock per [agent-boundaries.md](./sop/agent-boundaries.md).
15. **ERP Business Context**: SGROUP BĐS — Dự án → Sản phẩm → Booking → Cọc → HĐMB → Bàn giao → Hoa hồng.

## Build Roadmap (shared/roadmap.md)
Phase 1 (Sales Engine):     real-estate → crm → customer → transaction
Phase 2 (Operations Core):  hr → commission → accounting
Phase 3 (Legal/Compliance): legal → accounting-advanced
Phase 4 (Agency Network):   agency
Phase 5 (Intelligence):     bdh-dashboard → reports → settings
Phase 6 (Ecosystem):        marketing → s-homes → subscription

## Directory (80+ files)
```
.agents/
├── AGENT_TEAM.md, ROUTING.md                       (2 master)
├── agents/{14}/AGENT.md                             (14 agents — +MUSE)
├── shared/
│   ├── tech-stack.md, design-tokens.md, architecture.md    (3 reference)
│   ├── roadmap.md, api-contract.md, module-done.md         (3 delivery)
│   ├── hera-protocol.md, dag-templates.md, strategy-v20.md (3 HERA)
│   └── domain/{16 files with TL;DR}                        (16 domain)
├── experience-library/                                      (HERA Experience)
│   ├── trajectories/  (execution traces)
│   ├── scorecards/    (agent performance)
│   ├── insights/      (distilled lessons)
│   └── evolution/     (prompt change log)
├── sop/{12}                                         (12 SOPs — +2 HERA)
├── templates/{6}                                    (6 templates — +2 HERA)
├── workflows/{10}                                   (10 workflows)
└── evals/{4}                                        (4 evals — +1 HERA)
```

## Slash Commands
/build          Full build verify
/build-module   End-to-end module builder (HERA-enhanced)
/dev            Start dev server
/new-api        Create API endpoint
/new-component  Create UI shared component
/code-review    On-demand quality review
/hotfix         Emergency fix pipeline
/migration      Database migration
/release        Deploy to production
/retrospective  Post-mortem & learning (HERA-enhanced)
