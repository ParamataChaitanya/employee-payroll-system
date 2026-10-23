-- =======================================================
-- Database Schema for Employee Payroll Management System
-- Database: MySQL 8.0+
-- =======================================================

CREATE DATABASE IF NOT EXISTS payroll_db;
USE payroll_db;

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    employee_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    designation VARCHAR(50),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_emp_department (department),
    INDEX idx_emp_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Salaries Table
CREATE TABLE IF NOT EXISTS salaries (
    salary_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    basic_salary DOUBLE NOT NULL,
    hra DOUBLE NOT NULL,
    allowances DOUBLE NOT NULL,
    deductions DOUBLE NOT NULL,
    gross_salary DOUBLE NOT NULL,
    net_pay DOUBLE NOT NULL,
    pay_period VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PROCESSED',
    processed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_salary_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(employee_id) ON DELETE CASCADE,
    INDEX idx_salary_emp_period (employee_id, pay_period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
