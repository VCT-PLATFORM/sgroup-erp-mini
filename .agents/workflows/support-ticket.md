---
description: Customer support ticket management, SLA tracking, and knowledge base maintenance
---

# Support Ticket Workflow

Quy trình quản lý ticket hỗ trợ khách hàng, đảm bảo SLA, và duy trì knowledge base.

## When to Trigger
- User báo cáo bug hoặc vấn đề
- Yêu cầu hỗ trợ sử dụng hệ thống
- Feature request từ end user
- Câu hỏi về cách sử dụng

## Ticket Classification

| Priority | Response Time | Resolution Time | Example |
|----------|-------------|-----------------|---------|
| 🔴 P0 | 15 phút | 2 giờ | System down, data loss |
| 🟠 P1 | 1 giờ | 8 giờ | Core feature broken |
| 🟡 P2 | 4 giờ | 2 ngày | Feature impaired |
| 🟢 P3 | 1 ngày | 5 ngày | Question, cosmetic |

## Steps

1. **Receive & Log Ticket**
   ```markdown
   ## Ticket #[AUTO-ID]
   **Reporter**: [User Name] — [Role]
   **Priority**: P[0-3]
   **Category**: Bug | Feature Request | Question | Access Issue
   **Module**: Sales | Planning | Reporting | Auth | Mobile
   **Created**: [DateTime]
   **SLA Deadline**: [DateTime]
   
   ### Description
   [User's issue]
   
   ### Steps to Reproduce
   1. [step]
   2. [step]
   
   ### Environment
   - Platform: Web / iOS / Android
   - Browser: [if web]
   - Version: v[X.Y.Z]
   ```

2. **Triage (≤ 15 min)**
   - Classify priority (P0-P3)
   - Assign category & module
   - Check Knowledge Base for known solution
   - Escalation decision:
     | Level | Condition | Action |
     |-------|----------|--------|
     | L1 | Known issue / FAQ | Apply KB solution |
     | L2 | Unknown, reproducible | Escalate to Tech Lead |
     | L3 | Complex / systemic | Escalate to CTO + DevOps |

3. **Acknowledge User**
   ```
   Xin chào [Name],
   
   Cảm ơn bạn đã liên hệ. Chúng tôi đã nhận được yêu cầu
   của bạn (Ticket #[ID]) và đang xem xét.
   
   Dự kiến phản hồi: [SLA time]
   
   Trân trọng,
   SGROUP Support Team
   ```

4. **Investigate & Resolve**
   - L1 (Known Issue):
     - Apply solution từ Knowledge Base
     - Verify fix with user
   - L2 (Unknown):
     - Reproduce issue → Chạy `/debug`
     - Identify root cause
     - Fix or create backlog item → `/change-management`
   - L3 (Critical):
     - Escalate immediately → `/incident-management` hoặc `/hotfix`

5. **Communicate Resolution**
   ```
   Xin chào [Name],
   
   Vấn đề của bạn đã được xử lý:
   - Nguyên nhân: [Root cause]
   - Giải pháp: [What was done]
   
   Nếu vấn đề tiếp tục, vui lòng reply email này.
   
   Trân trọng,
   SGROUP Support Team
   ```

6. **Update Knowledge Base**
   - Nếu issue mới → tạo KB article:
     ```markdown
     # [Issue Title]
     
     ## Triệu chứng
     [What user sees]
     
     ## Nguyên nhân
     [Root cause]
     
     ## Giải pháp
     [Step-by-step fix]
     
     ## Phòng ngừa
     [How to avoid in future]
     ```
   - Nếu issue phổ biến → cập nhật FAQ

7. **Close Ticket & Follow-up**
   - Confirm resolution with user
   - Update ticket status: Resolved → Closed
   - Record resolution & root cause
   - Send satisfaction survey (optional)

8. **SLA Monitoring & Reporting**
   | Metric | Target | How |
   |--------|--------|-----|
   | First Response Time | < 1h (P1) | Timestamp tracking |
   | Resolution Time | < 8h (P1) | Timestamp tracking |
   | Customer Satisfaction | ≥ 4.0/5.0 | Post-resolution survey |
   | First Contact Resolution | ≥ 60% | L1 resolution rate |
   | Ticket Backlog | < 20 open | Dashboard count |
   | SLA Breach Rate | < 5% | Automated alert |

   - Weekly review: ticket trends, common issues, SLA compliance
   - Monthly report to management

## Knowledge Base Structure
```
📚 Knowledge Base
├── 🚀 Getting Started
├── 💼 Sales Module
├── 📊 Reporting
├── ❓ FAQ
└── 🔧 Troubleshooting
```

## Next Workflow
→ `/debug` for technical investigation
→ `/incident-management` for P0/P1 escalation
→ `/hotfix` for production bug fix
