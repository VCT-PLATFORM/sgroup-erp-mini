---
description: How to perform code review using Evaluator-Optimizer pattern
---

# /code-review {files}

AGENT: JAVIS (on-demand review, not default flow)

NOTE: Default flow = agents SELF-CHECK per AGENT.md checklist + build verify.
This workflow is for Chairman-requested deep review only.

## Step 1 — Score (6 dimensions × 5pts = /30)
1. Correctness — Logic, edge cases, acceptance criteria
2. Type Safety — Zero any, import type, strict nulls
3. Domain Compliance — matches shared/domain/ rules
4. Performance — no N+1, no unnecessary re-renders, lazy loading
5. Standards — file naming, git commit format, patterns
6. Security — input validation, auth checks, no injection

## Step 2 — Decision
```
≥25/30 → APPROVE
15-24  → REQUEST_CHANGES: list [must] items, agent fixes, re-score
<15    → REJECT: require rewrite
```

## Step 3 — Feedback format
```
SCORE: {n}/30
STATUS: APPROVE | REQUEST_CHANGES | REJECT
[must] {file}:{line} — {issue}
[nit]  {file}:{line} — {suggestion}
```

## Step 4 — Optimizer loop (max 2 iterations)
Agent fixes [must] items → re-score changed lines only.
Still failing after 2 → escalate to Chairman.
