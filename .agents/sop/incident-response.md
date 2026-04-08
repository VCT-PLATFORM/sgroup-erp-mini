# SOP: Incident Response

> **Actor:** Atlas (infra) + Javis (coordinate) + Domain agent (fix)
> **Trigger:** System down, major feature broken, security breach

## Severity Classification
| Severity | Criteria | Response | Escalation |
|---------|---------|----------|------------|
| SEV1 | System down, all users | <15 min | Chairman + All agents |
| SEV2 | Major feature broken | <30 min | Javis + Domain agent |
| SEV3 | Minor feature issue | <2h | Domain agent |
| SEV4 | Cosmetic / low impact | Next day | Domain agent |

## Response Steps
### 1. DETECT & CLASSIFY
- How detected: monitoring / user report / agent discovery
- What affected: which service/feature
- Who affected: all users / segment / internal
- Classify severity: SEV1-4

### 2. IMMEDIATE TRIAGE
```
Can we ROLLBACK?        → Fastest fix
Can we FEATURE FLAG?    → Isolate broken feature
Can we SCALE UP?        → If load related
Need HOTFIX?           → See /hotfix workflow
```

### 3. FIX & VERIFY
- Deploy fix → verify → monitor 1h
- Confirm no data loss or corruption
- Run regression tests (Quinn)

### 4. POST-MORTEM (within 72h)
- Use `templates/post-mortem.md`
- BLAMELESS — focus on system improvement
- Action items: Owner + Deadline + Priority
