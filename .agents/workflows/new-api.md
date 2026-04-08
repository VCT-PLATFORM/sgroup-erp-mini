---
description: How to add a new API endpoint in the Go backend
---
// turbo-all

# /new-api {domain} {method} {path}

AGENT FLOW: Javis → Brian → Sentry → Quinn

## Step 1 — JAVIS: Classify + attach domain
Read shared/domain/{domain}.md. Route to Brian with acceptance criteria.

## Step 2 — BRIAN: Implement endpoint
LOAD shared/domain/{domain}.md

1. Model: `internal/model/{domain}.go`
2. Repository: `internal/repository/{domain}_repo.go`
3. Service: `internal/service/{domain}_service.go`
4. Handler: `internal/handler/{domain}_handler.go`
5. Register route in `cmd/server/main.go`
6. Self-test: `go test ./internal/service/... -race -count=1`

## Step 3 — SENTRY: Auth guard
Add middleware.RequireRole() for the new route.

## Step 4 — BRIAN: Build verify
```powershell
cd D:\VCT PLATFORM\vct-platform\backend ; go build ./... ; go vet ./...
```

