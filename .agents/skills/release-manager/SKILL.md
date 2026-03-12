---
name: Release Manager
description: Release versioning, changelog, RC testing, and production deployment process for SGROUP ERP
---

# Release Manager Skill — SGROUP ERP

## Role Overview
The Release Manager coordinates releases, manages versioning, creates changelogs, and ensures smooth production deployments.

## Versioning Strategy

### Semantic Versioning (SemVer)
```
MAJOR.MINOR.PATCH — e.g., 2.5.3

MAJOR — Breaking changes, incompatible API changes
MINOR — New features, backward compatible
PATCH — Bug fixes, backward compatible
```

### Version Lifecycle
```
Development → Alpha (internal) → Beta (staging) → RC → Production

v2.5.0-alpha.1 → v2.5.0-beta.1 → v2.5.0-rc.1 → v2.5.0
```

## Release Process

### 1. Release Planning (1 week before)
- [ ] Define release scope with PO
- [ ] Review all PRs merged to develop
- [ ] Identify breaking changes
- [ ] Assign testers for RC testing

### 2. Code Freeze (3 days before)
- [ ] Create release branch: `release/v{X.Y.Z}`
- [ ] Only bug fixes allowed after freeze
- [ ] Update version numbers in `package.json`
- [ ] Generate changelog

### 3. RC (Release Candidate) Testing
- [ ] Deploy to staging environment
- [ ] QA runs regression test suite
- [ ] Stakeholders perform UAT
- [ ] Performance benchmarks verified
- [ ] Security scan completed

### 4. Production Deployment
- [ ] Database backup taken
- [ ] Migrations applied (Prisma)
- [ ] Backend deployed
- [ ] Frontend deployed (web + mobile OTA)
- [ ] Health checks pass
- [ ] Smoke tests pass
- [ ] Monitoring dashboards verified

### 5. Post-Release
- [ ] Tag release in Git: `git tag v{X.Y.Z}`
- [ ] Publish release notes
- [ ] Notify stakeholders
- [ ] Monitor error rates for 24h
- [ ] Close sprint/milestone

## Changelog Generation

### Template
```markdown
# Changelog

## [2.5.0] — 2026-03-12

### Added
- AI-powered sales analysis dashboard (#123)
- Offline mode for mobile app (#124)
- Export reports to PDF (#125)

### Changed
- Improved pipeline view performance — 3x faster (#130)
- Updated lead form with auto-fill (#131)

### Fixed
- Fixed login error on iOS 17 (#140)
- Fixed incorrect commission calculation (#141)

### Deprecated
- Old report API `/api/v1/reports` — use `/api/v2/reports`

### Security
- Updated dependencies to fix CVE-2026-xxxxx
```

### Automated Changelog from Git
```bash
# Generate changelog from conventional commits
git log v2.4.0..HEAD --pretty=format:"- %s (%h)" --no-merges

# With categories (if using conventional commits)
# feat: → Added
# fix:  → Fixed
# perf: → Changed
# docs: → Documentation
```

## Rollback Procedures

### Instant Rollback (< 5 minutes)
```bash
# Docker: revert to previous image
docker-compose down
docker tag sgroup-backend:previous sgroup-backend:latest
docker-compose up -d

# Database: skip if no migrations
# If migration was applied, restore backup:
psql -U postgres -d sgroup_erp < backup_before_release.sql
```

### Partial Rollback (Feature Flag)
```typescript
// Feature flags for gradual rollout
const FEATURES = {
  AI_DASHBOARD: process.env.FEATURE_AI_DASHBOARD === 'true',
  OFFLINE_MODE: process.env.FEATURE_OFFLINE_MODE === 'true',
};

// Usage
if (FEATURES.AI_DASHBOARD) {
  // Show AI dashboard
}
```

## Release Metrics
| Metric | Target | Track |
|--------|--------|-------|
| Deployment Frequency | Weekly | Release count/month |
| Lead Time (commit → prod) | < 3 days | Git timestamps |
| Change Failure Rate | < 5% | Hotfixes / releases |
| MTTR (Mean Time to Recover) | < 30 min | Incident logs |
| Rollback Frequency | < 1/month | Rollback count |
