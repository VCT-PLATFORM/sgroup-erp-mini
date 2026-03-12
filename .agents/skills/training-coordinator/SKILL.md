---
name: Training Coordinator
description: Team onboarding, user training programs, documentation, and knowledge sharing for SGROUP ERP
---

# Training Coordinator Skill — SGROUP ERP

## Role Overview
The Training Coordinator designs and delivers onboarding, training, and knowledge-sharing programs for both the development team and end-users.

## Developer Onboarding

### First Week Plan
```
Day 1: Welcome & Setup
├── Meet the team
├── Company overview & ERP vision
├── Dev environment setup (run /dev-setup workflow)
├── Get access to: Git, Slack, Jira, Prisma Studio
└── First PR: Fix a "good-first-issue"

Day 2-3: Codebase Walkthrough
├── Frontend architecture (React Native + Expo)
├── Backend architecture (NestJS + Prisma)
├── Key modules: Auth, Sales, Planning
├── Agent skills introduction
└── Code review standards

Day 4-5: First Feature
├── Pair programming with buddy
├── Build a small feature (guided)
├── Write tests
├── Submit PR, go through review process
└── Deploy to staging
```

### Onboarding Checklist
| Day | Task | Verified By |
|-----|------|-------------|
| 1 | Git access, clone repos | DevOps |
| 1 | Dev environment running | Buddy |
| 1 | Can access staging environment | DevOps |
| 2 | Understand project structure | Tech Lead |
| 3 | Complete code walkthrough | Tech Lead |
| 5 | First PR merged | Code Reviewer |
| 10 | Complete first feature independently | Tech Lead |
| 20 | Confident with full stack | Self-assessment |

### Buddy System
- Each new hire gets a buddy (senior dev) for first 30 days
- Daily 15-min check-in for first 2 weeks
- Weekly 30-min check-in for weeks 3-4
- Buddy reviews all PRs in first 2 weeks

## End-User Training

### Training Program Structure
```
Module 1: Getting Started (30 min)
├── Login and navigation
├── Dashboard overview
├── Profile settings
└── Mobile app setup

Module 2: Sales CRM (1 hour)
├── Creating and managing leads
├── Pipeline management
├── Activity logging
├── Appointment scheduling
└── Hands-on exercises

Module 3: Planning (45 min)
├── Sales planning
├── Marketing allocation
├── Executive planning view
└── Setting targets

Module 4: Reporting (30 min)
├── Viewing dashboards
├── Generating reports
├── Understanding KPIs
└── Exporting data

Module 5: AI Features (30 min)
├── Using AI chat assistant
├── AI-powered insights
├── Automated reporting
└── Best practices
```

### Training Delivery Methods
| Method | Best For | Duration | Materials |
|--------|----------|----------|-----------|
| Live Workshop | New employee groups | 2-3 hours | Slides + Demo |
| Video Tutorial | Self-paced learning | 5-15 min each | Screen recordings |
| Interactive Guide | Feature-specific | In-app | Tooltips + walkthrough |
| Documentation | Reference | — | KB articles |
| Hands-on Lab | Practice | 30-60 min | Test environment |

### Training Materials Checklist
- [ ] Video recordings of each module
- [ ] Step-by-step guides with screenshots
- [ ] FAQ document
- [ ] Quick reference card (cheat sheet)
- [ ] Test environment with sample data
- [ ] Feedback survey

## Knowledge Sharing

### Tech Talk Program
```markdown
## Tech Talk Schedule — Monthly

| Month | Topic | Presenter | Duration |
|-------|-------|-----------|----------|
| Jan | React Native Performance | Frontend Dev | 30 min |
| Feb | Prisma Advanced Queries | Backend Dev | 30 min |
| Mar | AI/LLM Integration | AI Engineer | 45 min |
| Apr | Security Best Practices | Security | 30 min |
| May | DevOps & CI/CD | DevOps | 30 min |
| Jun | UX Research Methods | UX Researcher | 30 min |

### Format
1. Presentation (15-20 min)
2. Live demo (5-10 min)
3. Q&A (5-10 min)
4. Record and share video + slides
```

### Documentation Standards
| Doc Type | Owner | Update Frequency | Location |
|----------|-------|----------------:|----------|
| API Docs | Backend Dev | Every release | `/docs/api/` |
| User Guide | Technical Writer | Every feature | KB |
| Architecture | Solution Architect | Quarterly | `/docs/architecture/` |
| Onboarding | Training Coordinator | Quarterly | `/docs/onboarding/` |
| Release Notes | Release Manager | Every release | CHANGELOG.md |

## Training Metrics
| Metric | Target | How to Measure |
|--------|--------|---------------|
| Onboarding completion | 100% in 2 weeks | Checklist completion |
| Time to first PR | < 3 days | Git timestamps |
| Dev productivity (sprint 2) | ≥ 60% of team avg | Velocity tracking |
| User training completion | ≥ 90% | LMS tracking |
| Training satisfaction | ≥ 4.0/5.0 | Post-training survey |
| Feature adoption post-training | ≥ 70% | Usage analytics |
