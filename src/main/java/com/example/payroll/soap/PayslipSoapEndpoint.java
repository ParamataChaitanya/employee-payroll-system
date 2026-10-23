package com.example.payroll.soap;

import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Salary;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.SalaryRepository;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Endpoint
public class PayslipSoapEndpoint {

    private static final String NAMESPACE_URI = "http://example.com/payroll/soap";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final EmployeeRepository employeeRepository;
    private final SalaryRepository salaryRepository;

    public PayslipSoapEndpoint(EmployeeRepository employeeRepository, SalaryRepository salaryRepository) {
        this.employeeRepository = employeeRepository;
        this.salaryRepository = salaryRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPayslipRequest")
    @ResponsePayload
    public GetPayslipResponse getPayslip(@RequestPayload GetPayslipRequest request) {
        long empId = request.getEmployeeId();
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("SOAP Fault: Employee not found with ID: " + empId));

        Optional<Salary> salaryOpt = salaryRepository.findByEmployeeEmployeeIdAndPayPeriod(empId, request.getPayPeriod());

        GetPayslipResponse response = new GetPayslipResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeName(employee.getEmployeeName());
        response.setDepartment(employee.getDepartment());
        response.setEmail(employee.getEmail());
        response.setPayPeriod(request.getPayPeriod());

        if (salaryOpt.isPresent()) {
            Salary salary = salaryOpt.get();
            response.setBasicSalary(salary.getBasicSalary());
            response.setHra(salary.getHra());
            response.setAllowances(salary.getAllowances());
            response.setDeductions(salary.getDeductions());
            response.setGrossSalary(salary.getGrossSalary());
            response.setNetPay(salary.getNetPay());
            response.setStatus(salary.getPaymentStatus());
            response.setGeneratedDate(salary.getProcessedDate() != null ?
                    salary.getProcessedDate().format(DATE_FORMATTER) : "2026-09-09 11:35:00");
        } else {
            // Default placeholder or computed if not yet processed
            response.setBasicSalary(0.0);
            response.setHra(0.0);
            response.setAllowances(0.0);
            response.setDeductions(0.0);
            response.setGrossSalary(0.0);
            response.setNetPay(0.0);
            response.setStatus("UNPROCESSED");
            response.setGeneratedDate("2026-09-09 11:35:00");
        }

        return response;
    }
}
