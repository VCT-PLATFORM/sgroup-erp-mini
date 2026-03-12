---
description: Architecture decision review process with SA, CTO, and Tech Lead
---

# Architecture Review Workflow

Structured process for reviewing and approving architecture decisions involving the Solution Architect, CTO, and Tech Lead.

## When to Trigger
- New module or major feature
- Technology change or addition
- External service integration
- Database schema redesign
- Performance/scalability concerns

## Steps

1. **SA drafts Architecture Decision Record (ADR)**
   - Use ADR template from solution-architect skill
   - Include context, decision, alternatives, consequences
   - Add architecture diagrams (C4 model)

2. **Tech Lead reviews technical feasibility**
   - Impact on existing codebase
   - Development effort estimation
   - Migration/rollback strategy
   - Testing implications

3. **CTO evaluates strategic alignment**
   - Alignment with tech roadmap
   - Build vs buy analysis
   - Cost implications (infrastructure, licensing)
   - Team capability assessment

4. **Security review (if applicable)**
   - Data flow analysis
   - Authentication/authorization impact
   - Compliance requirements (PDPA)
   - Third-party risk assessment

5. **Architecture Review Meeting (1 hour)**
   - SA presents the proposal
   - Tech Lead presents feasibility analysis
   - CTO provides strategic perspective
   - Open discussion and Q&A
   - Decision: Approve / Request Changes / Reject

6. **Document Decision**
   - Update ADR status to Accepted/Rejected
   - Record meeting attendees and key discussion points
   - Add any conditions or constraints agreed upon

7. **Communicate to Team**
   - Share ADR with development team
   - Tech Lead creates implementation tickets
   - Update tech documentation
   - Schedule knowledge sharing session if needed
