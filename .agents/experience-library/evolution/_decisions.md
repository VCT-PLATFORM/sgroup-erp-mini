# Prompt Evolution Decisions Log — HERA V4

> ADR-style log of WHY agent prompts were changed. Each decision must have evidence from scorecards/trajectories.

## Decision Format
```
### EVO-{SEQ}: {Agent} — {Change Summary}
Date: YYYY-MM-DD
Trigger: {MUSE score < threshold | Pattern discovery | Chairman directive}
Evidence: {Link to trajectory/scorecard}
Change: {What was added/removed/modified in the prompt}
Expected Impact: {What improvement is expected}
Result: {Actual impact after ≥3 tasks — updated later}
```

---

## Decisions

### EVO-001: ALL AGENTS — HERA V4 Initialization
**Date:** 2026-04-14
**Trigger:** Chairman directive — upgrade to HERA architecture
**Evidence:** V3 post-mortem: static routing, no learning, no credit assignment
**Change:** Added SELF-SCORE, EXPERIENCE PROTOCOL, and EVOLUTION LOG sections to all 14 agents. Created MUSE (Evaluator) agent. Replaced static keyword routing with 3-signal classification.
**Expected Impact:** Continuous improvement loop, reduced repeat mistakes, optimized agent dispatch
**Result:** *(Pending — will evaluate after 10 tasks)*

---

*Log maintained by MUSE. Reviewed during retrospectives.*
