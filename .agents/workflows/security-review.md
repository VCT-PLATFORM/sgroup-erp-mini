---
description: Security audit workflow for features and releases in SGROUP ERP
---

# Security Review Workflow

Quy trình đánh giá bảo mật cho feature mới hoặc trước khi release, đảm bảo ứng dụng an toàn.

## When to Trigger
- Feature mới xử lý dữ liệu nhạy cảm (user data, payments, auth)
- Trước release production
- Tích hợp external API / third-party service
- Thay đổi authentication / authorization logic

## Steps

1. **Scope Definition**
   - Xác định các components cần review
   - Classify data sensitivity:
     | Level | Data Type | Example |
     |-------|----------|---------|
     | Critical | Credentials | Password hashes, JWT secrets |
     | High | PII | CMND, email, phone, address |
     | Medium | Business | Sales data, reports |
     | Low | Public | Product catalog, FAQs |

2. **Authentication Review**
   - [ ] JWT tokens có expiration time hợp lý (≤ 7 days)
   - [ ] Refresh token rotation implemented
   - [ ] Password hashing sử dụng bcrypt (≥ 10 rounds)
   - [ ] Login rate limiting configured
   - [ ] Logout invalidates token properly
   - [ ] No hardcoded credentials in source code
   // turbo
   - Scan for hardcoded secrets: `cd sgroup-erp-backend && findstr /s /r "password\|secret\|api_key" src/**/*.ts`

3. **Authorization Review**
   - [ ] Role-based access control (RBAC) trên mọi endpoint
   - [ ] Decorators `@Roles()` trên tất cả protected endpoints
   - [ ] Không expose admin endpoints cho users thường
   - [ ] Resource-level authorization (user chỉ thấy data của mình)
   - [ ] Guards applied globally hoặc per-controller

4. **Input Validation (OWASP Top 10)**
   - [ ] All inputs validated với `class-validator` decorators
   - [ ] SQL Injection: Prisma parameterized queries (không raw SQL)
   - [ ] XSS: Output encoding, sanitize HTML input
   - [ ] CSRF: Token-based protection for state-changing operations
   - [ ] File Upload: Validate type, size, scan for malware
   - [ ] Rate Limiting: `@Throttle()` trên sensitive endpoints

5. **Data Protection (PDPA Compliance)**
   - [ ] PII data encrypted at rest
   - [ ] Sensitive data không log ra console/files
   - [ ] Data retention policy defined
   - [ ] User consent mechanism for data collection
   - [ ] Right to deletion implemented (soft delete → hard delete lifecycle)

6. **API Security**
   - [ ] HTTPS enforced (no HTTP)
   - [ ] CORS configured restrictively
   - [ ] Response headers hardened:
     ```
     X-Content-Type-Options: nosniff
     X-Frame-Options: DENY
     Strict-Transport-Security: max-age=31536000
     ```
   - [ ] Error messages không leak internal details
   - [ ] API versioning prevents breaking changes

7. **Dependency Security**
   // turbo
   - Backend: `cd sgroup-erp-backend && npm audit`
   // turbo
   - Frontend: `cd SGROUP-ERP-UNIVERSAL && npm audit`
   - Review & fix any High/Critical vulnerabilities
   - Update outdated packages if patches available

8. **Security Report**
   ```markdown
   # Security Review Report
   **Date**: [date]
   **Reviewer**: [name]
   **Scope**: [feature/module]
   
   ## Findings
   | # | Severity | Issue | Status |
   |---|----------|-------|--------|
   | 1 | 🔴 Critical | [description] | Open |
   | 2 | 🟠 High | [description] | Fixed |
   | 3 | 🟡 Medium | [description] | Open |
   | 4 | 🟢 Low | [description] | Accepted |
   
   ## Verdict: ✅ PASS / ❌ FAIL
   ```
   - 🔴 Critical → Phải fix trước khi merge/release
   - 🟠 High → Nên fix trong sprint hiện tại
   - 🟡 Medium → Backlog item
   - 🟢 Low → Nice-to-have

## Next Workflow
→ `/release-management` if pre-release review
→ `/feature-development` if security improvement task
