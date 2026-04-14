# Trajectory Template — Experience Library

> Use this template to capture every task execution. Filled by MUSE after evaluation.

---

# Trajectory: {TASK_NAME}

**Date:** {YYYY-MM-DD}
**Complexity:** {XS / S / M / L / XL}
**Module(s):** {affected module names}
**Requester:** {Chairman / Agent / System}
**Trajectory ID:** traj-{YYYY-MM-DD}-{task-slug}

## Task Description
{Brief description of what was requested}

## Acceptance Criteria
{GIVEN/WHEN/THEN format from JAVIS dispatch}

## Execution DAG
```
{Agent1} → {Agent2} → ... → MUSE
```

## Agent Contributions

| Agent | Role in Task | Self-Score | MUSE Score | Credit | Notes |
|-------|-------------|:----------:|:----------:|:------:|-------|
| {name} | {what they did} | {0-10} | {0-10} | {+2/+1/0/-1/-2} | {specific evidence} |

## Timeline
| Step | Agent | Started | Completed | Duration | Status |
|------|-------|---------|-----------|----------|--------|
| 1 | {name} | {time} | {time} | {duration} | {✅/❌/⚠️} |

## Outcome
- **Status:** {✅ Success / ❌ Failure / ⚠️ Partial}
- **Build:** {Pass / Fail}
- **Quality Score:** {0-10 weighted average}
- **Files Changed:** {count}

## Insights Captured
### What Worked
- {specific thing that went well}

### What Failed
- {specific thing that went wrong + root cause}

### New Patterns Discovered
- {any new patterns to add to _patterns.md}

### Blockers Encountered
- {external blockers outside agent control}

## Experience Library Updates
- [ ] Trajectory filed in `trajectories/`
- [ ] `trajectories/_index.md` updated
- [ ] Agent scorecards updated in `scorecards/`
- [ ] `scorecards/_summary.md` updated
- [ ] Insights written to `insights/` (if applicable)
- [ ] Patterns updated in `insights/_patterns.md` (if applicable)

---

*Captured by MUSE | Template version 1.0*
