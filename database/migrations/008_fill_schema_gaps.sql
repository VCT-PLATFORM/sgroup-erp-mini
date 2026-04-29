-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 008: Fill Schema Gaps
-- PostgreSQL 15
-- Adds: products, legal_docs, sales_plans,
--        crm_contacts, crm_interactions,
--        acc_transactions, acc_invoices,
--        exec_kpi_targets, exec_reports
-- Alters: deposits (add customer_confirm_url, ceo_confirm_url)
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- SECTION 1: PROJECT MODULE — products + legal_docs
-- ═══════════════════════════════════════════════════════════

-- ── Products (Sản phẩm / Căn hộ / Lô đất) ─────────────────
CREATE TABLE products (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    code                VARCHAR(50) NOT NULL,
    block               VARCHAR(50),
    floor               INT,
    area                NUMERIC(10, 2) NOT NULL DEFAULT 0,
    price               NUMERIC(18, 2) NOT NULL DEFAULT 0,
    commission_amt      NUMERIC(18, 2) DEFAULT 0,
    bonus_amt           NUMERIC(18, 2) DEFAULT 0,
    direction           VARCHAR(30),
    bedrooms            INT DEFAULT 0,
    unit_type           VARCHAR(50),
    view_desc           VARCHAR(300),
    status              VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
                        CHECK (status IN (
                            'AVAILABLE', 'LOCKED', 'RESERVED',
                            'PENDING_DEPOSIT', 'DEPOSIT', 'SOLD', 'COMPLETED'
                        )),
    booked_by           UUID REFERENCES employees(id) ON DELETE SET NULL,
    locked_until        TIMESTAMPTZ,
    customer_name       VARCHAR(200),
    customer_phone      VARCHAR(20),
    salesperson_id      UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, code)
);

CREATE INDEX idx_products_project ON products(project_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_salesperson ON products(salesperson_id);

COMMENT ON TABLE products IS 'Sản phẩm BĐS: căn hộ, lô đất, shophouse... thuộc một dự án';
COMMENT ON COLUMN products.commission_amt IS 'Hoa hồng cho NVKD bán thành công (VNĐ)';
COMMENT ON COLUMN products.bonus_amt IS 'Thưởng thêm nếu có chương trình bán hàng';
COMMENT ON COLUMN products.locked_until IS 'Thời gian giữ chỗ hết hạn — auto unlock khi hết';

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── Legal Documents (Pháp lý dự án) ────────────────────────
CREATE TABLE legal_docs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    doc_type            VARCHAR(50) NOT NULL DEFAULT 'OTHER'
                        CHECK (doc_type IN (
                            'GIAY_PHEP_XAY_DUNG', 'QUYET_DINH_PHE_DUYET',
                            'SO_DO', 'HOP_DONG', 'GIAY_CHUNG_NHAN',
                            'BIEU_MAU', 'OTHER'
                        )),
    status              VARCHAR(20) NOT NULL DEFAULT 'PREPARATION'
                        CHECK (status IN ('PREPARATION', 'SUBMITTED', 'ISSUE_FIXING', 'APPROVED')),
    file_url            VARCHAR(500) NOT NULL,
    uploaded_by         UUID REFERENCES employees(id) ON DELETE SET NULL,
    assignee_id         UUID REFERENCES employees(id) ON DELETE SET NULL,
    submit_date         DATE,
    approve_date        DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_legal_docs_project ON legal_docs(project_id);
CREATE INDEX idx_legal_docs_status ON legal_docs(status);
CREATE INDEX idx_legal_docs_doc_type ON legal_docs(doc_type);

COMMENT ON TABLE legal_docs IS 'Hồ sơ pháp lý dự án: giấy phép, quyết định, sổ đỏ...';

CREATE TRIGGER trg_legal_docs_updated_at
    BEFORE UPDATE ON legal_docs
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ═══════════════════════════════════════════════════════════
-- SECTION 2: SALES MODULE — ALTER deposits + sales_plans
-- ═══════════════════════════════════════════════════════════

-- ── Add confirmation URL columns to deposits ───────────────
ALTER TABLE deposits
    ADD COLUMN IF NOT EXISTS customer_confirm_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS ceo_confirm_url      VARCHAR(500);

COMMENT ON COLUMN deposits.customer_confirm_url IS 'Ảnh tin nhắn xác nhận từ khách hàng';
COMMENT ON COLUMN deposits.ceo_confirm_url IS 'Ảnh tin nhắn xác nhận từ Tổng Giám Đốc';

-- ── Sales Plans (Kế hoạch kinh doanh) ──────────────────────
CREATE TABLE sales_plans (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name                VARCHAR(300) NOT NULL,
    year                INT NOT NULL,
    month               INT,
    quarter             INT CHECK (quarter IN (1, 2, 3, 4)),
    plan_type           VARCHAR(20) NOT NULL DEFAULT 'MONTHLY'
                        CHECK (plan_type IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
    staff_id            UUID REFERENCES employees(id) ON DELETE SET NULL,
    
    -- Targets
    target_calls        INT DEFAULT 0,
    target_leads        INT DEFAULT 0,
    target_meetings     INT DEFAULT 0,
    target_site_visits  INT DEFAULT 0,
    target_bookings     INT DEFAULT 0,
    target_deposits     INT DEFAULT 0,
    target_revenue      NUMERIC(18, 2) DEFAULT 0,
    target_points       INT DEFAULT 0,
    
    -- Actual (auto-aggregated or manual)
    actual_calls        INT DEFAULT 0,
    actual_leads        INT DEFAULT 0,
    actual_meetings     INT DEFAULT 0,
    actual_site_visits  INT DEFAULT 0,
    actual_bookings     INT DEFAULT 0,
    actual_deposits     INT DEFAULT 0,
    actual_revenue      NUMERIC(18, 2) DEFAULT 0,
    actual_points       INT DEFAULT 0,
    
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    notes               TEXT,
    created_by          UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_by         UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_plans_year_month ON sales_plans(year, month);
CREATE INDEX idx_sales_plans_team ON sales_plans(team_id);
CREATE INDEX idx_sales_plans_staff ON sales_plans(staff_id);
CREATE INDEX idx_sales_plans_status ON sales_plans(status);

COMMENT ON TABLE sales_plans IS 'Kế hoạch kinh doanh: target vs actual theo tháng/quý/năm';
COMMENT ON COLUMN sales_plans.plan_type IS 'Loại KH: MONTHLY (nhân sự), QUARTERLY (team), YEARLY (CTy)';

CREATE TRIGGER trg_sales_plans_updated_at
    BEFORE UPDATE ON sales_plans
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ═══════════════════════════════════════════════════════════
-- SECTION 3: CRM MODULE
-- ═══════════════════════════════════════════════════════════

-- ── CRM Contacts (Khách hàng) ──────────────────────────────
CREATE TABLE crm_contacts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    full_name           VARCHAR(200) NOT NULL,
    email               VARCHAR(255),
    phone               VARCHAR(20),
    identity_card       VARCHAR(20),
    date_of_birth       DATE,
    gender              VARCHAR(10) CHECK (gender IN ('M', 'F', 'OTHER')),
    address             TEXT,
    source              VARCHAR(50)
                        CHECK (source IN ('WALK_IN', 'REFERRAL', 'ONLINE', 'EVENT', 'HOTLINE', 'MARKETING', 'OTHER')),
    assigned_to         UUID REFERENCES employees(id) ON DELETE SET NULL,
    team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'NEW'
                        CHECK (status IN ('NEW', 'CONTACTED', 'INTERESTED', 'NEGOTIATING', 'WON', 'LOST', 'DORMANT')),
    interest_project    UUID REFERENCES projects(id) ON DELETE SET NULL,
    interest_budget     NUMERIC(18, 2),
    interest_type       VARCHAR(30),
    notes               TEXT,
    last_contact_at     TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX idx_crm_contacts_assigned ON crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_contacts_team ON crm_contacts(team_id);
CREATE INDEX idx_crm_contacts_project ON crm_contacts(interest_project);

COMMENT ON TABLE crm_contacts IS 'Khách hàng CRM — theo dõi toàn bộ lifecycle';
COMMENT ON COLUMN crm_contacts.source IS 'Nguồn khách: walk-in, giới thiệu, online, sự kiện...';

CREATE TRIGGER trg_crm_contacts_updated_at
    BEFORE UPDATE ON crm_contacts
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── CRM Interactions (Lịch sử tương tác) ───────────────────
CREATE TABLE crm_interactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    contact_id          UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
    staff_id            UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    interaction_type    VARCHAR(30) NOT NULL
                        CHECK (interaction_type IN (
                            'CALL', 'MEETING', 'SITE_VISIT', 'EMAIL',
                            'MESSAGE', 'FOLLOW_UP', 'NEGOTIATION', 'OTHER'
                        )),
    outcome             VARCHAR(30)
                        CHECK (outcome IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'NO_ANSWER')),
    notes               TEXT,
    duration_minutes    INT,
    next_action         TEXT,
    next_action_date    DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_staff ON crm_interactions(staff_id);
CREATE INDEX idx_crm_interactions_type ON crm_interactions(interaction_type);

COMMENT ON TABLE crm_interactions IS 'Lịch sử tương tác với khách hàng: gọi, gặp, email...';


-- ═══════════════════════════════════════════════════════════
-- SECTION 4: ACCOUNTING MODULE
-- ═══════════════════════════════════════════════════════════

-- ── Transactions (Phát sinh tài chính) ─────────────────────
CREATE TABLE acc_transactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    txn_code            VARCHAR(30) NOT NULL UNIQUE,
    txn_type            VARCHAR(30) NOT NULL
                        CHECK (txn_type IN (
                            'BOOKING_FEE', 'DEPOSIT_FEE', 'COMMISSION',
                            'SALARY', 'BONUS', 'EXPENSE', 'REFUND', 'OTHER'
                        )),
    amount              NUMERIC(18, 2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'VND',
    direction           VARCHAR(10) NOT NULL CHECK (direction IN ('IN', 'OUT')),
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED')),
    
    -- References
    entity_type         VARCHAR(50),
    entity_id           UUID,
    project_id          UUID REFERENCES projects(id) ON DELETE SET NULL,
    employee_id         UUID REFERENCES employees(id) ON DELETE SET NULL,
    
    payment_method      VARCHAR(30),
    receipt_no          VARCHAR(50),
    description         TEXT,
    txn_date            DATE NOT NULL DEFAULT CURRENT_DATE,
    approved_by         UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_acc_txn_code ON acc_transactions(txn_code);
CREATE INDEX idx_acc_txn_type ON acc_transactions(txn_type);
CREATE INDEX idx_acc_txn_status ON acc_transactions(status);
CREATE INDEX idx_acc_txn_entity ON acc_transactions(entity_type, entity_id);
CREATE INDEX idx_acc_txn_date ON acc_transactions(txn_date);
CREATE INDEX idx_acc_txn_project ON acc_transactions(project_id);

COMMENT ON TABLE acc_transactions IS 'Phát sinh tài chính: hoa hồng, tiền cọc, lương, chi phí...';

CREATE TRIGGER trg_acc_transactions_updated_at
    BEFORE UPDATE ON acc_transactions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── Invoices (Hóa đơn) ─────────────────────────────────────
CREATE TABLE acc_invoices (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    invoice_no          VARCHAR(30) NOT NULL UNIQUE,
    invoice_type        VARCHAR(20) NOT NULL
                        CHECK (invoice_type IN ('PAYABLE', 'RECEIVABLE')),
    amount              NUMERIC(18, 2) NOT NULL,
    tax_amount          NUMERIC(18, 2) DEFAULT 0,
    total_amount        NUMERIC(18, 2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'VND',
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED')),
    counterparty_name   VARCHAR(300),
    counterparty_tax    VARCHAR(20),
    description         TEXT,
    issue_date          DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date            DATE,
    paid_at             TIMESTAMPTZ,
    created_by          UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_acc_invoices_no ON acc_invoices(invoice_no);
CREATE INDEX idx_acc_invoices_type ON acc_invoices(invoice_type);
CREATE INDEX idx_acc_invoices_status ON acc_invoices(status);
CREATE INDEX idx_acc_invoices_due ON acc_invoices(due_date);

COMMENT ON TABLE acc_invoices IS 'Hóa đơn: phải thu / phải trả';

CREATE TRIGGER trg_acc_invoices_updated_at
    BEFORE UPDATE ON acc_invoices
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ═══════════════════════════════════════════════════════════
-- SECTION 5: EXEC MODULE (Ban Điều Hành)
-- ═══════════════════════════════════════════════════════════

-- ── KPI Targets (Chỉ tiêu ban điều hành giao) ─────────────
CREATE TABLE exec_kpi_targets (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name                VARCHAR(300) NOT NULL,
    year                INT NOT NULL,
    quarter             INT CHECK (quarter IN (1, 2, 3, 4)),
    month               INT,
    scope               VARCHAR(20) NOT NULL
                        CHECK (scope IN ('COMPANY', 'DEPARTMENT', 'TEAM', 'INDIVIDUAL')),
    department_id       UUID REFERENCES departments(id) ON DELETE SET NULL,
    team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
    employee_id         UUID REFERENCES employees(id) ON DELETE SET NULL,
    
    target_revenue      NUMERIC(18, 2) DEFAULT 0,
    target_bookings     INT DEFAULT 0,
    target_deposits     INT DEFAULT 0,
    target_points       INT DEFAULT 0,
    target_leads        INT DEFAULT 0,
    target_conversion   NUMERIC(5, 2) DEFAULT 0,
    
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED')),
    notes               TEXT,
    created_by          UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exec_kpi_year ON exec_kpi_targets(year);
CREATE INDEX idx_exec_kpi_scope ON exec_kpi_targets(scope);
CREATE INDEX idx_exec_kpi_dept ON exec_kpi_targets(department_id);
CREATE INDEX idx_exec_kpi_team ON exec_kpi_targets(team_id);

COMMENT ON TABLE exec_kpi_targets IS 'Chỉ tiêu KPI do ban điều hành giao xuống: CTy → PB → Team → NV';

CREATE TRIGGER trg_exec_kpi_updated_at
    BEFORE UPDATE ON exec_kpi_targets
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── Exec Reports (Báo cáo định kỳ) ────────────────────────
CREATE TABLE exec_reports (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    title               VARCHAR(500) NOT NULL,
    report_type         VARCHAR(30) NOT NULL
                        CHECK (report_type IN (
                            'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'AD_HOC'
                        )),
    scope               VARCHAR(20) NOT NULL
                        CHECK (scope IN ('COMPANY', 'DEPARTMENT', 'TEAM')),
    department_id       UUID REFERENCES departments(id) ON DELETE SET NULL,
    team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
    period_start        DATE NOT NULL,
    period_end          DATE NOT NULL,
    
    -- Aggregated data snapshot
    summary_data        JSONB DEFAULT '{}',
    
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'PUBLISHED')),
    created_by          UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_by         UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exec_reports_type ON exec_reports(report_type);
CREATE INDEX idx_exec_reports_scope ON exec_reports(scope);
CREATE INDEX idx_exec_reports_period ON exec_reports(period_start, period_end);
CREATE INDEX idx_exec_reports_status ON exec_reports(status);

COMMENT ON TABLE exec_reports IS 'Báo cáo định kỳ ban điều hành: daily, weekly, monthly...';
COMMENT ON COLUMN exec_reports.summary_data IS 'Snapshot dữ liệu tổng hợp (revenue, bookings, deposits, points...)';

CREATE TRIGGER trg_exec_reports_updated_at
    BEFORE UPDATE ON exec_reports
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ═══ END Migration 008 ═══
