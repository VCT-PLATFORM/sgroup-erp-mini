---
description: Project/module initiation from stakeholder alignment to team kickoff
---

# Project Kickoff Workflow

Structured process for initiating a new project or major module in SGROUP ERP.

## Phase 1: Initiation (1-2 days)

1. **Define project scope with stakeholders**
   - Business objectives and success criteria
   - Target users and use cases
   - Budget and timeline constraints
   - Key stakeholders and decision makers

2. **Create Project Charter**
   ```markdown
   ## Project Charter — {Project Name}
   - Sponsor: {Name}
   - PM: {Name}
   - Objective: {One sentence}
   - Success Metrics: {KPIs}
   - Timeline: {Start} → {End}
   - Budget: {Amount}
   - Team: {Roles needed}
   ```

## Phase 2: Planning (2-3 days)

3. **BA conducts requirement analysis**
   - Use `/requirement-analysis` workflow
   - Output: BRD with user stories

4. **SA designs architecture**
   - Use `/architecture-review` workflow
   - Output: ADR, system diagrams

5. **PO creates product backlog**
   - Prioritize using RICE/MoSCoW
   - Break into sprints (2-week)
   - Estimate total effort

6. **PM creates project plan**
   - Gantt chart with milestones
   - Risk register
   - RACI matrix
   - Resource allocation

## Phase 3: Team Setup (1 day)

7. **Assemble the team**
   - Assign roles based on skill matrix
   - Set up communication channels (Slack, Jira)
   - Grant repository and environment access

8. **Set up development infrastructure**
   - Create Git branches
   - Configure CI/CD pipeline
   - Set up staging environment
   - Database schema initial migration

## Phase 4: Kickoff Meeting (2 hours)

9. **Kickoff agenda**
   ```
   1. Project vision and objectives (PO) — 15 min
   2. Architecture overview (SA) — 15 min
   3. Sprint plan and timeline (PM) — 15 min
   4. Development workflow (Tech Lead) — 15 min
   5. Team introductions and roles — 10 min
   6. Q&A — 20 min
   7. First sprint planning (SM) — 30 min
   ```

10. **Distribute kickoff artifacts**
    - Project charter
    - Architecture diagrams
    - Sprint 1 backlog
    - Team contact list
    - Access credentials

## Phase 5: First Sprint

11. **Start Sprint 1**
    - Use `/sprint-planning` workflow
    - Focus on foundation: auth, core models, basic UI
    - Daily standups begin
