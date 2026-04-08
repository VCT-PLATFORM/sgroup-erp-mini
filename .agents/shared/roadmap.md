# VCT Platform — Build Roadmap (V17 Bottom-Up)

TL;DR: 6 phases, User-Centric approach. Each module is built full-stack (schema ──▶ Go Microservice ──▶ React Frontend ──▶ Tests) and containerized independently before proceeding.

## Business Priorities (Bottom-Up Logic)
1. **Users First (Athletes/Members):** Attract maximum user registration.
2. **National Federation:** Supply national management tools for the users.
3. **Provincial Federations:** Delegation and local control.
4. **Clubs/Dojos:** Deep operations for the actual training centers.
5. **Tournaments:** The ultimate martial arts feature.
6. **Marketplace:** Commercial ecosystem.

---

## Phase Order + Deliverables

### 🎯 PHASE 1: "User Identity" (Prioritizing end-users)
*Goal: Provide a digital martial arts passport to attract users to the app.*
- **modules:** `members`, `dashboard` (Basic User Portal)
- **features:** Member registration, identity (QR), basic tracking.
- **priority:** P0 — MVP

### 🎯 PHASE 2: "National Core" (Prioritizing national federation)
*Goal: Allow the top-level federation to manage the massive influx of members.*
- **modules:** `belt-ranks`, `examinations`, `certificates`
- **features:** Define standards, approve examinations, issue digital certificates.
- **priority:** P0 — MVP

### 🎯 PHASE 3: "Regional Control" (Prioritizing provincial federation)
*Goal: Delegate management and foster communication locally.*
- **modules:** `personnel` (Federation Staff), `communications` (Announcements)
- **features:** RBAC refinement for provincial scope, internal news.
- **priority:** P1 — Launch

### 🎯 PHASE 4: "Dojo Operations" (Prioritizing clubs)
*Goal: Bring club owners on board with operational management tools.*
- **modules:** `clubs` (Deep ops), `finance` (Tuitions/Fees), `documents`
- **features:** Club profiles, member assignments, collecting tuition.
- **priority:** P1 — Launch

### 🎯 PHASE 5: "The Arena" (Prioritizing tournaments)
*Goal: Digitize the most complex lifecycle in martial arts.*
- **modules:** `tournaments`
- **features:** Bracket generation, real-time scoring, referee assignments.
- **note:** Needs completely isolated microservice logic due to heavy computational logic/real-time loads.
- **priority:** P2 — Post-launch

### 🎯 PHASE 6: "Ecosystem" (Prioritizing marketplace & reports)
*Goal: Monetization and high-level insights.*
- **modules:** `marketplace`, `reports`, `settings`
- **features:** E-commerce for gear, data warehouse aggregations.
- **priority:** P2 — Post-launch

---

## Technical Definition of Done (Microservice Context)
For a module to cross the finish line in V17, it must:
1. Work locally in isolated `/backend/services/<name>` Go module.
2. Ensure its failure does not crash the API Gateway.
3. Render completely isolated in `/core/shell/src/features/<name>`.
4. Gracefully show an Error Boundary if the backend is down without freezing the portal.
