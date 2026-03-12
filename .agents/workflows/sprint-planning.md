---
description: Full sprint planning ceremony with PO, SM, Tech Lead, and Dev team
---

# Sprint Planning Workflow

Conduct a structured sprint planning ceremony involving the Product Owner, Scrum Master, Tech Lead, and Development team.

## Pre-Planning (PO + SM — day before)
1. PO ensures backlog is refined and prioritized
2. SM calculates team capacity:
   ```
   Team Size × Sprint Days × Focus Factor = Available Points
   ```
3. Review previous sprint velocity for commitment baseline

## Part 1: Sprint Goal & Story Selection (1-2 hours)

4. **PO presents Sprint Goal**
   - Clear, measurable objective for the sprint
   - Aligned with quarterly OKRs

5. **PO walks through prioritized backlog items**
   - Present each story with context and acceptance criteria
   - Team asks clarifying questions

6. **Team selects stories for sprint**
   - Total story points ≤ average velocity
   - Stories must have clear acceptance criteria
   - Dependencies identified and resolved

## Part 2: Technical Breakdown (1-2 hours)

7. **Tech Lead facilitates task breakdown**
   - Each story broken into technical tasks
   - Tasks estimated in hours (not points)

8. **Identify technical dependencies**
   - Database changes first
   - API before frontend
   - Shared components before features

9. **Assign story owners**
   - Each story has a primary developer
   - Pair programming assignments for complex stories

## Post-Planning

10. **SM creates sprint board**
    - All stories and tasks in project management tool
    - Sprint goal visible to all

11. **SM sends sprint kickoff summary**
    ```markdown
    ## Sprint S{N} Kickoff
    **Goal**: {Sprint goal}
    **Duration**: {start} → {end}
    **Capacity**: {points} SP
    **Committed**: {points} SP ({N} stories)
    **Key risks**: {any risks identified}
    ```
