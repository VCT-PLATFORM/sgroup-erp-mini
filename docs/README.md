# 📚 SGROUP ERP — Tài Liệu Dự Án

> Thư mục tập trung toàn bộ tài liệu phân tích nghiệp vụ, kiến trúc, và hướng dẫn kỹ thuật của hệ thống SGROUP ERP.

---

## 🏢 Phân Tích Nghiệp Vụ (Business Analysis)

### 1. Module Dự Án (Project)
| File | Mô tả |
|------|--------|
| [project_module_analysis.md](business-analysis/project/project_module_analysis.md) | Phân tích & Đánh giá Toàn diện (Mới nhất) — Gap Analysis, Kiến trúc FE/BE, Lộ trình nâng cấp |
| [BRD-Project-Module.md](business-analysis/project/BRD-Project-Module.md) | Business Requirements Document (BRD) — Phân hệ Quản lý Dự Án BĐS và Giỏ hàng |
| [project-deep-analysis.md](business-analysis/project/project-deep-analysis.md) | Phân tích & Phản biện Sâu — Race Condition, Data Integrity, Security, API Design |
| [project-module-analysis.md](business-analysis/project/project-module-analysis.md) | Phân tích Nghiệp vụ Chi tiết — Data Model, Luồng sự kiện, Cross-module Integration |

### 2. Module Nhân Sự (HR)
| File | Mô tả |
|------|--------|
| [hr-module-analysis.md](business-analysis/hr/hr-module-analysis.md) | Phân tích & Đánh giá Toàn diện — Chấm công, Tính lương, Cấu trúc tổ chức, UI/UX Audit |

### 3. Module Kinh Doanh (Sales)
| File | Mô tả |
|------|--------|
| [phan-tich-nghiep-vu-kinh-doanh.md](business-analysis/sales/phan-tich-nghiep-vu-kinh-doanh.md) | Phân tích Tổng thể — Khách hàng, Chiến dịch, Tính hoa hồng, Dashboard |
| [sales-business-analysis.md](business-analysis/sales/sales-business-analysis.md) | Thiết kế hệ thống cho NVKD — Hành trình nghiệp vụ, Tích hợp Cross-module |
| [sales-module-analysis.md](business-analysis/sales/sales-module-analysis.md) | Phân tích Chi tiết 24 màn hình — Phân quyền 6 role tĩnh, Database Schema, API Architecture |
| [sales-module-audit.md](business-analysis/sales/sales-module-audit.md) | Full-stack Audit — Các vấn đề nghiêm trọng, Kiến trúc, Upgrade Roadmap |
| [sales-operational-readiness.md](business-analysis/sales/sales-operational-readiness.md) | Báo cáo Sẵn sàng Vận hành — Fix list ưu tiên cho go-live |
| [sales-audit-report.md](business-analysis/sales/sales-audit-report.md) | Rà soát Hoàn thiện — Ma trận 24 màn hình API vs Mock |

### 4. Module Tài Chính (Finance)
| File | Mô tả |
|------|--------|
| [brd-finance.md](business-analysis/finance/brd-finance.md) | BRD (Business Requirements Document) — Phân hệ Tài chính, Kế toán, Công nợ |

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture)

### Báo cáo & Phân tích Kiến trúc
| File | Mô tả |
|------|--------|
| [architecture-analysis-report.md](architecture/architecture-analysis-report.md) | Báo cáo Phân tích Kiến trúc Tổng thể — Go Backend + React Frontend |
| [project-review.md](architecture/project-review.md) | Đánh giá & Đề xuất Nâng cấp SGROUP ERP — Phân tích điểm yếu & Lộ trình |
| [ui-flow-matrix.md](architecture/ui-flow-matrix.md) | Ma trận UI Flow — Cấu trúc layout navigation và luồng dùng chung |

### Architecture Decision Records (ADR)
| File | Mô tả |
|------|--------|
| [ADR-001-microservices-strategy.md](adr/ADR-001-microservices-strategy.md) | Chiến lược tách Microservices, Modular Monolith vs Microservices |
| [ADR-002-database-design-standards.md](adr/ADR-002-database-design-standards.md) | Tiêu chuẩn thiết kế Database (PostgreSQL) và RDBMS Convention |

### Bộ Quy Tắc & Tiêu Chuẩn (Architecture Rules)
*Đây là các tài liệu tiêu chuẩn bắt buộc cho quá trình phát triển (Code, UI, DevOps).*
- [ai-data-architecture-rules.md](architecture/ai-data-architecture-rules.md) — Kiến trúc Dữ liệu & AI
- [api-architecture-rules.md](architecture/api-architecture-rules.md) — Chuẩn thiết kế API REST & GraphQL
- [backend-architecture-rules.md](architecture/backend-architecture-rules.md) — Kiến trúc Backend (Go, NestJS)
- [devops-architecture-rules.md](architecture/devops-architecture-rules.md) — Nguyên tắc CI/CD, Deployment, Server
- [frontend-architecture-rules.md](architecture/frontend-architecture-rules.md) — Cấu trúc source code React/Next.js
- [security-architecture-rules.md](architecture/security-architecture-rules.md) — Chính sách bảo mật (Auth, Rate Limit)
- [test-architecture-rules.md](architecture/test-architecture-rules.md) — Tiêu chuẩn Testing (Unit, E2E)
- [ui-architecture-rules.md](architecture/ui-architecture-rules.md) — Hệ thống Component (Atomic Design) & UI/UX

---

## 📖 Hướng Dẫn Kỹ Thuật (Guides)

| File | Mô tả |
|------|--------|
| [clasp-guide.md](guides/clasp-guide.md) | Hướng dẫn sử dụng `clasp` để pull và deploy dự án Google Apps Script |

---

## 🔗 Tham Khảo Khác

| File | Vị trí | Mô tả |
|------|--------|--------|
| [README.md](../README.md) | Root | Giới thiệu dự án, Cấu trúc Repos, Hướng dẫn chạy local |
| [sgroup-erp-business-description.html](sgroup-erp-business-description.html) | docs/ | Mô tả nghiệp vụ doanh nghiệp tổng thể (HTML format) |
