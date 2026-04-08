# TASK ROUTING — Agent Dispatch (V15, 8 Agents)

Javis dùng bảng này để route task. Mỗi task → 1 agent lead.

## Route Table
| Keywords | Agent | Owned Files |
|----------|-------|-------------|
| Decompose, plan, ADR, architecture | JAVIS | ROUTING.md, templates/ |
| React Web, React Native, component, screen, route | FIONA | modules/*/web/, modules/*/app/, core/ |
| Go API, handler, service, repository, endpoint | BRIAN | modules/*/api/, core/api-gateway/ |
| SQL, migration, schema, table, index, database | JENNY | modules/*/api/migrations/, modules/*/api/db* |
| @sgroup/ui, design token, NativeWind, reusable UI | NOVA | packages/ui/ |
| Docker, CI/CD, GitHub Actions, deploy, Turborepo | ATLAS | infra/, .github/, turbo.json |
| Test, E2E, Vitest, Playwright, coverage | QUINN | **/*.test.*, e2e/ |
| JWT, auth, RBAC, permission, security, login | SENTRY | rbac/, middleware/ |

## Cross-Domain Flows
| Task | Agent Flow |
|------|-----------|
| Full-stack feature | JAVIS → Jenny → Brian → Sentry → Fiona → Quinn → Atlas |
| New API endpoint | JAVIS → Brian → Sentry |
| New UI page | JAVIS → Fiona (+ Nova if new shared component) |
| Schema change | JAVIS → Jenny → Brian |
| Auth change | JAVIS → Sentry |
| Bug fix | JAVIS → Domain Agent (+ Quinn regression test) |
| Hotfix (P0) | JAVIS → Domain Agent → Atlas |

## Domain Context Rule
ALWAYS tell agent: "LOAD shared/domain/{module}.md before coding"

## Priority
P0 Immediate: Build broken, data loss, security breach
P1 Same day: Feature blocking, auth issue
P2 2-3 days: New feature, enhancement
P3 Backlog: Tech debt, optimization

