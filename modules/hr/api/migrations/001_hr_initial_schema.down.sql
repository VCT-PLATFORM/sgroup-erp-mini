-- 001_hr_initial_schema.down.sql

ALTER TABLE IF EXISTS hr_departments DROP CONSTRAINT IF EXISTS fk_hr_departments_manager;

DROP TABLE IF EXISTS hr_payslips CASCADE;
DROP TABLE IF EXISTS hr_payroll_runs CASCADE;
DROP TABLE IF EXISTS hr_attendance_records CASCADE;
DROP TABLE IF EXISTS hr_employment_contracts CASCADE;
DROP TABLE IF EXISTS hr_employees CASCADE;
DROP TABLE IF EXISTS hr_departments CASCADE;
DROP TABLE IF EXISTS hr_positions CASCADE;
DROP TABLE IF EXISTS hr_audit_logs CASCADE;
