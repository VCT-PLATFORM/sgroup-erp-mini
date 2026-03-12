---
name: Compliance Officer
description: Data privacy (PDPA), security compliance, audit trails, and regulatory requirements for SGROUP ERP
---

# Compliance Officer Skill — SGROUP ERP

## Role Overview
The Compliance Officer ensures SGROUP ERP meets legal, regulatory, and security standards — especially Vietnamese data privacy laws (PDPA) and industry best practices.

## Vietnamese Data Privacy (PDPA / Nghị định 13)

### Key Requirements
| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Consent for data collection | Consent checkbox on registration | Required |
| Right to access | User can view all personal data | Required |
| Right to correction | User can edit profile data | Required |
| Right to deletion | Soft delete + data anonymization | Required |
| Data breach notification | 72h notification to authorities | Required |
| Data processing purpose | Clear privacy policy | Required |
| Cross-border transfer consent | Consent for data outside VN | If applicable |

### Personal Data Classification
| Category | Examples | Protection Level |
|----------|---------|-----------------|
| Basic PII | Name, email, phone | Standard |
| Sensitive PII | ID number (CCCD), bank info | High |
| Health Data | (if applicable) | Critical |
| Financial Data | Salary, commission | High |
| Behavioral Data | Usage logs, click streams | Standard |

### Data Retention Policy
| Data Type | Retention | After Retention |
|-----------|-----------|----------------|
| User accounts | Active + 2 years after deactivation | Anonymize |
| Sales records | 5 years (tax requirement) | Archive |
| Audit logs | 3 years | Delete |
| Session logs | 90 days | Delete |
| Backups | 30 days | Auto-delete |

## Audit Trail Implementation

### Audit Log Schema
```prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  action      String   // CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT
  entity      String   // leads, deals, users
  entityId    String?  @map("entity_id")
  oldValue    Json?    @map("old_value")
  newValue    Json?    @map("new_value")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

### Audit Interceptor
```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;

    return next.handle().pipe(
      tap(async (response) => {
        await this.auditService.log({
          userId: user?.id,
          action: this.mapMethodToAction(method),
          entity: this.extractEntity(url),
          entityId: this.extractId(url),
          ipAddress: ip,
          userAgent: headers['user-agent'],
        });
      }),
    );
  }
}
```

## Security Compliance Checklist

### OWASP Top 10 Compliance
| # | Vulnerability | Status | Mitigation |
|---|--------------|--------|-----------|
| 1 | Broken Access Control | ✅ | RBAC guards on all routes |
| 2 | Cryptographic Failures | ✅ | bcrypt, JWT, HTTPS |
| 3 | Injection | ✅ | Prisma parameterized queries |
| 4 | Insecure Design | ✅ | Security reviewed architecture |
| 5 | Security Misconfiguration | ⚠️ | Review settings quarterly |
| 6 | Vulnerable Components | ⚠️ | Run `npm audit` weekly |
| 7 | Auth Failures | ✅ | Rate limiting, strong passwords |
| 8 | Data Integrity Failures | ✅ | Input validation, CSP headers |
| 9 | Logging Failures | ✅ | Audit logs on all actions |
| 10 | SSRF | ✅ | URL validation for external calls |

### Quarterly Security Audit Checklist
- [ ] Run `npm audit` on all packages
- [ ] Review IAM roles and permissions
- [ ] Check for exposed secrets (git history)
- [ ] Verify HTTPS everywhere
- [ ] Review CORS configuration
- [ ] Test rate limiting
- [ ] Verify backup/restore procedures
- [ ] Review audit logs for anomalies
- [ ] Update dependencies with known CVEs
- [ ] Penetration test (annual)

## Data Processing Agreement (DPA)

### Third-Party Services
| Service | Data Shared | Purpose | DPA Status |
|---------|------------|---------|-----------|
| BizFly CRM | Customer data | CRM sync | Required |
| OpenAI / Gemini | Anonymized queries | AI features | Required |
| AWS / GCP | All data (hosted) | Infrastructure | In place |
| Sentry | Error data (no PII) | Error tracking | Review |

## Incident Response

### Data Breach Response Plan
```
1. DETECT (0-1h)
   └── Identify scope, affected data, affected users

2. CONTAIN (1-4h)
   └── Isolate affected systems, revoke compromised credentials

3. NOTIFY (within 72h)
   ├── Notify authorities (Bộ Công an, Bộ TT&TT)
   ├── Notify affected users
   └── Document everything

4. REMEDIATE (1-7 days)
   ├── Fix vulnerability
   ├── Reset affected credentials
   └── Enhance monitoring

5. POST-MORTEM (within 2 weeks)
   └── Lessons learned, prevention measures
```
