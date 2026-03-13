---
description: Systematic debugging workflow for SGROUP ERP issues
---

# Debug Workflow

Use this workflow when diagnosing and fixing bugs in SGROUP ERP.

## Step 0 — Bug Classification

Identify the bug type before diving in:

| Type | Symptoms | Start Here |
|------|----------|------------|
| 🔴 **Crash** | White screen, error boundary triggered | Step 2 → Console |
| 🟡 **Logic** | Wrong data, wrong calculation | Step 3 → Data flow |
| 🟠 **UI** | Layout broken, styling off | Step 2 → Browser DevTools |
| 🔵 **Auth** | 401/403 errors, login loop | Step 3 → Network tab |
| 🟣 **API** | Data not loading, wrong response | Step 3 → Backend logs |
| ⚫ **Build** | TypeScript errors, module not found | Step 2 → tsc check |

## Steps

1. **Reproduce the Issue**
   - Identify exact steps to reproduce
   - Note the expected vs. actual behavior
   - Check browser console / terminal for errors
   - Take screenshots if UI-related
   - Try in both web (localhost:8081) and check Expo terminal

2. **Gather Context**
   - Which module is affected? (sales, planning, auth, etc.)
   - Frontend, backend, or database issue?
   // turbo
   - Check recent commits: `git log -n 10 --oneline`
   // turbo
   - Check recent file changes: `git diff --name-only HEAD~5`
   // turbo
   - Check Expo dev server: look for red error overlay in terminal

3. **Isolate the Problem**
   - **Frontend issues**:
     - Check browser DevTools Console for errors
     - Check Network tab for failed API calls (401, 403, 500)
     - Look for `TypeError: X.map is not a function` → Array.isArray issue
     - Look for `Cannot read property of undefined` → optional chaining needed
     - Check if ErrorBoundary caught the error (fallback UI shown)
     // turbo
     - Check TypeScript: `cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit`

   - **Backend issues**:
     - Check server logs / terminal output
     - Test API endpoint directly: `curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/endpoint`
     - Check if guard/authorization is blocking (403)
     - Check if JWT token is expired (401)
     // turbo
     - Check TypeScript: `cd sgroup-erp-backend && npx tsc --noEmit`

   - **Database issues**:
     - Check Prisma Studio: `cd sgroup-erp-backend && npx prisma studio`
     - Verify schema matches expectations
     - Check for missing migrations
     - Check Neon dashboard for connection issues

4. **Root Cause Analysis**
   - Trace the data flow from input to output
   - Identify where the data/behavior diverges
   - Check for edge cases (null, undefined, empty arrays, object vs array)
   - Look for recent changes that could have introduced the bug
   - **Check API response format**: is it `data[]` or `{ data: data[] }`?

5. **Implement Fix**
   - Make the minimal change needed to fix the issue
   - Apply appropriate defensive pattern (see Common Fixes below)
   - Add error handling if missing
   - Add null/undefined checks if needed

6. **Verify Fix**
   - Reproduce original steps — bug should be gone
   - Check no regression in related features
   - Test on web (localhost:8081)
   // turbo
   - Run tests: `cd sgroup-erp-backend && npm test`
   // turbo
   - Type check: `cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit`

7. **Document**
   - Add comment explaining why the fix was needed (if non-obvious)
   - Update relevant tests to cover this case

---

## Common SGROUP ERP Bug Patterns & Quick Fixes

### 🔴 Crash: `X.map is not a function` / `X.find is not a function`
**Root Cause**: API returns an object `{ data: [...] }` but code expects an array directly.
```tsx
// FIX: Normalize API response
const rawData = response.data;
const items = Array.isArray(rawData)
  ? rawData
  : (Array.isArray(rawData?.data) ? rawData.data : []);
```

### 🔴 Crash: `Cannot read properties of undefined`
**Root Cause**: Accessing nested property without null check.
```tsx
// FIX: Optional chaining + default
const teamName = staff?.team?.name ?? 'Chưa phân team';
```

### 🔴 Crash: ErrorBoundary triggered (white screen with fallback)
**Root Cause**: Runtime error in render. Check componentStack in console.
```tsx
// FIX: Wrap data access in try-catch or add guards
const safeData = Array.isArray(data) ? data : [];
```

### 🔵 Auth: 401 Unauthorized
**Root Cause**: JWT token expired or missing.
```tsx
// FIX: Axios interceptor handles auto-logout
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);
```

### 🔵 Auth: 403 Forbidden
**Root Cause**: User lacks required role/permission for the endpoint.
```tsx
// FIX: Check user role before showing UI, handle 403 gracefully
try {
  const data = await api.get('/endpoint');
} catch (error) {
  if (error.response?.status === 403) {
    // Show "Access Denied" message instead of crash
  }
}
```

### 🟡 Logic: Team name not showing
**Root Cause**: Matching by `teamId` but `AuthUser` doesn't have `teamId`, only `name`/`email`.
```tsx
// FIX: Match by email or filter differently
const myTeam = teams.find(t =>
  t.members?.some(m => m.email === currentUser.email)
);
```

### 🟠 UI: Error displays raw JSON
**Root Cause**: Error message shows `[object Object]` or JSON string.
```tsx
// FIX: Extract human-readable message
const message = typeof error === 'string'
  ? error
  : error?.response?.data?.message ?? error?.message ?? 'Đã có lỗi xảy ra';
```

### 🟣 API: Data not loading (no error visible)
**Root Cause**: API call fails silently, no loading/error state shown.
```tsx
// FIX: Always handle all states
if (loading) return <SGSkeleton />;
if (error) return <SGEmptyState title="Lỗi tải dữ liệu" />;
if (!data?.length) return <SGEmptyState title="Chưa có dữ liệu" />;
```

### ⚫ Build: Docker "Cannot find module '/app/dist/main'"
**Root Cause**: `tsconfig.json` outDir doesn't match Dockerfile COPY path.
```bash
# FIX: Check tsconfig.json → compilerOptions.outDir matches Dockerfile
# Ensure: "outDir": "./dist" and Dockerfile: COPY --from=builder /app/dist ./dist
```

### ⚫ Build: Vercel deploy fails
**Root Cause**: Missing `vercel.json` or post-export script error.
```json
// vercel.json — ensure SPA routing
{
  "buildCommand": "npx expo export --platform web && node scripts/post-export.js",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
