---
description: How to release and deploy to production
---

# /release {version}

AGENT FLOW: Javis (verify) → Atlas (deploy) → Quinn (smoke test)

## Step 1 — JAVIS: Pre-release checklist
- [ ] All PRs merged, code freeze
- [ ] `turbo run build` passes
- [ ] All tests passing
- [ ] Migrations reviewed (no destructive changes)
- [ ] Rollback plan documented
- [ ] i18n: en.json + vi.json complete

## Step 2 — ATLAS: Tag + deploy
```powershell
cd D:\VCT PLATFORM\vct-platform
git tag -a v{version} -m "Release {version}"
git push origin v{version}
```
Frontend: Push main → Vercel auto-deploys.
Backend: GitHub Actions → Docker build → Viettel IDC deploy.

## Step 3 — QUINN: Smoke test
Run E2E: Login→Dashboard, core feature flows.

## Step 4 — Monitor 1h
Stable → close release.
Issue → rollback: `git revert HEAD ; git push` (< 5 min).
