# KB: Module Placement — NEVER Put Features in core/shell

**Date Logged**: 2026-04-07
**Context**: Major structural violation caught by Chairman.

## The Bug
Agent placed all 10 feature modules inside `core/shell/src/features/`, creating a monolith. 
The correct placement is `modules/{name}/web/src/` — each module as an independent NPM workspace package (`@vct/{name}`).

## The Rules (Permanent)
1. **`core/shell/`** is ONLY for: App Router, Layouts, Error Boundaries, Auth/Portal pages. Nothing else.
2. **`core/packages/`** is for shared horizontal layers: `@vct/ui`, `@vct/utils`, `@vct/rbac`.
3. **`modules/{name}/web/`** is where ALL domain feature code lives. Each module MUST have its own `package.json` with name `@vct/{name}`.
4. **`modules/{name}/backend/`** is for module-specific backend config.
5. **`backend/services/{name}-svc/`** is for Go microservice code.
6. **App.tsx imports** must use workspace package names: `import { X } from '@vct/module-name'`, NEVER `./features/`.

## Evidence
```json
// package.json workspaces prove the architecture:
"workspaces": [
    "core/packages/*",     // Shared packages
    "core/shell",          // Shell ONLY
    "modules/*/web",       // Feature modules HERE
    "modules/*/backend"
]
```

## Pre-Flight Check
Before writing ANY frontend feature file, verify: "Am I writing into `modules/{name}/web/src/`?" If not, STOP.
