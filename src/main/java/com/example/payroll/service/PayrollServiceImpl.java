package com.example.payroll.service;

import com.example.payroll.dto.PayrollCalculationRequestDto;
import com.example.payroll.dto.PayrollResponseDto;
import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Salary;
import com.example.payroll.exception.EmployeeNotFoundException;
import com.example.payroll.exception.InvalidPayrollDataException;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.SalaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
public class PayrollServiceImpl implements PayrollService {

    private final EmployeeRepository employeeRepository;
    private final SalaryRepository salaryRepository;

    public PayrollServiceImpl(EmployeeRepository employeeRepository, SalaryRepository salaryRepository) {
        this.employeeRepository = employeeRepository;
        this.salaryRepository = salaryRepository;
    }

    @Override
    public PayrollResponseDto calculateAndProcessSalary(Long employeeId, PayrollCalculationRequestDto request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException(employeeId));

        double grossSalary = request.getBasicSalary() + request.getHra() + request.getAllowances();

        if (request.getDeductions() > grossSalary) {
            throw new InvalidPayrollDataException(
                    "Deductions (" + request.getDeductions() + ") cannot exceed Gross Salary (" + grossSalary + ")"
            );
        }

        double netPay = grossSalary - request.getDeductions();

        Salary salary = salaryRepository.findByEmployeeEmployeeIdAndPayPeriod(employeeId, request.getPayPeriod())
                .orElseGet(() -> new Salary(
                        employee,
                        request.getBasicSalary(),
                        request.getHra(),
                        request.getAllowances(),
                        request.getDeductions(),
                        grossSalary,
                        netPay,
                        request.getPayPeriod(),
                        "PROCESSED"
                ));

        salary.setEmployee(employee);
        salary.setBasicSalary(request.getBasicSalary());
        salary.setHra(request.getHra());
        salary.setAllowances(request.getAllowances());
        salary.setDeductions(request.getDeductions());
        salary.setGrossSalary(grossSalary);
        salary.setNetPay(netPay);
        salary.setPayPeriod(request.getPayPeriod());
        salary.setPaymentStatus("PROCESSED");
        salary.setProcessedDate(LocalDateTime.now());

        Salary savedSalary = salaryRepository.save(salary);
        return PayrollResponseDto.fromEntity(savedSalary);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponseDto> getSalaryHistory(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new EmployeeNotFoundException(employeeId);
        }
        return salaryRepository.findByEmployeeEmployeeId(employeeId).stream()
                .map(PayrollResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollResponseDto getSalaryByPeriod(Long employeeId, String payPeriod) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new EmployeeNotFoundException(employeeId);
        }
        Salary salary = salaryRepository.findByEmployeeEmployeeIdAndPayPeriod(employeeId, payPeriod)
                .orElseThrow(() -> new InvalidPayrollDataException(
                        "Salary record not found for employee " + employeeId + " and period " + payPeriod
                ));
        return PayrollResponseDto.fromEntity(salary);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponseDto> getSalariesByPeriod(String payPeriod) {
        return salaryRepository.findByPayPeriod(payPeriod).stream()
                .map(PayrollResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
