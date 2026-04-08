# SOP: Feature Lifecycle

> Covers the full product development cycle. For module building, use `/build-module` workflow.

## When to use this SOP
- New feature that spans multiple modules
- Feature requiring Chairman approval (>2 sprint effort)
- Feature with unclear requirements (needs discovery phase)

## Phases (simplified for V15)

### 1. DISCOVER (Javis + Chairman)
Problem statement: "For [persona], [problem] is painful because [impact]"

### 2. DEFINE (Javis)
User stories + acceptance criteria (Given/When/Then). Check shared/roadmap.md for dependencies.

### 3. BUILD (via /build-module or /new-feature workflow)
Execute full-stack build per workflow. Each agent self-checks.

### 4. VERIFY (Javis)
Run shared/module-done.md checklist. All boxes = DONE.

### 5. RELEASE (via /release workflow)
Deploy per release workflow. Monitor 1h.
