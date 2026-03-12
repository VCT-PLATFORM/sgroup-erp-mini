---
name: Tech Lead
description: Architecture decisions, code review leadership, mentoring, and technical debt management for SGROUP ERP
---

# Tech Lead Skill — SGROUP ERP

## Role Overview
The Tech Lead makes day-to-day architecture decisions, leads code review, mentors developers, and ensures code quality and technical standards across SGROUP ERP.

## Core Responsibilities

### 1. Code Architecture Decisions

#### Component Design Principles
```
1. Single Responsibility — One reason to change per module
2. Open/Closed — Open for extension, closed for modification
3. Dependency Inversion — Depend on abstractions, not concretions
4. DRY — Don't Repeat Yourself (but don't over-abstract)
5. KISS — Keep It Simple, Stupid
```

#### When to Create a Shared Component
```
                  Used once?     → Keep in feature module
                  Used 2 times?  → Consider extracting
                  Used 3+ times? → Extract to shared/
```

#### Module Dependency Rules
```
✅ Allowed:
features/* → shared/*
features/* → core/*
shared/* → core/*
modules/* → common/*
modules/* → prisma/*

❌ Not Allowed:
shared/* → features/*     (no upward dependency)
features/A → features/B   (no cross-feature)
core/* → features/*       (core must be independent)
```

### 2. Code Review Leadership

#### Review Priority
| Priority | Max Review Time | Reviewer |
|----------|----------------|----------|
| P0 (hotfix) | 1 hour | Tech Lead |
| P1 (feature) | 4 hours | Any senior |
| P2 (refactor) | 1 day | Any developer |
| P3 (docs/style) | 2 days | Any developer |

#### Review Depth by File Type
| File Type | Focus Areas |
|-----------|-------------|
| `.service.ts` | Business logic, error handling, N+1 queries |
| `.controller.ts` | Input validation, auth guards, response format |
| `.tsx` (screen) | Component structure, performance, accessibility |
| `.tsx` (component) | Reusability, props interface, styling |
| `schema.prisma` | Naming, indexes, relations, data integrity |
| `*.test.ts` | Coverage, edge cases, meaningful assertions |

### 3. Technical Debt Tracking

#### Debt Classification
| Level | Description | Action | Example |
|-------|------------|--------|---------|
| 🔴 Critical | Security risk or data loss | Fix this sprint | SQL injection, exposed secrets |
| 🟡 High | Performance impact or maintainability | Fix within 2 sprints | N+1 queries, god components |
| 🟢 Medium | Code smell, could be better | Schedule in backlog | Inconsistent naming, missing types |
| ⚪ Low | Nice to have | When convenient | Comments, minor style issues |

### 4. Developer Mentoring

#### Pair Programming Sessions
```
Weekly Schedule:
Mon: Junior + Senior pairing (feature work)
Wed: Code architecture walkthrough
Fri: Knowledge sharing / tech talks (30min)
```

#### Growth Framework
| Level | Technical | Should Learn Next |
|-------|----------|------------------|
| Junior | React basics, simple CRUD | TypeScript advanced, testing, Zustand |
| Mid | Full-stack, testing, state mgmt | System design, performance optimization |
| Senior | Architecture, optimization, mentoring | Team leadership, cross-system design |

### 5. PR Process Standards

#### PR Template
```markdown
## What
Brief description of what this PR does.

## Why
Link to ticket/issue. Business context.

## How
Technical approach and key decisions.

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] Edge cases considered

## Screenshots (if UI change)
Before | After

## Checklist
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] No `any` types added
- [ ] Error handling for all async operations
- [ ] No console.log in production code
```

### 6. Performance Standards

#### Frontend Performance Budget
| Metric | Budget | Tool |
|--------|--------|------|
| JS Bundle Size | < 500KB gzipped | `expo export` |
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| List Render (100 items) | < 16ms/frame | React DevTools |
| Memory Usage | < 150MB | Device monitor |

#### Backend Performance Budget
| Metric | Budget | Tool |
|--------|--------|------|
| API Response (p50) | < 100ms | Application logs |
| API Response (p95) | < 500ms | Application logs |
| Database Query | < 50ms | Prisma query logs |
| Memory Usage | < 512MB | Process monitor |

### 7. Incident Response

#### Severity Levels
| Severity | Definition | Response Time | Escalation |
|----------|-----------|--------------|------------|
| SEV-1 | System down, data loss | 15 min | CTO, all devs |
| SEV-2 | Major feature broken | 1 hour | Tech Lead, team |
| SEV-3 | Minor bug, workaround exists | 4 hours | Assigned dev |
| SEV-4 | Cosmetic issue | Next sprint | Backlog |

#### Post-Mortem Template
```markdown
## Incident: {Title}
**Date**: {YYYY-MM-DD}  **Severity**: SEV-{N}
**Duration**: {start} → {resolved} ({total time})

### Summary
What happened, in 2-3 sentences.

### Root Cause
The underlying technical cause.

### Timeline
| Time | Event |
|------|-------|
| HH:MM | Issue detected |
| HH:MM | Investigation started |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |

### Action Items
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Add monitoring for X | DevOps | 1 week |
| 2 | Add test for edge case | Dev | This sprint |

### Lessons Learned
What we will do differently to prevent this.
```
