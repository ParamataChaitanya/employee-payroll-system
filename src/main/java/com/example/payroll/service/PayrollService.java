package com.example.payroll.service;

import com.example.payroll.dto.PayrollCalculationRequestDto;
import com.example.payroll.dto.PayrollResponseDto;

import java.util.List;

public interface PayrollService {
    PayrollResponseDto calculateAndProcessSalary(Long employeeId, PayrollCalculationRequestDto request);
    List<PayrollResponseDto> getSalaryHistory(Long employeeId);
    PayrollResponseDto getSalaryByPeriod(Long employeeId, String payPeriod);
}
