---
description: Deploy SGROUP ERP to production or staging
---

# Deployment Workflow

## Steps

1. **Pre-deploy Checks**
   // turbo
   - Run tests: `cd sgroup-erp-backend && npm test`
   // turbo
   - Type check frontend: `cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit`
   // turbo
   - Type check backend: `cd sgroup-erp-backend && npx tsc --noEmit`

2. **Build Backend**
   // turbo
   - Build: `cd sgroup-erp-backend && npm run build`
   - Verify dist/ folder created successfully

3. **Build Frontend (Web)**
   // turbo
   - Build: `cd SGROUP-ERP-UNIVERSAL && npx expo export --platform web`
   - Verify dist/ folder created with index.html

4. **Database Migration (Production)**
   - Apply pending migrations: `cd sgroup-erp-backend && npx prisma migrate deploy`
   - ⚠️ Always backup database before running migrations in production

5. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

6. **Deploy Frontend to Web (EAS)**
   ```bash
   cd SGROUP-ERP-UNIVERSAL && eas update --branch production
   ```

7. **Post-deploy Verification**
   - Check backend health: `curl http://localhost:3000/api/health`
   - Verify frontend loads correctly
   - Check database connectivity
   - Monitor logs for errors: `docker-compose logs -f backend`

8. **Rollback (if needed)**
   ```bash
   # Revert to previous Docker image
   docker-compose down
   docker-compose -f docker-compose.yml up -d --no-build
   
   # Rollback database (if migration failed)
   # Restore from backup
   ```
