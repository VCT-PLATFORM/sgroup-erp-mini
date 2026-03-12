---
description: Release versioning, changelog, RC testing, and production deployment process
---

# Release Management Workflow

Quy trình quản lý release từ versioning đến deployment production.

## When to Trigger
- Sprint kết thúc với features sẵn sàng ship
- Hotfix đã verified cần release
- Scheduled release date

## Steps

1. **Release Planning**
   - Confirm release scope (stories hoàn thành & tested)
   - Assign version number (Semantic Versioning):
     ```
     MAJOR.MINOR.PATCH
     1.0.0 → First release
     1.1.0 → New feature (backward compatible)
     1.1.1 → Bug fix
     2.0.0 → Breaking change
     ```
   - Set release date & cutoff for new changes

2. **Pre-Release Checklist**
   - [ ] All sprint stories completed & merged to `develop`
   - [ ] No P0/P1 bugs outstanding
   - [ ] Code review completed → `/code-review`
   - [ ] All tests passing → `/testing`
   - [ ] Security review completed → `/security-review`
   - [ ] Performance targets met → `/performance-testing`
   - [ ] Database migrations ready & reviewed
   - [ ] Documentation updated

3. **Create Release Candidate**
   ```bash
   # Create RC branch from develop
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   
   # Update version
   cd sgroup-erp-backend && npm version 1.2.0 --no-git-tag-version
   cd ../SGROUP-ERP-UNIVERSAL && npm version 1.2.0 --no-git-tag-version
   
   # Commit version bump
   git add -A && git commit -m "chore: bump version to v1.2.0"
   git push origin release/v1.2.0
   ```

4. **RC Testing (Staging)**
   - Deploy RC to staging environment → `/deployment`
   - Smoke test all critical flows:
     - [ ] Login / Logout
     - [ ] Core CRUD operations
     - [ ] New features in this release
     - [ ] API health check
     - [ ] Database connectivity
   - Regression test impacted areas
   - Fix any bugs found → commit to release branch

5. **Generate Changelog**
   ```markdown
   # Changelog v1.2.0 (2026-03-12)
   
   ## ✨ New Features
   - **[FEAT-123]** Thêm quản lý lead mới
   - **[FEAT-124]** Dashboard phân tích bán hàng
   
   ## 🐛 Bug Fixes
   - **[BUG-456]** Fix lỗi hiển thị chart
   - **[BUG-457]** Fix validate form tạo lead
   
   ## 🔧 Improvements
   - Tối ưu query database (giảm 40% response time)
   - Cập nhật UI theo SGDS design system
   
   ## ⚠️ Breaking Changes
   - API `/api/leads` response format changed (see migration guide)
   
   ## 📦 Dependencies
   - Updated NestJS to v11.x
   - Updated Prisma to v6.x
   ```

6. **Go / No-Go Decision**
   | Criteria | Status | Required |
   |----------|--------|----------|
   | All tests passing | ✅/❌ | MUST |
   | No P0/P1 bugs | ✅/❌ | MUST |
   | Security review passed | ✅/❌ | MUST |
   | Performance targets met | ✅/❌ | SHOULD |
   | Stakeholder sign-off | ✅/❌ | MUST |
   | Rollback plan documented | ✅/❌ | MUST |
   
   **Decision**: ✅ GO → proceed to step 7 | ❌ NO-GO → fix issues, re-test

7. **Production Deployment**
   ```bash
   # Merge release to main
   git checkout main
   git merge release/v1.2.0
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin main --tags
   
   # Merge back to develop
   git checkout develop
   git merge release/v1.2.0
   git push origin develop
   
   # Delete release branch
   git branch -d release/v1.2.0
   ```
   - Deploy to production → Chạy `/deployment`

8. **Post-Release**
   - Monitor error rates for 1-2 hours → `/monitoring-setup`
   - Notify stakeholders of successful release
   - Close all resolved tickets
   - Archive release notes
   - If issues arise → Chạy `/incident-management` hoặc `/hotfix`

## Next Workflow
→ `/deployment` for actual deployment steps
→ `/monitoring-setup` for post-release monitoring
