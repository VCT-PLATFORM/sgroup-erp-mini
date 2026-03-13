---
description: Emergency hotfix workflow for critical production issues
---

# Hotfix Workflow

Quy trình sửa lỗi khẩn cấp trên production — fast-track từ triage đến deploy.

## When to Trigger
- 🔴 **P0** — System down, data loss, security breach
- 🟠 **P1** — Core feature broken, significant user impact

## Steps

1. **Triage (≤ 15 min)**
   - Confirm issue severity:
     | Severity | Definition | Response Time |
     |----------|-----------|---------------|
     | 🔴 P0 | System down / Data loss | Immediate |
     | 🟠 P1 | Core feature broken | ≤ 1 hour |
   - Identify affected users & scope of impact
   - Notify team lead & stakeholders
   - Decide: Hotfix or Rollback?

2. **Create Hotfix Branch**
   ```bash
   # Branch from main (production)
   git checkout main
   git pull origin main
   git checkout -b hotfix/fix-critical-bug-description
   ```

3. **Root Cause Analysis (≤ 30 min)**
   - Check production logs:
     ```bash
     docker-compose logs -f backend --tail=100
     ```
   - Check error monitoring (Sentry)
   - Reproduce issue locally if possible
   - Identify root cause → Chạy `/debug` nếu cần chi tiết

4. **Implement Fix**
   - Make minimal, targeted change
   - Nguyên tắc:
     - ❌ KHÔNG refactor cùng lúc
     - ❌ KHÔNG thêm feature mới
     - ✅ CHỈ fix exact issue
     - ✅ Thêm test cover bug case
   - Add comment explaining the fix:
     ```typescript
     // HOTFIX: [date] — Fix [issue description]
     // Root cause: [brief explanation]
     ```

5. **Fast-Track Review (≤ 15 min)**
   - Peer review bởi 1 senior dev
   - Review checklist (abbreviated):
     - [ ] Fix addresses root cause (not symptom)
     - [ ] No unrelated changes
     - [ ] Test added for the bug case
     - [ ] No new lint/type errors
   // turbo
   - Type check: `cd sgroup-erp-backend && npx tsc --noEmit`
   // turbo
   - Run tests: `cd sgroup-erp-backend && npm test`

6. **Deploy Hotfix**
   ```bash
   # Merge to main
   git checkout main
   git merge hotfix/fix-critical-bug-description
   git tag -a v1.2.1 -m "Hotfix: [description]"
   git push origin main --tags
   
   # Merge to develop
   git checkout develop
   git merge hotfix/fix-critical-bug-description
   git push origin develop
   
   # Delete hotfix branch
   git branch -d hotfix/fix-critical-bug-description
   ```
   - **Backend**: Deploy to production → Chạy `/deployment`
   - **Frontend (Vercel)**: Auto-deploys on push to main. Verify at https://sgroup-erp.vercel.app
   - **Frontend rollback**: Revert to previous deployment in Vercel Dashboard → Deployments → "..." → Promote

7. **Verify in Production**
   - Confirm fix resolves the issue
   - **Frontend checks**:
     - [ ] Page loads without crash
     - [ ] No errors in browser console
     - [ ] Data displays correctly
     - [ ] Login/auth still works
   - **Backend checks**:
     - [ ] API endpoints respond correctly
     - [ ] Error rates normal
   - Monitor for 30 minutes
   - Confirm no regression in related features
   - Update stakeholders: "Issue resolved"

8. **Post-Mortem (within 48 hours)**
   ```markdown
   # Post-Mortem: [Issue Title]
   **Date**: [date]
   **Severity**: P0/P1
   **Duration**: [time from detection to resolution]
   
   ## Timeline
   - HH:MM — Issue detected
   - HH:MM — Team notified
   - HH:MM — Root cause identified
   - HH:MM — Fix deployed
   - HH:MM — Verified in production
   
   ## Root Cause
   [Detailed explanation]
   
   ## Impact
   - Users affected: [number]
   - Duration: [time]
   
   ## Action Items (Prevent Recurrence)
   | # | Action | Owner | Due |
   |---|--------|-------|-----|
   | 1 | Add monitoring alert | DevOps | 1 week |
   | 2 | Add regression test | Dev | Next sprint |
   | 3 | Update documentation | Dev | Next sprint |
   ```
   - **Blameless** — Focus on process, not people
