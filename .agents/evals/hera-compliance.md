# HERA Compliance Evaluation — Agent Team Health Check

> Use this checklist to evaluate whether the agent team is operating according to HERA V4 protocol.
> Run this eval monthly or after each module completion.

## 1. Orchestration Layer (JAVIS)

- [ ] JAVIS uses 3-Signal Classification for every task dispatch
  - [ ] Keyword signal checked
  - [ ] Complexity signal assessed (T-shirt sized)
  - [ ] Experience Library consulted for similar past tasks
- [ ] DAG is constructed per task (not default linear pipeline)
- [ ] Parallel opportunities are exploited where dependencies allow
- [ ] Tiered activation applied (not all 14 agents for XS/S tasks)
- [ ] MUSE is ALWAYS triggered post-completion

## 2. Experience Library Health

- [ ] `trajectories/_index.md` is up to date (no missing entries)
- [ ] `scorecards/_summary.md` reflects recent task scores
- [ ] Each active agent has a scorecard in `scorecards/`
- [ ] `insights/_patterns.md` has been updated in last 10 tasks
- [ ] `evolution/_decisions.md` log is current
- [ ] No orphaned trajectory files (all indexed)

## 3. Agent Self-Scoring

- [ ] ALL agents that participated in tasks have self-scored
- [ ] Self-scores are realistic (not all 10s, not all 5s)
- [ ] MUSE scores are independent of self-scores
- [ ] Final scores are correctly weighted: (Self×0.3 + MUSE×0.7)

## 4. Credit Assignment

- [ ] MUSE assigns credit to EACH agent in every trajectory
- [ ] Credits are evidence-based (linked to specific outputs)
- [ ] Both positive and negative credits are assigned fairly
- [ ] Credit distribution is not biased toward/against any agent

## 5. RoPE (Prompt Evolution)

- [ ] Agents below threshold have been flagged
- [ ] RoPE proposals exist for underperforming agents
- [ ] Proposals are evidence-based (linked to trajectories)
- [ ] Applied evolutions are tracked with before/after scores
- [ ] No agent AGENT.md has exceeded 150 lines (anti-bloat)
- [ ] Evolution decisions are logged in `evolution/_decisions.md`

## 6. Quality Metrics

| Metric | Target | Actual | Status |
|--------|:------:|:------:|:------:|
| Team average score | ≥ 7.0 | {actual} | {🟢/🟡/🔴} |
| Agents below 6.0 | 0 | {count} | {🟢/🟡/🔴} |
| Trajectory capture rate | 100% | {%} | {🟢/🟡/🔴} |
| Experience lookup rate | ≥ 80% | {%} | {🟢/🟡/🔴} |
| RoPE response time | ≤ 3 tasks | {avg} | {🟢/🟡/🔴} |
| Repeat errors (same insight) | 0 | {count} | {🟢/🟡/🔴} |

## 7. Compliance Score

Calculate: (passed checks / total checks) × 100
- **≥ 90%** — 🟢 HERA protocol fully operational
- **70-89%** — 🟡 Operational with gaps — address within 5 tasks
- **50-69%** — 🟠 Significant gaps — immediate attention required
- **< 50%** — 🔴 HERA protocol not followed — escalate to Chairman

---

*Eval version 1.0 | Created: 2026-04-14*
