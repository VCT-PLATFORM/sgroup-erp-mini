# TASK ROUTING — Adaptive Dispatch (V4 HERA, 14 Agents)

JAVIS uses 3-Signal Classification to route every task. Static keyword matching is Signal 1 only.

## 3-Signal Classification

### Signal 1: Keyword → Agent Mapping
| Keywords | Agent | Owned Files |
|----------|-------|-------------|
| Decompose, plan, ADR, architecture, orchestrate | JAVIS | ROUTING.md, templates/ |
| Domain spec, entity design, state machine, data model | BELLA | .agents/shared/domain/ |
| Process flow, user journey, BPMN, workflow mapping | DIANA | docs/business-analysis/processes/ |
| Org chart, role definition, RBAC, KPI, approval hierarchy | OSCAR | docs/business-analysis/organization/ |
| Regulation, compliance, tax, market analysis, legal context | MARCO | docs/business-analysis/industry/ |
| React Web, component, screen, route, page, frontend | FIONA | modules/*/web/, core/web-host/ |
| Go API, handler, service, repository, endpoint, backend | BRIAN | modules/*/api/, core/api-gateway/ |
| SQL, migration, schema, table, index, database | JENNY | modules/*/api/migrations/ |
| @sgroup/ui, design token, NativeWind, reusable UI | NOVA | packages/ui/ |
| Docker, CI/CD, GitHub Actions, deploy, Turborepo | ATLAS | .github/, turbo.json, docker-compose.yml |
| Test, E2E, Vitest, Playwright, coverage | QUINN | **/*.test.*, e2e/ |
| JWT, auth, RBAC code, permission middleware, security | SENTRY | packages/rbac/, middleware/ |
| Integration, BizFly, PayOS, webhook, sync, API external | IRIS | modules/*/api/integrations/ |
| Evaluate, score, review quality, experience, trajectory | MUSE | .agents/experience-library/ |

### Signal 2: Complexity Assessment (T-Shirt Sizing)
| Size | Criteria | Max Agents | Default DAG |
|:----:|----------|:----------:|-------------|
| **XS** | Single file, <20 lines, no cross-module | 1-2 | DAG-XS-BUGFIX |
| **S** | Single concern, 1 module, <3 files | 2-3 | DAG-S-API / DAG-S-UI |
| **M** | Multi-file, may cross layers, 1 module | 3-5 | DAG-M-FEATURE |
| **L** | Full-stack, multiple modules, needs spec | 6-10 | DAG-L-FULLSTACK |
| **XL** | New module, architectural impact | 10-14 | DAG-XL-MODULE |

### Signal 3: Experience Lookup
```
1. Search experience-library/trajectories/_index.md for similar past tasks
2. IF match found + Success → Reuse DAG template, reference trajectory
3. IF match found + Failure → Avoid failed approach, route differently  
4. IF no match → Use default DAG template for complexity level
5. Tell agents: "CHECK experience-library/insights/ for known pitfalls"
```

## DAG Templates (see shared/dag-templates.md for full details)

### Quick Reference
| Task Type | DAG Flow |
|-----------|----------|
| **Bug fix (XS)** | Domain Agent → MUSE |
| **New API (S)** | Brian → Sentry → MUSE |
| **New UI page (S)** | Fiona (+ Nova if shared) → MUSE |
| **Schema change (S)** | Jenny → Brian → MUSE |
| **Feature (M)** | Bella(spec) → Brian + Fiona [parallel] → MUSE |
| **Full-stack (L)** | Bella → Diana + Oscar [parallel] → Jenny → Brian + Sentry [parallel] → Fiona + Nova [parallel] → Quinn → Atlas → MUSE |
| **New module (XL)** | Full BA Team → Jenny → Brian + Sentry + Iris → Nova + Fiona → Quinn → Atlas → MUSE |
| **Integration (XL)** | Bella + Marco → Iris + Brian → Fiona → Quinn → Atlas → MUSE |

## Cross-Domain Flows with HERA Enhancements

| Task | DAG Agent Flow | MUSE |
|------|---------------|:----:|
| **Full-stack feature** | JAVIS → BELLA → DIANA+OSCAR [∥] → JENNY → BRIAN+SENTRY [∥] → FIONA+NOVA [∥] → QUINN → ATLAS | → MUSE |
| **New module analysis** | JAVIS → BELLA+DIANA+OSCAR+MARCO [∥ then consolidate] | → MUSE |
| **New API endpoint** | JAVIS → BRIAN → SENTRY | → MUSE |
| **New UI page** | JAVIS → FIONA (+ NOVA if shared component) | → MUSE |
| **Schema change** | JAVIS → JENNY → BRIAN | → MUSE |
| **Auth change** | JAVIS → SENTRY | → MUSE |
| **Bug fix** | JAVIS → Domain Agent (+ QUINN regression) | → MUSE |
| **Hotfix (P0)** | JAVIS → Domain Agent → ATLAS | → MUSE |
| **External integration** | JAVIS → IRIS → BRIAN | → MUSE |
| **Commission calculation** | JAVIS → BELLA → MARCO(tax) → JENNY → BRIAN → FIONA | → MUSE |
| **Real estate booking** | JAVIS → BELLA → DIANA → JENNY → BRIAN+SENTRY [∥] → FIONA | → MUSE |
| **Regulatory compliance** | JAVIS → MARCO → BELLA(constraints) | → MUSE |
| **KPI/Dashboard** | JAVIS → OSCAR(kpis) → DIANA → JENNY → BRIAN → FIONA | → MUSE |

## BA Team Internal Coordination
```
Chairman asks "Build module X"
  ↓
JAVIS classifies (3-Signal): XL complexity → DAG-XL-MODULE selected
  ↓
JAVIS checks Experience Library for similar past modules
  ↓
BA Team activated in parallel:
  BELLA (lead)  → entity design, cross-module deps
  DIANA (flow)  → process maps, user journeys
  OSCAR (org)   → RBAC matrix, KPI defs
  MARCO (mkt)   → compliance check, tax rules
  ↓
BELLA consolidates → domain spec approved
  ↓
JAVIS dispatches to Code Agents per DAG
  ↓
MUSE evaluates entire trajectory → Experience Library updated
```

## Tiered Activation Rules
- **XS/S tasks:** Skip BA team unless domain spec is missing
- **M tasks:** BA lead (Bella) only, skip Diana/Oscar/Marco unless needed
- **L/XL tasks:** Full BA team activation
- **ALL tasks:** JAVIS dispatches + MUSE evaluates (non-negotiable)

## Domain Context Rule
- ALWAYS tell agent: "LOAD shared/domain/{module}.md before coding"
- ALWAYS tell agent: "CHECK experience-library/ for past lessons"
- For BA agents: "ALSO CHECK docs/business-analysis/{area}/ for existing analysis"

## Priority
P0 Immediate: Build broken, data loss, security breach, financial data error
P1 Same day: Feature blocking, auth issue, commission calculation bug
P2 2-3 days: New feature, enhancement
P3 Backlog: Tech debt, optimization, prompt evolution
