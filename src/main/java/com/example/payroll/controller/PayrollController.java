package com.example.payroll.controller;

import com.example.payroll.dto.ApiResponse;
import com.example.payroll.dto.PayrollCalculationRequestDto;
import com.example.payroll.dto.PayrollResponseDto;
import com.example.payroll.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PutMapping("/calculate/{id}")
    public ResponseEntity<ApiResponse<PayrollResponseDto>> calculateMonthlySalary(
            @PathVariable("id") Long id,
            @Valid @RequestBody PayrollCalculationRequestDto request) {
        PayrollResponseDto response = payrollService.calculateAndProcessSalary(id, request);
        return ResponseEntity.ok(ApiResponse.success("Payroll calculated and processed successfully", response));
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<ApiResponse<List<PayrollResponseDto>>> getSalaryHistory(@PathVariable("id") Long id) {
        List<PayrollResponseDto> history = payrollService.getSalaryHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Salary history retrieved successfully", history));
    }

    @GetMapping("/employee/{id}/period/{period}")
    public ResponseEntity<ApiResponse<PayrollResponseDto>> getSalaryByPeriod(
            @PathVariable("id") Long id,
            @PathVariable("period") String period) {
        PayrollResponseDto response = payrollService.getSalaryByPeriod(id, period);
        return ResponseEntity.ok(ApiResponse.success("Salary record retrieved successfully", response));
    }
}
