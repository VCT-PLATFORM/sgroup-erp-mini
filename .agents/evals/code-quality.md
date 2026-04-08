# Eval: Code Quality (V15)

## Dimensions (Score 1-5 each, total /30)
1. Correctness — Logic, edge cases, acceptance criteria met
2. Type Safety — Zero any, import type, strict nulls, exhaustive switch
3. Domain Compliance — Matches entities/rules/validations from shared/domain/
4. Performance — No N+1, no unnecessary re-renders, lazy routes, API <200ms
5. Standards — File naming, commit format, code patterns per AGENT.md
6. Security — Input validation, auth/RBAC guards, no injection

## Gates
≥25/30: APPROVE
15-24:  REQUEST_CHANGES
<15:    REJECT (rewrite)

## Per-Stack Checks

TypeScript: zero any | import type | named exports | Interface > Type
React: FC<Props> | t() | cn() | TanStack Query | Error Boundaries
Go: Handler→Service→Repo | ctx first arg | no SQL in handlers | slog
SQL: UUID v7 | soft delete | FK indexes | CHECK enums | .down.sql exists
