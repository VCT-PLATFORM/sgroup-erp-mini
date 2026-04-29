-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 006: System Support Tables
-- PostgreSQL 15
-- ═══════════════════════════════════════════════════════════

-- ── Attachments (Polymorphic) ──────────────────────────────
CREATE TABLE attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID NOT NULL,
    filename        VARCHAR(300) NOT NULL,
    url             VARCHAR(500) NOT NULL,
    size_bytes      BIGINT DEFAULT 0,
    mime_type       VARCHAR(100),
    uploaded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);

COMMENT ON TABLE attachments IS 'File đính kèm đa hình (polymorphic): entity_type + entity_id';
COMMENT ON COLUMN attachments.entity_type IS 'Tên bảng nguồn: booking, deposit, legal_doc, employee...';

-- ── Audit Logs ─────────────────────────────────────────────
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(30) NOT NULL
                    CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT')),
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

COMMENT ON TABLE audit_logs IS 'Lịch sử thao tác: ai làm gì, lúc nào, dữ liệu cũ/mới';

-- ── Notifications ──────────────────────────────────────────
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(300) NOT NULL,
    body            TEXT,
    type            VARCHAR(50) NOT NULL
                    CHECK (type IN (
                        'BOOKING_NEW', 'BOOKING_APPROVED', 'BOOKING_REJECTED',
                        'DEPOSIT_NEW', 'DEPOSIT_CONFIRMED', 'DEPOSIT_COMPLETED',
                        'APPROVAL_NEEDED', 'DEAL_WON', 'DEAL_LOST',
                        'SYSTEM', 'INFO'
                    )),
    entity_type     VARCHAR(50),
    entity_id       UUID,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

COMMENT ON TABLE notifications IS 'Thông báo push cho user: Sales tạo booking → Admin nhận thông báo';

-- ═══ END Migration 006 ═══
