package com.example.payroll.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "salaries")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salary_id")
    private Long salaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "basic_salary", nullable = false)
    private Double basicSalary;

    @Column(name = "hra", nullable = false)
    private Double hra;

    @Column(name = "allowances", nullable = false)
    private Double allowances;

    @Column(name = "deductions", nullable = false)
    private Double deductions;

    @Column(name = "gross_salary", nullable = false)
    private Double grossSalary;

    @Column(name = "net_pay", nullable = false)
    private Double netPay;

    @Column(name = "pay_period", nullable = false, length = 20)
    private String payPeriod;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "PROCESSED";

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    public Salary() {
    }

    public Salary(Employee employee, Double basicSalary, Double hra, Double allowances, Double deductions, Double grossSalary, Double netPay, String payPeriod, String paymentStatus) {
        this.employee = employee;
        this.basicSalary = basicSalary;
        this.hra = hra;
        this.allowances = allowances;
        this.deductions = deductions;
        this.grossSalary = grossSalary;
        this.netPay = netPay;
        this.payPeriod = payPeriod;
        this.paymentStatus = paymentStatus;
    }

    @PrePersist
    protected void onCreate() {
        if (this.processedDate == null) {
            this.processedDate = LocalDateTime.now();
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "PROCESSED";
        }
    }

    public Long getSalaryId() {
        return salaryId;
    }

    public void setSalaryId(Long salaryId) {
        this.salaryId = salaryId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
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
