---
description: Systematic debugging workflow for SGROUP ERP issues
---

# Debug Workflow

Use this workflow when diagnosing and fixing bugs.

## Steps

1. **Reproduce the Issue**
   - Identify exact steps to reproduce
   - Note the expected vs. actual behavior
   - Check browser console / terminal for errors
   - Take screenshots if UI-related

2. **Gather Context**
   - Which module is affected? (frontend/backend/database)
   - When did it start happening? (recent change?)
   // turbo
   - Check recent commits: `git log -n 10 --oneline`
   // turbo
   - Check recent file changes: `git diff --name-only HEAD~5`

3. **Isolate the Problem**
   - **Frontend issues**: 
     - Check browser DevTools Console for errors
     - Check Network tab for failed API calls
     - Verify component state with React DevTools
     // turbo
     - Check TypeScript: `cd SGROUP-ERP-UNIVERSAL && npx tsc --noEmit`
   
   - **Backend issues**:
     - Check server logs
     - Test API endpoint directly with curl/Postman
     // turbo
     - Check TypeScript: `cd sgroup-erp-backend && npx tsc --noEmit`
   
   - **Database issues**:
     - Check Prisma Studio: `cd sgroup-erp-backend && npx prisma studio`
     - Verify schema matches expectations
     - Check for missing migrations

4. **Root Cause Analysis**
   - Trace the data flow from input to output
   - Identify where the data/behavior diverges
   - Check for edge cases (null, undefined, empty arrays)
   - Look for recent changes that could have introduced the bug

5. **Implement Fix**
   - Make the minimal change needed to fix the issue
   - Add error handling if missing
   - Add null/undefined checks if needed

6. **Verify Fix**
   - Reproduce original steps — bug should be gone
   - Check no regression in related features
   // turbo
   - Run tests: `cd sgroup-erp-backend && npm test`

7. **Document**
   - Add comment explaining why the fix was needed (if non-obvious)
   - Update relevant tests to cover this case
