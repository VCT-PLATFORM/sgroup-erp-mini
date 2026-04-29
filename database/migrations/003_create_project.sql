-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 003: Project Module
-- PostgreSQL 15 — Chỉ bảng projects, loại hình SP cấu hình trong code
-- ═══════════════════════════════════════════════════════════

-- ── Projects ───────────────────────────────────────────────
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(300) NOT NULL,
    description     TEXT,
    developer       VARCHAR(200),
    location        TEXT,
    province        VARCHAR(100),
    district        VARCHAR(100),
    image_url       VARCHAR(500),
    property_type   VARCHAR(30) NOT NULL DEFAULT 'APARTMENT',
    fee_rate        NUMERIC(5, 2) DEFAULT 0,
    avg_price       NUMERIC(18, 2) DEFAULT 0,
    total_units     INT DEFAULT 0,
    sold_units      INT DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'BOOKING'
                    CHECK (status IN ('BOOKING', 'DEPOSIT', 'CONTRACT', 'HANDOVER', 'SOLD_OUT')),
    manager_id      UUID REFERENCES employees(id) ON DELETE SET NULL,
    team_size       INT DEFAULT 0,
    progress        NUMERIC(5, 2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    tags            JSONB DEFAULT '[]',
    start_date      DATE,
    end_date        DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_code ON projects(code);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_property_type ON projects(property_type);
CREATE INDEX idx_projects_manager ON projects(manager_id);

COMMENT ON TABLE projects IS 'Dự án bất động sản';
COMMENT ON COLUMN projects.property_type IS 'Loại hình SP: giá trị hợp lệ cấu hình trong code (LAND, APARTMENT, VILLA, SHOPHOUSE, OFFICETEL...)';
COMMENT ON COLUMN projects.fee_rate IS 'Tỷ lệ hoa hồng %';

-- ── Auto-update trigger ────────────────────────────────────
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ═══ END Migration 003 ═══
