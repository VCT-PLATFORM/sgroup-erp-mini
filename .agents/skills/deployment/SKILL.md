---
name: Deployment
description: Docker deployment, CI/CD pipeline, and environment management for SGROUP ERP
---

# Deployment Skill — SGROUP ERP

## Architecture Overview
```
┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│  Frontend        │  │  Backend          │  │  Database     │
│  React Native    │  │  NestJS           │  │  PostgreSQL   │
│  Expo (Web/Mobile│──│  Prisma ORM       │──│  Docker       │
│  )               │  │  Docker           │  │              │
└─────────────────┘  └──────────────────┘  └──────────────┘
```

## Docker Setup

### Backend Dockerfile
```dockerfile
# sgroup-erp-backend/Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./sgroup-erp-backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/sgroup_erp
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sgroup_erp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
```

### Docker Commands
```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down

# Reset (with data cleanup)
docker-compose down -v
```

## Expo Deployment (Frontend)

### Web Build
```bash
cd SGROUP-ERP-UNIVERSAL
expo export --platform web
# Output in dist/ — deploy to any static hosting
```

### EAS Build (Mobile)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for platforms
eas build --platform android
eas build --platform ios

# OTA Update
eas update --branch production --message "Bug fixes"
```

## Environment Management

### Environment Files
```
.env.development    # Local dev
.env.staging        # Staging server
.env.production     # Production server
```

### Required Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-secure-secret-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production

# AI (Optional)
OPENAI_API_KEY=sk-xxx
GOOGLE_AI_API_KEY=xxx
```

## CI/CD Pipeline (GitHub Actions)

### Backend Pipeline
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD
on:
  push:
    branches: [main]
    paths: ['sgroup-erp-backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: cd sgroup-erp-backend && npm ci
      - run: cd sgroup-erp-backend && npm test
      - run: cd sgroup-erp-backend && npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: |
          docker build -t sgroup-backend ./sgroup-erp-backend
          # Push to registry and deploy
```

## Deployment Checklist
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS configured
- [ ] CORS configured for frontend domain
- [ ] Health check endpoint responds
- [ ] Logs and monitoring set up
- [ ] Backup strategy verified
- [ ] Rollback plan documented
