-- 001_hr_initial_schema.up.sql

-- 1. hr_audit_logs
CREATE TABLE hr_audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values TEXT,
    new_values TEXT,
    changed_by INTEGER,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_hr_audit_logs_table_name ON hr_audit_logs(table_name);
CREATE INDEX idx_hr_audit_logs_record_id ON hr_audit_logs(record_id);
CREATE INDEX idx_hr_audit_logs_changed_by ON hr_audit_logs(changed_by);
CREATE INDEX idx_hr_audit_logs_created_at ON hr_audit_logs(created_at);

-- 2. hr_positions
CREATE TABLE hr_positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    level VARCHAR(50) DEFAULT 'Junior',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. hr_departments
CREATE TABLE hr_departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER,
    manager_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_hr_departments_parent FOREIGN KEY (parent_id) REFERENCES hr_departments(id) ON DELETE SET NULL
);

-- 4. hr_employees
CREATE TABLE hr_employees (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    identity_card VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    avatar_url VARCHAR(500),
    department_id INTEGER,
    position_id INTEGER,
    status VARCHAR(50) DEFAULT 'Active',
    join_date DATE,
    leave_date DATE,
    manager_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_hr_employees_department FOREIGN KEY (department_id) REFERENCES hr_departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_hr_employees_position FOREIGN KEY (position_id) REFERENCES hr_positions(id) ON DELETE SET NULL,
    CONSTRAINT fk_hr_employees_manager FOREIGN KEY (manager_id) REFERENCES hr_employees(id) ON DELETE SET NULL
);

-- Fix circular dependency: Add manager_id FK to hr_departments
ALTER TABLE hr_departments ADD CONSTRAINT fk_hr_departments_manager FOREIGN KEY (manager_id) REFERENCES hr_employees(id) ON DELETE SET NULL;

-- 5. hr_employment_contracts
CREATE TABLE hr_employment_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    employee_id INTEGER NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    base_salary DECIMAL(18,4),
    currency VARCHAR(10) DEFAULT 'VND',
    working_hours INTEGER,
    document_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_hr_employment_contracts_employee FOREIGN KEY (employee_id) REFERENCES hr_employees(id) ON DELETE CASCADE
);
CREATE INDEX idx_hr_employment_contracts_deleted_at ON hr_employment_contracts(deleted_at);

-- 6. hr_attendance_records
CREATE TABLE hr_attendance_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    date VARCHAR(10) NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    total_hours NUMERIC(5,2),
    status VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_hr_attendance_records_employee FOREIGN KEY (employee_id) REFERENCES hr_employees(id) ON DELETE CASCADE
);
CREATE INDEX idx_hr_attendance_records_employee_date ON hr_attendance_records(employee_id, date);
CREATE INDEX idx_hr_attendance_records_deleted_at ON hr_attendance_records(deleted_at);

-- 7. hr_payroll_runs
CREATE TABLE hr_payroll_runs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cycle_start DATE NOT NULL,
    cycle_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    processed_by INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_hr_payroll_runs_deleted_at ON hr_payroll_runs(deleted_at);

-- 8. hr_payslips
CREATE TABLE hr_payslips (
    id SERIAL PRIMARY KEY,
    payroll_run_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    standard_work_days NUMERIC(5,2),
    actual_work_days NUMERIC(5,2),
    base_salary DECIMAL(18,4),
    allowances DECIMAL(18,4),
    deductions DECIMAL(18,4),
    net_salary DECIMAL(18,4),
    status VARCHAR(50) DEFAULT 'Generated',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_hr_payslips_payroll_run FOREIGN KEY (payroll_run_id) REFERENCES hr_payroll_runs(id) ON DELETE CASCADE,
    CONSTRAINT fk_hr_payslips_employee FOREIGN KEY (employee_id) REFERENCES hr_employees(id) ON DELETE CASCADE
);
CREATE INDEX idx_hr_payslips_payroll_run_id ON hr_payslips(payroll_run_id);
CREATE INDEX idx_hr_payslips_employee_id ON hr_payslips(employee_id);
CREATE INDEX idx_hr_payslips_deleted_at ON hr_payslips(deleted_at);
