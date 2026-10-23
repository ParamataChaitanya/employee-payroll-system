package com.example.payroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class EmployeePayrollApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeePayrollApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  EMPLOYEE PAYROLL MANAGEMENT SYSTEM STARTED SUCCESSFULLY");
        System.out.println("  REST Endpoints Base URL: http://localhost:8080/api");
        System.out.println("  SOAP WSDL URL:           http://localhost:8080/ws/payslips.wsdl");
        System.out.println("==================================================================");
    }
}
