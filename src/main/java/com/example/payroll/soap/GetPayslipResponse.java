package com.example.payroll.soap;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "employeeId",
    "employeeName",
    "department",
    "email",
    "payPeriod",
    "basicSalary",
    "hra",
    "allowances",
    "deductions",
    "grossSalary",
    "netPay",
    "status",
    "generatedDate"
})
@XmlRootElement(name = "getPayslipResponse", namespace = "http://example.com/payroll/soap")
public class GetPayslipResponse {

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private long employeeId;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String employeeName;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String department;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String email;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String payPeriod;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private double basicSalary;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private double hra;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private double allowances;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private double deductions;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private double grossSalary;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private double netPay;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String status;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String generatedDate;

    public GetPayslipResponse() {
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
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

    public String getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(String payPeriod) {
        this.payPeriod = payPeriod;
    }

    public double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public double getHra() {
        return hra;
    }

    public void setHra(double hra) {
        this.hra = hra;
    }

    public double getAllowances() {
        return allowances;
    }

    public void setAllowances(double allowances) {
        this.allowances = allowances;
    }

    public double getDeductions() {
        return deductions;
    }

    public void setDeductions(double deductions) {
        this.deductions = deductions;
    }

    public double getGrossSalary() {
        return grossSalary;
    }

    public void setGrossSalary(double grossSalary) {
        this.grossSalary = grossSalary;
    }

    public double getNetPay() {
        return netPay;
    }

    public void setNetPay(double netPay) {
        this.netPay = netPay;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(String generatedDate) {
        this.generatedDate = generatedDate;
    }
}
