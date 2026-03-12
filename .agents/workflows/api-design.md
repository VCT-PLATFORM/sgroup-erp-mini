---
description: API design and documentation workflow using NestJS conventions
---

# API Design Workflow

Quy trình thiết kế API RESTful cho SGROUP ERP, từ endpoint design đến Swagger documentation.

## When to Trigger
- Feature mới cần backend API
- Thay đổi API contract hiện tại
- Tích hợp external service

## Steps

1. **Gather API Requirements**
   - Review user stories & acceptance criteria
   - Identify data entities & relationships
   - List all operations needed (CRUD + business operations)
   - Identify consumers: Frontend / Mobile / External

2. **Design Resource Endpoints**
   - Follow RESTful conventions:
     ```
     GET    /api/{module}            → List (paginated)
     GET    /api/{module}/:id        → Get by ID
     POST   /api/{module}            → Create
     PATCH  /api/{module}/:id        → Update (partial)
     DELETE /api/{module}/:id        → Soft delete
     
     # Business operations
     POST   /api/{module}/:id/action → Custom action
     ```
   - Naming rules:
     - Plural nouns for resources: `/api/leads`, `/api/customers`
     - kebab-case for multi-word: `/api/sales-activities`
     - Nest sub-resources: `/api/leads/:id/activities`
   - Include versioning strategy (if needed): `/api/v1/...`

3. **Define Request/Response DTOs**
   - Follow NestJS DTO conventions (tham khảo backend-dev skill):
     ```typescript
     // Create DTO — only required fields
     export class CreateLeadDto {
       @IsString() @IsNotEmpty()
       fullName: string;
       
       @IsEmail()
       email: string;
       
       @IsEnum(LeadSource)
       source: LeadSource;
     }
     
     // Update DTO — all optional (Partial)
     export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
     
     // Response DTO — full entity
     export class LeadResponseDto {
       id: string;  // UUID v7
       fullName: string;
       email: string;
       source: LeadSource;
       status: LeadStatus;
       createdAt: Date;
       updatedAt: Date;
     }
     ```
   - Always include pagination for list endpoints:
     ```typescript
     export class PaginatedResponseDto<T> {
       data: T[];
       meta: {
         total: number;
         page: number;
         limit: number;
         totalPages: number;
       };
     }
     ```

4. **Define Error Responses**
   - Standardized error format:
     ```json
     {
       "statusCode": 400,
       "message": "Validation failed",
       "errors": [
         { "field": "email", "message": "Email không hợp lệ" }
       ],
       "timestamp": "2026-03-12T09:00:00.000Z"
     }
     ```
   - HTTP Status codes:
     | Code | Usage |
     |------|-------|
     | 200 | Successful GET, PATCH |
     | 201 | Successful POST (created) |
     | 204 | Successful DELETE |
     | 400 | Validation error |
     | 401 | Unauthorized (no/invalid token) |
     | 403 | Forbidden (no permission) |
     | 404 | Resource not found |
     | 409 | Conflict (duplicate) |
     | 500 | Internal server error |

5. **Design Authentication & Authorization**
   - JWT-based authentication (tham khảo security skill)
   - Role-based access per endpoint:
     ```typescript
     @Roles(Role.ADMIN, Role.SALES_MANAGER)
     @Get()
     findAll() { ... }
     ```
   - Document required roles for each endpoint

6. **Write Swagger Documentation**
   - Use NestJS Swagger decorators:
     ```typescript
     @ApiTags('leads')
     @ApiOperation({ summary: 'Tạo lead mới' })
     @ApiResponse({ status: 201, type: LeadResponseDto })
     @ApiResponse({ status: 400, description: 'Validation error' })
     ```
   // turbo
   - Generate & verify Swagger: `cd sgroup-erp-backend && npm run start:dev`
   - Access Swagger UI: `http://localhost:3000/api/docs`

7. **API Review**
   - Tech Lead reviews:
     - [ ] RESTful conventions followed
     - [ ] Request/Response DTOs properly typed
     - [ ] Validation decorators on all inputs
     - [ ] Pagination on list endpoints
     - [ ] Error responses standardized
     - [ ] Auth/Authz defined for all endpoints
     - [ ] Swagger docs complete
   - Iterate on feedback

8. **Handoff**
   - Share API spec (Swagger JSON) with frontend team
   - Create types on frontend matching DTOs
   - Proceed to implementation → Chạy `/feature-development`

## Next Workflow
→ `/feature-development` or `/db-migration` if schema changes needed first
