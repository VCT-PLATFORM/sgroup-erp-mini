---
description: Sprint retrospective ceremony with multiple formats, voting, and action items
---

# Retrospective Workflow

Sprint retrospective — rút kinh nghiệm và cải tiến liên tục sau mỗi sprint.

## Schedule
- **When**: Cuối mỗi sprint, sau Sprint Review/Demo
- **Duration**: 1 giờ
- **Participants**: Scrum Master (facilitator), Dev team, PO (optional)
- **Rule**: Blameless — focus on process, not people

## Steps

1. **Set the Stage (5 min)**
   - SM nhắc lại Sprint Goal & kết quả
   - Nhắc Prime Directive:
     > "Regardless of what we discover, we understand and believe that everyone did the best job they could, given what they knew, their skills, and the resources available."
   - Chọn format cho retro (rotate mỗi sprint)

2. **Gather Data — Chọn 1 format (20 min)**

   ### Format A: Start-Stop-Continue
   | 🟢 Start (Bắt đầu làm) | 🔴 Stop (Ngừng làm) | 🔵 Continue (Tiếp tục) |
   |--------------------------|---------------------|------------------------|
   | Pair programming | Skipping code review | Daily standups |
   | Writing tests first | Late deployments | Sprint demos |

   ### Format B: 4Ls
   | ❤️ Liked | 📚 Learned | 😤 Lacked | 🌟 Longed For |
   |----------|-----------|---------|--------------|
   | Team collaboration | Prisma relations | Documentation | CI/CD pipeline |

   ### Format C: Sailboat ⛵
   ```
   🏝️ Island (Mục tiêu): Ship v1.2 with CRM features
   💨 Wind (Thúc đẩy): Clear requirements, good teamwork
   ⚓ Anchor (Cản trở): Tech debt, slow CI
   🪨 Rocks (Rủi ro): Scope creep, missing specs
   ```

   ### Format D: Happiness Radar
   | Category | 😊 Happy | 😐 Neutral | 😞 Frustrated |
   |----------|---------|----------|-------------|
   | Process | ✓ | | |
   | Technology | | ✓ | |
   | Teamwork | ✓ | | |
   | Learning | | | ✓ |

3. **Vote & Prioritize (5 min)**
   - Mỗi người 3 dot-votes
   - Chọn top 3 items theo vote
   - Focus thảo luận vào top items

4. **Generate Actions (20 min)**
   - Thảo luận top 3 items
   - Tạo SMART action items:
     | # | Action | Owner | Due | Measurable |
     |---|--------|-------|-----|-----------|
     | 1 | Setup CI/CD pipeline | DevOps | Sprint S+1 | Pipeline runs on every PR |
     | 2 | Add test coverage report | TL | Sprint S+1 | Coverage visible in PR |
     | 3 | Weekly code review sessions | Team | Ongoing | 1 session/week |
   - Mỗi action phải có **Owner** và **Due date**
   - Limit: ≤ 3 actions per retro (focus > quantity)

5. **Review Previous Actions (5 min)**
   - Check status of actions từ retro trước:
     | # | Previous Action | Status |
     |---|----------------|--------|
     | 1 | Setup linting | ✅ Done |
     | 2 | Create deployment doc | ⏳ In Progress |
     | 3 | Add error boundaries | ❌ Not Started |
   - Carry forward incomplete items nếu vẫn relevant

6. **Close & Appreciation (5 min)**
   - Mỗi người appreciate 1 team member
   - SM tóm tắt key takeaways
   - Share retro notes với team

## Sprint Health Metrics
Track over time:
- Team happiness: [1-10 scale]
- Action item completion rate: [%]
- Sprint goal achievement: [%]
- Velocity trend: [chart]

## Next Workflow
→ `/sprint-planning` for the next sprint
→ `/knowledge-sharing` to share learnings from retro
