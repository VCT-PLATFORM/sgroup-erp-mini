---
description: Step-by-step workflow for developing a new feature in SGROUP ERP
---

# Feature Development Workflow

Use this workflow when implementing a new feature. Follow each step in order.

## Steps

1. **Understand Requirements**
   - Read the feature requirements / user story
   - Identify affected modules (frontend, backend, database)
   - Check for existing patterns in similar features

2. **Plan the Implementation**
   - Create an implementation plan document
   - List all files to create/modify
   - Design the data model (if database changes needed)
   - Identify shared components to reuse

3. **Database Changes (if needed)**
   - Update `prisma/schema.prisma` with new models/fields
   // turbo
   - Create migration: `cd sgroup-erp-backend && npx prisma migrate dev --name <feature_name>`
   // turbo
   - Generate Prisma client: `cd sgroup-erp-backend && npx prisma generate`

4. **Backend Implementation**
   - Create/update DTOs in `src/modules/<feature>/dto/`
   - Create/update service in `src/modules/<feature>/<feature>.service.ts`
   - Create/update controller in `src/modules/<feature>/<feature>.controller.ts`
   - Create/update module in `src/modules/<feature>/<feature>.module.ts`
   - Register module in `app.module.ts` if new

5. **Frontend Implementation**
   - Create types in `src/features/<feature>/types/`
   - Create Zustand store in `src/features/<feature>/stores/`
   - Create screen components in `src/features/<feature>/screens/`
   - Create reusable components in `src/features/<feature>/components/`
   - Add navigation routes

6. **Testing**
   // turbo
   - Run backend tests: `cd sgroup-erp-backend && npm test`
   - Test API endpoints manually or with Supertest
   - Verify frontend renders correctly on web and mobile

7. **Code Review**
   - Self-review using the code-review skill checklist
   - Check for TypeScript errors
   // turbo
   - Run lint: `cd sgroup-erp-backend && npm run lint`

8. **Polish**
   - Add loading states and error handling
   - Verify responsive design (mobile + web)
   - Add micro-animations per UI/UX design skill
   - Test edge cases (empty state, error state, large data)
