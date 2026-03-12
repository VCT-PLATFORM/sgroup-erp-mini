---
description: Run full test suite for frontend and backend
---

# Testing Workflow

Run all tests and generate coverage reports.

## Steps

// turbo-all

1. Run backend unit tests
```bash
cd sgroup-erp-backend && npm test
```

2. Run backend tests with coverage
```bash
cd sgroup-erp-backend && npm run test:cov
```

3. Run backend E2E tests
```bash
cd sgroup-erp-backend && npm run test:e2e
```

4. Run frontend TypeScript check
```bash
cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit
```

5. Run frontend unit tests (if configured)
```bash
cd SGROUP-ERP-UNIVERSAL && npm test -- --ci
```

## Interpreting Results
- **All green**: Safe to merge/deploy
- **Failed tests**: Fix failures before proceeding
- **Coverage below targets**: Add missing tests
  - Services: ≥ 80%
  - Controllers: ≥ 70%
  - UI Components: ≥ 60%
  - Utils: ≥ 90%
