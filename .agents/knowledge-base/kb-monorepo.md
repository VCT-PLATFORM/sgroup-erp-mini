# KB: Monorepo & Golang Imports (The `backend/` Rule)

**Date Logged**: 2026-04-06
**Context**: Migration from isolated Go repo to Turborepo monorepo.

## The Bug
Agents repeatedly created a separate external directory `vct-backend-go` outside of the `D:\VCT PLATFORM\vct-platform` workspace, causing git history segmentation, workspace fragmentation, and pathing errors.

## The Rule (Permanent)
1. **NO OUTSIDE FOLDERS**: All backend code MUST reside strictly inside `vct-platform/backend/`. NEVER create a directory at the root `D:\VCT PLATFORM\`.
2. **GOLANG MODULE IMPORT PATH**: 
   The `go.mod` is defined at `backend/go.mod`. 
   The module name is `vct-platform/backend`.
   Therefore, ANY internal import must be prefixed with `vct-platform/backend/`.
   
   *Example:*
   ```go
   // CORRECT
   import "vct-platform/backend/internal/model"
   
   // INCORRECT (Will fail go build)
   import "internal/model"
   ```

## Action
Before generating scaffold commands or `main.go`, ensure all imports adhere to this strict path formatting.
