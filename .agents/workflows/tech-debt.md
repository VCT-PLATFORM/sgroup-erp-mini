---
description: Technical debt identification, prioritization, and systematic reduction for SGROUP ERP
---

# Tech Debt Management Workflow

Quy trình nhận diện, ưu tiên, và trả nợ kỹ thuật một cách có hệ thống.

## When to Trigger
- Sprint retrospective identifies tech debt issues
- Code review phát hiện patterns xấu lặp lại
- Performance degradation do legacy code
- Difficulty adding new features (code rigidity)
- Quarterly tech debt assessment

## Steps

1. **Identify Tech Debt**
   - Sources of tech debt:
     | Type | Description | Example |
     |------|-----------|---------|
     | Code | Poor patterns, duplicates, `any` types | Untyped API responses |
     | Architecture | Wrong abstractions, tight coupling | Circular dependencies |
     | Testing | Missing tests, flaky tests | 0% coverage on module |
     | Documentation | Outdated/missing docs | Stale README, no API docs |
     | Dependencies | Outdated packages, CVEs | NestJS 2 major versions behind |
     | Infrastructure | Manual processes, no CI/CD | Manual deployments |
   - Collect from:
     - [ ] Code review findings
     - [ ] Retrospective action items
     - [ ] `// TODO` and `// HACK` comments
     - [ ] `npm audit` warnings
     - [ ] Recurring bugs in same area

2. **Document Tech Debt Items**
   ```markdown
   ## TD-[NNN]: [Title]
   **Type**: Code | Architecture | Testing | Dependency | Infrastructure
   **Module**: [affected module]
   **Created**: [date]
   **Reporter**: [name]
   
   ### Current State
   [What the problem is today]
   
   ### Impact
   [How it affects development / quality / performance]
   
   ### Proposed Solution
   [How to fix it]
   
   ### Effort Estimate
   [Story points or hours]
   ```

3. **Assess & Prioritize**
   - Score each item:
     | Factor | Low (1) | Medium (2) | High (3) |
     |--------|---------|-----------|----------|
     | **Impact** on dev speed | Minimal | Noticeable | Significant |
     | **Risk** of not fixing | Can live with | Occasional issues | Blocking |
     | **Effort** to fix | > 1 sprint | 1-3 days | < 1 day |
     | **Frequency** of encounter | Rarely | Weekly | Daily |
   
   - Priority = (Impact + Risk + Frequency) / Effort
   - Quick wins (high priority, low effort) first

4. **Allocate Sprint Capacity**
   - **Rule of thumb**: 20% of sprint capacity for tech debt
   - Example sprint allocation:
     ```
     Sprint capacity: 40 SP
     ├── Features: 32 SP (80%)
     └── Tech debt: 8 SP (20%)
     ```
   - Tech debt items appear in sprint as regular stories
   - PO approves balance between features and debt

5. **Execute Improvements**
   - Follow `/feature-development` workflow for each item
   - Best practices:
     - [ ] One refactoring per PR (don't mix with features)
     - [ ] Add/update tests before refactoring
     - [ ] Use IDE refactoring tools (rename, extract, inline)
     - [ ] Boy Scout Rule: leave code cleaner than you found it
   - Common refactoring patterns:
     | Pattern | When |
     |---------|------|
     | Extract function/component | Function > 50 lines |
     | Replace `any` with proper type | TypeScript debt |
     | Add error boundaries | Missing error handling |
     | Remove dead code | Unused imports/functions |
     | Add indexes | Slow database queries |
     | Update dependencies | `npm outdated` list |

6. **Scan & Measure**
   // turbo
   - Find TODOs: `findstr /s /r "TODO\|HACK\|FIXME" "d:\SGROUP ERP FULL\sgroup-erp-backend\src\**\*.ts"`
   // turbo
   - Check outdated deps: `cd sgroup-erp-backend && npm outdated`
   // turbo
   - Security audit: `cd sgroup-erp-backend && npm audit`
   // turbo
   - Type check: `cd sgroup-erp-backend && npx tsc --noEmit`

7. **Track Progress**
   | Metric | Current | Target | Trend |
   |--------|---------|--------|-------|
   | TODO/HACK comments | [N] | Decreasing | ↓ |
   | npm audit issues | [N] | 0 critical | ↓ |
   | Test coverage | [%] | ≥ 80% (services) | ↑ |
   | TypeScript `any` usage | [N] | 0 | ↓ |
   | Outdated dependencies | [N] | ≤ 5 | ↓ |
   | Tech debt items (open) | [N] | Decreasing | ↓ |

8. **Quarterly Review**
   - Review tech debt backlog
   - Archive completed items
   - Re-prioritize remaining items
   - Celebrate improvements 🎉
   - Share learnings → `/knowledge-sharing`

## Next Workflow
→ `/feature-development` for implementing fixes
→ `/code-review` for reviewing refactored code
→ `/retrospective` to discuss tech debt trends
