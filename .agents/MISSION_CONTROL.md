# 🚀 HERA MISSION CONTROL (HMC) V5.5 — GOAL-DRIVEN AUTONOMY

> **Status**: EXPERIMENTAL | **Release Date**: 2026-05-15
> **Philosophy**: Transition from "Instruction-based" to "Objective-driven" agency.
> **Source Inspiration**: Codex `/goal` (Autonomous Mission Loop).

---

## I. TỔNG QUAN (The Goal Framework)

HMC V5.5 giới thiệu khái niệm **Mission (Nhiệm vụ dài hạn)**. Khác với Task (yêu cầu đơn lẻ), Mission là một mục tiêu bền bỉ (Durable Objective) mà Agent team sẽ theo đuổi tự động cho đến khi đạt được kết quả hoặc bị chặn.

### 1. Cấu trúc một Mission
Mỗi Mission khi được kích hoạt qua lệnh `/goal` sẽ khởi tạo một state file tại `.agents/missions/M-{ID}.json`.

- **Objective**: Mục tiêu cốt lõi (ví dụ: "Di chuyển toàn bộ API sang PostgreSQL 18").
- **Success Criteria (Definition of Done)**: Danh sách các điều kiện kiểm chứng được (Verifiable conditions).
- **Task Tree**: Cây phân rã công việc (Decomposition).
- **Autonomous Loop**: Chu kỳ (Plan → Act → Test → Review).
- **Persistence**: Trạng thái được lưu lại và có thể "Resume" sau khi Chairman ngắt kết nối.

---

## II. LỆNH MISSION CONTROL (/goal)

Đội ngũ Agent (đứng đầu là JEN) sẽ nhận diện các lệnh sau:

| Lệnh | Mô tả | Hành động của Agent |
|:-----|:------|:-------------------|
| `/goal <mục tiêu>` | Khởi tạo Mission mới | Phân rã mục tiêu thành Task Tree, xác định Success Criteria, bắt đầu vòng lặp. |
| `/goal status` | Xem tiến độ hiện tại | Hiển thị Task Tree, phần trăm hoàn thành, và agent đang thực thi. |
| `/goal pause` | Tạm dừng Mission | Lưu snapshot context và dừng mọi background processes. |
| `/goal resume` | Tiếp tục Mission | Load lại context từ snapshot và tiếp tục từ task đang dở. |
| `/goal clear` | Xóa Mission | Lưu log vào Experience Library và dọn dẹp bộ nhớ. |
| `/goal review` | Trạm chốt Chairman | Dừng lại để Chairman kiểm tra kết quả trung gian (Rule 24). |

---

## III. VÒNG LẶP TỰ HÀNH (The Mission Loop)

JEN sẽ điều phối Mission theo chu trình khép kín:

1. **MISSION_PLANNING**: 
   - Sử dụng Model **XL** (Gemini 3.1 Pro/Claude 3.5 Pro) để phân rã Objective.
   - Tạo file `.agents/missions/M-{ID}.json`.
2. **EXECUTION**: 
   - Dispatch sub-tasks cho các Department dựa trên `ROUTING_INDEX.md`.
   - Áp dụng **Shadow Running** (Rule 20) để chạy ngầm các task lớn.
3. **SELF_VERIFICATION**: 
   - Sau mỗi sub-task, một `qa_agent` hoặc `financial_auditor` sẽ check Success Criteria.
   - Nếu thất bại: Gọi **Self-Healing Circuit Breaker** (Trụ cột 4).
4. **ITERATION**: 
   - Cập nhật Task Tree. Nếu mục tiêu chưa đạt, quay lại bước 2.
5. **COMPLETION**: 
   - Khi mọi Success Criteria = TRUE, báo cáo kết quả tổng thể và xin sign-off.

---

## IV. BẢN NÂNG CẤP CHO TOÀN ĐỘI AGENT (Team Upgrade)

### 1. JEN (Chief of Staff) — Orchestrator
- **Upgrade**: Thêm module **MissionTracker**. JEN không chỉ routing mà còn quản lý "State of Goal".
- **Capability**: Có khả năng tự "Promote" model khi phát hiện Mission bị kẹt (Stalled).

### 2. FINANCIAL_AUDITOR — Verifier
- **Upgrade**: Thêm khả năng check "Definition of Done".
- **Capability**: Không chỉ chấm điểm HERA mà còn xác nhận "Goal Progress %".
 
+### 4. NOVA (UI Lead) — Visualizer
+- **Upgrade**: Thêm module **NEXUS UI Engine**.
+- **Capability**: Tự động generate các dashboard trực quan bằng OpenUI cho mỗi Mission. Giúp Chairman theo dõi tiến độ theo thời gian thực (streaming UI).
+
### 3. DEPT LEADS — Gatekeepers
- **Upgrade**: Review output dựa trên Context của cả Mission, không chỉ task đơn lẻ.

---

## V. VÍ DỤ VẬN HÀNH

**Chairman**: `/goal Nâng cấp toàn bộ hệ thống Bracket sang 128 VĐV và thêm ô Vô Địch`

**JEN (Mission M-001)**:
1. **Plan**: 
   - Task 1: Update `bracketEngine.ts` (Backend logic).
   - Task 2: Update `BracketTree.tsx` (SVG UI).
   - Task 3: Test với dummy data 128 VĐV.
2. **Success Criteria**:
   - [ ] Build thành công không lỗi TS.
   - [ ] Demo page hiển thị đúng 128 nhánh.
   - [ ] Ô Vô Địch xuất hiện cuối cùng.
3. **Execution**: Bắt đầu Task 1... (Running in shadow mode).

---
> **Sign-off**: HERA MISSION CONTROL V5.5 Core
> *Biến mục tiêu thành hành động bền bỉ.*
