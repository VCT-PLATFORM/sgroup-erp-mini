-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 002: HR Module
-- PostgreSQL 15
-- ═══════════════════════════════════════════════════════════

-- ── Departments ────────────────────────────────────────────
CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50) UNIQUE,
    description     TEXT,
    manager_id      UUID,  -- FK added after employees table exists
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_departments_code ON departments(code);

COMMENT ON TABLE departments IS 'Phòng ban: Kinh Doanh, Marketing, Nhân Sự, Kế Toán...';

-- ── Positions ──────────────────────────────────────────────
CREATE TABLE positions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50) UNIQUE,
    level           VARCHAR(50)
                    CHECK (level IN ('C_LEVEL', 'DIRECTOR', 'MANAGER', 'LEADER', 'SENIOR', 'STAFF', 'INTERN')),
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE positions IS 'Chức vụ: Giám đốc, Trưởng phòng, Nhân viên...';

-- ── Teams ──────────────────────────────────────────────────
CREATE TABLE teams (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50) UNIQUE,
    description     TEXT,
    department_id   UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teams_department ON teams(department_id);

COMMENT ON TABLE teams IS 'Nhóm/đội trong phòng ban';

-- ── Employees ──────────────────────────────────────────────
CREATE TABLE employees (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id                 UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    employee_code           VARCHAR(30) NOT NULL UNIQUE,
    full_name               VARCHAR(200) NOT NULL,
    english_name            VARCHAR(200),
    email                   VARCHAR(255),
    phone                   VARCHAR(20),
    relative_phone          VARCHAR(20),
    identity_card           VARCHAR(20),
    id_issue_date           DATE,
    id_issue_place          VARCHAR(200),
    date_of_birth           DATE,
    gender                  VARCHAR(10) CHECK (gender IN ('M', 'F', 'OTHER')),
    address                 TEXT,
    permanent_address       TEXT,
    contact_address         TEXT,
    
    -- Financial
    tax_code                VARCHAR(20),
    insurance_book_number   VARCHAR(30),
    bank_name               VARCHAR(100),
    bank_account            VARCHAR(30),
    
    -- Organization
    department_id           UUID REFERENCES departments(id) ON DELETE SET NULL,
    position_id             UUID REFERENCES positions(id) ON DELETE SET NULL,
    team_id                 UUID REFERENCES teams(id) ON DELETE SET NULL,
    manager_id              UUID REFERENCES employees(id) ON DELETE SET NULL,
    
    -- Employment
    status                  VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                            CHECK (status IN ('ACTIVE', 'PROBATION', 'ON_LEAVE', 'TERMINATED')),
    employment_type         VARCHAR(20) DEFAULT 'FULL_TIME'
                            CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    join_date               DATE,
    leave_date              DATE,
    official_salary         NUMERIC(18, 2),
    probation_salary        NUMERIC(18, 2),
    remaining_leave_days    INT DEFAULT 0,
    total_leave_days        INT DEFAULT 12,
    
    -- Recruitment
    recruiter               VARCHAR(200),
    candidate_source        VARCHAR(100),
    referrer                VARCHAR(200),
    
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_team ON employees(team_id);
CREATE INDEX idx_employees_position ON employees(position_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_code ON employees(employee_code);

-- Now add deferred FK for departments.manager_id
ALTER TABLE departments
    ADD CONSTRAINT fk_departments_manager
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

COMMENT ON TABLE employees IS 'Nhân viên — liên kết với users qua user_id';
COMMENT ON COLUMN employees.user_id IS 'Liên kết đến tài khoản đăng nhập, nullable nếu chưa có tài khoản';

-- ── Auto-update triggers ───────────────────────────────────
CREATE TRIGGER trg_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ═══ END Migration 002 ═══
