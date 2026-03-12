---
name: Scrum Master
description: Agile ceremonies facilitation, team coaching, impediment removal, and continuous improvement for SGROUP ERP
---

# Scrum Master Skill — SGROUP ERP

## Role Overview
The Scrum Master facilitates Agile ceremonies, coaches the team toward self-organization, removes impediments, and drives continuous improvement.

## Agile Ceremonies

### 1. Daily Standup (15 minutes)

#### Format
Each team member answers:
1. **Hôm qua** tôi đã làm gì?
2. **Hôm nay** tôi sẽ làm gì?
3. Có **blocker** nào không?

#### Rules
- Timebox: 15 minutes strict
- Same time, same place daily
- Stand up (creates urgency)
- Talk to the team, not the SM
- Park deep-dives for after standup

#### Anti-Patterns to Watch
| ❌ Anti-Pattern | ✅ Better |
|---|---|
| Status reporting to SM | Peer-to-peer sync |
| > 15 minutes | Timebox strictly, take offline |
| Problem-solving in standup | "Let's discuss after standup" |
| Missing members | Async update required |

### 2. Sprint Planning (2-4 hours)

#### Agenda
```
Part 1: WHAT (1-2h) — led by PO
├── Sprint Goal definition
├── Review prioritized backlog
└── Select stories for sprint

Part 2: HOW (1-2h) — led by Dev team
├── Break stories into tasks
├── Identify dependencies
├── Estimate tasks
└── Confirm capacity vs commitment
```

#### Sprint Goal Template
```
"Trong sprint này, chúng ta sẽ [mục tiêu chính]
để [giá trị mang lại cho user/business].
Thành công được đo bằng [tiêu chí cụ thể]."
```

### 3. Sprint Review / Demo (1 hour)

#### Agenda
```
1. Sprint Goal recap (2 min)
2. Demo completed features (30 min)
   - Each developer demos their work
   - Stakeholder Q&A after each demo
3. Metrics review (10 min)
   - Velocity, burndown
   - Sprint goals met/missed
4. Feedback & discussion (15 min)
5. Backlog adjustment (5 min)
```

### 4. Sprint Retrospective (1 hour)

#### Formats (rotate)

**Format 1: Start-Stop-Continue**
| 🟢 Start | 🔴 Stop | 🔵 Continue |
|-----------|---------|-------------|
| Pair programming | Skipping code review | Daily standups |
| Writing tests first | Late deployments | Sprint demos |

**Format 2: 4Ls**
| Liked ❤️ | Learned 📚 | Lacked 😤 | Longed For 🌟 |
|----------|-----------|----------|--------------|
| Team collaboration | New testing patterns | Documentation | CI/CD pipeline |

**Format 3: Sailboat** ⛵
```
🏝️ Island (Goal): What are we trying to reach?
💨 Wind (Helps): What is pushing us forward?
⚓ Anchor (Blocks): What is holding us back?
🪨 Rocks (Risks): What dangers lie ahead?
```

#### Action Items Template
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Set up automated testing | TL | Next sprint | Open |
| 2 | Create deployment checklist | DevOps | This week | Done |

### 5. Backlog Refinement (1 hour/week)

#### Process
1. PO presents upcoming stories
2. Team asks clarifying questions
3. Acceptance criteria reviewed/added
4. Stories estimated (Planning Poker)
5. Stories broken down if too large (> 8 SP)

## Agile Metrics

### Velocity Chart
```
Sprint:    S1    S2    S3    S4    S5    S6
Points:    25    28    32    30    35    33
           ▓▓▓   ▓▓▓   ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓ ▓▓▓▓
Average: 30.5 points/sprint
```

### Key Metrics Dashboard
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Velocity | 30 SP | 35 SP | ↑ |
| Sprint Goal Achievement | 80% | 90% | ↑ |
| Lead Time | 8 days | 5 days | ↓ |
| Cycle Time | 3 days | 2 days | ↓ |
| WIP (Work in Progress) | 8 | ≤ 6 | → |
| Bug Escape Rate | 5% | < 3% | ↓ |
| Team Happiness | 7/10 | ≥ 8/10 | ↑ |

### Burndown Chart Reading
```
Ideal:    ───────────────────
                              ╲
Actual:   ──────╲              ╲
                  ──────╲       ╲
                         ─────── (end)

Green: Actual follows ideal line
Yellow: Deviation < 20%
Red: Deviation > 20% or flat line (blocked)
```

## Team Health

### Team Health Check (quarterly)
Rate 1-5 and discuss:
1. **Delivering Value** — Are we building the right thing?
2. **Speed** — Are we delivering fast enough?
3. **Quality** — Are we proud of our code?
4. **Fun** — Do we enjoy our work?
5. **Learning** — Are we growing?
6. **Mission** — Do we understand why?
7. **Teamwork** — Do we help each other?
8. **Support** — Do we get what we need?

### Impediment Tracking
| ID | Impediment | Raised | Impact | Action | Owner | Resolved |
|----|-----------|--------|--------|--------|-------|----------|
| IMP-1 | Slow CI pipeline | S3 | Dev velocity | Upgrade runners | DevOps | S4 |
| IMP-2 | Missing design specs | S3 | Story readiness | Weekly design sync | UX | Open |

## Coaching Patterns

### For New Teams
- Focus on ceremony discipline first
- Introduce one practice at a time
- Celebrate small wins
- Shield team from external disruptions

### For Mature Teams
- Encourage self-facilitation of ceremonies
- Introduce advanced practices (mob programming, TDD)
- Focus on metrics-driven improvement
- Enable cross-team collaboration
