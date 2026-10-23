package com.example.payroll.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

public class PayrollCalculationRequestDto {

    @NotBlank(message = "Pay period must not be blank")
    @Pattern(regexp = "^(0[1-9]|1[0-2])-\\d{4}$", message = "Invalid pay period format. Expected format MM-YYYY")
    private String payPeriod;

    @NotNull(message = "Basic salary must not be null")
    @PositiveOrZero(message = "Basic salary must be positive or zero")
    private Double basicSalary;

    @NotNull(message = "HRA must not be null")
    @PositiveOrZero(message = "HRA must be positive or zero")
    private Double hra;

    @NotNull(message = "Allowances must not be null")
    @PositiveOrZero(message = "Allowances must be positive or zero")
    private Double allowances;

    @NotNull(message = "Deductions must not be null")
    @PositiveOrZero(message = "Deductions must be positive or zero")
    private Double deductions;

    public PayrollCalculationRequestDto() {
    }

    public PayrollCalculationRequestDto(String payPeriod, Double basicSalary, Double hra, Double allowances, Double deductions) {
        this.payPeriod = payPeriod;
        this.basicSalary = basicSalary;
        this.hra = hra;
        this.allowances = allowances;
        this.deductions = deductions;
    }

    public String getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(String payPeriod) {
        this.payPeriod = payPeriod;
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
}
