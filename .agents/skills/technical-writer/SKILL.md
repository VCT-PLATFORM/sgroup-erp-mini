---
name: Technical Writer
description: API documentation, user manuals, release notes, and knowledge base management for SGROUP ERP
---

# Technical Writer Skill — SGROUP ERP

## Role Overview
The Technical Writer creates and maintains all documentation — API docs, user guides, release notes, and internal knowledge base — ensuring clarity, consistency, and accessibility.

## Documentation Types

### 1. API Documentation

#### Endpoint Documentation Template
```markdown
## POST /api/leads

Create a new sales lead.

### Authentication
Requires JWT Bearer token with `SALES_REP` or `MANAGER` role.

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Customer name (2-100 chars) |
| phone | string | ✅ | Phone number (VN format) |
| email | string | ❌ | Email address |
| source | enum | ✅ | Lead source: `WEB`, `CALL`, `REFERRAL`, `EVENT` |
| estimatedValue | number | ❌ | Estimated deal value (₫) |
| notes | string | ❌ | Additional notes |

### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "source": "WEB",
    "estimatedValue": 50000000
  }'
\`\`\`

### Success Response (201)
\`\`\`json
{
  "id": "01958c3a-...",
  "name": "Nguyễn Văn A",
  "status": "NEW",
  "createdAt": "2026-03-12T08:00:00Z"
}
\`\`\`

### Error Responses
| Code | Description |
|------|-------------|
| 400 | Validation error — missing/invalid fields |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — insufficient role |
```

### 2. User Guide

#### Feature Guide Template
```markdown
# Hướng dẫn: Quản lý Leads

## Tổng quan
Module Leads giúp bạn quản lý danh sách khách hàng tiềm năng
từ lúc tiếp nhận đến khi chốt deal.

## Tạo Lead mới
1. Vào menu **Bán hàng** → **Leads**
2. Click nút **+ Thêm Lead** (góc phải trên)
3. Điền thông tin:
   - **Tên khách hàng** (bắt buộc)
   - **Số điện thoại** (bắt buộc)
   - **Nguồn** — chọn từ danh sách
4. Click **Lưu**

> 💡 **Mẹo**: Nhập số điện thoại để hệ thống tự kiểm tra
> khách hàng đã tồn tại chưa.

## Quản lý Pipeline
- Kéo thả lead giữa các cột để cập nhật trạng thái
- Click vào lead để xem chi tiết và lịch sử hoạt động

## FAQ
**Q: Làm sao để chuyển lead cho người khác?**
A: Vào chi tiết lead → Click "Chuyển" → Chọn nhân viên.
```

### 3. Release Notes

#### Release Note Template
```markdown
# Release Notes — v{X.Y.Z}
**Ngày phát hành**: {DD/MM/YYYY}

## ✨ Tính năng mới
- **AI Dashboard**: Xem phân tích doanh số bằng AI
- **Offline Mode**: Sử dụng app khi không có mạng

## 🐛 Sửa lỗi
- Sửa lỗi không tải được báo cáo khi dữ liệu rỗng
- Sửa lỗi hiển thị số tiền âm trên pipeline

## 🔧 Cải tiến
- Tốc độ tải danh sách lead nhanh hơn 3x
- Cải thiện UX form tạo lead

## ⚠️ Breaking Changes
- API `/api/v1/reports` đổi thành `/api/v2/reports`
  - Xem [migration guide](/docs/migration-v2)

## 🗓️ Phiên bản tiếp theo
- Tích hợp Google Calendar
- Export báo cáo PDF
```

### 4. Internal Knowledge Base

#### KB Article Template
```markdown
# KB-{NNN}: {Title}

**Danh mục**: {Development | Deployment | Troubleshooting | How-to}
**Cập nhật**: {DD/MM/YYYY}
**Tác giả**: {Name}

## Vấn đề
Mô tả ngắn gọn vấn đề hoặc nhu cầu.

## Giải pháp
Hướng dẫn từng bước.

## Ví dụ
Code snippet hoặc screenshot.

## Xem thêm
- Liên kết đến tài liệu liên quan
```

## Writing Standards

### Style Guide
| Rule | Example |
|------|---------|
| Use active voice | ✅ "Click the button" ❌ "The button should be clicked" |
| Use present tense | ✅ "The system saves" ❌ "The system will save" |
| Be concise | ✅ "Enter your name" ❌ "Please proceed to enter your name in the field" |
| Use numbered lists for steps | 1. Open... 2. Click... 3. Enter... |
| Use tables for reference data | Parameters, error codes, config options |
| Include examples | Code snippets, screenshots, sample data |

### Vietnamese Localization
- Use formal Vietnamese for user-facing docs
- Technical terms: keep English with Vietnamese explanation
  - Example: "Pipeline (luồng xử lý bán hàng)"
- Currency: ₫ hoặc VNĐ, dùng dấu chấm phân cách: 1.000.000₫
- Date format: DD/MM/YYYY

## Documentation Lifecycle
```
Draft → Review (Tech Lead) → Publish → Update (on changes) → Archive
```
