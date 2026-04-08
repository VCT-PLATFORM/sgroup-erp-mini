# SGROUP ERP — Locked Tech Stack

> Source of truth cho toàn bộ agents. KHÔNG thay đổi version mà không có ADR.

## Frontend
| Technology | Version | Package |
|-----------|---------|---------|
| React Web | 19.2.4 | `react`, `react-dom` |
| TailwindCSS | 4.2.x | `tailwindcss`, `@tailwindcss/vite` |
| React Native | 0.85.x | `react-native`, `react` |
| Module Federation | 1.0/Repack | `@callstack/repack`, Vite MF |
| TypeScript | 5.8.x | `typescript` |
| NativeWind | 4.0.x beta | `nativewind`, `tailwindcss` |
| React Navigation | 7.x | `@react-navigation/native` |
| i18next | 26.x | `i18next`, `react-i18next` |
| Lucide | Latest | `lucide-react`, `lucide-react-native` |
| Echarts | Latest | `react-native-echarts`, `echarts` |
| Class Utils | Latest | `clsx`, `tailwind-merge` |

## State Management
| Technology | Purpose |
|-----------|---------|
| Zustand | Lightweight global state (Identity, UI) |
| TanStack Query | Server state, caching, data fetching |

## Backend
| Technology | Version |
|-----------|---------|
| Go | 1.26.2 |
| Gin-Gonic | Latest |
| GORM | Latest |
| pgx/v5 | Latest |

## Database
| Technology | Version |
|-----------|---------|
| PostgreSQL | 18.3 |
| Primary Keys | UUID v7 (NEVER v4) |
| Soft Deletes | `deleted_at TIMESTAMPTZ` |

## Infrastructure
| Technology | Purpose |
|-----------|---------|
| Turborepo | Monorepo pipeline |
| Docker | Containerization |
| GitHub Actions | CI/CD |
| Vercel | Frontend deployment |
| Viettel IDC | Backend/DB hosting |

## Banned
- ❌ Python/Node backends
- ❌ Vue/Angular/Svelte
- ❌ Redux (use Zustand)
- ❌ styled-components/emotion
- ❌ UUID v4
- ❌ Auto-increment IDs
