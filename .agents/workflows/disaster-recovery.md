---
description: Disaster recovery planning, backup testing, failover procedures, and recovery drills for SGROUP ERP
---

# Disaster Recovery Workflow

Quy trình lập kế hoạch và thực thi khôi phục sau thảm họa cho SGROUP ERP.

## When to Trigger
- Setup production lần đầu (tạo DR plan)
- Quarterly DR drill (test khôi phục)
- Sau mỗi major incident
- Thay đổi infrastructure hoặc thêm service mới

## Recovery Tiers

| Tier | RPO | RTO | Strategy | Monthly Cost |
|------|-----|-----|----------|-------------|
| 🥉 Bronze | 24h | 4h | Daily backups, manual restore | $ |
| 🥈 Silver | 1h | 1h | Continuous backup, warm standby | $$ |
| 🥇 Gold | 0 | 15 min | Active-active multi-region | $$$$ |

**Current recommendation**: 🥈 Silver for production

## Steps

### Phase 1: DR Planning

1. **Risk Assessment**
   | Risk | Probability | Impact | Mitigation |
   |------|-----------|--------|-----------|
   | Database corruption | Low | Critical | Auto backups, WAL archiving |
   | Server failure | Low | High | Auto-restart, load balancer |
   | Region outage | Very Low | Critical | Cross-region backup |
   | Ransomware | Low | Critical | Offline backups, access controls |
   | Human error (data delete) | Medium | High | Soft delete, point-in-time recovery |
   | DDoS attack | Medium | High | Cloud Armor, rate limiting |

2. **Define RPO & RTO per Service**
   | Service | RPO (Data Loss) | RTO (Downtime) | Priority |
   |---------|-----------------|----------------|----------|
   | Database (PostgreSQL) | 1 hour | 1 hour | P0 |
   | Backend API | 0 (stateless) | 5 min | P0 |
   | Frontend Web | 0 (static) | 5 min | P1 |
   | File Storage | 24 hours | 2 hours | P2 |
   | Redis Cache | N/A (ephemeral) | 5 min | P2 |

### Phase 2: Backup Configuration

3. **Database Backups**
   - Automated daily backup:
     ```bash
     #!/bin/bash
     # backup.sh — Cron: 0 2 * * *
     DATE=$(date +%Y%m%d_%H%M%S)
     BACKUP_DIR="/backups"
     
     # Full database dump
     pg_dump -U postgres -h localhost sgroup_erp | gzip > $BACKUP_DIR/db_$DATE.sql.gz
     
     # Verify backup integrity
     gunzip -t $BACKUP_DIR/db_$DATE.sql.gz && echo "✅ Backup verified"
     
     # Keep last 30 days
     find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
     
     # Upload to remote storage
     aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://sgroup-backups/daily/
     ```
   - Enable WAL archiving for point-in-time recovery
   - Cloud SQL: Enable automated backups + point-in-time recovery

4. **Application State Backups**
   - Backup checklist:
     - [ ] Database (pg_dump) — Daily
     - [ ] Uploaded files (Cloud Storage sync) — Daily
     - [ ] Environment configs (.env, secrets) — On change
     - [ ] Prisma migrations — In Git repo
     - [ ] Docker images — In container registry

5. **Cross-Region Replication (Silver+)**
   ```
   Primary Region (asia-southeast1 — Singapore)
   ├── Cloud SQL Primary
   ├── App instances (active)
   └── Cloud Storage (source)
        │
        │ Continuous replication
        ▼
   DR Region (asia-southeast2 — Jakarta)
   ├── Cloud SQL Read Replica
   ├── App instances (standby)
   └── Cloud Storage (replicated)
   ```

### Phase 3: Recovery Procedures

6. **Recovery Runbooks**

   #### Scenario A: Database Corruption
   ```bash
   # 1. Stop application
   docker-compose stop backend
   
   # 2. Restore from latest backup
   gunzip -c /backups/db_latest.sql.gz | psql -U postgres -d sgroup_erp_restore
   
   # 3. Verify data integrity
   psql -U postgres -d sgroup_erp_restore -c "SELECT COUNT(*) FROM users;"
   
   # 4. Swap databases
   psql -U postgres -c "ALTER DATABASE sgroup_erp RENAME TO sgroup_erp_corrupted;"
   psql -U postgres -c "ALTER DATABASE sgroup_erp_restore RENAME TO sgroup_erp;"
   
   # 5. Restart application
   docker-compose start backend
   
   # 6. Verify
   curl http://localhost:3000/api/health
   ```

   #### Scenario B: Server Failure
   ```bash
   # 1. Docker auto-restart handles most cases
   docker-compose up -d
   
   # 2. If server unrecoverable — provision new server
   # 3. Pull latest images
   docker-compose pull
   
   # 4. Restore data from backup
   # 5. Run migrations
   cd sgroup-erp-backend && npx prisma migrate deploy
   
   # 6. Start services
   docker-compose up -d
   ```

   #### Scenario C: Region Outage (Silver+)
   ```bash
   # 1. Promote DR region read replica to primary
   gcloud sql instances promote-replica sgroup-db-replica
   
   # 2. Update DNS to point to DR region
   # 3. Start standby app instances
   # 4. Verify all services
   ```

### Phase 4: DR Drills

7. **Quarterly DR Drill**
   - Schedule: First week of each quarter
   - Drill procedure:
     1. Notify team of planned drill
     2. Execute recovery scenario (in staging)
     3. Measure actual RPO and RTO
     4. Document gaps and issues
   
   - Drill report:
     | Metric | Target | Actual | Pass |
     |--------|--------|--------|------|
     | RPO achieved | 1h | [actual] | ✅/❌ |
     | RTO achieved | 1h | [actual] | ✅/❌ |
     | Backup integrity | 100% | [actual] | ✅/❌ |
     | Runbook accurate | Yes | [actual] | ✅/❌ |

8. **Continuous Improvement**
   - Update runbooks after each drill/incident
   - Review DR tier quarterly (upgrade if needed)
   - Test backup restoration monthly
   - Monitor backup job success/failure → `/monitoring-setup`

## Emergency Contacts

| Role | Name | Phone | When to Call |
|------|------|-------|-------------|
| CTO | [Name] | [Phone] | P0 incidents |
| DevOps Lead | [Name] | [Phone] | Infrastructure issues |
| DBA | [Name] | [Phone] | Database issues |
| Cloud Provider | Support | [Support #] | Cloud outage |

## Next Workflow
→ `/incident-management` when disaster strikes
→ `/monitoring-setup` for backup monitoring
