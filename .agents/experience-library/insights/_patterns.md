# Cross-Cutting Patterns & Anti-Patterns — Experience Library

> Distilled lessons from multiple trajectories. Each pattern is backed by ≥2 real experiences.

## Patterns (DO THIS)

### P-001: Domain Spec First, Always
**Context:** Every time code was written without a domain spec, rework was ≥50%.
**Rule:** NEVER start code agents before Bella's domain spec is approved.
**Evidence:** *(Will be linked to trajectories as they accumulate)*

### P-002: Decimal for Money, No Exceptions
**Context:** Float64 for VND amounts caused rounding errors in commission calculations.
**Rule:** ALL monetary values → `Decimal(18,4)` in DB, `shopspring/decimal` in Go, `Intl.NumberFormat` in TS.
**Evidence:** Legacy knowledge from `kb-monorepo.md`

### P-003: Experience Lookup Saves Tokens
**Context:** Checking past trajectories before starting prevents repeat debugging.
**Rule:** First action for ANY task = search `trajectories/_index.md`.
**Evidence:** *(Pending first HERA V4 cycle)*

## Anti-Patterns (DON'T DO THIS)

### AP-001: Guessing Instead of Tracing
**Context:** Magic fixes that mask root cause always resurface.
**Rule:** Debug via log/trace, NEVER guess. If stuck after 3 attempts → post-mortem.

### AP-002: Coding on Main Branch
**Context:** Direct main branch changes have caused rollback incidents.
**Rule:** ALWAYS `git checkout -b feat/{task}` before any code change.

### AP-003: Ignoring Agent Boundaries
**Context:** Cross-boundary edits cause merge conflicts and architectural violations.
**Rule:** Stay within your owned directories per `sop/agent-boundaries.md`.

---

## Migrated from Legacy Knowledge Base

### INS-Module-Placement (from kb-module-placement.md)
**Lesson:** Module code belongs in `modules/{name}/web/` (frontend) and `modules/{name}/api/` (backend). 
Shared code goes in `packages/`. NEVER put module code in `core/`.

### INS-Monorepo-Structure (from kb-monorepo.md)
**Lesson:** Turborepo manages the monorepo. Each module is an independent workspace.
Always use `npx turbo run build` to verify cross-module compatibility.

---

*Patterns are reviewed and updated by MUSE during retrospectives.*
