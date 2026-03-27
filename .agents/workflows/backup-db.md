---
description: Backup database before critical operations (migrations, bulk updates)
---

# Database Backup — SGROUP ERP

Sao lưu database PostgreSQL trước khi thực hiện thao tác rủi ro cao (migration, bulk update, data fix).

## When to Trigger
- Trước khi chạy `prisma migrate deploy` trên production
- Trước khi bulk update/delete dữ liệu
- Trước khi chạy script fix data
- Định kỳ hàng ngày (automated)

## Steps

1. **Check current database size**
```bash
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

2. **Create backup** (pg_dump)
```bash
pg_dump $DATABASE_URL --format=custom --no-owner --file=backup_$(date +%Y%m%d_%H%M%S).dump
```

3. **Verify backup file**
```bash
pg_restore --list backup_*.dump | head -20
```

4. **Upload to S3/Cloud Storage** (nếu có)
```bash
aws s3 cp backup_*.dump s3://sgroup-erp-backups/$(date +%Y/%m)/
```

## Restore Procedure

1. **Drop and recreate** (⚠️ DESTRUCTIVE)
```bash
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

2. **Restore from backup**
```bash
pg_restore --no-owner --dbname=$DATABASE_URL backup_YYYYMMDD_HHMMSS.dump
```

3. **Verify restore**
```bash
psql $DATABASE_URL -c "SELECT count(*) FROM users;"
```

## Neon Database (Cloud)
Nếu dùng Neon PostgreSQL:
```bash
# Neon tự động tạo branch backup
neon branches create --name backup-$(date +%Y%m%d) --project-id $NEON_PROJECT_ID
```

## ⚠️ Critical Rules
- KHÔNG BAO GIỜ chạy migration trên production mà không backup trước
- Giữ ít nhất 7 bản backup gần nhất
- Test restore procedure định kỳ mỗi tháng
