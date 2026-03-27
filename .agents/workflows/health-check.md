---
description: Quick system health check — NestJS backend build + Prisma validate + frontend TypeScript check
---

// turbo-all

# Health Check — SGROUP ERP

Kiểm tra nhanh sức khỏe toàn hệ thống (backend + frontend + database).

## Steps

1. **Validate Prisma schema**
```bash
cd sgroup-erp-backend && npx prisma validate
```

2. **Generate Prisma Client** (đảm bảo types up-to-date)
```bash
cd sgroup-erp-backend && npx prisma generate
```

3. **Build NestJS backend** (type-check + compile)
```bash
cd sgroup-erp-backend && npm run build
```

4. **Run backend unit tests** (short mode)
```bash
cd sgroup-erp-backend && npm run test -- --passWithNoTests
```

5. **Frontend TypeScript check**
```bash
cd sgroup-erp-fe && npx tsc --noEmit
```

6. **Check lint issues**
```bash
cd sgroup-erp-fe && npm run lint 2>&1 | tail -5
```

7. **Report results summary**
> Tổng hợp kết quả: số lỗi build, test pass/fail, lint warnings. Báo cáo cho user.
