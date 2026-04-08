# VCT Platform Strategy V17 — Microservices & Bottom-Up Roadmap

**Notice to All Agents:** This document outlines the V17 architectural and business strategy for the VCT Platform. ALL modules engineered from this point forward MUST adhere to these constraints.

## 1. Architectural Mandate: Fault Isolation
To ensure massive stability, the VCT Platform uses **Modular Frontends** paired with **Dockerized Microservices Backend**.

- **Frontend isolation:** UI modules must be rendered through React's `TolerantErrorBoundary` inside `core/shell`. A crash in the "Tournaments" UI must NEVER crash the "Members" UI.
- **Backend isolation (Microservices):** 
  - Sub-domains (e.g. `backend/services/members-svc/`, `backend/services/tournaments-svc/`) MUST be built as standalone Go executables intended for isolated Docker containers.
  - A panic or fatal error in a particular service must only take down its own container. Other services must continue operating.
  - Inter-service communication should happen via HTTP/RPC or an event bus, NOT via direct internal Go imports spanning across different service domains.

## 2. Delivery Roadmap: The "Bottom-Up" Strategy
Prioritization is radically changed to focus on acquiring end-users first, rather than top-level federations down. Development phases must occur in this exact order:

- 🎯 **Phase 1: "User First" (The Athlete Lifecycle)**
  - Modules: `members`, `dashboard`.
  - Goal: Focus on individual martial artists, ID/QR code, digital profile.
  - Status: *In Progress* (`members` MVP built).

- 🎯 **Phase 2: "National Core" (Top-Level Fed)**
  - Modules: `belt-ranks`, `examinations`, `certificates`.
  - Goal: National standards, belt progression approval, massive certification issuance.

- 🎯 **Phase 3: "Regional Control" (Provincial Fed)**
  - Modules: `personnel`, `communications`.
  - Goal: Delegation logic. Provinces manage their own zones.

- 🎯 **Phase 4: "Dojo Operations" (Clubs & Gyms)**
  - Modules: `clubs`, `finance`, `documents`.
  - Goal: Day-to-day operations for martial arts schools (tuition, schedules).

- 🎯 **Phase 5: "The Arena" (Tournaments)**
  - Modules: `tournaments`.
  - Goal: Bracket making, real-time match scoring, leaderboards. Heavy logic container.

- 🎯 **Phase 6: "Ecosystem" (Marketplace)**
  - Modules: `marketplace`, `reports`, `settings`.
  - Goal: Commerce (apparel, gear) and Big Data insights.

## Agent Directives
1. **Javis (Orchestrator):** Ensure all plans align strictly with the V17 roadmap order. Do not build Phase 5 features before Phase 2.
2. **Brian (Backend API):** Ensure that you craft APIs inside `backend/services/[domain-svc]` instead of a monolith. 
3. **Fiona (Frontend UI):** Ensure all new feature slices inside `core/shell/src/features` are wrapped in error boundaries.
4. **Sentry (Security/Auth):** Ensure RBAC scales gracefully from National ──▶ Provincial ──▶ Club levels.
5. **Atlas & Quinn (Build/QA):** Verify container isolation compatibility by testing isolated packages.

*Strategy drafted on: 2026-04-06*
