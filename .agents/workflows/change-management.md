---
description: Change request evaluation, impact analysis, approval, and implementation tracking
---

# Change Management Workflow

Quy trình đánh giá, phê duyệt và thực thi change request — đảm bảo thay đổi có kiểm soát.

## When to Trigger
- Yêu cầu thay đổi scope dự án
- Thay đổi database schema trên production
- Thay đổi architecture (tech stack, infrastructure)
- Feature request mới giữa sprint
- Breaking API changes

## Change Classification

| Type | Risk | Approval Required |
|------|------|------------------|
| 🟢 Standard | Low | Tech Lead |
| 🟡 Normal | Medium | Tech Lead + PO |
| 🟠 Significant | High | Tech Lead + PO + CTO |
| 🔴 Emergency | Critical | CTO (fast-track) |

## Steps

1. **Submit Change Request**
   ```markdown
   # Change Request: CR-{NNN}
   
   **Requester**: [name]
   **Date**: [date]
   **Type**: Standard / Normal / Significant / Emergency
   
   ## Description
   [What needs to change and why]
   
   ## Business Justification
   [Why this change is needed. Link to OKR if applicable]
   
   ## Current State (As-Is)
   [How it works today]
   
   ## Desired State (To-Be)
   [How it should work after the change]
   ```

2. **Impact Analysis**
   - Technical impact:
     | Area | Impacted | Details |
     |------|---------|---------|
     | Database | Yes/No | Schema changes, migrations |
     | Backend API | Yes/No | New/modified endpoints |
     | Frontend | Yes/No | New screens, UI changes |
     | Mobile | Yes/No | App update required |
     | Infrastructure | Yes/No | Server, config changes |
     | Security | Yes/No | Auth, data, compliance |
   
   - Effort estimation:
     | Task | Effort | Sprint |
     |------|--------|--------|
     | Database migration | 2 SP | S12 |
     | Backend API | 5 SP | S12 |
     | Frontend screens | 8 SP | S12-S13 |
     | Testing | 3 SP | S13 |
     | **Total** | **18 SP** | **2 sprints** |
   
   - Risk assessment:
     - Backward compatibility issues?
     - Data migration required?
     - Rollback complexity?
     - Users need retraining?

3. **Approval Process**
   | Approver | Evaluates | Decision |
   |----------|----------|---------|
   | Tech Lead | Technical feasibility, effort | ✅ Approve / ❌ Reject |
   | PO | Business value vs. cost | ✅ Approve / ❌ Reject |
   | CTO | Strategic alignment (Significant only) | ✅ Approve / ❌ Reject |
   
   - All required approvers must approve
   - If rejected → provide alternative approach or defer

4. **Plan Implementation**
   - If approved:
     - [ ] Create backlog items (user stories / tasks)
     - [ ] Prioritize in backlog → `/backlog-refinement`
     - [ ] Schedule in sprint → `/sprint-planning`
     - [ ] If architecture change → `/architecture-review`
     - [ ] If DB change → `/db-migration`
   - Document rollback plan

5. **Communicate Change**
   - Notify affected stakeholders:
     ```
     📋 CHANGE APPROVED: CR-{NNN}
     Summary: [brief]
     Impact: [who/what affected]
     Timeline: Sprint S{N} - S{N+1}
     Owner: [name]
     ```
   - Update project documentation

6. **Track Implementation**
   | CR | Status | Sprint | Completion |
   |----|--------|--------|-----------|
   | CR-001 | In Progress | S12 | 60% |
   | CR-002 | Approved | S13 | 0% |
   | CR-003 | Rejected | — | — |

7. **Post-Change Review**
   - Verify change meets acceptance criteria
   - Confirm no unintended side effects
   - Update documentation
   - Close change request

## Emergency Changes (Fast-Track)
- For P0/P1 production issues → Chạy `/hotfix` trực tiếp
- Document change request retroactively within 48 hours
- CTO approval (can be verbal, confirmed in writing later)
