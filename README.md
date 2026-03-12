# SGROUP ERP — Full Workspace

Monorepo chứa toàn bộ hệ thống ERP cho SGROUP.

## Cấu trúc

| Thư mục                 | Mô tả                              | Tech                                   |
| ----------------------- | ---------------------------------- | -------------------------------------- |
| `SGROUP-ERP-UNIVERSAL/` | Frontend app (Web + iOS + Android) | Expo 55, React Native 0.83, TypeScript |
| `sgroup-erp-backend/`   | REST API Backend                   | NestJS, Prisma, SQLite                 |

## Quick Start

### Frontend

```bash
cd SGROUP-ERP-UNIVERSAL
npm install
npx expo start --web --port 8082
```

### Backend

```bash
cd sgroup-erp-backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### Demo Accounts

| Email           | Password | Role                |
| --------------- | -------- | ------------------- |
| admin@sgroup.vn | 123456   | Admin (full access) |
| hr@sgroup.vn    | 123456   | HR Manager          |
| sales@sgroup.vn | 123456   | Sales Employee      |

## Modules

- **Ban Điều Hành (BDH)** — KPI Dashboard, Planning (Total/Sales/Marketing)
- **Kinh doanh** — CRM, Deals, Pipeline
- **Marketing** — Campaigns, Lead attribution
- **Nhân sự** — HR management
- **Tài chính** — Finance, Commissions
- **Dự án** — Project management, Inventory
- **Đại lý** — Agency network F1/F2
- **Pháp lý** — Legal, Contracts
- **S-Homes** — Property management
