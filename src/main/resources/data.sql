-- =======================================================
-- Sample Seed Data for Employee Payroll Management System
-- =======================================================

USE payroll_db;

-- Seed Employees
INSERT IGNORE INTO employees (employee_id, employee_name, department, email, designation, phone, status)
VALUES
(1, 'John Doe', 'Engineering', 'john.doe@company.com', 'Senior Software Engineer', '+1-555-0101', 'ACTIVE'),
(2, 'Sarah Smith', 'Human Resources', 'sarah.smith@company.com', 'HR Manager', '+1-555-0102', 'ACTIVE'),
(3, 'Alex Johnson', 'Finance', 'alex.johnson@company.com', 'Financial Analyst', '+1-555-0103', 'ACTIVE'),
(4, 'Emily Davis', 'Marketing', 'emily.davis@company.com', 'Marketing Lead', '+1-555-0104', 'ACTIVE');

-- Seed Salary Records
INSERT IGNORE INTO salaries (salary_id, employee_id, basic_salary, hra, allowances, deductions, gross_salary, net_pay, pay_period, payment_status)
VALUES
(1, 1, 50000.0, 20000.0, 10000.0, 5000.0, 80000.0, 75000.0, '09-2026', 'PROCESSED'),
(2, 2, 45000.0, 18000.0, 8000.0, 4500.0, 71000.0, 66500.0, '09-2026', 'PROCESSED');
