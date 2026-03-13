---
description: Run full test suite for frontend and backend
---

# Testing Workflow

Run all tests, verify the app, and generate coverage reports.

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

6. Run backend TypeScript check
```bash
cd sgroup-erp-backend && npx tsc --noEmit
```

7. Run backend lint
```bash
cd sgroup-erp-backend && npm run lint
```

## Browser Verification (Manual)

After automated tests pass, verify key flows in browser:

### Critical Path Checklist
- [ ] **Login**: Navigate to `http://localhost:8081` → login with valid credentials → dashboard loads
- [ ] **Sales Dashboard**: Click Sales menu → dashboard renders with KPI cards
- [ ] **Staff Management**: Click Staff → staff list loads (no crash)
- [ ] **Team Report**: Click Team Report → report renders correctly
- [ ] **Booking**: Click Giữ Chỗ → booking form works
- [ ] **Error states**: Disconnect backend → app shows error state (not white screen)

### Common Browser Test Issues
| Issue | What to Check |
|-------|--------------|
| White screen / crash | Open DevTools Console → look for `TypeError` |
| `X.map is not a function` | API response not normalized with `Array.isArray()` |
| Page loads but empty | Check Network tab → API returning data? |
| 403 error | Check user role / JWT token |
| Data stale after edit | Store not refreshing → check `fetchData()` call after mutation |

## Interpreting Results
- **All green**: Safe to merge/deploy
- **Failed tests**: Fix failures before proceeding
- **Coverage below targets**: Add missing tests
  - Services: ≥ 80%
  - Controllers: ≥ 70%
  - UI Components: ≥ 60%
  - Utils: ≥ 90%
- **TypeScript errors**: Fix type errors before committing
