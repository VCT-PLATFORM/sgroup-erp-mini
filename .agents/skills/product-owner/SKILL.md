---
name: Product Owner
description: Product vision, backlog management, user story writing, and feature prioritization for SGROUP ERP
---

# Product Owner Skill — SGROUP ERP

## Role Overview
The Product Owner defines the product vision, manages the backlog, writes user stories, and ensures the team delivers maximum business value for SGROUP ERP.

## Core Frameworks

### 1. Product Vision & Strategy

#### Product Vision Statement
```
FOR [target customer]
WHO [statement of need]
THE [product name] IS A [product category]
THAT [key benefit / compelling reason to use]
UNLIKE [primary competitor / current alternative]
OUR PRODUCT [statement of primary differentiation]
```

#### SGROUP ERP Vision Example
```
FOR doanh nghiệp vừa và nhỏ tại Việt Nam
WHO cần quản lý quy trình bán hàng và vận hành hiệu quả
SGROUP ERP LÀ một nền tảng ERP thông minh
GIÚP tự động hóa quy trình và đưa ra quyết định dựa trên dữ liệu
KHÁC VỚI các giải pháp ERP truyền thống phức tạp
SẢN PHẨM CỦA CHÚNG TÔI tích hợp AI và giao diện thân thiện mobile-first
```

#### OKR Framework
```markdown
## Q1 2026 OKRs

### Objective 1: Tăng hiệu suất bán hàng 30%
- KR1: 90% nhân viên sử dụng CRM hàng ngày (hiện tại: 40%)
- KR2: Thời gian tạo báo cáo giảm từ 2h xuống 15 phút
- KR3: Tỷ lệ chuyển đổi lead → deal tăng từ 5% lên 8%

### Objective 2: Cải thiện trải nghiệm người dùng
- KR1: NPS score ≥ 40 (hiện tại: 25)
- KR2: Task completion rate ≥ 85%
- KR3: Onboarding time giảm từ 3 ngày xuống 1 ngày
```

### 2. User Story Writing

#### Format
```
AS A [role/persona]
I WANT [feature/capability]
SO THAT [business value/benefit]
```

#### INVEST Criteria Checklist
- **I**ndependent — Không phụ thuộc story khác
- **N**egotiable — Có thể thương lượng chi tiết
- **V**aluable — Mang lại giá trị cho user/business
- **E**stimable — Team có thể ước lượng effort
- **S**mall — Hoàn thành được trong 1 sprint
- **T**estable — Có acceptance criteria rõ ràng

#### Acceptance Criteria Template (Given-When-Then)
```gherkin
GIVEN tôi đang ở trang Dashboard bán hàng
AND tôi đã đăng nhập với role "sales_rep"
WHEN tôi click vào nút "Thêm Lead mới"
THEN form tạo lead hiển thị với các trường bắt buộc
AND nút "Lưu" ở trạng thái disabled cho đến khi form hợp lệ
```

#### Story Sizing (Story Points)
| Points | Complexity | Example |
|--------|-----------|---------|
| 1 | Trivial | Fix typo, change label |
| 2 | Simple | Add form field, update validation |
| 3 | Standard | New CRUD screen |
| 5 | Complex | New feature with business logic |
| 8 | Very complex | Cross-module integration |
| 13 | Epic-level | Break down further |

### 3. Prioritization Frameworks

#### RICE Score
```
Reach × Impact × Confidence
─────────────────────────── = RICE Score
         Effort

| Feature | Reach | Impact | Confidence | Effort | RICE |
|---------|-------|--------|------------|--------|------|
| AI Chat | 500 | 3 | 80% | 3 | 400 |
| Reports | 200 | 2 | 90% | 1 | 360 |
| Mobile  | 300 | 2 | 70% | 5 | 84  |
```

#### MoSCoW Classification
| Category | Definition | % of Scope |
|----------|-----------|------------|
| **Must** have | Thiết yếu, không ship nếu thiếu | 60% |
| **Should** have | Quan trọng nhưng có workaround | 20% |
| **Could** have | Tốt nếu có, cải thiện UX | 15% |
| **Won't** have | Không làm trong release này | 5% |

### 4. Backlog Management

#### Backlog Structure
```
Epic (Objective level)
├── Feature (Shippable increment)
│   ├── User Story (Sprint-sized)
│   │   ├── Task (Dev work)
│   │   └── Sub-task
│   └── Bug
└── Tech Debt Story
```

#### Refinement Checklist
- [ ] Story has clear acceptance criteria
- [ ] Story follows INVEST criteria
- [ ] Dependencies identified
- [ ] Design/UX mockups attached (if needed)
- [ ] Story pointed by team
- [ ] Technical approach discussed
- [ ] Edge cases documented

### 5. Product Metrics Dashboard

| Category | Metric | Target | How to Measure |
|----------|--------|--------|----------------|
| Acquisition | New users/month | +15% MoM | Registration count |
| Activation | Feature adoption rate | ≥ 70% | Feature usage / total users |
| Retention | DAU/MAU ratio | ≥ 40% | Active user tracking |
| Revenue | MRR growth | +10% MoM | Subscription revenue |
| Satisfaction | NPS | ≥ 40 | Quarterly survey |
| Efficiency | Task completion time | Decreasing | In-app timing |

### 6. Release Planning

#### Release Readiness Checklist
- [ ] All Must-have stories completed and tested
- [ ] No P0/P1 bugs outstanding
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Stakeholder sign-off received
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured
