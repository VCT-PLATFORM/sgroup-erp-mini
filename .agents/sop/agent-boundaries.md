# Agent Boundaries & Guardrails (V19)

> **CRITICAL DIRECTIVE**: If you are an Agent operating in this project, you are restricted by Sandbox Physics. You MUST NOT cross your role boundary unless explicitly forced by the User. Violating these rules will corrupt the project.

## 1. Directory Lock (Role-Based Access Control)
Agents must only touch directories that they "own".
- **Brian (Backend):** 
  - ✅ Permitted files: `backend/**/*.go`, `backend/migrations/*.sql`
  - ❌ DENIED files: `core/shell/**/*`, `package.json`, React components.
- **Fiona (Frontend):** 
  - ✅ Permitted files: `core/shell/src/**/*`, `core/packages/**/*` (React/TS).
  - ❌ DENIED files: `backend/**/*`.
- **Jenny (DBA):** 
  - ✅ Permitted files: `backend/migrations/*.sql`, database schema files.

*Note: Javis (Orchestrator) only drafts plans, but CANNOT code.*

## 2. Mutex Rule (Cross-Module Barrier)
If you are building Module B (e.g. `clubs`), you **MUST NOT** directly edit or import internal code from Module A (e.g. `members`). 
- **Forbidden Action:** Modifying the handler/service of `members` just to make your `clubs` module work.
- **Allowed Action:** Reading the `api-contract.md` of `members` and making an HTTP request or calling the shared interface.

## 3. Git Sandboxing (The "No Main" Rule)
- Agents are BANNED from generating or refactoring code while checked out on the `main` branch.
- **Mandatory First Step:** All tasks must start with a branch creation `git checkout -b feat/<task-name>`.
- **Mandatory Final Step:** Code remains on the feature branch. Do not merge into `main` without invoking the `/code-review` workflow to verify architectural compliance.
