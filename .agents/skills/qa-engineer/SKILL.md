---
name: QA Engineer
description: Test strategy, test automation frameworks, performance testing, and bug reporting for SGROUP ERP
---

# QA Engineer Skill — SGROUP ERP

## Role Overview
The QA Engineer ensures the quality, reliability, and performance of SGROUP ERP through comprehensive testing strategies, automation, and systematic bug tracking.

## Test Strategy

### Test Pyramid
```
          ╱╲
         ╱  ╲        E2E Tests (10%)
        ╱    ╲       Browser/mobile automation
       ╱──────╲
      ╱        ╲     Integration Tests (20%)
     ╱          ╲    API tests, service integration
    ╱────────────╲
   ╱              ╲   Unit Tests (70%)
  ╱                ╲   Functions, components, services
 ╱──────────────────╲
```

### Test Types by Layer
| Layer | Tool | Coverage Target | Run |
|-------|------|----------------|-----|
| Unit (Backend) | Jest | ≥ 80% | Every commit |
| Unit (Frontend) | Jest + RTL | ≥ 60% | Every commit |
| API Integration | Supertest | All endpoints | Every PR |
| E2E (Web) | Playwright | Critical paths | Daily / PR |
| E2E (Mobile) | Detox | Core flows | Before release |
| Performance | k6 | API benchmarks | Weekly |
| Security | npm audit + OWASP ZAP | All deps | Weekly |

## Test Automation

### API Testing with Supertest
```typescript
describe('POST /api/leads', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getTestToken('sales_rep');
  });

  it('should create lead with valid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/leads')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Customer',
        phone: '0901234567',
        source: 'WEB',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      name: 'Test Customer',
      status: 'NEW',
    });
    expect(response.body.id).toBeDefined();
  });

  it('should reject without required fields', async () => {
    await request(app.getHttpServer())
      .post('/api/leads')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: '' })
      .expect(400);
  });

  it('should reject unauthorized request', async () => {
    await request(app.getHttpServer())
      .post('/api/leads')
      .send({ name: 'Test' })
      .expect(401);
  });
});
```

### E2E Testing with Playwright
```typescript
import { test, expect } from '@playwright/test';

test.describe('Sales Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.fill('[data-testid="email-input"]', 'test@sgroup.vn');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
  });

  test('should display sales pipeline', async ({ page }) => {
    await page.click('[data-testid="sales-nav"]');
    await expect(page.locator('[data-testid="pipeline-view"]')).toBeVisible();
    await expect(page.locator('[data-testid="lead-card"]')).toHaveCount.greaterThan(0);
  });

  test('should create new lead', async ({ page }) => {
    await page.click('[data-testid="add-lead-button"]');
    await page.fill('[data-testid="lead-name"]', 'E2E Test Lead');
    await page.fill('[data-testid="lead-phone"]', '0987654321');
    await page.selectOption('[data-testid="lead-source"]', 'WEB');
    await page.click('[data-testid="submit-lead"]');
    
    await expect(page.locator('text=E2E Test Lead')).toBeVisible();
  });
});
```

### Performance Testing with k6
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up
    { duration: '1m', target: 50 },     // Sustained load
    { duration: '30s', target: 100 },   // Peak
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% under 500ms
    http_req_failed: ['rate<0.01'],     // Less than 1% errors
  },
};

export default function () {
  const token = getAuthToken();
  
  const res = http.get('http://localhost:3000/api/leads', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has data': (r) => JSON.parse(r.body).length > 0,
  });
  
  sleep(1);
}
```

## Test Planning

### Test Plan Template
```markdown
## Test Plan — {Feature/Sprint}

### Scope
- Features to test: [list]
- Out of scope: [list]

### Test Environment
- Frontend: http://localhost:8081
- Backend: http://localhost:3000
- Database: PostgreSQL (test DB)

### Test Cases
| TC-ID | Description | Precondition | Steps | Expected Result | Priority |
|-------|-------------|-------------|-------|-----------------|----------|
| TC-001 | Create lead | Logged in as sales_rep | 1. Click New Lead 2. Fill form 3. Submit | Lead created, appears in list | P0 |

### Regression Test Suite
| Area | # Tests | Automated | Manual | Status |
|------|---------|-----------|--------|--------|
| Auth | 15 | 15 | 0 | ✅ |
| Sales | 30 | 20 | 10 | ⚠️ |
| Planning | 25 | 10 | 15 | 🔄 |
```

## Bug Reporting

### Bug Report Template
```markdown
## BUG-{NNN}: {Short title}

**Severity**: P0-Critical | P1-High | P2-Medium | P3-Low
**Environment**: Production | Staging | Dev
**Platform**: Web | iOS | Android
**Reporter**: {Name}
**Date**: {YYYY-MM-DD}

### Description
What happened vs. what was expected.

### Steps to Reproduce
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

### Expected Behavior
What should have happened.

### Actual Behavior
What actually happened.

### Screenshots / Video
[Attach evidence]

### Additional Info
- Browser/Device: Chrome 120 / iPhone 15
- User role: sales_rep
- Data state: [relevant data conditions]
```

### Severity Classification
| Severity | Definition | Response | Examples |
|----------|-----------|----------|---------|
| P0 - Critical | System unusable, data loss | Fix immediately | Login broken, data corruption |
| P1 - High | Major feature broken, no workaround | Fix this sprint | Cannot create leads, payment failure |
| P2 - Medium | Feature impaired, workaround exists | Fix next sprint | Sort not working, slow loading |
| P3 - Low | Cosmetic, minor inconvenience | Backlog | Typo, alignment issue, color off |

## Quality Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Defect Density | Bugs / KLOC | < 5 per KLOC |
| Test Coverage | Covered lines / Total lines | ≥ 75% |
| Defect Escape Rate | Prod bugs / Total bugs found | < 10% |
| Test Pass Rate | Passed / Total tests | ≥ 95% |
| Automation Coverage | Automated / Total test cases | ≥ 70% |
| Mean Time to Detect | Detection time from introduction | < 1 sprint |

## SGROUP ERP — Common Bugs to Regression Test

These bugs have been found in production. Always test for them:

| Bug ID | Area | Description | How to Test |
|--------|------|-------------|-------------|
| BUG-001 | Data | `.map()` crash on API response | Mock API returning `{ data: [] }` instead of `[]` |
| BUG-002 | Auth | 401 causes infinite redirect loop | Expire JWT token → should redirect to login once |
| BUG-003 | Auth | 403 crashes page instead of showing error | Login as restricted role → access admin endpoint |
| BUG-004 | UI | Error displays `[object Object]` | Trigger API error → should show readable message |
| BUG-005 | Data | Team name not showing (wrong field lookup) | Check staff with team → team name visible |
| BUG-006 | Build | Docker `Cannot find module dist/main` | Run `docker build` → should start successfully |
| BUG-007 | Deploy | Vercel 404 on page refresh | Refresh any route → should not 404 |
| BUG-008 | UI | White screen on ErrorBoundary-less module | Navigate to all modules → none should crash |

### Quick Smoke Test Script
```bash
# Backend health
curl -s http://localhost:3000/api/health | jq .

# Auth
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@sgroup.vn","password":"password"}' | jq -r .access_token)

# Check key endpoints
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/sales-ops/staff | jq 'length'
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/sales-ops/teams | jq 'length'
```
