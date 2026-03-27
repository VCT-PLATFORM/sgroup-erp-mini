---
description: Run performance benchmarks for SGROUP ERP — API throughput, database queries, and memory profiling
---

# Performance Benchmark — SGROUP ERP

Đo lường hiệu năng API, database queries, và memory usage.

## When to Trigger
- Trước và sau khi optimize
- Khi user báo "chậm" hoặc response time > 500ms
- Trước khi deploy feature mới lên production
- Định kỳ mỗi sprint

## Steps

### 1. API Load Testing (Artillery/k6)

1. **Cài đặt Artillery** (nếu chưa có)
```bash
npm install -g artillery
```

2. **Tạo test scenario** (`benchmark/load-test.yml`)
```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 30
      arrivalRate: 10
      name: "Warm up"
    - duration: 60
      arrivalRate: 50
      name: "Ramp up"
  defaults:
    headers:
      Authorization: "Bearer {{token}}"

scenarios:
  - name: "GET Sales List"
    flow:
      - get:
          url: "/api/sales"
  - name: "GET Project Dashboard"
    flow:
      - get:
          url: "/api/projects"
```

3. **Chạy load test**
```bash
artillery run benchmark/load-test.yml --output result.json
```

4. **Xem báo cáo**
```bash
artillery report result.json
```

### 2. Database Query Profiling

1. **Enable Prisma query logging**
```typescript
// prisma.service.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

2. **Check slow queries** (PostgreSQL)
```sql
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

3. **Analyze với EXPLAIN**
```sql
EXPLAIN ANALYZE SELECT * FROM leads WHERE status = 'NEW' ORDER BY created_at DESC LIMIT 20;
```

### 3. Memory Profiling

1. **Start với inspect mode**
```bash
node --inspect dist/main.js
```

2. **Mở Chrome DevTools**: `chrome://inspect`
3. **Take heap snapshot** trước và sau load test
4. **So sánh** để phát hiện memory leaks

## Performance Targets

| Metric | Target | Red Flag |
|---|---|---|
| API p95 latency | < 200ms | > 500ms |
| API p99 latency | < 500ms | > 1s |
| Throughput | > 100 req/s | < 50 req/s |
| Memory usage | < 512MB | > 1GB |
| DB query avg | < 50ms | > 200ms |
