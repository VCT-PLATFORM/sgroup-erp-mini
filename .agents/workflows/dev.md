---
description: How to run the vct-platform development server locally  
---
// turbo-all

# Workflow: Chạy Dev Server

## 1. Start database (Docker)
```powershell
cd D:\VCT PLATFORM\vct-platform
docker-compose -f infra/docker-compose.yml up -d
```

## 2. Start backend
```powershell
cd D:\VCT PLATFORM\vct-platform\backend
go run main.go
```

## 3. Start frontend (Shell)
```powershell
cd D:\VCT PLATFORM\vct-platform\core\shell
npm run dev
```

## 4. Start toàn bộ workspace (Turborepo)
```powershell
cd D:\VCT PLATFORM\vct-platform
npm run dev
```

## URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/v1
- PostgreSQL: localhost:5432

## Environment
Đảm bảo có file `.env` trong `core/shell/` với:
```
VITE_API_URL=http://localhost:8080/api/v1
```

