---
description: Rapid fix workflow for common SGROUP ERP bugs — not for production emergencies (use /hotfix instead)
---

# Quick Fix Workflow

Quy trình fix nhanh các bug phổ biến trong quá trình phát triển.
Dùng khi fix bug thường, KHÔNG PHẢI production emergency (dùng `/hotfix`).

## When to Use
- Bug phát sinh trong quá trình development
- Bug không ảnh hưởng production (hoặc ảnh hưởng nhẹ)
- Bug đã từng gặp và có pattern fix sẵn

## Quick Reference: Common Fixes

### 1. Crash: `X.map is not a function`
// turbo
```bash
cd SGROUP-ERP-UNIVERSAL && grep -rn "\.map\|\.filter\|\.find" src/features/ --include="*.tsx" | head -20
```
**Fix**: Thêm `Array.isArray()` guard trước mọi `.map()`, `.filter()`, `.find()`:
```tsx
const items = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
```

### 2. Crash: `Cannot read properties of undefined`
**Fix**: Thêm optional chaining:
```tsx
// Before: staff.team.name
// After:
const teamName = staff?.team?.name ?? 'N/A';
```

### 3. Auth: 401 Unauthorized / Token Expired
**Fix**: Kiểm tra Axios interceptor trong `src/shared/api.ts`:
```tsx
if (error.response?.status === 401) {
  await AsyncStorage.removeItem('auth_token');
  // Navigate to login
}
```

### 4. Auth: 403 Forbidden
**Diagnose**: Kiểm tra backend guard:
// turbo
```bash
cd sgroup-erp-backend && grep -rn "@Roles\|@UseGuards" src/modules/ --include="*.ts" | head -20
```
**Fix**: Cập nhật `@Roles()` decorator hoặc thêm role cho user.

### 5. UI: Error shows raw JSON / [object Object]
**Fix**: Extract message:
```tsx
const msg = typeof err === 'string' ? err : err?.response?.data?.message ?? err?.message ?? 'Lỗi';
```

### 6. Build: TypeScript errors
// turbo
```bash
cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit 2>&1 | head -30
```
// turbo
```bash
cd sgroup-erp-backend && npx tsc --noEmit 2>&1 | head -30
```

### 7. Docker: Cannot find module '/app/dist/main'
**Fix**: Kiểm tra `tsconfig.json` → `compilerOptions.outDir` phải khớp với Dockerfile COPY path.

### 8. Vercel: Deploy fails / 404 on routes
**Fix**: Kiểm tra `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Steps

1. **Identify Bug Type** — Tham khảo bảng trên
2. **Apply Quick Fix** — Copy pattern phù hợp
3. **Verify**
   // turbo
   - Type check: `cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit`
   - Test trên browser: `http://localhost:8081`
4. **Done** — Nếu fix thành công, không cần thêm bước nào
