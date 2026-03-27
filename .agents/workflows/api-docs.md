---
description: Generate API documentation by scanning NestJS controllers and Swagger decorators
---

# API Documentation Generation — SGROUP ERP

Tạo và cập nhật tài liệu API tự động từ Swagger/OpenAPI decorators trong NestJS.

## When to Trigger
- Sau khi thêm/sửa API endpoint
- Trước khi handoff cho frontend team
- Khi onboard developer mới cần đọc API spec

## Steps

1. **Verify Swagger decorators** đầy đủ trên tất cả controllers
```bash
cd sgroup-erp-backend && grep -rn "@ApiTags\|@ApiOperation\|@ApiResponse" src/modules/ | wc -l
```

2. **Check controllers thiếu Swagger**
```bash
cd sgroup-erp-backend && for f in $(find src/modules -name "*.controller.ts"); do if ! grep -q "@ApiTags" "$f"; then echo "MISSING @ApiTags: $f"; fi; done
```

3. **Start backend để generate Swagger**
```bash
cd sgroup-erp-backend && npm run start:dev
```

4. **Verify Swagger UI**
> Mở trình duyệt: `http://localhost:3000/api/docs`
> Kiểm tra tất cả endpoints đã hiển thị đúng

5. **Export Swagger JSON**
```bash
curl http://localhost:3000/api/docs-json -o docs/api/swagger.json
```

6. **Generate API changelog** (so sánh với version trước)
```bash
npx openapi-diff docs/api/swagger-prev.json docs/api/swagger.json
```

## Swagger Checklist per Endpoint
- [ ] `@ApiTags('module-name')` trên controller
- [ ] `@ApiOperation({ summary: '...' })` trên mỗi method
- [ ] `@ApiResponse({ status: 200, type: ResponseDto })` trên mỗi method
- [ ] `@ApiResponse({ status: 400, description: 'Validation error' })`
- [ ] `@ApiBearerAuth()` nếu endpoint cần JWT
- [ ] Request DTO có `@ApiProperty()` trên mỗi field

## Output
- Swagger UI: `http://localhost:3000/api/docs`
- Swagger JSON: `docs/api/swagger.json`
- Chia sẻ cho FE team để tạo types matching
