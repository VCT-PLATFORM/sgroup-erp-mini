---
description: Production incident response, escalation, communication, and blameless postmortem
---

# Incident Management Workflow

Quy trình xử lý sự cố production — từ phát hiện đến khắc phục và rút kinh nghiệm.

## Severity Classification

| Level | Definition | Response | Escalation |
|-------|-----------|----------|-----------|
| 🔴 **P0** — Critical | System down, data breach | ≤ 5 min | CTO + Team |
| 🟠 **P1** — High | Core feature broken | ≤ 15 min | Tech Lead + Dev |
| 🟡 **P2** — Medium | Non-core feature broken | ≤ 1 hour | Dev on-call |
| 🟢 **P3** — Low | Minor UI issue, cosmetic | Next business day | Backlog item |

## Steps

### Phase 1: Detection & Alert (≤ 5 min)

1. **Incident Detected**
   - Sources: Monitoring alert, user report, team discovery
   - Classify severity (P0–P3)
   - Assign Incident Commander (IC)

2. **Notify Stakeholders**
   ```
   🚨 INCIDENT ALERT
   Severity: [P0/P1/P2/P3]
   Summary: [1-line summary]
   Impact: [What users see]
   Status: Investigating
   IC: [Name]
   ```

### Phase 2: Investigation (≤ 30 min)

3. **Assess Impact**
   - How many users affected?
   - Which features impacted?
   - Is data integrity at risk?
   - Is the issue spreading?

4. **Investigate Root Cause**
   - Check monitoring dashboards:
     ```bash
     # Check backend logs
     docker-compose logs -f backend --tail=200
     
     # Check database connectivity
     cd sgroup-erp-backend && npx prisma db execute --stdin <<< "SELECT 1"
     
     # Check system resources
     docker stats
     ```
   - Check recent deployments: `git log -5 --oneline`
   - Check database changes: recent migrations
   - Check external dependencies (third-party APIs)

### Phase 3: Mitigation (≤ 1 hour)

5. **Decide Action**
   | Option | When to Use |
   |--------|-----------|
   | 🔄 Rollback | Caused by recent deployment |
   | 🔧 Hotfix | Known fix, < 30 min to implement |
   | 🛡️ Mitigate | Can reduce impact while investigating |
   | ⏸️ Feature toggle | Disable broken feature |

6. **Execute Mitigation**
   - Rollback → follow `/deployment` rollback steps
   - Hotfix → follow `/hotfix` workflow
   - Feature toggle → disable in configuration
   - Scale → increase replicas if load issue

7. **Update Stakeholders**
   ```
   📊 INCIDENT UPDATE
   Severity: [P0/P1/P2/P3]
   Status: Mitigating / Resolved
   Root Cause: [brief]
   Action Taken: [what was done]
   ETA Resolution: [time estimate]
   ```

### Phase 4: Resolution

8. **Verify Resolution**
   - Confirm service fully restored
   - Monitor error rates return to normal
   - Verify no data loss or corruption
   - Check related systems for side effects

9. **Close Incident**
   ```
   ✅ INCIDENT RESOLVED
   Severity: [P0/P1/P2/P3]
   Duration: [total downtime]
   Root Cause: [brief]
   Resolution: [what was done]
   Action Items: [preventing recurrence]
   ```

### Phase 5: Post-Incident Review (within 72 hours)

10. **Blameless Post-Mortem**
    ```markdown
    # Post-Mortem: [Incident Title]
    
    ## Summary
    [1 paragraph description]
    
    ## Timeline (UTC+7)
    | Time | Event |
    |------|-------|
    | HH:MM | Incident detected by [source] |
    | HH:MM | IC assigned: [name] |
    | HH:MM | Root cause identified |
    | HH:MM | Mitigation applied |
    | HH:MM | Service fully restored |
    
    ## Root Cause Analysis (5 Whys)
    1. Why did the service fail? → [answer]
    2. Why did [answer]? → [deeper answer]
    3. Why... (continue until root)
    
    ## What Went Well  
    - [positive observations]
    
    ## What Went Wrong
    - [areas for improvement]
    
    ## Action Items
    | # | Action | Owner | Priority | Due |
    |---|--------|-------|----------|-----|
    | 1 | Add alerting for X | DevOps | P1 | 1 week |
    | 2 | Add test for scenario | Dev | P2 | Sprint |
    | 3 | Update runbook | Team | P3 | Sprint |
    ```
    - **RULE: Blameless** — Focus on systems and processes, not individuals
    - Share learnings với team → `/knowledge-sharing`
