---
name: UX Researcher
description: User research, personas, usability testing, journey mapping, and accessibility for SGROUP ERP
---

# UX Researcher Skill — SGROUP ERP

## Role Overview
The UX Researcher ensures SGROUP ERP delivers exceptional user experiences by conducting research, creating personas, mapping user journeys, and validating designs through testing.

## Research Methods

### 1. User Research Framework

| Method | Type | When to Use | Sample Size |
|--------|------|-------------|-------------|
| User Interview | Qualitative | Discovery, validation | 5-8 users |
| Contextual Inquiry | Qualitative | Understanding workflows | 3-5 users |
| Survey | Quantitative | Large-scale validation | 50+ users |
| A/B Testing | Quantitative | Design decisions | 100+ users per variant |
| Usability Test | Mixed | Prototype validation | 5-7 users |
| Card Sorting | Mixed | Information architecture | 10-15 users |
| Diary Study | Qualitative | Long-term behavior | 10-15 users |

### 2. Persona Creation

#### Persona Template
```markdown
## Persona: {Name}

📸 [Photo/Avatar]

### Demographics
- **Tên**: Nguyễn Văn A
- **Tuổi**: 28
- **Vị trí**: Nhân viên bán hàng (Sales Rep)
- **Kinh nghiệm**: 3 năm trong ngành bất động sản
- **Tech level**: Intermediate — sử dụng smartphone thành thạo

### Goals 🎯
1. Chốt deals nhanh hơn, tăng commission
2. Quản lý pipeline khách hàng hiệu quả
3. Giảm thời gian làm báo cáo thủ công

### Pain Points 😤
1. Nhập liệu trùng lặp giữa nhiều hệ thống
2. Không biết khách hàng nào cần follow-up
3. Báo cáo cuối tuần mất 2-3 giờ

### Key Behaviors
- Kiểm tra CRM 5-10 lần/ngày trên mobile
- Gọi điện 20-30 cuộc/ngày
- Đi gặp khách 2-3 lần/tuần

### Quote
"Tôi cần một app đơn giản để quản lý khách hàng
mà không mất thời gian nhập liệu."

### Scenarios
1. Đang gặp khách → nhanh chóng ghi chú trên mobile
2. Đầu sáng → xem pipeline và lên kế hoạch gọi điện
3. Cuối tuần → review hiệu suất và tạo báo cáo
```

#### SGROUP ERP Personas
| Persona | Role | Primary Device | Key Need |
|---------|------|---------------|----------|
| Sales Rep (Anh) | Nhân viên bán hàng | Mobile | CRM nhanh, pipeline view |
| Sales Manager (Chị) | Quản lý bán hàng | Desktop + Mobile | Dashboard, team performance |
| Executive (Sếp) | Giám đốc | Desktop | KPIs, báo cáo tổng quan |
| Planning Staff (Em) | Nhân viên kế hoạch | Desktop | Data entry, analysis tools |

### 3. User Journey Mapping

#### Sales Rep — Daily Journey
```
PHASE:    Morning          Midday           Afternoon       Evening
─────────────────────────────────────────────────────────────────────
ACTION:   Check pipeline   Make calls       Visit clients   Report
          Review tasks     Update CRM       Take notes      Review KPIs
─────────────────────────────────────────────────────────────────────
THINKING: "What should I   "Need to log     "Where is       "How did I
           do first?"      this call"       client info?"   do today?"
─────────────────────────────────────────────────────────────────────
FEELING:  😐 Neutral       😤 Frustrated    😤 Frustrated   😩 Tired
          (too many tasks) (slow data entry) (no mobile)    (manual report)
─────────────────────────────────────────────────────────────────────
OPPORTUNITY:
          AI suggestions   Quick-add call   Mobile CRM      Auto-report
          Smart priority   Voice-to-text    Offline mode    AI summary
```

### 4. Usability Testing

#### Test Plan Template
```markdown
## Usability Test Plan — {Feature}

### Objective
Validate that users can [complete specific tasks] with [target success rate].

### Participants
- Number: 5-7 users
- Profile: [role/persona]
- Recruitment: [internal/external]

### Test Tasks
| # | Task | Success Criteria | Time Limit |
|---|------|-----------------|-----------|
| T1 | Create a new lead | Lead saved, appears in list | 2 min |
| T2 | Schedule appointment | Appointment created with notification | 3 min |
| T3 | View sales dashboard | Finds monthly revenue number | 1 min |

### Metrics
- Task completion rate (target: ≥ 80%)
- Time on task
- Error rate
- System Usability Scale (SUS) score (target: ≥ 68)
- User satisfaction (1-5 scale)

### Script
1. "Hãy tưởng tượng bạn vừa nhận được thông tin một khách hàng tiềm năng.
    Hãy thêm khách hàng này vào hệ thống."
2. [Observe, take notes, do NOT intervene]
3. Post-task: "Bạn thấy việc này dễ hay khó? Tại sao?"
```

#### SUS (System Usability Scale)
10 questions, scored 1-5:
1. Tôi nghĩ tôi sẽ muốn sử dụng hệ thống này thường xuyên
2. Tôi thấy hệ thống này phức tạp không cần thiết
3. Tôi thấy hệ thống này dễ sử dụng
4. Tôi cần sự hỗ trợ kỹ thuật để sử dụng hệ thống
5. Tôi thấy các chức năng được tích hợp tốt
6. Tôi thấy có quá nhiều sự không nhất quán
7. Hầu hết mọi người sẽ nhanh chóng học cách sử dụng
8. Hệ thống rất cồng kềnh khi sử dụng
9. Tôi cảm thấy tự tin khi sử dụng hệ thống
10. Cần học nhiều thứ trước khi bắt đầu sử dụng

**SUS Score**: ((Sum of odd items - 5) + (25 - Sum of even items)) × 2.5
- ≥ 80: Excellent | 68-79: Good | 50-67: OK | < 50: Poor

### 5. Heuristic Evaluation (Nielsen's 10)

| # | Heuristic | Check | Priority |
|---|-----------|-------|----------|
| 1 | Visibility of system status | Loading states, progress indicators | P0 |
| 2 | Match with real world | Vietnamese labels, familiar terms | P0 |
| 3 | User control & freedom | Undo/redo, cancel buttons | P1 |
| 4 | Consistency & standards | Same patterns across modules | P0 |
| 5 | Error prevention | Validation before submit | P0 |
| 6 | Recognition over recall | Visible options, autocomplete | P1 |
| 7 | Flexibility & efficiency | Keyboard shortcuts, bookmarks | P2 |
| 8 | Aesthetic & minimal design | Clean layout, no clutter | P1 |
| 9 | Error recovery | Clear error messages, suggestions | P0 |
| 10 | Help & documentation | Tooltips, onboarding tour | P2 |

### 6. Accessibility (WCAG 2.1)

#### Priority Checks
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text
- [ ] All interactive elements keyboard accessible
- [ ] Images have alt text
- [ ] Form fields have labels
- [ ] Focus indicators visible
- [ ] Touch targets ≥ 44×44px (mobile)
- [ ] Content readable at 200% zoom
- [ ] Screen reader compatible (semantic HTML/ARIA)

### 7. Information Architecture

#### Card Sorting Results Template
```markdown
| Category (User-defined) | Items Grouped |
|------------------------|---------------|
| Bán hàng | Lead, Deal, Pipeline, Báo cáo bán hàng |
| Khách hàng | Danh bạ, Lịch sử mua, Phản hồi |
| Kế hoạch | Kế hoạch kinh doanh, Mục tiêu, Ngân sách |
| Quản lý | Nhân sự, KPI, Lương, Chấm công |
```

#### Navigation Structure (based on research)
```
├── 🏠 Dashboard (Overview)
├── 💼 Bán hàng
│   ├── Pipeline
│   ├── Leads
│   ├── Appointments
│   └── Activities
├── 📊 Kế hoạch
│   ├── Sales Planning
│   ├── Marketing Planning
│   └── Executive Planning
├── 📈 Báo cáo
│   ├── Sales Report
│   ├── KPI Dashboard
│   └── Commission
└── ⚙️ Cài đặt
```
