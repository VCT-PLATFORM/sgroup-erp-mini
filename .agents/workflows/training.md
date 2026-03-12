---
description: Team onboarding, user training programs, documentation, and knowledge sharing for SGROUP ERP
---

# Training Workflow

Quy trình đào tạo team phát triển và end-user sử dụng SGROUP ERP.

## When to Trigger
- Onboarding thành viên team mới → kết hợp `/onboarding`
- Triển khai module mới cho end-users
- User adoption thấp (< 60%)
- Cập nhật feature lớn ảnh hưởng workflow người dùng

## Training Types

| Type | Audience | Duration | Frequency |
|------|---------|----------|-----------|
| Developer Onboarding | New devs | 2 tuần | Per hire |
| End-User Training | Staff using ERP | 2-3 giờ | Per module launch |
| Feature Update | Existing users | 30-60 phút | Per release |
| Admin Training | IT admins | 1-2 giờ | Quarterly |

## Steps

### Phase 1: Training Needs Assessment

1. **Identify Training Gap**
   - Who needs training? (Developer / End-user / Admin)
   - What skills or knowledge are missing?
   - Current vs. desired competency level:
     | Area | Current | Target | Gap |
     |------|---------|--------|-----|
     | CRM Usage | 40% adoption | 90% | High |
     | Reporting | Basic | Advanced | Medium |
     | Mobile App | Not used | Daily use | High |

### Phase 2: Training Design

2. **Design Curriculum**
   - Follow training program from training-coordinator skill:
     ```
     Module 1: Getting Started (30 min)
     ├── Login and navigation
     ├── Dashboard overview
     └── Mobile app setup
     
     Module 2: Sales CRM (1 hour)
     ├── Creating and managing leads
     ├── Pipeline management
     └── Activity logging
     
     Module 3: Planning (45 min)
     ├── Sales planning
     └── Marketing allocation
     
     Module 4: Reporting (30 min)
     ├── Viewing dashboards
     └── Generating reports
     ```

3. **Prepare Training Materials**
   - [ ] Slide deck with step-by-step instructions
   - [ ] Video recordings (5-15 min each module)
   - [ ] Hands-on exercises with test data
   - [ ] Quick reference card (cheat sheet)
   - [ ] Test environment setup with sample data
   - [ ] Post-training quiz / assessment

### Phase 3: Training Delivery

4. **Choose Delivery Method**
   | Method | Best For | Prep Time |
   |--------|---------|-----------|
   | Live Workshop | New employee groups | 1-2 days |
   | Video Tutorial | Self-paced remote | 1-2 days/module |
   | Interactive Guide | In-app walkthrough | 2-3 days dev |
   | Documentation | Reference lookup | 1 day/topic |
   | Hands-on Lab | Practice skills | 1 day setup |

5. **Conduct Training Sessions**
   - Agenda:
     1. Introduction & objectives (5 min)
     2. Demo of features (15-20 min)
     3. Hands-on practice (20-30 min)
     4. Q&A (10-15 min)
     5. Feedback collection (5 min)
   - Record all sessions for future reference
   - Provide access to test environment

### Phase 4: Assessment & Follow-up

6. **Assess Learning**
   - Post-training quiz / practical test
   - Competency checklist:
     | Task | Can Do Independently | Needs Help | Cannot Do |
     |------|---------------------|-----------|-----------|
     | Create lead | ✅ | | |
     | Generate report | | ✅ | |
     | Use mobile app | | | ✅ |

7. **Measure Training Effectiveness**
   | Metric | Target | How to Measure |
   |--------|--------|---------------|
   | Training completion | 100% | Attendance roster |
   | Quiz pass rate | ≥ 80% | Quiz scores |
   | Feature adoption | ≥ 70% | Usage analytics |
   | User satisfaction | ≥ 4.0/5.0 | Survey |
   | Support tickets (post) | Decreasing | Ticket count |

8. **Continuous Improvement**
   - Collect feedback after each session
   - Update materials based on:
     - Common questions (→ add to FAQ)
     - Confusion points (→ improve demos)
     - Feature updates (→ update screenshots/videos)
   - Schedule follow-up sessions (30 days later)
   - Create knowledge base articles → `/knowledge-sharing`
