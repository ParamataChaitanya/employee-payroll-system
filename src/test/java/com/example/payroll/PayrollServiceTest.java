package com.example.payroll;

import com.example.payroll.dto.PayrollCalculationRequestDto;
import com.example.payroll.dto.PayrollResponseDto;
import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Salary;
import com.example.payroll.exception.EmployeeNotFoundException;
import com.example.payroll.exception.InvalidPayrollDataException;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.SalaryRepository;
import com.example.payroll.service.PayrollServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PayrollServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private SalaryRepository salaryRepository;

    @InjectMocks
    private PayrollServiceImpl payrollService;

    private Employee mockEmployee;

    @BeforeEach
    void setUp() {
        mockEmployee = new Employee(1L, "Alice Johnson", "Engineering", "alice@example.com", "Software Engineer", "+1-555-1234", "ACTIVE");
    }

    @Test
    @DisplayName("Should successfully calculate gross salary and net pay")
    void testCalculateSalarySuccess() {
        // Given
        PayrollCalculationRequestDto request = new PayrollCalculationRequestDto("09-2026", 50000.0, 20000.0, 5000.0, 3000.0);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(mockEmployee));
        when(salaryRepository.findByEmployeeEmployeeIdAndPayPeriod(1L, "09-2026")).thenReturn(Optional.empty());

        Salary savedSalary = new Salary(mockEmployee, 50000.0, 20000.0, 5000.0, 3000.0, 75000.0, 72000.0, "09-2026", "PROCESSED");
        savedSalary.setSalaryId(101L);
        when(salaryRepository.save(any(Salary.class))).thenReturn(savedSalary);

        // When
        PayrollResponseDto response = payrollService.calculateAndProcessSalary(1L, request);

        // Then
        assertNotNull(response);
        assertEquals(75000.0, response.getGrossSalary()); // 50000 + 20000 + 5000 = 75000
        assertEquals(72000.0, response.getNetPay());      // 75000 - 3000 = 72000
        assertEquals("09-2026", response.getPayPeriod());
        verify(salaryRepository, times(1)).save(any(Salary.class));
    }

    @Test
    @DisplayName("Should throw EmployeeNotFoundException when employee does not exist")
    void testCalculateSalaryEmployeeNotFound() {
        PayrollCalculationRequestDto request = new PayrollCalculationRequestDto("09-2026", 50000.0, 20000.0, 5000.0, 3000.0);
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class, () -> {
            payrollService.calculateAndProcessSalary(999L, request);
        });

        verify(salaryRepository, never()).save(any(Salary.class));
    }

    @Test
    @DisplayName("Should throw InvalidPayrollDataException when deductions exceed gross salary (Rollback)")
    void testCalculateSalaryDeductionsExceedGross() {
        // Basic: 10000, HRA: 2000, Allowances: 1000 -> Gross: 13000
        // Deductions: 15000 (> 13000)
        PayrollCalculationRequestDto request = new PayrollCalculationRequestDto("09-2026", 10000.0, 2000.0, 1000.0, 15000.0);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(mockEmployee));

        assertThrows(InvalidPayrollDataException.class, () -> {
            payrollService.calculateAndProcessSalary(1L, request);
        });

        // Ensure rollback guarantee: no salary record is saved
        verify(salaryRepository, never()).save(any(Salary.class));
    }
}
