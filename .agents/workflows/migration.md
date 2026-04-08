---
description: How to create and apply database migrations safely
---

# /migration {description}

AGENT FLOW: Javis → Jenny → Brian → Atlas

## Step 1 — JAVIS: Attach domain context
Read shared/domain/{module}.md. Route to Jenny with entity + rules.

## Step 2 — JENNY: Create migration files
LOAD shared/domain/{module}.md
```powershell
$seq = (Get-ChildItem "D:\VCT PLATFORM\vct-platform\backend\migrations\*.up.sql" -ErrorAction SilentlyContinue | Measure-Object).Count + 1
$name = "{description}"
New-Item "D:\VCT PLATFORM\vct-platform\backend\migrations\${seq}_${name}.up.sql" -Force
New-Item "D:\VCT PLATFORM\vct-platform\backend\migrations\${seq}_${name}.down.sql" -Force
```
Write SQL. Self-check per AGENT.md.

## Step 3 — BRIAN: Update repository code
Update Go model + repository to match new schema.
Self-test: `go test ./... -race -count=1`

## Step 4 — Verify locally
```powershell
# Apply → verify → rollback → re-apply
docker exec -it vct-postgres psql -U vct_admin -d vct_platform -f /migrations/{seq}_{name}.up.sql
docker exec -it vct-postgres psql -U vct_admin -d vct_platform -f /migrations/{seq}_{name}.down.sql
docker exec -it vct-postgres psql -U vct_admin -d vct_platform -f /migrations/{seq}_{name}.up.sql
```

