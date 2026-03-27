---
description: Clean all caches and rebuild the entire project from scratch
---

// turbo-all

# Clean Build — SGROUP ERP

Xóa toàn bộ cache và rebuild từ đầu khi gặp lỗi build khó hiểu.

## When to Trigger
- Build thất bại với lỗi bí ẩn sau khi cập nhật dependencies
- TypeScript complain về types đã bị xóa/thay đổi
- Prisma Client không sync với schema
- Metro bundler cache bị stale

## Steps

1. **Clean NestJS backend**
```bash
cd sgroup-erp-backend && rm -rf dist node_modules/.cache
```

2. **Regenerate Prisma Client**
```bash
cd sgroup-erp-backend && npx prisma generate
```

3. **Reinstall backend dependencies**
```bash
cd sgroup-erp-backend && rm -rf node_modules && npm install
```

4. **Build backend fresh**
```bash
cd sgroup-erp-backend && npm run build
```

5. **Clean frontend caches**
```bash
cd sgroup-erp-fe && rm -rf node_modules/.cache .expo dist
```

6. **Reinstall frontend dependencies**
```bash
cd sgroup-erp-fe && rm -rf node_modules && npm install
```

7. **Clear Metro bundler cache** (mobile)
```bash
cd sgroup-erp-fe && npx expo start --clear
```

## Nuclear Option (khi tất cả đều thất bại)
```bash
# Xóa tất cả node_modules + lockfiles
find . -name "node_modules" -type d -prune -exec rm -rf {} +
rm -f package-lock.json sgroup-erp-backend/package-lock.json sgroup-erp-fe/package-lock.json
npm install
cd sgroup-erp-backend && npm install && npx prisma generate
cd ../sgroup-erp-fe && npm install
```
