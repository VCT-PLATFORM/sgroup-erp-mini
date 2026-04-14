# HERA Protocol — Master Reference (V4)

> Core protocol document for the HERA (Hierarchical Evolution) agent architecture.
> ALL agents MUST read this document. JAVIS uses it for dispatch. MUSE uses it for evaluation.

## 1. Three-Signal Classification

JAVIS classifies every incoming task using 3 signals before dispatching:

### Signal 1: Keyword Matching (from ROUTING.md)
Traditional keyword → agent mapping. Still useful for clear-cut tasks.
Example: "React component" → FIONA, "Go API handler" → BRIAN

### Signal 2: Complexity Assessment (T-Shirt Sizing)
| Size | Criteria | Max Agents | Example |
|------|----------|:----------:|---------|
| **XS** | Single file, <20 lines change, no cross-module impact | 1-2 | Fix typo, update config, add field |
| **S** | Single concern, 1 module, <3 files | 2-3 | Add API endpoint, new component |
| **M** | Multi-file, may cross layers (API+UI), 1 module | 3-5 | New feature with backend + frontend |
| **L** | Full-stack, multiple modules, needs spec | 6-10 | New feature with BA spec → full pipeline |
| **XL** | New module, architectural impact | 10-14 | Build entire module from scratch |

### Signal 3: Experience Lookup
Search `experience-library/trajectories/_index.md` for similar past tasks.
- **Match found + Success**: Reuse the same DAG template and agent sequence
- **Match found + Failure**: Avoid the failed approach, route differently
- **No match**: Use default DAG template for the complexity level

## 2. DAG (Directed Acyclic Graph) Execution Plans

Instead of a fixed pipeline, JAVIS constructs a task-specific DAG:

### DAG Construction Rules
1. **Identify required agents** based on task requirements (not all agents needed)
2. **Determine dependencies** — which agents depend on output from others
3. **Parallelize independent steps** — agents without dependencies run concurrently
4. **Always end with MUSE** — every DAG terminates with MUSE evaluation

### DAG Template Catalog
See `shared/dag-templates.md` for pre-built DAG templates per complexity level.

## 3. Credit Assignment Algorithm

After task completion, MUSE assigns credit using this protocol:

### Step 1: Map Agent Contributions
For each agent in the DAG, categorize their contribution:
- **Primary (+2)**: Agent whose output was the main deliverable
- **Supporting (+1)**: Agent whose output enabled/enhanced the deliverable
- **Neutral (0)**: Agent participated but neither helped nor hindered
- **Blocking (-1)**: Agent whose output required rework or caused delays
- **Critical Block (-2)**: Agent whose failure caused task failure

### Step 2: Evidence Collection
Each credit must be backed by specific evidence:
- Build pass/fail → attribute to code agents
- Spec completeness → attribute to BA agents
- Security gaps → attribute to Sentry
- Test coverage → attribute to Quinn

### Step 3: Score Aggregation
Agent's task score = (Self-Score × 0.3) + (MUSE Score × 0.7)
Rolling average = last 10 tasks weighted (recent = higher weight)

## 4. RoPE (Role-Aware Prompt Evolution)

### Trigger Conditions
| Condition | Action |
|-----------|--------|
| Agent score < 4.0 for 3 consecutive tasks | MANDATORY prompt revision |
| Agent score < 6.0 for 5 consecutive tasks | Prompt review recommended |
| New anti-pattern discovered affecting agent | Prompt update to prevent recurrence |
| Agent excels (>9.0 for 3 tasks) | Capture winning patterns into prompt |
| Chairman directive | Immediate prompt revision |

### Evolution Process
1. MUSE identifies the trigger and root cause
2. MUSE proposes specific prompt changes
3. JAVIS reviews and approves the proposal
4. Changes applied to agent's AGENT.md
5. Logged in `experience-library/evolution/_decisions.md`
6. Agent's EVOLUTION LOG section updated
7. Effectiveness measured over next 3 tasks

### What CAN Be Evolved
- ✅ Standards and rules (add/refine/remove)
- ✅ Examples and patterns
- ✅ Self-check items
- ✅ Workflow sequences
- ✅ Domain context

### What CANNOT Be Evolved
- ❌ Agent's core role and job description
- ❌ File ownership boundaries
- ❌ Security/financial mandatory rules
- ❌ Tech stack decisions (require ADR)

## 5. Tiered Activation

Not every task needs all 14 agents. JAVIS activates only what's needed:

### Tier 1: Always Active
- **JAVIS** (orchestrator) — dispatches every task
- **MUSE** (evaluator) — evaluates every task

### Tier 2: Activated by Task Type
- **BA Team** (Bella/Diana/Oscar/Marco) — when spec/analysis needed
- **Code Team** (Fiona/Brian/Jenny/Nova) — when code changes needed
- **Support Team** (Atlas/Quinn/Sentry/Iris) — when infra/test/auth/integration needed

### Tier 3: Activated by Complexity
| Complexity | Minimum Activation |
|------------|-------------------|
| XS | 1 domain agent + MUSE |
| S | 1-2 domain agents + MUSE |
| M | BA lead + 2-3 code agents + MUSE |
| L | Full BA + full code + Quinn + MUSE |
| XL | All 14 agents |

## 6. Experience Library Schema

### Trajectory Entry (per task)
```markdown
# Trajectory: {task-name}
Date: {YYYY-MM-DD}
Complexity: {XS/S/M/L/XL}
Module(s): {affected modules}
Requester: {Chairman / System / Agent}

## Execution DAG
{agent1} → {agent2} → {agent3} → MUSE

## Agent Contributions
| Agent | Role in Task | Self-Score | MUSE Score | Credit |
|-------|-------------|:----------:|:----------:|:------:|

## Outcome
Status: {✅ Success / ❌ Failure / ⚠️ Partial}
Build: {Pass / Fail}
Quality Score: {0-10}

## Insights
- What worked: ...
- What failed: ...
- New patterns: ...
```

---

*Protocol version: V4.0 | Effective: 2026-04-14 | Owner: JAVIS + MUSE*
