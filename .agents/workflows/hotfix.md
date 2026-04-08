---
description: How to deploy an emergency hotfix to production
---

# /hotfix {description}

AGENT FLOW: Javis → Domain Agent → Atlas
SLA: Fix deployed within 30 minutes.

## Step 1 — JAVIS: Classify + route
Identify affected domain + agent. P0 priority.

## Step 2 — DOMAIN AGENT: Minimal fix
```powershell
cd D:\VCT PLATFORM\vct-platform
git checkout main ; git pull origin main
git checkout -b hotfix/{agent}-{description}
```
Fix the specific bug. MAX 50 lines. NO refactoring. NO features.
Write regression test. Self-check per AGENT.md checklist.

## Step 3 — ATLAS: Build + deploy
```powershell
cd D:\VCT PLATFORM\vct-platform
npx turbo run build
git checkout main ; git merge hotfix/{agent}-{description}
git push origin main
```

## Step 4 — Monitor 30 min
Stable → close. Regression → `git revert HEAD ; git push`.

## Step 5 — Post-mortem (if SEV1/SEV2)
Use templates/post-mortem.md. Blameless. Action items with owner + deadline.
