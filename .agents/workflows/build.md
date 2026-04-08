---
description: How to build the vct-platform project and verify all checks pass
---
// turbo-all

# Workflow: Build & Verify

## 1. Install dependencies
```powershell
cd D:\VCT PLATFORM\vct-platform
npm install
```

## 2. TypeScript check (Shell)
```powershell
cd D:\VCT PLATFORM\vct-platform\core\shell
npx tsc -b --noEmit
```

## 3. Vite build (Shell)
```powershell
cd D:\VCT PLATFORM\vct-platform\core\shell
npx vite build
```

## 4. Full Turborepo build
```powershell
cd D:\VCT PLATFORM\vct-platform
npx turbo run build
```

## 5. Backend build (nếu có thay đổi Go)
```powershell
cd D:\VCT PLATFORM\vct-platform\backend
go build ./...
```

## 6. Lint check
```powershell
cd D:\VCT PLATFORM\vct-platform
npx turbo run lint
```

## Troubleshooting
- **TS error "Cannot find module"**: Kiểm tra path aliases trong `vite.config.ts` và `tsconfig.app.json`
- **Build fail on imports**: Kiểm tra barrel exports trong `index.ts` files
- **EPERM errors**: Đóng VS Code terminal đang chạy dev server trước khi build

