---
name: Project Manager
description: Sprint planning, risk management, timeline estimation, and stakeholder reporting for SGROUP ERP
---

# Project Manager Skill — SGROUP ERP

## Role Overview
The PM plans, executes, and delivers SGROUP ERP projects on time and within budget, managing risks, resources, and stakeholder expectations.

## Core Frameworks

### 1. Sprint Planning & Execution

#### Sprint Structure (2-week)
```
Day 1:  Sprint Planning (2-4h)
Day 2-9: Development & daily standups (15min)
Day 10: Code freeze, testing
Day 11: Sprint Review (1h) + Sprint Retrospective (1h)
Day 12: Buffer / tech debt / planning next sprint
```

#### Sprint Planning Checklist
- [ ] Sprint goal defined and agreed
- [ ] Stories refined and estimated
- [ ] Total story points ≤ team velocity
- [ ] Dependencies identified and resolved
- [ ] Each story has an owner
- [ ] Definition of Done reviewed

#### Velocity Tracking
```markdown
| Sprint | Committed | Completed | Velocity | Notes |
|--------|-----------|-----------|----------|-------|
| S1 | 34 | 30 | 30 | New team member onboarding |
| S2 | 32 | 32 | 32 | |
| S3 | 35 | 28 | 28 | Blocked by infra issue |
| S4 | 30 | 31 | 31 | |
| **Average** | | | **30.25** | |
```

### 2. Risk Management

#### Risk Matrix
```
Impact →    Low         Medium       High       Critical
Likelihood
┌──────────┬──────────┬──────────┬──────────┐
│ Very High│ Medium   │ High     │ Critical │ Critical │
├──────────┼──────────┼──────────┼──────────┤
│ High     │ Low      │ Medium   │ High     │ Critical │
├──────────┼──────────┼──────────┼──────────┤
│ Medium   │ Low      │ Medium   │ Medium   │ High     │
├──────────┼──────────┼──────────┼──────────┤
│ Low      │ Low      │ Low      │ Medium   │ Medium   │
└──────────┴──────────┴──────────┴──────────┘
```

#### Risk Register Template
| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner | Status |
|----|------|-----------|--------|-------|------------|-------|--------|
| R1 | Key developer leaves | Medium | High | High | Knowledge sharing, docs | PM | Active |
| R2 | Scope creep | High | Medium | High | Strict change process | PO | Active |
| R3 | Third-party API changes | Low | High | Medium | Abstraction layer | SA | Monitor |

### 3. Timeline Estimation (PERT)
```
Estimated Duration = (Optimistic + 4×Most Likely + Pessimistic) / 6

Example:
Feature "AI Dashboard"
- Optimistic: 5 days
- Most Likely: 8 days
- Pessimistic: 15 days
- PERT Estimate: (5 + 4×8 + 15) / 6 = 8.7 days
```

#### Gantt Chart Structure
```
Phase 1: Foundation (Weeks 1-4)
  ├── Database schema design     [W1-W2] ████████
  ├── Auth module                [W2-W3]     ████████
  └── Core API endpoints        [W3-W4]         ████████

Phase 2: Features (Weeks 5-10)
  ├── Sales module               [W5-W7] ████████████
  ├── Planning module            [W7-W9]         ████████████
  └── Reporting module           [W9-W10]                ████████

Phase 3: Polish (Weeks 11-12)
  ├── Performance optimization   [W11]   ████
  ├── UAT & bug fixes           [W11-W12] ████████
  └── Deployment                [W12]            ████
```

### 4. Status Reporting

#### Weekly Status Report Template
```markdown
## Sprint S{N} — Tuần {DD/MM} → {DD/MM}

### 🟢 Overall Status: On Track / 🟡 At Risk / 🔴 Off Track

### Progress
- Sprint velocity: {completed}/{committed} points ({percent}%)
- Stories completed: {N}/{M}
- Bugs resolved: {N} (P0: {x}, P1: {y})

### Key Accomplishments
1. [Feature/milestone completed]
2. [Feature/milestone completed]

### Blockers & Risks
| Issue | Impact | Action | Owner | ETA |
|-------|--------|--------|-------|-----|

### Next Week Plan
1. [Planned work]
2. [Planned work]

### Resource Needs
- [Any additional resources needed]
```

### 5. Resource & Capacity Planning

#### Capacity Calculator
```
Team Capacity = Team Size × Sprint Days × Focus Factor

Focus Factor:
- New team: 0.5-0.6
- Established team: 0.7-0.8
- Mature team: 0.8-0.9

Example: 6 devs × 10 days × 0.7 = 42 ideal days
```

#### RACI Matrix
| Activity | PO | PM | TL | Dev | QA | DevOps |
|----------|----|----|----|----|----|----|
| Requirements | A | C | C | I | I | I |
| Sprint Planning | A | R | C | C | C | I |
| Development | I | I | A | R | I | I |
| Code Review | I | I | A | R | I | I |
| Testing | I | I | C | C | R | I |
| Deployment | I | R | C | I | I | A |
| Monitoring | I | R | C | I | I | A |

*R=Responsible, A=Accountable, C=Consulted, I=Informed*

### 6. Budget Management

#### Cost Tracking
| Category | Budgeted | Actual | Variance | Notes |
|----------|----------|--------|----------|-------|
| Personnel | $X | $Y | +/-% | |
| Infrastructure | $X | $Y | +/-% | AWS/GCP costs |
| Tools/Licenses | $X | $Y | +/-% | |
| Training | $X | $Y | +/-% | |
| **Total** | **$X** | **$Y** | **+/-% **| |

### 7. Change Management

#### Change Request Process
1. Change Request submitted (CR form)
2. Impact analysis (effort, timeline, cost, risk)
3. PO prioritization decision
4. Stakeholder approval (if scope/budget/timeline affected)
5. Backlog updated, team informed
6. Change tracked in CR log

#### CR Template
| Field | Value |
|-------|-------|
| CR ID | CR-{NNN} |
| Requested by | {Name} |
| Description | {What changed} |
| Justification | {Why} |
| Impact | Effort: {SP}, Timeline: {days}, Cost: {$} |
| Decision | Approved / Deferred / Rejected |
