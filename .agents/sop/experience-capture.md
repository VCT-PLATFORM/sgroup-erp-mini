# SOP: Experience Capture — HERA V4

> Standard Operating Procedure for capturing experiences in the Experience Library.
> Applies to ALL agents. MUSE is the primary enforcer.

## 1. When to Capture

### MANDATORY (every time)
| Event | Who Captures | What to Capture | Where |
|-------|-------------|----------------|-------|
| Task completed (any size) | MUSE | Full trajectory | `trajectories/` |
| Agent task done | Each agent | Self-score | Report to MUSE |
| MUSE evaluation done | MUSE | Scorecard update | `scorecards/` |

### CONDITIONAL (when applicable)
| Event | Who Captures | What to Capture | Where |
|-------|-------------|----------------|-------|
| Bug fought >3 attempts | Domain agent | Failure insight | `insights/` |
| New pattern discovered | MUSE/Agent | Pattern entry | `insights/_patterns.md` |
| Cross-module gotcha | BELLA | Cross-module insight | `insights/` |
| Agent score <4.0 (3x) | MUSE | RoPE proposal | `evolution/_decisions.md` |
| Agent score >9.0 (3x) | MUSE | Success pattern | `insights/_patterns.md` |

## 2. How to Capture

### Step 1: Agent Self-Score
After completing their portion of a task, each agent fills their SELF-SCORE:
```
CORRECTNESS (0-10): {score}
QUALITY (0-10): {score}
EFFICIENCY (0-10): {score}
LEARNING (0-10): {score}
TOTAL: (C×4 + Q×3 + E×2 + L×1) / 10 = {score}
BLOCKERS: {list or "None"}
```

### Step 2: MUSE Collection
MUSE collects all agent self-scores and evaluates independently:
- Read all outputs produced by agents in this task
- Score each agent using the MUSE rubric (see MUSE AGENT.md)
- Calculate final score: `(Self × 0.3) + (MUSE × 0.7)`

### Step 3: Trajectory Writing
MUSE writes the trajectory using `templates/trajectory.md`:
- File: `experience-library/trajectories/traj-{date}-{slug}.md`
- Update: `experience-library/trajectories/_index.md`

### Step 4: Scorecard Update
MUSE updates each involved agent's scorecard:
- File: `experience-library/scorecards/agent-{name}.md`
- Update: `experience-library/scorecards/_summary.md`

### Step 5: Insight Extraction (if applicable)
If the task revealed new patterns or anti-patterns:
- Write insight: `experience-library/insights/ins-{topic}.md`
- Update patterns: `experience-library/insights/_patterns.md`

## 3. Quality Standards for Captures

### DO
- Be specific — include file names, error messages, exact commands
- Use evidence — link to specific outputs or build results
- Be honest — low scores are valuable learning data
- Be constructive — "Agent X caused rework because Y" not "Agent X was bad"

### DON'T
- Don't inflate scores — 7 is the baseline for competent work
- Don't skip capture for "small" tasks — XS tasks still get trajectories
- Don't write vague insights — "be careful" is not an insight
- Don't blame external factors without evidence

## 4. Experience Lookup Protocol (Before Starting)

Every agent MUST, before starting work:
1. Open `experience-library/trajectories/_index.md`
2. Search (Ctrl+F) for: module name, task type, similar keywords
3. If match found → read the trajectory for context
4. Check `insights/_patterns.md` for relevant patterns
5. Check own scorecard for areas to focus on

## 5. Retention & Cleanup

- **Trajectories:** Keep ALL (never delete — they're learning data)
- **Scorecards:** Keep ALL entries, summarize quarterly
- **Insights:** Review monthly, merge redundant entries
- **Evolution log:** Keep ALL (historical record of prompt changes)

---

*SOP version 1.0 | Effective: 2026-04-14 | Owner: MUSE*
