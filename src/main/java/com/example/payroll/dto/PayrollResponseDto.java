package com.example.payroll.dto;

import com.example.payroll.entity.Salary;
import java.time.LocalDateTime;

public class PayrollResponseDto {

    private Long salaryId;
    private Long employeeId;
    private String employeeName;
    private String department;
    private String email;
    private Double basicSalary;
    private Double hra;
    private Double allowances;
    private Double deductions;
    private Double grossSalary;
    private Double netPay;
    private String payPeriod;
    private String paymentStatus;
    private LocalDateTime processedDate;

    public PayrollResponseDto() {
    }

    public PayrollResponseDto(Long salaryId, Long employeeId, String employeeName, String department, String email,
                              Double basicSalary, Double hra, Double allowances, Double deductions,
                              Double grossSalary, Double netPay, String payPeriod, String paymentStatus,
                              LocalDateTime processedDate) {
        this.salaryId = salaryId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.email = email;
        this.basicSalary = basicSalary;
        this.hra = hra;
        this.allowances = allowances;
        this.deductions = deductions;
        this.grossSalary = grossSalary;
        this.netPay = netPay;
        this.payPeriod = payPeriod;
        this.paymentStatus = paymentStatus;
        this.processedDate = processedDate;
    }

    public static PayrollResponseDto fromEntity(Salary salary) {
        if (salary == null) return null;
        return new PayrollResponseDto(
                salary.getSalaryId(),
                salary.getEmployee() != null ? salary.getEmployee().getEmployeeId() : null,
                salary.getEmployee() != null ? salary.getEmployee().getEmployeeName() : null,
                salary.getEmployee() != null ? salary.getEmployee().getDepartment() : null,
                salary.getEmployee() != null ? salary.getEmployee().getEmail() : null,
                salary.getBasicSalary(),
                salary.getHra(),
                salary.getAllowances(),
                salary.getDeductions(),
                salary.getGrossSalary(),
                salary.getNetPay(),
                salary.getPayPeriod(),
                salary.getPaymentStatus(),
                salary.getProcessedDate()
        );
    }

    public Long getSalaryId() {
        return salaryId;
    }

    public void setSalaryId(Long salaryId) {
        this.salaryId = salaryId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(Double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public Double getHra() {
        return hra;
    }

    public void setHra(Double hra) {
        this.hra = hra;
    }

    public Double getAllowances() {
        return allowances;
    }

    public void setAllowances(Double allowances) {
        this.allowances = allowances;
    }

    public Double getDeductions() {
        return deductions;
    }

    public void setDeductions(Double deductions) {
        this.deductions = deductions;
    }

    public Double getGrossSalary() {
        return grossSalary;
    }

    public void setGrossSalary(Double grossSalary) {
        this.grossSalary = grossSalary;
    }

    public Double getNetPay() {
        return netPay;
    }

    public void setNetPay(Double netPay) {
        this.netPay = netPay;
    }

    public String getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(String payPeriod) {
        this.payPeriod = payPeriod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getProcessedDate() {
        return processedDate;
    }

    public void setProcessedDate(LocalDateTime processedDate) {
        this.processedDate = processedDate;
    }
}
