# SGROUP ERP — System Architecture Blueprint

> Quyết định thiết kế lõi & chuẩn giao tiếp Module. Javis quản lý tệp này qua luồng ADR. Mọi Agent phải đọc để hiểu giới hạn ranh giới (Boundaries).

## 1. Enterprise Architecture: Vertical Slice + Super-App + Microservices
Thay vì chia Frontend và Backend thành 2 kho riêng rẽ, toàn bộ source sẽ được xoay dọc (Vertical). Mọi thành phần của 1 nghiệp vụ (Web/App/API/DB) nằm chung 1 cột để đảm bảo tính độc lập tuyệt đối (Fault Isolation).

```text
sgroup-erp-full/
│
├── core/                      ← Nền tảng lõi & Host
│   ├── web-host/              ← React 19 Shell (Nhúng các MFEs)
│   ├── app-host/              ← React Native 0.85 Shell (Nhúng các Mini-Apps qua Repack)
│   └── api-gateway/           ← Go API Gateway (Kiểm soát Auth, Rate Limit)
│
├── modules/                   ← Các nghiệp vụ (Vertical Slices)
│   ├── crm/                   ← Nghiệp vụ Khách hàng
│   │   ├── web/               ← Remote MFE React 19
│   │   ├── app/               ← Mini-App React Native
│   │   ├── api/               ← Go Microservice (Port 8081)
│   │   └── docs/              ← OpenAPI & Contracts
│   │
│   ├── hr/                    ← Nghiệp vụ Nhân sự
│   │   ├── web/ | app/ | api/ (Port 8082)
│   │
│   └── accounting/            ← Nghiệp vụ Kế toán
│       ├── web/ | app/ | api/ (Port 8083)
│
├── packages/                  ← Thư viện chia sẻ ngang
│   ├── ui/                    ← @sgroup/ui (NativeWind Design System)
│   └── go-common/             ← Shared Go logic (Log, DB connect, utils)
│
└── infra/                     ← Cấu hình DevOps & Môi trường
    └── docker-compose.yml     ← Setup Local Dev (DB, Redis, MQ)
```

## 2. Các Quy chuẩn Kỹ thuật Nâng cao (Elite Tier)

### Giao tiếp Đồng bộ (Sync) & Bất đồng bộ (Async)
- **Sync:** Web/App gọi qua API Gateway → `modules/*/api` (RESTful/gRPC). Agent dùng `OpenAPI` để đồng bộ Contract, tuyệt đối không hard-code field name.
- **Async (Microservices Message Queue):** Tuyệt đối KHÔNG ĐƯỢC gọi HTTP trực tiếp từ Service này sang Service khác (vd CRM gọi chéo Accounting). Mọi thay đổi trạng thái phải bắn Message qua **RabbitMQ**. Module khác tự Listen rác nghiệp vụ.

### Bảo mật & RBAC
- Xác thực 100% tại `core/api-gateway`. JWT Tokens lưu thông tin UserID, TenantID và Role.
- Các requests chạy tới `modules/*/api` là an toàn. Tại đây kết hợp chung với PostgreSQL **Row-Level Security (RLS)** để cô lập dữ liệu theo Tenant.

### State & Caching
- **Frontend App:** Dùng `TanStack Query` + SQLite để làm Offline-first (Optimistic Updates).
- **Backend API:** Dùng `Redis` (Distributed Cache) để bọc các queries danh mục lớn hoặc báo cáo tĩnh nhằm giảm tải cho DB chính.

### Observability
- 100% các request qua Gateway sẽ được gán `trace_id` (OpenTelemetry), lan truyền sang các Message Queue và Log để dễ dàng Tracking qua Jaeger/Loki.

## 3. Deployment Topology (Viettel IDC)
```text
[ Thiết bị User (Web/App) ] 
       │
       ▼ (HTTPS)
[ Load Balancer / NGINX ] 
       │
       ▼
[ Core API Gateway ] ───────▶ Token JWT valid? (Kiểm tra RBAC)
       │
       ▼ (gRPC / HTTP)
┌──────────────────────────────────────────────┐
│  Kubernetes / Docker Swarm Cluster           │
│  ├─ [ CRM Service ] ◀──▶  [ Schema: CRM ]    │
│  ├─ [ HR Service ]  ◀──▶  [ Schema: HR ]     │
│  ├─ [ ACC Service ] ◀──▶  [ Schema: ACC ]    │
└───────────────▲──────────────────────────────┘
                │ (Event Bus - RabbitMQ)
                ▼
[ Background Workers (Cron) / Redis Cache ] 
```

## Architecture Decisions Log (ADR)
| ADR | Decision | Date | Status |
|-----|----------|------|--------|
| ADR-001 | Kiến trúc Vertical Slice (Mọi thứ thu vào module) | 2026-04-08 | ✅ Accepted |
| ADR-002 | React Native App 0.85 & Repack Module Federation | 2026-04-08 | ✅ Accepted |
| ADR-003 | Golang 1.26 Microservices architecture | 2026-04-08 | ✅ Accepted |
| ADR-004 | PostgreSQL 15 (DB per service/Schema) | 2026-04-08 | ✅ Accepted |
| ADR-005 | RabbitMQ cho Event-Driven decoupling | 2026-04-08 | ✅ Accepted |
| ADR-006 | OpenAPI cho API Contracts | 2026-04-08 | ✅ Accepted |
