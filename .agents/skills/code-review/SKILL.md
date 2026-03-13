---
name: Code Review
description: Systematic code review skill for maintaining code quality in the SGROUP ERP project
---

# Code Review Skill — SGROUP ERP

## Overview
Use this skill when reviewing code changes (PRs, commits, or file modifications) to ensure quality, consistency, and maintainability.

## Review Checklist

### 1. TypeScript Quality
- [ ] No `any` types — use proper interfaces/types
- [ ] All functions have explicit return types
- [ ] Interfaces are properly defined and exported
- [ ] Generic types used where appropriate
- [ ] No type assertions (`as`) unless absolutely necessary and documented

### 2. Architecture & Patterns
- [ ] Follows established module/feature structure
- [ ] Components are properly separated (presentation vs. logic)
- [ ] State management uses Zustand stores (no prop drilling)
- [ ] API calls go through proper service layers
- [ ] No circular dependencies

### 3. Error Handling
- [ ] All async operations have error handling (try/catch or .catch())
- [ ] User-facing errors show meaningful messages
- [ ] Network errors handled gracefully with retry/fallback
- [ ] Edge cases considered (empty arrays, null values, undefined)

### 4. Performance
- [ ] No unnecessary re-renders (check deps in useEffect, useMemo, useCallback)
- [ ] Large lists use virtualization (FlatList, not ScrollView with map)
- [ ] Images properly sized and cached
- [ ] No memory leaks (cleanup in useEffect)
- [ ] Database queries are optimized (proper indexes, select only needed fields)

### 5. Security
- [ ] No sensitive data in console.log or error messages
- [ ] Input validation on both frontend and backend
- [ ] SQL injection prevention (using Prisma parameterized queries)
- [ ] XSS prevention (no dangerouslySetInnerHTML)
- [ ] Authentication/authorization checks on all protected routes

### 6. Naming & Readability
- [ ] Variable/function names are descriptive and follow conventions
- [ ] Components use PascalCase, functions use camelCase
- [ ] Files follow naming conventions (see frontend-dev skill)
- [ ] Comments explain "why", not "what"
- [ ] No dead/commented-out code

### 7. Testing
- [ ] New features have corresponding tests
- [ ] Edge cases covered in tests
- [ ] Test descriptions are clear and specific
- [ ] Mocks are properly set up and cleaned up

## Review Process

### Step 1: Understand Context
1. Read the PR description / task requirements
2. Identify all changed files
3. Understand the feature being implemented

### Step 2: Review Architecture
1. Check file placement and module structure
2. Verify dependencies and imports
3. Look for separation of concerns

### Step 3: Line-by-Line Review
1. Check each file against the checklist above
2. Look for bugs, edge cases, and potential issues
3. Verify TypeScript types are correct

### Step 4: Integration Check
1. How do changes affect existing features?
2. Are there breaking changes?
3. Is backward compatibility maintained?

### Step 5: Provide Feedback
Use this format for feedback:

```
🔴 BLOCKER: [Critical issue that must be fixed]
🟡 SUGGESTION: [Improvement that would be good to have]
🟢 NICE: [Something done well, encourage good practices]
💡 QUESTION: [Clarification needed]
```

## Common Anti-Patterns to Flag

| Anti-Pattern | Better Approach |
|---|---|
| God component (500+ lines) | Split into smaller components |
| Prop drilling (3+ levels) | Use Zustand store |
| Inline styles | `StyleSheet.create()` |
| Hardcoded strings/colors | Theme constants |
| `useEffect` for derived state | `useMemo` |
| Fetch in component | Custom hook or React Query |
| `any` type | Proper interface |
| Nested ternaries | Early returns or switch |

## Common Bug Checklist (from SGROUP ERP Experience)

**Run through this checklist for EVERY code change:**

### Data Safety
- [ ] Every `.map()`, `.filter()`, `.find()` is preceded by `Array.isArray()` check
- [ ] API response is normalized: handles both `data[]` and `{ data: data[] }` formats
- [ ] All nested property access uses optional chaining (`?.`)
- [ ] Default values provided via nullish coalescing (`?? defaultValue`)

### Error Handling
- [ ] ErrorBoundary wraps the feature module
- [ ] All `async` functions have `try/catch`
- [ ] 401 errors trigger token cleanup + redirect to login
- [ ] 403 errors show user-friendly "Access Denied" message (not crash)
- [ ] Network errors show retry option
- [ ] Loading state shown during data fetch (`SGSkeleton`)
- [ ] Empty state shown when data array is empty (`SGEmptyState`)
- [ ] Error message is human-readable, not raw JSON/object

### Auth & Authorization
- [ ] Protected endpoints use `@UseGuards(JwtAuthGuard)`
- [ ] Role-based access uses `@Roles()` decorator
- [ ] Frontend checks user role before showing restricted UI
- [ ] Token refresh/expiry handled by Axios interceptor

### Data Display
- [ ] Numbers formatted with `toLocaleString()` or `Intl.NumberFormat`
- [ ] Dates formatted consistently (use dayjs or date-fns)
- [ ] User names use `name` field (not `fullName` which doesn't exist)
- [ ] Team assignment matches by `email`, not `teamId` (which may not exist on AuthUser)

