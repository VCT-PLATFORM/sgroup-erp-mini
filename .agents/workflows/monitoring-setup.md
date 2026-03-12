---
description: Monitoring, alerting, health checks, logging, and dashboard setup for SGROUP ERP
---

# Monitoring Setup Workflow

Thiết lập hệ thống monitoring, alerting, và logging cho SGROUP ERP.

## When to Trigger
- Setup production environment lần đầu
- Thêm service mới cần monitoring
- Sau mỗi major incident → cải thiện monitoring

## Steps

1. **Health Check Endpoints**
   - Verify health endpoint exists (tham khảo devops skill):
     ```bash
     curl http://localhost:3000/api/health
     ```
   - Expected response:
     ```json
     {
       "status": "healthy",
       "timestamp": "2026-03-12T09:00:00.000Z",
       "uptime": 86400,
       "database": "connected"
     }
     ```
   - If missing, implement using `HealthController` from devops skill

2. **Application Logging**
   - Configure structured logging:
     ```typescript
     // Logger levels
     LOG_LEVEL=info          // Production
     LOG_LEVEL=debug         // Staging
     LOG_LEVEL=verbose       // Development
     ```
   - Logging standards:
     - ✅ Log: errors, warnings, auth events, business events
     - ❌ Don't log: passwords, tokens, PII, full request bodies
   - Log format (JSON):
     ```json
     {
       "timestamp": "2026-03-12T09:00:00Z",
       "level": "error",
       "service": "sgroup-erp-backend",
       "message": "Failed to create lead",
       "context": { "userId": "abc-123", "module": "leads" },
       "error": { "name": "ValidationError", "message": "..." }
     }
     ```

3. **Monitoring Stack Setup**
   - Monitoring architecture (tham khảo devops skill):
     ```
     App Metrics    → Prometheus → Grafana (Dashboards)
     App Logs       → Fluentd   → Elasticsearch → Kibana
     Error Tracking → Sentry
     Uptime         → UptimeRobot / Better Uptime
     ```
   - Docker Compose additions:
     ```yaml
     # Add to docker-compose.monitoring.yml
     services:
       prometheus:
         image: prom/prometheus:latest
         volumes:
           - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
         ports: ['9090:9090']
       
       grafana:
         image: grafana/grafana:latest
         ports: ['3001:3000']
         environment:
           GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
     ```

4. **Key Metrics to Monitor**
   | Category | Metric | Alert Threshold |
   |----------|--------|----------------|
   | **Availability** | Uptime | < 99.9% |
   | **Performance** | API p95 response time | > 500ms |
   | **Errors** | Error rate (5xx) | > 1% in 5 min |
   | **Database** | Connection pool usage | > 80% |
   | **Database** | Query time | > 200ms |
   | **System** | CPU usage | > 85% for 5 min |
   | **System** | Memory usage | > 90% |
   | **System** | Disk usage | > 85% |
   | **Business** | Failed login attempts | > 10/min |
   | **SSL** | Certificate expiry | < 14 days |

5. **Alert Configuration**
   - Alert levels:
     | Level | Action | Notification |
     |-------|--------|-------------|
     | 🔴 Critical | Page on-call immediately | SMS + Phone call |
     | 🟠 Warning | Investigate within 1 hour | Slack + Email |
     | 🟡 Info | Review next business day | Slack only |
   - Avoid alert fatigue: start with few critical alerts, expand gradually

6. **Grafana Dashboards**
   - Create dashboards:
     - **System Overview**: CPU, Memory, Disk, Network
     - **API Performance**: Request rate, latency, error rate
     - **Database**: Query performance, connection pool, slow queries
     - **Business**: Active users, key transactions, conversion rates

7. **Uptime Monitoring (External)**
   - Configure UptimeRobot or Better Uptime:
     - Monitor: `https://api.sgroup.vn/api/health`
     - Interval: Every 1 minute
     - Alert: Email + Slack on down
     - Status page: Public or internal

8. **On-Call Rotation**
   | Week | Primary On-Call | Secondary |
   |------|----------------|-----------|
   | W1 | Dev A | Dev B |
   | W2 | Dev B | Dev C |
   | W3 | Dev C | Dev A |
   
   - Primary: First responder (≤ 5 min for P0)
   - Secondary: Backup if primary unavailable
   - Escalation: Tech Lead → CTO

9. **Runbook for Common Issues**
   | Issue | Check | Fix |
   |-------|-------|-----|
   | API 502 | `docker-compose ps` | Restart backend: `docker-compose restart backend` |
   | DB connection error | Check pool | Increase pool size in DATABASE_URL |
   | High memory | `docker stats` | Restart or scale: `docker-compose up -d --scale backend=3` |
   | Disk full | `df -h` | Clean logs: `docker system prune` |

## Next Workflow
→ `/incident-management` when alerts fire
