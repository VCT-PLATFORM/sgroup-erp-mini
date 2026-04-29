-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 005: Marketing Module
-- PostgreSQL 15
-- ═══════════════════════════════════════════════════════════

-- ── Campaigns ──────────────────────────────────────────────
CREATE TABLE campaigns (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name                VARCHAR(300) NOT NULL,
    description         TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'PLANNING'
                        CHECK (status IN ('PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED')),
    channel             VARCHAR(30) NOT NULL
                        CHECK (channel IN (
                            'FACEBOOK_ADS', 'GOOGLE_ADS', 'SEO', 'EMAIL',
                            'EVENTS', 'KOL', 'CONTENT', 'OTHER'
                        )),
    budget              NUMERIC(18, 2) NOT NULL DEFAULT 0,
    spent               NUMERIC(18, 2) NOT NULL DEFAULT 0,
    start_date          DATE,
    end_date            DATE,
    owner_id            UUID REFERENCES employees(id) ON DELETE SET NULL,
    target_leads        INT DEFAULT 0,
    actual_leads        INT DEFAULT 0,
    target_conversions  INT DEFAULT 0,
    actual_conversions  INT DEFAULT 0,
    kpi_goal            VARCHAR(300),
    tags                JSONB DEFAULT '[]',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_channel ON campaigns(channel);
CREATE INDEX idx_campaigns_owner ON campaigns(owner_id);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

COMMENT ON TABLE campaigns IS 'Chiến dịch marketing';

-- ── Marketing Leads ────────────────────────────────────────
CREATE TABLE mkt_leads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name            VARCHAR(200) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    source          VARCHAR(50),
    status          VARCHAR(20) NOT NULL DEFAULT 'NEW'
                    CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')),
    campaign_id     UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    assigned_to     UUID REFERENCES employees(id) ON DELETE SET NULL,
    notes           TEXT,
    value           NUMERIC(18, 2) DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mkt_leads_campaign ON mkt_leads(campaign_id);
CREATE INDEX idx_mkt_leads_status ON mkt_leads(status);
CREATE INDEX idx_mkt_leads_assigned ON mkt_leads(assigned_to);

COMMENT ON TABLE mkt_leads IS 'Leads sinh ra từ chiến dịch marketing';

-- ── Content Posts ──────────────────────────────────────────
CREATE TABLE content_posts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    title           VARCHAR(500) NOT NULL,
    platform        VARCHAR(20) NOT NULL
                    CHECK (platform IN ('FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'WEBSITE', 'YOUTUBE')),
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                    CHECK (status IN ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED')),
    scheduled_date  TIMESTAMPTZ,
    published_date  TIMESTAMPTZ,
    author_id       UUID REFERENCES employees(id) ON DELETE SET NULL,
    content         TEXT,
    image_url       VARCHAR(500),
    likes           INT DEFAULT 0,
    comments        INT DEFAULT 0,
    shares          INT DEFAULT 0,
    views           INT DEFAULT 0,
    campaign_id     UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    tags            JSONB DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_posts_campaign ON content_posts(campaign_id);
CREATE INDEX idx_content_posts_platform ON content_posts(platform);
CREATE INDEX idx_content_posts_status ON content_posts(status);
CREATE INDEX idx_content_posts_author ON content_posts(author_id);

COMMENT ON TABLE content_posts IS 'Bài đăng content trên các nền tảng MXH';

-- ── KOL Partners ──────────────────────────────────────────
CREATE TABLE kol_partners (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name            VARCHAR(200) NOT NULL,
    platform        VARCHAR(20) NOT NULL
                    CHECK (platform IN ('FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'WEBSITE', 'YOUTUBE')),
    followers       INT DEFAULT 0,
    category        VARCHAR(100),
    price_per_post  NUMERIC(18, 2) DEFAULT 0,
    rating          NUMERIC(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_collabs   INT DEFAULT 0,
    last_collab     DATE,
    contact         VARCHAR(200),
    status          VARCHAR(20) DEFAULT 'PROSPECT'
                    CHECK (status IN ('ACTIVE', 'INACTIVE', 'PROSPECT')),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kol_platform ON kol_partners(platform);
CREATE INDEX idx_kol_status ON kol_partners(status);

COMMENT ON TABLE kol_partners IS 'Danh sách KOL/Influencer hợp tác';

-- ── Auto-update triggers ───────────────────────────────────
CREATE TRIGGER trg_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_mkt_leads_updated_at
    BEFORE UPDATE ON mkt_leads
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_kol_partners_updated_at
    BEFORE UPDATE ON kol_partners
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ═══ END Migration 005 ═══
