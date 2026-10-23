package com.example.payroll.service;

import com.example.payroll.dto.EmployeeRequestDto;
import com.example.payroll.dto.EmployeeResponseDto;
import com.example.payroll.entity.Employee;
import com.example.payroll.exception.DuplicateEmailException;
import com.example.payroll.exception.EmployeeNotFoundException;
import com.example.payroll.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeResponseDto createEmployee(EmployeeRequestDto request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + request.getEmail());
        }

        Employee employee = new Employee();
        employee.setEmployeeName(request.getEmployeeName());
        employee.setDepartment(request.getDepartment());
        employee.setEmail(request.getEmail());
        employee.setDesignation(request.getDesignation());
        employee.setPhone(request.getPhone());
        employee.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        Employee saved = employeeRepository.save(employee);
        return EmployeeResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        return EmployeeResponseDto.fromEntity(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        if (!employee.getEmail().equalsIgnoreCase(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + request.getEmail());
        }

        employee.setEmployeeName(request.getEmployeeName());
        employee.setDepartment(request.getDepartment());
        employee.setEmail(request.getEmail());
        employee.setDesignation(request.getDesignation());
        employee.setPhone(request.getPhone());
        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }

        Employee updated = employeeRepository.save(employee);
        return EmployeeResponseDto.fromEntity(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        employeeRepository.delete(employee);
    }
}
