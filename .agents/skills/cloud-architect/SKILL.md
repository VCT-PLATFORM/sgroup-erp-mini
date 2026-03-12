---
name: Cloud Architect
description: AWS/GCP cloud architecture, serverless patterns, cost optimization, and multi-region deployment for SGROUP ERP
---

# Cloud Architect Skill — SGROUP ERP

## Role Overview
The Cloud Architect designs cloud infrastructure, optimizes costs, ensures high availability, and plans for scalable multi-region deployment.

## Cloud Architecture — SGROUP ERP

### Recommended Stack (GCP/AWS)
```
                    ┌──────────────┐
Internet ──HTTPS──> │ Cloud CDN     │ (Static assets, frontend)
                    │ / CloudFront  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Load Balancer │ (Cloud LB / ALB)
                    │ SSL termination│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │ App Server │ │ App   │ │ App Server │
        │ Instance 1 │ │ Inst 2│ │ Instance 3 │
        │ (NestJS)   │ │       │ │            │
        └─────┬──────┘ └───┬───┘ └─────┬──────┘
              │            │            │
              └────────────┼────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │ Cloud SQL  │ │ Redis │ │ Cloud      │
        │ PostgreSQL │ │ Cache │ │ Storage    │
        │ (Primary)  │ │       │ │ (Files)    │
        └─────┬──────┘ └───────┘ └────────────┘
              │
        ┌─────▼──────┐
        │ Read Replica│
        └────────────┘
```

### Service Mapping
| Component | GCP | AWS | Purpose |
|-----------|-----|-----|---------|
| Compute | Cloud Run / GKE | ECS Fargate / EKS | App servers |
| Database | Cloud SQL (PostgreSQL) | RDS PostgreSQL | Primary DB |
| Cache | Memorystore (Redis) | ElastiCache | Session/cache |
| Storage | Cloud Storage | S3 | File uploads |
| CDN | Cloud CDN | CloudFront | Static assets |
| DNS | Cloud DNS | Route 53 | Domain management |
| Monitoring | Cloud Monitoring | CloudWatch | Metrics/alerts |
| Logging | Cloud Logging | CloudWatch Logs | Centralized logs |
| Secrets | Secret Manager | Secrets Manager | API keys, credentials |
| CI/CD | Cloud Build | CodePipeline | Deployment |

## Serverless Patterns

### Cloud Run / Fargate Deployment
```yaml
# GCP Cloud Run — cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/sgroup-backend', './sgroup-erp-backend']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/sgroup-backend']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'sgroup-backend'
      - '--image=gcr.io/$PROJECT_ID/sgroup-backend'
      - '--region=asia-southeast1'
      - '--platform=managed'
      - '--min-instances=1'
      - '--max-instances=10'
      - '--memory=512Mi'
      - '--cpu=1'
      - '--set-env-vars=NODE_ENV=production'
```

### Serverless Functions (for background tasks)
```typescript
// Cloud Functions / Lambda — scheduled report generation
export const generateDailyReport = async (event: CloudEvent) => {
  const yesterday = new Date(Date.now() - 86400000);
  const report = await generateReport(yesterday);
  await uploadToStorage(`reports/${yesterday.toISOString().split('T')[0]}.json`, report);
  await sendNotification('Daily report generated');
};
```

## Cost Optimization

### Right-Sizing Guide
| Service | Dev | Staging | Production |
|---------|-----|---------|------------|
| App instances | 1 × small | 2 × small | 3 × medium |
| Database | Shared / db-f1-micro | db-custom-1-4096 | db-custom-4-16384 |
| Redis | None | 1GB basic | 5GB standard |
| Storage | Pay-per-use | Pay-per-use | Pay-per-use |
| **Est. Monthly** | **~$30** | **~$150** | **~$500-800** |

### Cost Saving Strategies
| Strategy | Savings | Implementation |
|----------|---------|---------------|
| Auto-scaling (scale to zero) | Up to 70% | Cloud Run min-instances=0 for dev |
| Committed use discounts | 30-55% | 1-year commit for production DB |
| Preemptible/Spot instances | 60-80% | For CI/CD runners |
| Right-size database | 20-40% | Monitor and adjust |
| CDN caching | 10-30% | Cache static assets, API responses |
| Lifecycle policies | 5-10% | Auto-delete old logs/backups |

## High Availability

### Multi-Region Architecture (Future)
```
Region: Asia Southeast 1 (Singapore) — PRIMARY
├── App instances (auto-scaled)
├── Cloud SQL Primary
├── Redis Primary
└── Cloud Storage

Region: Asia Southeast 2 (Jakarta) — FAILOVER
├── App instances (standby)
├── Cloud SQL Read Replica
├── Redis Replica
└── Cloud Storage (replicated)
```

### Disaster Recovery
| Tier | RPO | RTO | Strategy | Cost |
|------|-----|-----|----------|------|
| Bronze | 24h | 4h | Daily backups, manual restore | $ |
| Silver | 1h | 1h | Continuous backup, warm standby | $$ |
| Gold | 0 | 15min | Active-active multi-region | $$$$ |

**Current recommendation**: Silver tier for production

## Security in Cloud

### IAM Best Practices
- Principle of least privilege for all service accounts
- Separate service accounts per service
- No long-lived keys — use workload identity
- Enable audit logging for all admin actions

### Network Security
```
Internet → Cloud Armor (WAF/DDoS) → Load Balancer → VPC
                                                     │
              Private subnet: App servers ───────────┘
              Private subnet: Database (no public IP)
              Private subnet: Redis (no public IP)
```

### Compliance
- Data residency: Southeast Asia region
- Encryption at rest: AES-256 (default)
- Encryption in transit: TLS 1.3
- Backup retention: 30 days minimum
