# SOP: Prompt Evolution (RoPE) — HERA V4

> Standard Operating Procedure for evolving agent prompts based on performance data.
> MUSE proposes. JAVIS approves. Evidence required.

## 1. Trigger Conditions

| Trigger | Severity | Action |
|---------|:--------:|--------|
| Agent score **< 4.0** for **3 consecutive** tasks | 🔴 Critical | MANDATORY prompt revision |
| Agent score **< 6.0** for **5 consecutive** tasks | 🟠 Warning | Prompt review recommended |
| Same error repeated **3 times** across trajectories | 🟠 Warning | Add specific rule to prevent |
| Agent score **> 9.0** for **3 consecutive** tasks | 🟢 Excellence | Capture winning patterns into prompt |
| New anti-pattern affecting agent | 🟡 Info | Add preventive rule |
| Chairman directive | 🔴 Critical | Immediate revision |

## 2. Evolution Process

### Step 1: Root Cause Analysis (MUSE)
MUSE identifies WHY the agent is underperforming by analyzing:
- Last 3-5 trajectories involving the agent
- Specific dimensions where scores are low (Correctness? Quality? Efficiency? Learning?)
- Common thread across failures
- External vs internal factors

### Step 2: Proposal Writing (MUSE)
MUSE writes a proposal in `experience-library/evolution/_decisions.md`:
```markdown
### EVO-{SEQ}: {Agent} — {Change Summary}
Date: {date}
Trigger: {trigger condition and evidence}
Evidence: {links to trajectories/scorecards}
Root Cause: {analysis of why agent is underperforming}
Proposed Change: {exact additions/modifications/removals to AGENT.md}
Expected Impact: {specific improvement expected}
Risk: {potential negative side effects}
```

### Step 3: Review (JAVIS)
JAVIS reviews the proposal for:
- [ ] Evidence is solid (not anecdotal)
- [ ] Proposed change addresses root cause (not symptoms)
- [ ] Change doesn't conflict with core role/boundaries
- [ ] Change doesn't violate financial/security rules

### Step 4: Apply (JAVIS)
If approved, JAVIS applies the change to the agent's AGENT.md:
- Add/modify/remove specific sections
- Update agent's EVOLUTION LOG section
- Log in `evolution/_decisions.md`

### Step 5: Measure (MUSE)
After evolution, MUSE measures effectiveness:
- Track next 3 tasks involving the evolved agent
- Compare scores before and after
- Update the EVO decision with actual results

### Step 6: Rollback (if needed)
If evolution made things WORSE (score decreased further):
- MUSE reports regression
- JAVIS reverts the change
- New analysis with different approach

## 3. What CAN Be Evolved

✅ **Allowed changes:**
- Adding new rules to STANDARDS section
- Adding examples of correct/incorrect approaches
- Refining SELF-CHECK items
- Adding domain-specific knowledge
- Adjusting workflow sequences
- Adding "BEFORE CODING" context

## 4. What CANNOT Be Evolved

❌ **Protected sections (require Chairman approval):**
- Agent's core JOB description
- Agent's DOMAIN (file ownership)
- SENIOR DNA section (shared across all agents)
- Financial Mandatory Rules (Decimal, transactions, audit)
- Security/authentication requirements
- Tech stack decisions

## 5. Evolution Cadence

| Review Type | Frequency | Participants |
|------------|-----------|-------------|
| Automated trigger | Per-task (via MUSE scoring) | MUSE |
| Scheduled review | Every 10 tasks | JAVIS + MUSE |
| Retrospective | Per milestone/module completion | All agents via /retrospective |
| Chairman review | On request | Chairman + JAVIS |

## 6. Anti-Inflation Protocol

To prevent prompt bloat over time:
- Maximum AGENT.md size: ~150 lines (excluding standard sections)
- When adding a rule, consider if an existing rule can be refined instead
- Quarterly: MUSE audits all prompts for redundancy
- Rules that haven't been relevant in 20+ tasks → candidate for removal

---

*SOP version 1.0 | Effective: 2026-04-14 | Owner: MUSE + JAVIS*
