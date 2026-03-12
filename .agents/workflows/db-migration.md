---
description: Database migration workflow for creating and applying Prisma migrations
---

# Database Migration Workflow

Use this workflow when making changes to the database schema.

## Steps

1. **Plan Schema Changes**
   - Identify what models/fields need to change
   - Check existing schema: review `sgroup-erp-backend/prisma/schema.prisma`
   - Consider impact on existing data
   - Plan for backward compatibility

2. **Edit Schema**
   - Open `sgroup-erp-backend/prisma/schema.prisma`
   - Make the required changes following conventions:
     - UUID v7 for IDs
     - camelCase fields with `@map("snake_case")`
     - Always include `createdAt` / `updatedAt`
     - Add indexes for frequently queried fields

3. **Create Migration**
   // turbo
   ```bash
   cd sgroup-erp-backend && npx prisma migrate dev --name describe_the_change
   ```

4. **Review Generated SQL**
   - Check the migration file in `prisma/migrations/`
   - Verify it matches your intentions
   - Look for potential data loss (**DROP TABLE**, **DROP COLUMN**)

5. **Regenerate Client**
   // turbo
   ```bash
   cd sgroup-erp-backend && npx prisma generate
   ```

6. **Update Application Code**
   - Update DTOs if fields changed
   - Update services if relations changed
   - Update types on frontend if API response changed

7. **Verify**
   // turbo
   - Open Prisma Studio: `cd sgroup-erp-backend && npx prisma studio`
   - Verify new schema looks correct
   // turbo
   - Run tests: `cd sgroup-erp-backend && npm test`
   
8. **Production Deployment**
   - ⚠️ **ALWAYS backup the database before production migrations**
   ```bash
   # Backup
   pg_dump -U postgres -h host -d sgroup_erp > backup_before_migration.sql
   
   # Apply
   cd sgroup-erp-backend && npx prisma migrate deploy
   ```

## Dangerous Operations Warning
If your migration includes any of these, proceed with extra caution:
- 🔴 `DROP TABLE` — Data will be permanently deleted
- 🔴 `DROP COLUMN` — Column data will be lost  
- 🟡 `ALTER COLUMN TYPE` — May fail if data can't be cast
- 🟡 `NOT NULL` constraint — May fail if existing rows have NULL values
