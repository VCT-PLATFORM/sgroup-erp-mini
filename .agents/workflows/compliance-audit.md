---
description: PDPA compliance audit, data privacy review, and regulatory checklist for SGROUP ERP
---

# Compliance Audit Workflow

Quy trình kiểm toán tuân thủ PDPA (bảo vệ dữ liệu cá nhân), bảo mật, và các yêu cầu pháp lý.

## When to Trigger
- Quarterly scheduled audit
- Feature mới thu thập/xử lý dữ liệu cá nhân
- Trước major release
- Sau data breach incident
- Tích hợp third-party service mới

## Steps

1. **Scope & Schedule**
   - Xác định scope audit:
     | Area | In Scope | Last Audited |
     |------|---------|-------------|
     | Data collection | ✅ | [date] |
     | Data storage | ✅ | [date] |
     | Data processing | ✅ | [date] |
     | Third-party sharing | ✅ | [date] |
     | User rights | ✅ | [date] |
   - Assign audit team (Compliance Officer + Tech Lead)

2. **Data Inventory & Classification**
   - Map all personal data (tham khảo compliance-officer skill):
     | Data Field | Category | Sensitivity | Storage | Encrypted |
     |-----------|---------|------------|---------|-----------|
     | Full Name | Basic PII | Standard | PostgreSQL | At rest ✅ |
     | Email | Basic PII | Standard | PostgreSQL | At rest ✅ |
     | Phone | Basic PII | Standard | PostgreSQL | At rest ✅ |
     | CCCD/CMND | Sensitive PII | High | PostgreSQL | At rest ✅ |
     | Bank Info | Financial | High | PostgreSQL | At rest ✅ |
     | Password | Credential | Critical | Hashed (bcrypt) | ✅ |
   - Verify data flows: Input → Processing → Storage → Output → Deletion

3. **PDPA / Nghị Định 13 Compliance Check**
   | # | Requirement | Status | Evidence |
   |---|------------|--------|---------|
   | 1 | Consent for data collection | ✅/❌ | Registration form checkbox |
   | 2 | Right to access personal data | ✅/❌ | Profile view endpoint |
   | 3 | Right to correction | ✅/❌ | Profile edit endpoint |
   | 4 | Right to deletion | ✅/❌ | Account deletion flow |
   | 5 | Data processing purpose stated | ✅/❌ | Privacy policy page |
   | 6 | Data breach notification (72h) | ✅/❌ | Incident response plan |
   | 7 | Cross-border transfer consent | ✅/❌ | If using foreign cloud |
   | 8 | Data minimization | ✅/❌ | Only collect necessary data |

4. **Audit Trail Review**
   - Verify audit logging is active (tham khảo compliance-officer skill):
     ```sql
     -- Check audit log coverage
     SELECT entity, action, COUNT(*) 
     FROM audit_logs 
     WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
     GROUP BY entity, action
     ORDER BY entity, action;
     ```
   - Verify logged events:
     - [ ] User login/logout
     - [ ] Data creation/update/deletion
     - [ ] Permission changes
     - [ ] Admin actions
     - [ ] Failed login attempts

5. **Data Retention Check**
   - Verify retention policies are enforced (tham khảo compliance-officer skill):
     | Data Type | Policy | Actual | Compliant |
     |-----------|--------|--------|-----------|
     | User accounts | Active + 2 years | [check] | ✅/❌ |
     | Sales records | 5 years (tax) | [check] | ✅/❌ |
     | Audit logs | 3 years | [check] | ✅/❌ |
     | Session logs | 90 days | [check] | ✅/❌ |
     | Backups | 30 days | [check] | ✅/❌ |
   - Check for data that should have been deleted/anonymized

6. **Third-Party Data Processing Review**
   - Review all third-party services (tham khảo compliance-officer skill):
     | Service | Data Shared | Purpose | DPA Signed | Compliant |
     |---------|-----------|---------|-----------|-----------|
     | GCP/AWS | All (hosted) | Infrastructure | ✅/❌ | ✅/❌ |
     | OpenAI/Gemini | Queries (anonymized) | AI features | ✅/❌ | ✅/❌ |
     | Sentry | Error data | Error tracking | ✅/❌ | ✅/❌ |
   - Verify Data Processing Agreements (DPA) are in place
   - Check data residency requirements (Vietnam/SEA)

7. **Security Controls Audit**
   - Run security review → `/security-review`
   // turbo
   - Dependency audit: `cd sgroup-erp-backend && npm audit`
   - Verify encryption:
     - [ ] Data at rest: AES-256 (database)
     - [ ] Data in transit: TLS 1.3 (HTTPS)
     - [ ] Passwords: bcrypt (≥ 10 rounds)
     - [ ] Backups: encrypted

8. **Generate Compliance Report**
   ```markdown
   # Compliance Audit Report
   **Period**: Q1 2026
   **Auditor**: [Name]
   **Date**: [Date]
   
   ## Summary
   - Overall Compliance: [%]
   - Critical Findings: [N]
   - Recommendations: [N]
   
   ## Findings
   | # | Category | Finding | Severity | Remediation |
   |---|---------|---------|----------|-------------|
   | 1 | PDPA | [finding] | High | [action needed] |
   | 2 | Security | [finding] | Medium | [action needed] |
   
   ## Action Items
   | # | Action | Owner | Due | Priority |
   |---|--------|-------|-----|----------|
   | 1 | [remediation] | [name] | [date] | P1 |
   
   ## Next Audit: [date]
   ```

## Schedule
- **Quarterly**: Full audit (Steps 1-8)
- **Per Release**: Quick check (Steps 3, 4, 7)
- **Per Incident**: Post-breach review (Steps 2, 3, 6, 8)
