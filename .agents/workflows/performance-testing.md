---
description: Performance testing workflow including load testing, profiling, and optimization
---

# Performance Testing Workflow

Quy trình kiểm thử hiệu năng: load testing, profiling, và tối ưu hóa cho SGROUP ERP.

## When to Trigger
- Trước release production
- Feature mới có heavy data processing
- Nhận report về performance issues
- Thêm nhiều concurrent users

## Steps

1. **Define Performance Targets**
   | Metric | Target | Measurement |
   |--------|--------|------------|
   | API Response Time (p95) | < 500ms | Backend profiling |
   | Page Load Time | < 3s | Lighthouse |
   | Time to Interactive (TTI) | < 5s | Lighthouse |
   | Concurrent Users | ≥ 100 | Load testing |
   | Database Query Time | < 100ms | Prisma logging |
   | Memory Usage (Backend) | < 512MB | Docker stats |
   | Bundle Size (Frontend) | < 2MB | Build analysis |

2. **Backend Profiling**
   - Enable Prisma query logging:
     ```typescript
     const prisma = new PrismaClient({
       log: ['query', 'warn', 'error'],
     });
     ```
   - Identify N+1 queries → add `include` / `select`
   - Check for missing database indexes:
     ```sql
     EXPLAIN ANALYZE SELECT * FROM leads WHERE status = 'NEW';
     ```
   - Profile memory usage:
     ```bash
     node --inspect dist/main.js
     # Open Chrome DevTools → Memory tab
     ```

3. **Database Optimization**
   - Review slow queries (> 100ms):
     ```sql
     SELECT query, calls, mean_time, total_time
     FROM pg_stat_statements
     ORDER BY mean_time DESC
     LIMIT 20;
     ```
   - Add indexes for:
     - [ ] Foreign keys used in JOINs
     - [ ] Columns used in WHERE / ORDER BY
     - [ ] Composite indexes for multi-column queries
   - Consider query optimizations:
     - Use `select` instead of `include` (Prisma)
     - Pagination instead of loading all records
     - Caching for frequently accessed data

4. **API Load Testing**
   - Install load testing tool:
     ```bash
     npm install -g autocannon
     ```
   - Run load test:
     ```bash
     # Basic load test — 100 connections, 30 seconds
     autocannon -c 100 -d 30 http://localhost:3000/api/leads
     
     # With authentication
     autocannon -c 50 -d 30 -H "Authorization=Bearer <token>" http://localhost:3000/api/leads
     ```
   - Analyze results:
     | Metric | Acceptable | Warning | Critical |
     |--------|-----------|---------|----------|
     | Avg latency | < 100ms | 100-500ms | > 500ms |
     | p99 latency | < 1s | 1-3s | > 3s |
     | Errors | 0% | < 1% | > 1% |
     | Req/sec | > 500 | 100-500 | < 100 |

5. **Frontend Performance**
   - Run Lighthouse audit (Chrome DevTools → Lighthouse):
     | Category | Target Score |
     |----------|-------------|
     | Performance | ≥ 90 |
     | Accessibility | ≥ 90 |
     | Best Practices | ≥ 90 |
     | SEO | ≥ 80 |
   - Check bundle size:
     ```bash
     cd SGROUP-ERP-UNIVERSAL && npx expo export --platform web
     # Check dist/ folder sizes
     ```
   - Optimize:
     - [ ] Lazy loading for screens/routes
     - [ ] Image optimization (WebP, proper sizing)
     - [ ] Memoize expensive components (`React.memo`, `useMemo`)
     - [ ] Virtualized lists cho long lists (`FlatList`)
     - [ ] Reduce re-renders (check React DevTools Profiler)

6. **Mobile Performance**
   - Check FPS (target: 60fps)
   - Memory usage monitoring
   - Startup time optimization
   - Network request optimization (batch, cache)
   - Optimize animations (use `Animated` / `Reanimated` native driver)

7. **Performance Report**
   ```markdown
   # Performance Test Report
   **Date**: [date]
   **Version**: [version]
   
   ## API Performance
   | Endpoint | Avg (ms) | p95 (ms) | p99 (ms) | Req/s |
   |----------|----------|----------|----------|-------|
   | GET /leads | 45 | 120 | 350 | 800 |
   | POST /leads | 60 | 180 | 500 | 600 |
   
   ## Frontend Performance (Lighthouse)
   | Metric | Score | Details |
   |--------|-------|---------|
   | Performance | 92 | LCP: 1.8s, FID: 50ms, CLS: 0.05 |
   
   ## Optimizations Applied
   - [List optimizations made]
   
   ## Remaining Issues
   - [Issues with remediation plan]
   ```

## Next Workflow
→ `/release-management` if all targets met
→ `/debug` if specific performance issues need fixing
