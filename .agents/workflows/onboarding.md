---
description: New team member onboarding from environment setup to first contribution
---

# Onboarding Workflow

Quy trình onboarding thành viên mới — từ setup môi trường đến first contribution.

## Timeline Overview

| Day | Focus | Key Activities |
|-----|-------|---------------|
| Day 1 | Setup & Access | Environment setup, accounts, tool access |
| Day 2-3 | Learn & Explore | Codebase walkthrough, architecture overview |
| Day 4-5 | First Task | Pair programming, first small PR |
| Week 2 | Independent | Solo task with buddy support |
| Week 3-4 | Ramp Up | Full sprint participation |
| Month 2 | Autonomous | Full velocity, mentor others |

## Steps

### Day 1: Setup & Access

1. **Account & Tool Access**
   - [ ] Git repository access (GitHub/GitLab)
   - [ ] Project management tool (Jira/Linear)
   - [ ] Communication channels (Slack/Teams)
   - [ ] Design files (Figma)
   - [ ] Database credentials (dev environment)
   - [ ] Cloud console access (if needed)

2. **Development Environment**
   - Chạy `/dev-setup` workflow:
     - [ ] Clone repository
     - [ ] Install dependencies (frontend + backend)
     - [ ] Configure environment variables
     - [ ] Setup database
     - [ ] Run application locally
   - Verify: Frontend loads, Backend responds, Database connected

3. **Assign Buddy/Mentor**
   - Buddy = experienced team member
   - Responsibilities:
     - Answer daily questions
     - Pair on first tasks
     - Code review first PRs
     - Cultural integration

### Day 2-3: Learn & Explore

4. **Project Overview Presentation (1 hour)**
   - Business context: SGROUP ERP vision & goals
   - Product demo: Key features & user flows
   - Architecture overview: Tech stack, modules, data flow
   - Team structure: Roles, responsibilities, ceremonies

5. **Codebase Walkthrough (2 hours)**
   - Project structure:
     ```
     SGROUP ERP FULL/
     ├── SGROUP-ERP-UNIVERSAL/   → Frontend (React Native / Expo)
     │   ├── src/features/       → Feature modules
     │   ├── src/shared/         → Shared components
     │   └── src/stores/         → State management (Zustand)
     ├── sgroup-erp-backend/     → Backend (NestJS / Prisma)
     │   ├── src/modules/        → Feature modules
     │   ├── prisma/             → Database schema & migrations
     │   └── src/common/         → Shared utilities
     └── .agents/                → AI agent skills & workflows
     ```
   - Coding conventions & patterns
   - Design system (SGDS) overview
   - Key skills to read: backend-dev, frontend-dev, code-review

6. **Read Essential Documentation**
   - [ ] README.md
   - [ ] Architecture Decision Records (ADRs)
   - [ ] Coding standards (code-review skill)
   - [ ] Git branching strategy (devops skill)
   - [ ] Available workflows (`.agents/workflows/`)
   - [ ] Design system (ui-ux-design skill)

### Day 4-5: First Contribution

7. **Select First Task**
   - Ideal first task criteria:
     - ✅ Small scope (1-2 SP)
     - ✅ Non-critical path
     - ✅ Good learning opportunity
     - ✅ Clear acceptance criteria
   - Suggestions: fix a bug, add a field, update validation, improve UI

8. **Pair Programming Session**
   - Buddy pair programs on first task
   - Practice the full development cycle:
     1. Create feature branch
     2. Implement change → `/feature-development`
     3. Write tests
     4. Submit PR
     5. Address code review feedback → `/code-review`
     6. Merge & verify

### Week 2: Growing Independence

9. **Solo Task with Support**
   - Work on a 3-5 SP story independently
   - Buddy available for questions (not pairing)
   - First solo PR → detailed code review from buddy

10. **Participate in Ceremonies**
    - [ ] Daily standup → share progress
    - [ ] Sprint planning → ask questions
    - [ ] Backlog refinement → learn estimation
    - [ ] Sprint review → observe demos

### Week 3-4: Full Ramp Up

11. **Assess Progress**
    | Area | Beginner | Intermediate | Autonomous |
    |------|----------|-------------|-----------|
    | Dev setup | Can run app | Can troubleshoot | Can help others |
    | Frontend | Basic components | Feature screens | Complex features |
    | Backend | Read code | CRUD modules | Business logic |
    | Testing | Read tests | Write tests | Design test strategy |
    | Process | Follow steps | Suggest improvements | Lead ceremonies |

12. **Feedback Loop**
    - Week 1 check-in: buddy + new member
    - Week 2 check-in: tech lead + new member
    - Month 1 review: full 360° feedback
