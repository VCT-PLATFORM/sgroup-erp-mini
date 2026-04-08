# Eval: Build Health (V15)

## Frontend
  npx tsc -b --noEmit    → 0 errors
  npx vite build         → exits 0, dist/ created
  Target: build <30s, bundle <500KB gzipped

## Backend
  go build ./...         → exits 0
  go vet ./...           → 0 warnings
  Target: compile <10s

## Full Pipeline
  npx turbo run build    → all tasks exit 0

## Domain Completeness
  Every module in shared/domain/ that has been built should have:
  - Frontend page(s) in core/shell/src/features/
  - Backend API in backend/internal/
  - Migration in migrations/
  - i18n keys in en.json + vi.json

