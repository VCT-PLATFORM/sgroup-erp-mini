# SGROUP ERP — AGENT TEAM V1

Mission: Build hệ thống quản trị doanh nghiệp (ERP) toàn diện hàng đầu.
Design: Domain-First | Token-Minimum | One-Job | Self-Review | Delivery-Focused.

## 8 Agents

ORCHESTRATION     CODE PRODUCERS          SPECIALISTS
┌────────┐   ┌──────┬──────┬──────┬──────┐   ┌──────┬──────┬──────┐
│ JAVIS  │──▶│FIONA │BRIAN │JENNY │ NOVA │   │ATLAS │QUINN │SENTRY│
│Dispatch│   │  FE  │  BE  │  DB  │  UI  │   │DevOps│ Test │ Auth │
└────────┘   └──────┴──────┴──────┴──────┘   └──────┴──────┴──────┘

## Task Flow
Chairman → JAVIS (route + domain file) → AGENT (code + self-check + verify) → Done

## Operating Principles
1. **No Flat Files**: Code must sit in the proper workspace (frontend: `core/shell/` / `core/packages/`, backend: `backend/`).
2. **No "Magic" Fixes**: If code breaks, debug it via log/trace. Do not guess.
3. **Architecture V17**: All agents MUST adhere strictly to the Fault Isolation & Roadmap guidelines laid out in [strategy-v17.md](./shared/strategy-v17.md). Backend builds are microservices; frontend uses error boundaries.
4. **Definition of Done**: Every module must pass all gates in [module-done.md](./shared/module-done.md) before marking complete.
5. **Turbo Delivery**: Workflows starting with `/build-module` or `/workflow` must be executed strictly step-by-step.
6. **Auto-Learning (V18 Protocol)**: 
   - Before coding, ALL agents MUST read `.agents/knowledge-base/` to avoid past mistakes.
   - **3-Strike Rule**: If an agent fails to fix a bug after 3 consecutive attempts, THEY MUST STOP. You are required to run an internal Post-Mortem, figure out the root cause, write a lesson into `.agents/knowledge-base/`, and update workflows before proceeding. Do NOT loop blindly.
7. **Guardrails (V19 Protocol)**:
   - **NO MAIN:** You are BANNED from making structural modifications on the `main` branch. All `/build-module` workflows must start with `git checkout -b`.
   - **Mutex Lock:** Follow the exact boundary constraints in `.agents/sop/agent-boundaries.md`. Backend agents only touch backend. Frontend agents only touch frontend. Do not cross the boundary.

## Build Roadmap (shared/roadmap.md)
Phase 1 (MVP):    hr → crm → accounting
Phase 2 (Core):   projects → inventory → sales
Phase 3 (Launch): subscriptions → real-estate
Phase 4 (Ops):    finance → communications → documents
Phase 5 (Analytics): dashboard → reports → settings
Phase 6 (Mobile): mobile

## Directory (42 files)
```
.agents/
├── AGENT_TEAM.md, ROUTING.md                     (2 master)
├── agents/{8}/AGENT.md                            (8 agents)
├── shared/
│   ├── tech-stack.md, design-tokens.md, architecture.md  (3 reference)
│   ├── roadmap.md, api-contract.md, module-done.md       (3 delivery) [NEW]
│   └── domain/{10 files with TL;DR}                      (10 domain)
├── sop/{2: incident-response, feature-lifecycle}  (2 SOPs)
├── templates/{4}                                  (4 templates)
├── workflows/{10 — added build-module}            (10 workflows)
└── evals/{3}                                      (3 evals)
```

## Slash Commands
/build          Full build verify
/build-module   End-to-end module builder [NEW]
/dev            Start dev server
/new-feature    Create feature scaffold
/new-api        Create API endpoint
/new-component  Create UI shared component
/code-review    On-demand quality review
/hotfix         Emergency fix pipeline
/migration      Database migration
/release        Deploy to production
