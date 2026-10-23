package com.example.payroll.repository;

import com.example.payroll.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    Optional<Salary> findByEmployeeEmployeeIdAndPayPeriod(Long employeeId, String payPeriod);
    List<Salary> findByEmployeeEmployeeId(Long employeeId);
}
