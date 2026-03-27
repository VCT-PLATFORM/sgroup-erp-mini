---
description: Start full development environment with Docker Compose + backend + frontend
---

// turbo-all

# Docker Dev Environment — SGROUP ERP

Khởi động toàn bộ môi trường phát triển local bằng Docker Compose.

## Prerequisites
- Docker Desktop đang chạy
- File `.env` đã được cấu hình (copy từ `.env.example`)

## Steps

1. **Start infrastructure services** (PostgreSQL, Redis)
```bash
docker-compose up -d postgres redis
```

2. **Wait for services to be healthy**
```bash
docker-compose ps
```
> Đợi cho đến khi tất cả services hiện `healthy` hoặc `running`.

3. **Run Prisma migrations**
```bash
cd sgroup-erp-backend && npx prisma migrate dev
```

4. **Seed database** (nếu DB trống)
```bash
cd sgroup-erp-backend && npx prisma db seed
```

5. **Start NestJS backend**
```bash
cd sgroup-erp-backend && npm run start:dev
```
> Backend chạy tại `http://localhost:3000`

6. **Start React Native / Expo frontend** (terminal mới)
```bash
cd sgroup-erp-fe && npx expo start
```
> Expo chạy tại `http://localhost:8081`

## Verify
- Backend health: `curl http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/api/docs`
- Expo Web: `http://localhost:8081`

## Troubleshooting
- **PostgreSQL port conflict**: Đổi port trong `docker-compose.yml` hoặc stop PostgreSQL local
- **Prisma Client outdated**: `npx prisma generate`
- **Node modules missing**: `npm install` trong mỗi thư mục
