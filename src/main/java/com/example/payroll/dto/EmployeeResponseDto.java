package com.example.payroll.dto;

import com.example.payroll.entity.Employee;
import java.time.LocalDateTime;

public class EmployeeResponseDto {
    private Long employeeId;
    private String employeeName;
    private String department;
    private String email;
    private String designation;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeeResponseDto() {
    }

    public EmployeeResponseDto(Long employeeId, String employeeName, String department, String email, String designation, String phone, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.email = email;
        this.designation = designation;
        this.phone = phone;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static EmployeeResponseDto fromEntity(Employee employee) {
        if (employee == null) return null;
        return new EmployeeResponseDto(
                employee.getEmployeeId(),
                employee.getEmployeeName(),
                employee.getDepartment(),
                employee.getEmail(),
                employee.getDesignation(),
                employee.getPhone(),
                employee.getStatus(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
