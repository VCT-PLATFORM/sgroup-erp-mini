---
description: How to run a post-mortem or retrospective to auto-learn and update the system after completing a milestone.
---

# Agent Retrospective & Optimization Flow

Run this workflow periodically or after a major milestone is completed to allow the Agent team to self-evaluate and upgrade their knowledge.

## Prerequisites
- A completed module or solved incident.
- Terminal logs or an associated `walkthrough.md`.

## Steps

1. **Analyze (The "Look-back")**
   - Javis reads the git log and recent artifacts (`walkthrough.md`, `task.md`) for the last module built.
   - Sifts through error logs or struggles the team faced (e.g. build failing multiple times before fixing).

2. **Diagnose (The Post-Mortem)**
   - Javis drafts a Post-Mortem artifact identifying the root cause of any friction (e.g., outdated tool, misaligned prompt, lack of type-checking).

3. **Evolve (The Update)**
   - Based on the Post-Mortem, Javis writes a new lesson entry to `.agents/knowledge-base/`.
   - *If applicable:* Javis modifies an existing SOP in `.agents/sop/` or edits a specific Agent's role in `.agents/agents/` to prevent the error permanently.

4. **Review & Save**
   - Present the identified upgrades to the Chairman.
   - Once approved, git commit the knowledge updates with `docs(knowledge): retro update and workflow optimization`.
