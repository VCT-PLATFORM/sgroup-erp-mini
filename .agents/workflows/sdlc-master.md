---
description: Master SDLC orchestrator — full project lifecycle from analysis to operations
---

# SDLC Master Workflow — SGROUP ERP

Bản đồ tổng thể liên kết toàn bộ workflows theo vòng đời phát triển phần mềm.
Sử dụng workflow này để xác định bước tiếp theo trong dự án.

## Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SGROUP ERP — SDLC Pipeline                       │
│                                                                     │
│  Phase 0        Phase 1         Phase 2         Phase 3             │
│  ┌──────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │KICKOFF│───▶│ ANALYSIS │───▶│  DESIGN  │───▶│  BUILD   │         │
│  └──────┘    └──────────┘    └──────────┘    └──────────┘          │
│                                                    │                │
│  Phase 7        Phase 6         Phase 5      Phase 4               │
│  ┌──────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │IMPROVE│◀──│ OPERATE  │◀──│ RELEASE  │◀──│  TEST    │          │
│  └──────┘    └──────────┘    └──────────┘    └──────────┘          │
│       │                                                             │
│       └─────────── Continuous Improvement Loop ──────────▶ Phase 1  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Khởi Động Dự Án 🚀

| Step | Workflow | Trigger |
|------|----------|---------|
| 0.1 | `/project-kickoff` | Dự án / module mới |

**Output**: Project Charter, Team assigned, Communication plan
**Gate**: Stakeholder sign-off → Proceed to Phase 1

---

## Phase 1: Phân Tích Nghiệp Vụ 📋

| Step | Workflow | Trigger |
|------|----------|---------|
| 1.1 | `/requirement-analysis` | Sau kickoff |
| 1.2 | `/backlog-refinement` | Hàng tuần |

**Output**: User stories, Acceptance criteria, Prioritized backlog
**Gate**: PO approves stories as "Ready for Sprint" → Proceed to Phase 2

---

## Phase 2: Thiết Kế 🎨

| Step | Workflow | Trigger |
|------|----------|---------|
| 2.1 | `/architecture-review` | Module mới / tech change |
| 2.2 | `/ui-ux-design` | Feature có UI |
| 2.3 | `/api-design` | Feature cần API |

**Output**: ADR, UI mockups, API spec (Swagger)
**Gate**: Tech Lead + PO approve designs → Proceed to Phase 3

---

## Phase 3: Xây Dựng 🔨

| Step | Workflow | Trigger |
|------|----------|---------|
| 3.1 | `/sprint-planning` | Đầu mỗi sprint |
| 3.2 | `/db-migration` | Cần thay đổi database |
| 3.3 | `/feature-development` | Mỗi user story |
| 3.4 | `/debug` | Khi gặp bug |

**Output**: Working code, Unit tests, PR ready for review
**Gate**: Feature complete & PR submitted → Proceed to Phase 4

---

## Phase 4: Kiểm Tra Chất Lượng ✅

| Step | Workflow | Trigger |
|------|----------|---------|
| 4.1 | `/code-review` | PR submitted |
| 4.2 | `/testing` | Code merged |
| 4.3 | `/security-review` | Feature xử lý data nhạy cảm / trước release |
| 4.4 | `/performance-testing` | Trước release / feature heavy load |

**Output**: Code reviewed, Tests passing, Security approved, Performance OK
**Gate**: All quality checks pass → Proceed to Phase 5

---

## Phase 5: Triển Khai 🚢

| Step | Workflow | Trigger |
|------|----------|---------|
| 5.1 | `/release-management` | Sprint kết thúc |
| 5.2 | `/deployment` | Release approved (local/VPS) |
| 5.3 | `/cloud-deployment` | Deploy lên cloud (GCP/AWS) |

**Output**: Version tagged, Deployed to production, Changelog published
**Gate**: Post-deploy verification OK → Proceed to Phase 6

---

## Phase 6: Vận Hành ⚙️

| Step | Workflow | Trigger |
|------|----------|---------|
| 6.1 | `/monitoring-setup` | Setup lần đầu / thêm service |
| 6.2 | `/incident-management` | Sự cố production |
| 6.3 | `/hotfix` | Bug khẩn cấp trên production |
| 6.4 | `/disaster-recovery` | DR planning / drill / recovery |
| 6.5 | `/support-ticket` | User report issue |

**Output**: Monitoring active, Incidents resolved, System stable
**Gate**: System stable → Continue to Phase 7

---

## Phase 7: Cải Tiến Liên Tục 🔄

| Step | Workflow | Trigger |
|------|----------|---------|
| 7.1 | `/retrospective` | Cuối mỗi sprint |
| 7.2 | `/knowledge-sharing` | Sau feature / incident |
| 7.3 | `/tech-debt` | Quản lý nợ kỹ thuật |
| 7.4 | `/training` | Đào tạo team / users |

**Output**: Action items, Improved processes, Team learnings documented
**Gate**: Action items assigned → Loop back to Phase 1 for next sprint

---

## Workflows Hỗ Trợ 🛠️

| Workflow | When to Use |
|----------|-----------|
| `/dev-setup` | Lần đầu setup / new team member |
| `/onboarding` | Thành viên mới join team |
| `/change-management` | Change request giữa sprint |
| `/data-analytics` | Phân tích dữ liệu, BI dashboards |
| `/ai-integration` | Tích hợp AI/ML features |
| `/compliance-audit` | Kiểm toán PDPA, bảo mật |

---

## Quick Reference: Workflow theo Tình Huống

| Tình huống | Workflow |
|-----------|----------|
| Bắt đầu dự án mới | `/project-kickoff` → `/requirement-analysis` |
| Sprint mới bắt đầu | `/sprint-planning` |
| Cần thiết kế UI | `/ui-ux-design` |
| Cần thiết kế API | `/api-design` |
| Bắt đầu code feature | `/feature-development` |
| Cần thay đổi database | `/db-migration` |
| Code xong, cần review | `/code-review` |
| Trước khi release | `/testing` → `/security-review` → `/release-management` |
| Deploy lên production | `/deployment` hoặc `/cloud-deployment` |
| Có bug trên production | `/hotfix` hoặc `/incident-management` |
| User báo bug/hỏi | `/support-ticket` |
| Setup monitoring | `/monitoring-setup` |
| Kết thúc sprint | `/retrospective` |
| Thành viên mới | `/onboarding` → `/dev-setup` |
| Thay đổi scope | `/change-management` |
| Gặp bug khi develop | `/debug` |
| Cần chia sẻ kiến thức | `/knowledge-sharing` |
| Thay đổi kiến trúc | `/architecture-review` |
| Grooming backlog | `/backlog-refinement` |
| Tích hợp AI | `/ai-integration` |
| Phân tích data / BI | `/data-analytics` |
| Kiểm toán tuân thủ | `/compliance-audit` |
| Quản lý nợ kỹ thuật | `/tech-debt` |
| Đào tạo team / users | `/training` |
| DR planning / drill | `/disaster-recovery` |
| Kiểm tra performance | `/performance-testing` |

---

## Tổng hợp: 33 Workflows

| # | Workflow | Phase | Type |
|---|---------|-------|------|
| 1 | `/project-kickoff` | 0 - Khởi động | Process |
| 2 | `/requirement-analysis` | 1 - Phân tích | Process |
| 3 | `/backlog-refinement` | 1 - Phân tích | Ceremony |
| 4 | `/architecture-review` | 2 - Thiết kế | Review |
| 5 | `/ui-ux-design` | 2 - Thiết kế | Design |
| 6 | `/api-design` | 2 - Thiết kế | Design |
| 7 | `/sprint-planning` | 3 - Xây dựng | Ceremony |
| 8 | `/db-migration` | 3 - Xây dựng | Technical |
| 9 | `/feature-development` | 3 - Xây dựng | Technical |
| 10 | `/debug` | 3 - Xây dựng | Technical |
| 11 | `/code-review` | 4 - Kiểm tra | Review |
| 12 | `/testing` | 4 - Kiểm tra | Technical |
| 13 | `/security-review` | 4 - Kiểm tra | Review |
| 14 | `/performance-testing` | 4 - Kiểm tra | Technical |
| 15 | `/release-management` | 5 - Triển khai | Process |
| 16 | `/deployment` | 5 - Triển khai | Technical |
| 17 | `/cloud-deployment` | 5 - Triển khai | Technical |
| 18 | `/monitoring-setup` | 6 - Vận hành | Technical |
| 19 | `/incident-management` | 6 - Vận hành | Process |
| 20 | `/hotfix` | 6 - Vận hành | Technical |
| 21 | `/disaster-recovery` | 6 - Vận hành | Technical |
| 22 | `/support-ticket` | 6 - Vận hành | Process |
| 23 | `/retrospective` | 7 - Cải tiến | Ceremony |
| 24 | `/knowledge-sharing` | 7 - Cải tiến | Process |
| 25 | `/tech-debt` | 7 - Cải tiến | Process |
| 26 | `/training` | 7 - Cải tiến | Process |
| 27 | `/dev-setup` | Hỗ trợ | Technical |
| 28 | `/onboarding` | Hỗ trợ | Process |
| 29 | `/change-management` | Hỗ trợ | Process |
| 30 | `/data-analytics` | Hỗ trợ | Technical |
| 31 | `/ai-integration` | Hỗ trợ | Technical |
| 32 | `/compliance-audit` | Hỗ trợ | Review |
| 33 | `/sdlc-master` | — | Orchestrator |
