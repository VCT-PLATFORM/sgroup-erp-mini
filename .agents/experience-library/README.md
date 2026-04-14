# SGROUP ERP — Experience Library (HERA V4)

> **MANDATORY DIRECTIVE FOR ALL AGENTS:**
> Before starting ANY task, you MUST search this `experience-library` for past trajectories related to your work.
> After completing ANY task, you MUST capture the experience here via the trajectory template.

## What is this?

The Experience Library is the **collective intelligence persistence layer** for the HERA agent team. Unlike the old knowledge-base (static, manual), this system is **experience-driven** — it captures full execution trajectories, agent performance data, and distilled patterns to enable continuous evolution.

> _"An experience uncaptured is a lesson lost. An experience indexed is a team leveled up."_

## Architecture (3 + 1 layers)

```
experience-library/
│
├── trajectories/                ← WHAT HAPPENED (Full execution traces)
│   ├── _index.md               ← Searchable master index
│   └── traj-{YYYY-MM-DD}-{task-slug}.md
│
├── scorecards/                  ← HOW WELL (Agent performance data)
│   ├── _summary.md             ← Team performance dashboard
│   └── agent-{name}.md         ← Per-agent score history
│
├── insights/                    ← WHY IT MATTERS (Distilled lessons)
│   ├── _patterns.md            ← Cross-cutting patterns & anti-patterns
│   └── ins-{topic}.md          ← Specific insight with context
│
└── evolution/                   ← HOW WE GROW (Prompt evolution history)
    ├── _decisions.md           ← Why prompts were changed (ADR-style)
    └── evo-{agent}-history.md  ← Each agent's prompt changelog
```

## How to Use

### Before Starting a Task (ALL agents)
1. **Search `trajectories/_index.md`** for similar past tasks
2. **Read relevant trajectory** to learn what worked/failed
3. **Check `insights/`** for known pitfalls in your domain
4. **Check your scorecard** in `scorecards/agent-{your-name}.md` for areas to improve

### After Completing a Task (ALL agents)
1. **Self-Score** using the SELF-SCORE rubric in your AGENT.md
2. **Report scores** to MUSE (Evaluator Agent)
3. **MUSE captures** full trajectory + assigns credit

### When to Write Insights (MUSE + domain agents)
- Bug fought for >3 attempts → MUST write insight
- New pattern discovered → SHOULD write insight
- Cross-module gotcha found → MUST write insight

## Naming Conventions
- **Trajectories:** `traj-YYYY-MM-DD-{task-slug}.md` (e.g., `traj-2026-04-14-hr-payroll-api.md`)
- **Scorecards:** `agent-{name}.md` (e.g., `agent-brian.md`)
- **Insights:** `ins-{topic}-{context}.md` (e.g., `ins-golang-decimal-precision.md`)
- **Evolution:** `evo-{agent}-history.md` (e.g., `evo-javis-history.md`)

## Migration from Knowledge Base
The legacy `knowledge-base/` files have been migrated here:
- `kb-module-placement.md` → `insights/ins-module-placement.md`
- `kb-monorepo.md` → `insights/ins-monorepo-structure.md`

## Ownership
- **MUSE** owns trajectory capture and credit assignment
- **JAVIS** owns experience lookup during task planning
- **BELLA** curates cross-module insights
- **Each agent** owns their own scorecard self-reporting
