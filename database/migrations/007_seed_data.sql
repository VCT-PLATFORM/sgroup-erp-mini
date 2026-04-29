-- ═══════════════════════════════════════════════════════════
-- SGroup ERP — Migration 007: Seed Data (UUID v7 Edition)
-- PostgreSQL 15
-- ═══════════════════════════════════════════════════════════

-- ── 1. Roles ───────────────────────────────────────────────
INSERT INTO roles (code, name, description, permissions) VALUES
('admin',          'System Admin',     'Toàn quyền hệ thống',           '{"all": true}'),
('hr',             'HR Manager',       'Quản lý nhân sự',               '{"hr": ["read","write","delete"]}'),
('sales_staff',    'Sales Staff',      'Nhân viên kinh doanh',          '{"sales": ["read","write"]}'),
('sales_manager',  'Sales Manager',    'Trưởng phòng kinh doanh',      '{"sales": ["read","write","approve"]}'),
('sales_director', 'Sales Director',   'Giám đốc kinh doanh',          '{"sales": ["read","write","approve","delete"]}'),
('mkt_staff',      'Marketing Staff',  'Nhân viên marketing',           '{"marketing": ["read","write"]}'),
('mkt_manager',    'Marketing Manager','Trưởng phòng marketing',       '{"marketing": ["read","write","approve"]}');

-- ── 2. Users & Employees Seeding with Variables ───────────
DO $$
DECLARE
    role_admin_id UUID;
    role_sales_dir_id UUID;
    role_sales_mgr_id UUID;
    role_sales_staff_id UUID;
    role_mkt_mgr_id UUID;
    
    user_admin_id UUID := uuid_generate_v7();
    user_sales_dir_id UUID := uuid_generate_v7();
    user_sales_mgr_id UUID := uuid_generate_v7();
    user_sales_staff_id UUID := uuid_generate_v7();
    user_mkt_mgr_id UUID := uuid_generate_v7();
    
    dept_sales_id UUID := uuid_generate_v7();
    dept_mkt_id UUID := uuid_generate_v7();
    dept_hr_id UUID := uuid_generate_v7();
    dept_acc_id UUID := uuid_generate_v7();
    
    pos_dir_id UUID := uuid_generate_v7();
    pos_mgr_id UUID := uuid_generate_v7();
    pos_staff_id UUID := uuid_generate_v7();
    pos_intern_id UUID := uuid_generate_v7();
    
    team_alpha_id UUID := uuid_generate_v7();
    team_beta_id UUID := uuid_generate_v7();
    team_content_id UUID := uuid_generate_v7();
    
    emp_admin_id UUID := uuid_generate_v7();
    emp_sales_dir_id UUID := uuid_generate_v7();
    emp_sales_mgr_id UUID := uuid_generate_v7();
    emp_sales_staff_id UUID := uuid_generate_v7();
    emp_mkt_mgr_id UUID := uuid_generate_v7();
    
    proj_sgr_id UUID := uuid_generate_v7();
    proj_vgp_id UUID := uuid_generate_v7();
    proj_egs_id UUID := uuid_generate_v7();
    
    book_1_id UUID := uuid_generate_v7();
    book_2_id UUID := uuid_generate_v7();
BEGIN
    -- Get roles
    SELECT id INTO role_admin_id FROM roles WHERE code = 'admin';
    SELECT id INTO role_sales_dir_id FROM roles WHERE code = 'sales_director';
    SELECT id INTO role_sales_mgr_id FROM roles WHERE code = 'sales_manager';
    SELECT id INTO role_sales_staff_id FROM roles WHERE code = 'sales_staff';
    SELECT id INTO role_mkt_mgr_id FROM roles WHERE code = 'mkt_manager';

    -- Users
    INSERT INTO users (id, email, password_hash, name, status) VALUES
    (user_admin_id,       'admin@sgroup.vn',    crypt('Admin@123', gen_salt('bf')), 'Nguyễn Admin',     'ACTIVE'),
    (user_sales_dir_id,   'ngviet@sgroup.vn',   crypt('Pass@123',  gen_salt('bf')), 'Ngô Việt',         'ACTIVE'),
    (user_sales_mgr_id,   'tranlh@sgroup.vn',   crypt('Pass@123',  gen_salt('bf')), 'Trần Lê Hoàng',    'ACTIVE'),
    (user_sales_staff_id, 'phamtd@sgroup.vn',   crypt('Pass@123',  gen_salt('bf')), 'Phạm Thùy Dung',   'ACTIVE'),
    (user_mkt_mgr_id,     'lemk@sgroup.vn',     crypt('Pass@123',  gen_salt('bf')), 'Lê Minh Khoa',     'ACTIVE');

    -- User Roles
    INSERT INTO user_roles (user_id, role_id) VALUES
    (user_admin_id, role_admin_id),
    (user_sales_dir_id, role_sales_dir_id),
    (user_sales_mgr_id, role_sales_mgr_id),
    (user_sales_staff_id, role_sales_staff_id),
    (user_mkt_mgr_id, role_mkt_mgr_id);

    -- Departments
    INSERT INTO departments (id, name, code) VALUES
    (dept_sales_id, 'Kinh Doanh', 'KD'),
    (dept_mkt_id,   'Marketing',  'MKT'),
    (dept_hr_id,    'Nhân Sự',    'HR'),
    (dept_acc_id,   'Kế Toán',    'KT');

    -- Positions
    INSERT INTO positions (id, name, code, level) VALUES
    (pos_dir_id,    'Giám đốc Kinh Doanh', 'GD-KD',  'DIRECTOR'),
    (pos_mgr_id,    'Trưởng phòng',        'TP',      'MANAGER'),
    (pos_staff_id,  'Nhân viên',           'NV',      'STAFF'),
    (pos_intern_id, 'Thực tập sinh',       'TTS',     'INTERN');

    -- Teams
    INSERT INTO teams (id, name, code, department_id) VALUES
    (team_alpha_id,   'Team Alpha',   'KD-A', dept_sales_id),
    (team_beta_id,    'Team Beta',    'KD-B', dept_sales_id),
    (team_content_id, 'Team Content', 'MKT-C', dept_mkt_id);

    -- Employees
    INSERT INTO employees (id, user_id, employee_code, full_name, email, phone, department_id, position_id, team_id, status, join_date) VALUES
    (emp_admin_id,       user_admin_id,       'NV001', 'Nguyễn Admin',   'admin@sgroup.vn',  '0901000001', dept_sales_id, pos_dir_id,   NULL,           'ACTIVE', '2024-01-01'),
    (emp_sales_dir_id,   user_sales_dir_id,   'NV002', 'Ngô Việt',       'ngviet@sgroup.vn', '0901000002', dept_sales_id, pos_mgr_id,   team_alpha_id,  'ACTIVE', '2024-03-01'),
    (emp_sales_mgr_id,   user_sales_mgr_id,   'NV003', 'Trần Lê Hoàng',  'tranlh@sgroup.vn', '0901000003', dept_sales_id, pos_staff_id, team_alpha_id,  'ACTIVE', '2024-06-01'),
    (emp_sales_staff_id, user_sales_staff_id, 'NV004', 'Phạm Thùy Dung', 'phamtd@sgroup.vn', '0901000004', dept_sales_id, pos_staff_id, team_beta_id,   'ACTIVE', '2024-06-15'),
    (emp_mkt_mgr_id,     user_mkt_mgr_id,     'NV005', 'Lê Minh Khoa',   'lemk@sgroup.vn',   '0901000005', dept_mkt_id,   pos_mgr_id,   team_content_id, 'ACTIVE', '2024-04-01');

    -- Projects
    INSERT INTO projects (id, code, name, developer, location, property_type, fee_rate, avg_price, total_units, sold_units, status, manager_id) VALUES
    (proj_sgr_id, 'SGR', 'SGroup Riverside',    'SGroup Corp',  'Quận 2, TP.HCM',     'APARTMENT', 3.0, 5000000000, 200, 45,  'BOOKING',  emp_admin_id),
    (proj_vgp_id, 'VGP', 'Vinhomes Grand Park', 'Vingroup',     'TP. Thủ Đức, HCM',   'APARTMENT', 2.5, 3500000000, 500, 120, 'DEPOSIT',  emp_admin_id),
    (proj_egs_id, 'EGS', 'Eco Green Saigon',    'Xuân Mai Corp','Quận 7, TP.HCM',     'APARTMENT', 3.0, 4200000000, 300, 80,  'CONTRACT', emp_sales_dir_id);

    -- Bookings
    INSERT INTO bookings (id, project_id, unit_code, customer_name, customer_phone, booking_amount, staff_id, team_id, status, created_by, year, month) VALUES
    (book_1_id, proj_sgr_id, 'V1-1',  'Trần Lê Hải',    '0969841010', 50000000, emp_sales_mgr_id, team_alpha_id, 'APPROVED', emp_sales_mgr_id, 2026, 4),
    (book_2_id, proj_vgp_id, 'GP-01', 'Lâm Chấn Phong', '0912345678', 50000000, emp_sales_staff_id, team_alpha_id, 'PENDING',  emp_sales_staff_id, 2026, 4);

    -- Deposits
    INSERT INTO deposits (id, project_id, unit_code, customer_name, customer_phone, deposit_amount, price, source, booking_id, staff_id, team_id, payment_method, status, created_by, year, month) VALUES
    (uuid_generate_v7(), proj_sgr_id, 'V1-1',  'Trần Lê Hải',    '0969841010', 200000000, 5200000000, 'BOOKING', book_1_id, emp_sales_mgr_id, team_alpha_id, 'BANK_TRANSFER', 'PENDING',   emp_sales_mgr_id, 2026, 4),
    (uuid_generate_v7(), proj_egs_id, 'EG-01', 'Đào Thùy Trang', '0987654321', 250000000, 0,          'DIRECT',  NULL,      emp_sales_staff_id, team_beta_id,  'CASH',          'CONFIRMED', emp_sales_staff_id, 2026, 4);

END $$;

-- ═══ END Migration 007 ═══
