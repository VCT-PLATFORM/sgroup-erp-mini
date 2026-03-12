---
description: Knowledge sharing workflow for documentation, tech talks, and team learning
---

# Knowledge Sharing Workflow

Quy trình chia sẻ kiến thức trong team: documentation, tech talks, pair programming, và wiki updates.

## When to Trigger
- Sau khi implement feature phức tạp
- Học được technology / pattern mới
- Sau post-mortem incident
- Onboarding thành viên mới
- Technical decision (ADR) đã approved

## Steps

1. **Identify Knowledge to Share**
   - Sources:
     - Sprint retrospective action items
     - Post-mortem learnings
     - New architecture decisions (ADRs)
     - Complex features vừa implement
     - Best practices discovered
     - Common mistakes / gotchas

2. **Choose Format**
   | Format | Duration | Audience | Best For |
   |--------|----------|----------|----------|
   | Tech Talk | 30-45 min | Full team | New technology, architecture |
   | Lightning Talk | 10-15 min | Full team | Tips, tricks, quick demos |
   | Pair Programming | 1-2 hours | 2 people | Hands-on skills transfer |
   | Code Walkthrough | 30 min | Dev team | Complex feature review |
   | Written Doc | Async | Everyone | Reference material |
   | Brown Bag Session | 1 hour | Interested | Deep dive topics |

3. **Prepare Content**
   - Tech Talk / Lightning Talk:
     ```markdown
     # [Topic Title]
     
     ## Problem / Motivation
     [Why is this important?]
     
     ## Solution / Approach
     [What did we do? Code examples]
     
     ## Key Takeaways
     [3-5 bullet points]
     
     ## Resources
     [Links for further reading]
     ```
   - Written Documentation:
     - Update project wiki / README
     - Write ADR (Architecture Decision Record)
     - Create how-to guide
     - Update SKILL.md files

4. **Schedule & Present**
   - Recurring slot: mỗi thứ 6 cuối sprint, 30 phút
   - Calendar invite với topic preview
   - Record session (nếu remote) for future reference
   - Interactive Q&A ≥ 10 minutes

5. **Document & Archive**
   - Store presentations in shared drive
   - Update relevant documentation:
     - [ ] README.md updates
     - [ ] ADR files (`.agents/` directory)
     - [ ] SKILL.md skill files
     - [ ] Workflow files (`.agents/workflows/`)
     - [ ] Code comments for complex logic
   - Link from related knowledge items

6. **Update Architecture Decision Records (ADRs)**
   ```markdown
   # ADR-{NNN}: [Decision Title]
   
   **Status**: Accepted | Deprecated | Superseded
   **Date**: [date]
   **Deciders**: [names]
   
   ## Context
   [What is the issue that motivates this decision?]
   
   ## Decision
   [What we decided to do and why]
   
   ## Alternatives Considered
   | Option | Pros | Cons |
   |--------|------|------|
   | A | ... | ... |
   | B | ... | ... |
   
   ## Consequences
   - Positive: [benefits]
   - Negative: [trade-offs]
   - Neutral: [things that change]
   ```

7. **Measure Impact**
   | Metric | Target |
   |--------|--------|
   | Sessions per sprint | ≥ 1 |
   | Team attendance | ≥ 80% |
   | Documentation freshness | Updated ≤ 1 sprint old |
   | Onboarding time | Decreasing quarter over quarter |

## Next Workflow
→ `/onboarding` to use documented knowledge for new members
