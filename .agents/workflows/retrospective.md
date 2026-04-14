---
description: How to run a post-mortem or retrospective to auto-learn and update the system after completing a milestone.
---

# Agent Retrospective & Optimization Flow (HERA V4 Enhanced)

Run this workflow periodically, after major milestones, or every 10 tasks to allow the Agent team to self-evaluate, evolve prompts, and upgrade collective intelligence.

## Prerequisites
- A completed module or solved incident.
- Terminal logs or an associated `walkthrough.md`.
- MUSE scorecards and trajectories from the period under review.

## Steps

### 1. Data Collection (MUSE)
   - Pull all trajectories from `experience-library/trajectories/` for the review period.
   - Pull agent scorecards from `experience-library/scorecards/_summary.md`.
   - Pull insights from `experience-library/insights/_patterns.md`.
   - Calculate rolling score averages for each agent.

### 2. Analyze — The "Look-back" (JAVIS + MUSE)
   - Javis reads the git log and recent artifacts (`walkthrough.md`, `task.md`).
   - MUSE presents scoring data: team average, individual scores, trends.
   - Identify agents with declining scores (📉 trend).
   - Identify agents with consistently high scores (📈 excellence).
   - Sift through error patterns and recurrent issues.

### 3. Diagnose — The Post-Mortem (JAVIS)
   - Javis drafts a Post-Mortem using `templates/post-mortem.md`.
   - Root cause analysis for any friction (e.g., outdated tool, misaligned prompt, lack of type-checking).
   - Categorize issues: Agent-caused vs External vs Systemic.

### 4. Evolve — Prompt Evolution (MUSE → JAVIS)
   Based on the diagnosis:
   
   **a. RoPE Triggers (automatic):**
   - Agent score < 4.0 for 3+ tasks → MANDATORY prompt revision
   - Agent score < 6.0 for 5+ tasks → Prompt review recommended
   - Repeated error pattern → Add preventive rule
   
   **b. Excellence Capture (manual):**
   - Agent score > 9.0 consistently → Capture winning patterns into their prompt
   - New efficient workflow discovered → Update DAG templates
   
   **c. System Updates:**
   - MUSE writes evolution proposals to `experience-library/evolution/_decisions.md`
   - JAVIS reviews and applies approved changes to agent AGENT.md files
   - Update SOPs in `.agents/sop/` if process issues found
   - Update DAG templates in `shared/dag-templates.md` if routing issues found

### 5. Insight Consolidation (BELLA + MUSE)
   - Review `insights/` for redundant entries → merge
   - Review `_patterns.md` for outdated patterns → archive or update
   - Cross-reference domain specs with new insights → update if needed

### 6. Review & Save (Chairman)
   - Present identified upgrades to the Chairman.
   - Show before/after scoring data to demonstrate improvement.
   - Once approved, git commit with `docs(hera): retrospective — evolution cycle {N}`.

### 7. Measure (MUSE — post-retrospective)
   - Track the next 5-10 tasks after evolution.
   - Compare scores before and after prompt changes.
   - Log results in the relevant EVO decision entries.
   - If evolution worsened performance → rollback per `sop/prompt-evolution.md`.

## Retrospective Output Artifacts
- Post-mortem document (if incident)
- Updated agent AGENT.md files (if RoPE triggered)
- Updated `experience-library/evolution/_decisions.md`
- Updated `experience-library/insights/_patterns.md`
- Updated scorecards with retrospective notes

## Cadence
| Trigger | When |
|---------|------|
| Module completion | After every module passes Definition-of-Done |
| Every 10 tasks | Periodic health check |
| P0 incident | Immediate post-mortem |
| Chairman request | On-demand |
