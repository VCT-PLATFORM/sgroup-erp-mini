# DAG Templates — Pre-Built Execution Plans (HERA V4)

> JAVIS selects and adapts these templates based on 3-Signal Classification.
> Templates are starting points — JAVIS may modify based on experience lookup.

## Template Selection Matrix

| Complexity | Task Type | Template |
|:----------:|-----------|----------|
| XS | Bug fix | DAG-XS-BUGFIX |
| XS | Config change | DAG-XS-CONFIG |
| S | New API endpoint | DAG-S-API |
| S | New UI component | DAG-S-UI |
| S | Schema change | DAG-S-SCHEMA |
| M | Feature (API+UI) | DAG-M-FEATURE |
| M | Process with spec | DAG-M-PROCESS |
| L | Full-stack feature | DAG-L-FULLSTACK |
| L | Auth/RBAC feature | DAG-L-AUTH |
| XL | New module | DAG-XL-MODULE |
| XL | Cross-module integration | DAG-XL-INTEGRATION |

---

## DAG-XS-BUGFIX
```
Task → Domain Agent (fix) → MUSE (evaluate)
```
**Agents:** 1 domain agent + MUSE
**Skip:** BA team, Quinn (unless regression), Atlas
**Notes:** Direct fix. Domain agent self-tests.

## DAG-XS-CONFIG
```
Task → Atlas/Fiona/Brian (config) → MUSE (evaluate)
```
**Agents:** 1 agent + MUSE
**Skip:** BA team, Jenny, Quinn

## DAG-S-API
```
Task → Brian (endpoint) → Sentry (auth check) → MUSE (evaluate)
```
**Agents:** Brian + Sentry + MUSE
**Parallel:** None (sequential dependency)
**Prerequisite:** Domain spec must exist. If not → Bella first.

## DAG-S-UI
```
Task → Fiona (component/page) → MUSE (evaluate)
         └→ Nova (if shared component needed)
```
**Agents:** Fiona + (optionally Nova) + MUSE
**Parallel:** Fiona and Nova can work in parallel if no dependency

## DAG-S-SCHEMA
```
Task → Jenny (migration) → Brian (update models) → MUSE (evaluate)
```
**Agents:** Jenny → Brian + MUSE
**Sequential:** Brian depends on Jenny's schema

## DAG-M-FEATURE
```
                ┌→ Brian (API) → Sentry (auth)
Task → Bella ──┤                                  → MUSE (evaluate)
    (quick spec)└→ Fiona (UI) ────────────────────┘
```
**Agents:** Bella + Brian + Sentry + Fiona + MUSE
**Parallel:** Brian and Fiona can work in parallel after Bella's spec
**Note:** If domain spec already exists, skip Bella

## DAG-M-PROCESS
```
Task → Diana (process flow) → Bella (entity spec)
         → Brian (API) + Fiona (UI) [parallel]
           → Quinn (test key flows) → MUSE (evaluate)
```
**Agents:** Diana + Bella + Brian + Fiona + Quinn + MUSE

## DAG-L-FULLSTACK
```
Task → Bella (domain spec)
         → Diana (process flow) [parallel with Oscar]
         → Oscar (RBAC matrix) [parallel with Diana]
           → Jenny (schema) 
             → Brian (API) + Sentry (auth) [parallel]
               → Fiona (UI) + Nova (shared components) [parallel]
                 → Quinn (tests)
                   → Atlas (build verify)
                     → MUSE (evaluate)
```
**Agents:** 10-12 agents
**Parallel opportunities:**
  - Diana ∥ Oscar (after Bella)
  - Brian ∥ Sentry (after Jenny)
  - Fiona ∥ Nova (after Brian)

## DAG-L-AUTH
```
Task → Oscar (RBAC requirements) → Bella (entity constraints)
         → Sentry (middleware + guards)
           → Brian (endpoint auth) + Fiona (UI guards) [parallel]
             → Quinn (auth tests)
               → MUSE (evaluate)
```
**Agents:** Oscar + Bella + Sentry + Brian + Fiona + Quinn + MUSE

## DAG-XL-MODULE
```
Phase 1 — Analysis (parallel BA team):
  ┌→ Bella (domain spec & entities)
  ├→ Diana (process flows & journeys)
  ├→ Oscar (RBAC & KPIs)
  └→ Marco (compliance & regulations)

Phase 2 — Schema:
  → Jenny (database migrations)

Phase 3 — Backend (parallel where possible):
  → Brian (API handlers/services/repos)
  → Sentry (auth middleware)
  → Iris (external integrations, if applicable)

Phase 4 — Frontend (parallel):
  → Nova (shared UI components, if needed)
  → Fiona (module screens & pages)

Phase 5 — Quality:
  → Quinn (tests — unit + E2E)
  → Atlas (build + deploy config)

Phase 6 — Evaluation:
  → MUSE (full module evaluation + trajectory capture)
```
**Agents:** All 14
**Duration:** Longest DAG, reserved for brand new modules

## DAG-XL-INTEGRATION
```
Phase 1:
  → Bella (cross-module dependency mapping)
  → Marco (compliance check for integration)

Phase 2:
  → Iris (external API client + webhook)
  → Brian (internal API adjustments)
  → Jenny (schema if new tables needed)

Phase 3:
  → Fiona (UI for integration status/config)
  → Quinn (integration tests)
  → Atlas (environment config)

Phase 4:
  → MUSE (evaluate)
```
**Agents:** 8-10

---

## DAG Modification Rules
1. JAVIS MAY skip agents that have no work in a specific task
2. JAVIS MAY add agents not in the template if task requires them
3. JAVIS MUST NOT skip MUSE — every task must be evaluated
4. JAVIS MUST NOT skip Bella for tasks ≥ M complexity (unless domain spec already exists)
5. Parallel agents MUST NOT have data dependencies on each other

---

*Templates are living documents — updated based on Experience Library patterns.*
