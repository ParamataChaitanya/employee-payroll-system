package com.example.payroll.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EmployeeRequestDto {

    @NotBlank(message = "Employee name must not be blank")
    @Size(min = 2, max = 100, message = "Employee name must be between 2 and 100 characters")
    private String employeeName;

    @NotBlank(message = "Department must not be blank")
    private String department;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Invalid email format")
    private String email;

    private String designation;

    private String phone;

    private String status = "ACTIVE";

    public EmployeeRequestDto() {
    }

    public EmployeeRequestDto(String employeeName, String department, String email, String designation, String phone, String status) {
        this.employeeName = employeeName;
        this.department = department;
        this.email = email;
        this.designation = designation;
        this.phone = phone;
        this.status = status;
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
}
