---
description: Set up development environment from scratch for SGROUP ERP
---

# Development Environment Setup

## Prerequisites
1. Node.js 22+ installed
2. Git configured
3. (Optional) PostgreSQL 16+ locally OR Neon account for serverless DB

## Steps

// turbo-all

1. Clone the repository
```bash
git clone https://github.com/hbtung95/sgroup-erp.git && cd "SGROUP ERP FULL"
```

2. Install frontend dependencies
```bash
cd SGROUP-ERP-UNIVERSAL && npm install
```

3. Install backend dependencies
```bash
cd sgroup-erp-backend && npm install
```

4. Create backend environment file
```bash
cd sgroup-erp-backend && copy .env.example .env
```
Then edit `.env` with your database credentials:
```env
# Option A: Local PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sgroup_erp

# Option B: Neon Serverless (recommended for quick start)
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/sgroup_erp?sslmode=require

# Authentication
JWT_SECRET=your-secret-key-at-least-256-bits-long
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

5. Set up the database
```bash
cd sgroup-erp-backend && npx prisma migrate dev
```

6. Generate Prisma client
```bash
cd sgroup-erp-backend && npx prisma generate
```

7. Seed database (if seed file exists)
```bash
cd sgroup-erp-backend && npx prisma db seed
```

8. Start backend in dev mode
```bash
cd sgroup-erp-backend && npm run start:dev
```

9. Start frontend in dev mode (Web)
```bash
cd SGROUP-ERP-UNIVERSAL && npx expo start --web --port 8081
```

## Verification
- Backend: Visit `http://localhost:3000/api` — should return API info
- Frontend: Visit `http://localhost:8081` — should show the app
- Database: Run `cd sgroup-erp-backend && npx prisma studio` to verify data

## Vercel Environment (Frontend Production)
If deploying frontend to Vercel:
1. Install Vercel CLI: `npm install -g vercel`
2. Link project: `cd SGROUP-ERP-UNIVERSAL && vercel link`
3. Set env vars in Vercel Dashboard:
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
4. Deploy: `vercel --prod` or push to `main` branch

## Common Setup Issues

| Issue | Fix |
|-------|-----|
| `Cannot find module 'prisma'` | Run `npx prisma generate` |
| `Connection refused` to DB | Check `DATABASE_URL` in `.env` |
| Port 8081 already in use | Kill process: `npx kill-port 8081` |
| Expo metro bundler stuck | Clear cache: `npx expo start --web --port 8081 --clear` |
| `node-gyp` build errors | Install build tools: `npm install -g node-gyp` |
| Neon connection timeout | Check `?sslmode=require` in connection string |
