# Module Definition-of-Done

A module is DONE when ALL checkboxes pass:

## Database (Jenny)
- [ ] Migration .up.sql creates all tables from shared/domain/{module}.md
- [ ] Migration .down.sql reverses .up.sql exactly
- [ ] UUID v7 PKs, soft deletes, FK indexes, CHECK constraints
- [ ] Apply → rollback → re-apply succeeds (idempotent)

## Backend API (Brian)
- [ ] All CRUD endpoints per api-contract.md URL pattern
- [ ] Non-CRUD action endpoints (transfer, approve, etc.) if needed
- [ ] Response schema matches api-contract.md exactly
- [ ] Error codes follow {MODULE}_{ACTION}_{REASON} convention
- [ ] Self-tests: go test ./internal/service/{module}... passes
- [ ] go build && go vet clean

## Auth (Sentry)
- [ ] RBAC middleware on every endpoint per shared/domain/federation.md matrix
- [ ] Input validation/sanitization on all write endpoints

## Frontend (Fiona)
- [ ] List page with pagination, sort, filter
- [ ] Detail/view page
- [ ] Create/edit form with validation
- [ ] Delete (with confirmation dialog)
- [ ] All strings via t() — keys in both en.json + vi.json
- [ ] All className via cn()
- [ ] Lazy-loaded route registered in App.tsx
- [ ] Error boundary wrapping feature
- [ ] Domain rules from shared/domain/{module}.md correctly displayed

## Tests (Quinn)
- [ ] Unit tests for key components (≥70% coverage for standard, ≥90% for critical)
- [ ] E2E smoke: navigate to page → create → view → edit → delete
- [ ] Domain edge cases tested (from shared/domain/{module}.md)
- [ ] npx vitest run passes

## Build (Atlas)
- [ ] npx turbo run build exits 0
- [ ] No new TypeScript errors
- [ ] No console warnings in build output
