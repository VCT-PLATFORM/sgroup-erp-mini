---
description: Run E2E test suite cho SGROUP ERP Platform
---

// turbo-all

# E2E Testing — SGROUP ERP

Chạy bộ test End-to-End để kiểm tra toàn bộ flow từ UI → API → Database.

## Prerequisites
- Docker services đang chạy (PostgreSQL, Redis)
- Backend đang chạy (`npm run start:dev`)

## Steps

1. **Ensure test database is ready**
```bash
cd sgroup-erp-backend && DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate deploy
```

2. **Seed test data**
```bash
cd sgroup-erp-backend && DATABASE_URL=$TEST_DATABASE_URL npx prisma db seed
```

3. **Run backend integration tests** (Supertest)
```bash
cd sgroup-erp-backend && npm run test:e2e
```

4. **Run frontend E2E tests** (nếu có Playwright/Maestro)
```bash
npx playwright test --project=chromium
```
> Nếu chưa cài browsers: `npx playwright install --with-deps chromium`

5. **Show test report**
```bash
npx playwright show-report
```

## Test Strategy
- **Auth flow**: Login → Token refresh → Logout
- **CRUD flow**: Create → Read → Update → Soft-Delete
- **Permission flow**: Admin access → Sales restricted → Unauthorized rejected
- **Data integrity**: Decimal precision cho tiền tệ, UUID v7 format check

## CI Integration
Thêm vào `.github/workflows/test.yml`:
```yaml
- name: E2E Tests
  run: |
    npm run test:e2e
    npx playwright test
```
