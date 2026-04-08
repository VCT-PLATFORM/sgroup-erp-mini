---
description: How to build a complete module end-to-end (full-stack)
---
// turbo-all

# /build-module {module}

End-to-end full-stack build for a single module.
AGENT FLOW: Javis → Jenny → Brian → Sentry → Fiona → Quinn → Atlas
DOMAIN: LOAD shared/domain/{module}.md at EVERY step.
API: Follow shared/api-contract.md for all endpoints.
DONE: Check shared/module-done.md at the end.

## Step 0 — JAVIS: Git Sandboxing (V19 Guardrail)
```powershell
cd "D:\VCT PLATFORM\vct-platform"
git checkout -b "feat/module-{module}"
```
*Crucial: Do not perform any file generation on the `main` branch.*

## Step 1 — JAVIS: Prerequisites
Verify all target directories exist before starting:
```powershell
@("D:\VCT PLATFORM\vct-platform\backend\migrations","D:\VCT PLATFORM\vct-platform\backend\internal\model","D:\VCT PLATFORM\vct-platform\backend\internal\repository","D:\VCT PLATFORM\vct-platform\backend\internal\service","D:\VCT PLATFORM\vct-platform\backend\internal\handler") | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ }
```
If backend doesn't exist: scaffold it first (`go mod init backend`).

## Step 2 — JAVIS: Plan
Read shared/domain/{module}.md. List entities, endpoints needed, pages needed.
Read shared/roadmap.md — verify this module's dependencies are already built.

## Step 3 — JENNY: Schema
```powershell
$seq = (Get-ChildItem "D:\VCT PLATFORM\vct-platform\backend\migrations\*.up.sql" -ErrorAction SilentlyContinue | Measure-Object).Count + 1
New-Item "D:\VCT PLATFORM\vct-platform\backend\migrations\${seq}_{module}.up.sql" -Force
New-Item "D:\VCT PLATFORM\vct-platform\backend\migrations\${seq}_{module}.down.sql" -Force
```
Write SQL from domain entities. Self-check: constraints, rollback.

## Step 4 — BRIAN: API
Create: model → repo (interface+impl) → service → handler → register route.
Follow api-contract.md: URL pattern, response schema, error codes.
Self-test: `cd backend ; go test ./internal/service/... -race -count=1`

## Step 5 — SENTRY: Auth
Add RequireRole() middleware per federation.md RBAC matrix.
Validate inputs on all write endpoints.

## Step 6 — FIONA: Frontend
```powershell
$base = "D:\VCT PLATFORM\vct-platform\core\shell\src\features\{module}"
New-Item -ItemType Directory -Force -Path "$base\components","$base\hooks","$base\api","$base\types"
```
Create: types (match API response) → api hooks (TanStack Query) → pages (list+detail+form) → barrel export.
Add i18n keys to en.json + vi.json. Add lazy route to App.tsx.

## Step 7 — QUINN: Tests
Write: unit tests for components + E2E smoke (create→view→edit→delete).
`npx vitest run --coverage`

## Step 8 — ATLAS: Build verify
```powershell
cd D:\VCT PLATFORM\vct-platform ; npx turbo run build
```

## Step 9 — JAVIS: Verify DONE
Run through shared/module-done.md checklist. All boxes checked → module DONE. Do NOT merge to main, trigger `/code-review` workflow first.

