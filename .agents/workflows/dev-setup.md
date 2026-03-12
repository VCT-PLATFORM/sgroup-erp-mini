---
description: Set up development environment from scratch for SGROUP ERP
---

# Development Environment Setup

## Prerequisites
1. Node.js 22+ installed
2. PostgreSQL 16+ running
3. Git configured

## Steps

// turbo-all

1. Clone the repository
```bash
git clone <repo-url> && cd "SGROUP ERP FULL"
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
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sgroup_erp
JWT_SECRET=your-secret-key-256-bits
JWT_EXPIRES_IN=7d
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

9. Start frontend in dev mode
```bash
cd SGROUP-ERP-UNIVERSAL && npx expo start --web --port 8081
```

## Verification
- Backend: Visit `http://localhost:3000/api` — should return API info
- Frontend: Visit `http://localhost:8081` — should show the app
- Database: Run `npx prisma studio` to verify data
