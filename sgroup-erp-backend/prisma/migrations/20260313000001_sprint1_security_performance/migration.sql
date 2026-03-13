-- ════════════════════════════════════════════════════════════════
-- SPRINT 1 MIGRATION: Security & Performance
-- Áp dụng: 2026-03-13
-- ════════════════════════════════════════════════════════════════

-- ── 1. REFRESH TOKEN TABLE (Token Revocation) ─────────────────
-- Cho phép logout thực sự và revoke token bị compromise
CREATE TABLE "RefreshToken" (
    "id"          TEXT         NOT NULL,
    "token"       TEXT         NOT NULL,
    "userId"      TEXT         NOT NULL,
    "expiresAt"   TIMESTAMP(3) NOT NULL,
    "revokedAt"   TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceInfo"  TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- Index để lookup nhanh theo token value
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
-- Index cho cleanup expired tokens và lookup theo user
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- ── 2. DATABASE INDEXES — Customer (hay query nhất) ──────────
-- Hầu hết queries filter theo year/month, status, assignedTo
CREATE INDEX "Customer_year_month_idx"   ON "Customer"("year", "month");
CREATE INDEX "Customer_status_idx"       ON "Customer"("status");
CREATE INDEX "Customer_assignedTo_idx"   ON "Customer"("assignedTo");
CREATE INDEX "Customer_source_idx"       ON "Customer"("source");
CREATE INDEX "Customer_createdAt_idx"    ON "Customer"("createdAt" DESC);

-- ── 3. DATABASE INDEXES — FactDeal ───────────────────────────
CREATE INDEX "FactDeal_year_month_idx"   ON "FactDeal"("year", "month");
CREATE INDEX "FactDeal_teamId_idx"       ON "FactDeal"("teamId");
CREATE INDEX "FactDeal_staffId_idx"      ON "FactDeal"("staffId");
CREATE INDEX "FactDeal_stage_idx"        ON "FactDeal"("stage");
CREATE INDEX "FactDeal_status_idx"       ON "FactDeal"("status");
CREATE INDEX "FactDeal_createdAt_idx"    ON "FactDeal"("createdAt" DESC);

-- ── 4. DATABASE INDEXES — SalesActivity ─────────────────────
CREATE INDEX "SalesActivity_year_month_idx" ON "SalesActivity"("year", "month");
CREATE INDEX "SalesActivity_staffId_idx"    ON "SalesActivity"("staffId");
CREATE INDEX "SalesActivity_date_idx"       ON "SalesActivity"("date" DESC);

-- ── 5. DATABASE INDEXES — Appointment ───────────────────────
CREATE INDEX "Appointment_staffId_idx"      ON "Appointment"("staffId");
CREATE INDEX "Appointment_scheduledAt_idx"  ON "Appointment"("scheduledAt");
CREATE INDEX "Appointment_status_idx"       ON "Appointment"("status");

-- ── 6. DATABASE INDEXES — CommissionRecord ───────────────────
CREATE INDEX "CommissionRecord_staffId_idx"  ON "CommissionRecord"("staffId");
CREATE INDEX "CommissionRecord_year_month_idx" ON "CommissionRecord"("year", "month");
CREATE INDEX "CommissionRecord_status_idx"   ON "CommissionRecord"("status");

-- ── 7. DATABASE INDEXES — DebtRecord ─────────────────────────
CREATE INDEX "DebtRecord_status_idx"         ON "DebtRecord"("status");
CREATE INDEX "DebtRecord_dueDate_idx"        ON "DebtRecord"("dueDate");
CREATE INDEX "DebtRecord_customerId_idx"     ON "DebtRecord"("customerId");

-- ── 8. SOFT DELETE — Thêm deletedAt cho các entity quan trọng
-- Customer: cần audit trail khi "xóa" lead
ALTER TABLE "Customer"
    ADD COLUMN "deletedAt" TIMESTAMP(3);

-- FactDeal: deal đã đóng cần lưu lại cho lịch sử
ALTER TABLE "FactDeal"
    ADD COLUMN "deletedAt" TIMESTAMP(3);

-- PropertyProduct: sản phẩm BĐS không nên hard delete
ALTER TABLE "PropertyProduct"
    ADD COLUMN "deletedAt" TIMESTAMP(3);

-- HrEmployee: nhân viên nghỉ việc cần giữ lịch sử
-- (dùng isActive đã có, thêm deletedAt để có timestamp chính xác)
ALTER TABLE "HrEmployee"
    ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Index để query không bao gồm records đã xóa (soft delete performance)
CREATE INDEX "Customer_deletedAt_idx"         ON "Customer"("deletedAt")     WHERE "deletedAt" IS NULL;
CREATE INDEX "FactDeal_deletedAt_idx"         ON "FactDeal"("deletedAt")     WHERE "deletedAt" IS NULL;
CREATE INDEX "PropertyProduct_deletedAt_idx"  ON "PropertyProduct"("deletedAt") WHERE "deletedAt" IS NULL;

-- ── 9. rawJson: String → JSON type (JSONB trong PostgreSQL) ──
-- Cho phép query bên trong JSON, dùng GIN index
-- NOTE: Cast an toàn — String value NULL hoặc valid JSON được giữ nguyên

ALTER TABLE "PlanScenarioLog"
    ALTER COLUMN "rawJson" TYPE JSONB USING
        CASE WHEN "rawJson" IS NULL OR TRIM("rawJson") = '' THEN NULL
             ELSE "rawJson"::JSONB END;

ALTER TABLE "PlanBundleLog"
    ALTER COLUMN "rawJson" TYPE JSONB USING
        CASE WHEN "rawJson" IS NULL OR TRIM("rawJson") = '' THEN NULL
             ELSE "rawJson"::JSONB END;

ALTER TABLE "ExecPlanLatest"
    ALTER COLUMN "rawJson" TYPE JSONB USING
        CASE WHEN "rawJson" IS NULL OR TRIM("rawJson") = '' THEN NULL
             ELSE "rawJson"::JSONB END;

-- ── 10. ExecKpiLatest rawJson (nếu tồn tại) ─────────────────
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ExecKpiLatest' AND column_name = 'rawJson'
    ) THEN
        ALTER TABLE "ExecKpiLatest"
            ALTER COLUMN "rawJson" TYPE JSONB USING
                CASE WHEN "rawJson" IS NULL OR TRIM("rawJson") = '' THEN NULL
                     ELSE "rawJson"::JSONB END;
    END IF;
END $$;

-- GIN index trên JSONB columns để query bên trong JSON nhanh
CREATE INDEX "PlanScenarioLog_rawJson_gin" ON "PlanScenarioLog" USING GIN ("rawJson") WHERE "rawJson" IS NOT NULL;
CREATE INDEX "PlanBundleLog_rawJson_gin"   ON "PlanBundleLog"   USING GIN ("rawJson") WHERE "rawJson" IS NOT NULL;
