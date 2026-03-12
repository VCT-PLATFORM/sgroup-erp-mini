---
description: Cloud deployment, infrastructure provisioning, and cost optimization for SGROUP ERP
---

# Cloud Deployment Workflow

Quy trình triển khai và quản lý hạ tầng cloud cho SGROUP ERP (GCP / AWS).

## When to Trigger
- Setup production infrastructure lần đầu
- Scale application (thêm instances, regions)
- Migration từ local/VPS sang cloud
- Tối ưu chi phí cloud

## Steps

1. **Requirements Assessment**
   - Xác định workload:
     | Metric | Current | Expected Growth |
     |--------|---------|----------------|
     | Concurrent users | [N] | [N in 6 months] |
     | Request rate | [req/s] | [expected] |
     | Data size (DB) | [GB] | [expected] |
     | File storage | [GB] | [expected] |
   - Chọn cloud provider: GCP / AWS
   - Chọn deployment tier (tham khảo cloud-architect skill):
     | Tier | Cost/month | For |
     |------|-----------|-----|
     | Dev | ~$30 | Development & testing |
     | Staging | ~$150 | QA & demo |
     | Production | ~$500-800 | Live users |

2. **Architecture Design**
   - Follow cloud architecture from cloud-architect skill:
     ```
     Internet → CDN → Load Balancer → App Servers (2-3 instances)
                                         ├── PostgreSQL (Cloud SQL/RDS)
                                         ├── Redis (Cache)
                                         └── Cloud Storage (Files)
     ```
   - Chọn service components:
     | Component | GCP Option | AWS Option |
     |-----------|-----------|-----------|
     | Compute | Cloud Run | ECS Fargate |
     | Database | Cloud SQL PostgreSQL | RDS PostgreSQL |
     | Cache | Memorystore Redis | ElastiCache |
     | Storage | Cloud Storage | S3 |
     | CDN | Cloud CDN | CloudFront |
     | Secrets | Secret Manager | Secrets Manager |

3. **Infrastructure Provisioning**
   - Database setup:
     ```bash
     # GCP example
     gcloud sql instances create sgroup-db \
       --database-version=POSTGRES_16 \
       --tier=db-custom-2-8192 \
       --region=asia-southeast1 \
       --storage-size=20GB \
       --storage-auto-increase
     ```
   - Container registry:
     ```bash
     # Build & push Docker image
     docker build -t gcr.io/$PROJECT_ID/sgroup-backend ./sgroup-erp-backend
     docker push gcr.io/$PROJECT_ID/sgroup-backend
     ```
   - Deploy app service:
     ```bash
     gcloud run deploy sgroup-backend \
       --image=gcr.io/$PROJECT_ID/sgroup-backend \
       --region=asia-southeast1 \
       --min-instances=1 \
       --max-instances=10 \
       --memory=512Mi
     ```

4. **Configure Networking & Security**
   - [ ] SSL/TLS certificates (Let's Encrypt or managed)
   - [ ] Custom domain mapping
   - [ ] VPC / private network for DB & Redis
   - [ ] Cloud Armor / WAF rules (DDoS protection)
   - [ ] CORS configuration
   - [ ] IP whitelisting for admin endpoints
   - IAM & Service Accounts:
     - Least privilege principle
     - Separate accounts per service
     - No long-lived keys

5. **Configure Environment Variables**
   - Store secrets securely (Secret Manager):
     ```bash
     # Add secrets
     echo -n "postgresql://..." | gcloud secrets create DATABASE_URL --data-file=-
     echo -n "my-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-
     ```
   - Environment-specific configs:
     | Variable | Dev | Staging | Production |
     |----------|-----|---------|-----------|
     | NODE_ENV | development | staging | production |
     | LOG_LEVEL | debug | info | warn |
     | RATE_LIMIT | 1000/min | 500/min | 200/min |

6. **Setup CI/CD Pipeline**
   - GitHub Actions → Cloud Build → Deploy (tham khảo devops skill)
   - Branch strategy:
     ```
     main → production deploy
     develop → staging deploy
     feature/* → CI only (lint, test, build)
     ```
   - Deploy pipeline: Build → Test → Push image → Deploy → Health check

7. **Database Migration (Cloud)**
   - Apply migrations:
     ```bash
     # Connect via Cloud SQL Proxy
     cloud-sql-proxy $INSTANCE_CONNECTION_NAME &
     
     # Run migration
     DATABASE_URL="postgresql://..." npx prisma migrate deploy
     ```
   - Setup automated backups:
     - Daily automated backup (cloud-managed)
     - Point-in-time recovery enabled
     - Cross-region backup replication (optional)

8. **Cost Optimization**
   - Follow strategies from cloud-architect skill:
     - [ ] Auto-scaling configured (scale to zero for non-prod)
     - [ ] Committed use discounts (production DB)
     - [ ] Lifecycle policies for old logs/backups
     - [ ] Right-sized instances (monitor & adjust)
   - Setup cost alerts:
     ```bash
     # GCP budget alert
     gcloud billing budgets create \
       --billing-account=$BILLING_ACCOUNT \
       --display-name="SGROUP Monthly" \
       --budget-amount=800USD \
       --threshold-rule=percent=80
     ```

9. **Verify Deployment**
   - Health check: `curl https://api.sgroup.vn/api/health`
   - Run smoke tests against production
   - Verify monitoring → `/monitoring-setup`
   - Document infrastructure in architecture wiki

## Next Workflow
→ `/monitoring-setup` for observability
→ `/deployment` for routine deploys (after infrastructure is set up)
