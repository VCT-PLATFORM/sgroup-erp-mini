-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 004: Sales Module
-- PostgreSQL 15 — Chỉ bookings, deposits, sales_activities
-- ═══════════════════════════════════════════════════════════

-- ── Bookings (Giữ chỗ) ────────────────────────────────────
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    product_id      UUID,
    unit_code       VARCHAR(50),
    customer_name   VARCHAR(200) NOT NULL,
    customer_phone  VARCHAR(20),
    customer_email  VARCHAR(255),
    id_card_no      VARCHAR(20),
    booking_amount  NUMERIC(18, 2) NOT NULL DEFAULT 0,
    staff_id        UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    team_id         UUID REFERENCES teams(id) ON DELETE SET NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    booking_date    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    note            TEXT,
    created_by      UUID REFERENCES employees(id) ON DELETE SET NULL,
    reviewed_by     UUID REFERENCES employees(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,
    year            INT NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    month           INT NOT NULL DEFAULT EXTRACT(MONTH FROM NOW()),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_project ON bookings(project_id);
CREATE INDEX idx_bookings_staff ON bookings(staff_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_year_month ON bookings(year, month);

COMMENT ON TABLE bookings IS 'Giữ chỗ BĐS: PENDING → APPROVED / REJECTED';
COMMENT ON COLUMN bookings.booking_amount IS 'Số tiền giữ chỗ (VNĐ)';

-- ── Deposits (Đặt cọc) ────────────────────────────────────
CREATE TABLE deposits (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    product_id          UUID,
    unit_code           VARCHAR(50),
    customer_name       VARCHAR(200) NOT NULL,
    customer_phone      VARCHAR(20),
    customer_email      VARCHAR(255),
    id_card_no          VARCHAR(20),
    deposit_amount      NUMERIC(18, 2) NOT NULL DEFAULT 0,
    price               NUMERIC(18, 2) DEFAULT 0,
    source              VARCHAR(20) NOT NULL DEFAULT 'DIRECT'
                        CHECK (source IN ('BOOKING', 'DIRECT')),
    booking_id          UUID REFERENCES bookings(id) ON DELETE SET NULL,
    staff_id            UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
    payment_method      VARCHAR(30)
                        CHECK (payment_method IN ('BANK_TRANSFER', 'CASH', 'MOMO', 'OTHER')),
    receipt_no          VARCHAR(50),
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED')),
    is_agreement_signed BOOLEAN NOT NULL DEFAULT FALSE,
    is_contract_signed  BOOLEAN NOT NULL DEFAULT FALSE,
    notes               TEXT,
    id_front_url        VARCHAR(500),
    id_back_url         VARCHAR(500),
    payment_proof_url   VARCHAR(500),
    deposit_date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at        TIMESTAMPTZ,
    created_by          UUID REFERENCES employees(id) ON DELETE SET NULL,
    reviewed_by         UUID REFERENCES employees(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMPTZ,
    year                INT NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    month               INT NOT NULL DEFAULT EXTRACT(MONTH FROM NOW()),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deposits_project ON deposits(project_id);
CREATE INDEX idx_deposits_staff ON deposits(staff_id);
CREATE INDEX idx_deposits_booking ON deposits(booking_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_created_at ON deposits(created_at);
CREATE INDEX idx_deposits_year_month ON deposits(year, month);

COMMENT ON TABLE deposits IS 'Đặt cọc BĐS: PENDING → CONFIRMED → COMPLETED';
COMMENT ON COLUMN deposits.price IS 'Giá trị sản phẩm - chỉ Admin module Dự Án nhập';
COMMENT ON COLUMN deposits.source IS 'BOOKING = chuyển từ giữ chỗ, DIRECT = tạo cọc trực tiếp';
COMMENT ON COLUMN deposits.is_agreement_signed IS 'Đã ký văn bản thỏa thuận';
COMMENT ON COLUMN deposits.is_contract_signed IS 'Đã ký hợp đồng mua bán';

-- ── Sales Activities (Nhật ký hoạt động) ──────────────────
CREATE TABLE sales_activities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    staff_id        UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    team_id         UUID REFERENCES teams(id) ON DELETE SET NULL,
    posts_count     INT NOT NULL DEFAULT 0,
    calls_count     INT NOT NULL DEFAULT 0,
    new_leads       INT NOT NULL DEFAULT 0,
    meetings_made   INT NOT NULL DEFAULT 0,
    site_visits     INT NOT NULL DEFAULT 0,
    bookings_count  INT NOT NULL DEFAULT 0,
    deposits_count  INT NOT NULL DEFAULT 0,
    points          INT NOT NULL DEFAULT 0,
    activity_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(staff_id, activity_date)
);

CREATE INDEX idx_activities_staff ON sales_activities(staff_id);
CREATE INDEX idx_activities_team ON sales_activities(team_id);
CREATE INDEX idx_activities_date ON sales_activities(activity_date);

COMMENT ON TABLE sales_activities IS 'Nhật ký hoạt động hàng ngày — tính điểm KPI';
COMMENT ON COLUMN sales_activities.points IS 'Tổng điểm tự động tính từ các hoạt động';

-- ── Auto-update triggers ───────────────────────────────────
CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_deposits_updated_at
    BEFORE UPDATE ON deposits
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ═══ END Migration 004 ═══
