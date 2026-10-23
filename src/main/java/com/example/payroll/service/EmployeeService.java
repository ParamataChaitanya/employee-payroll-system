package com.example.payroll.service;

import com.example.payroll.dto.EmployeeRequestDto;
import com.example.payroll.dto.EmployeeResponseDto;

import java.util.List;

public interface EmployeeService {
    EmployeeResponseDto createEmployee(EmployeeRequestDto request);
    EmployeeResponseDto getEmployeeById(Long id);
    List<EmployeeResponseDto> getAllEmployees();
    EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto request);
    void deleteEmployee(Long id);
}
