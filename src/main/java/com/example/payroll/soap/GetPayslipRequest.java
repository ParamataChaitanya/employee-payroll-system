package com.example.payroll.soap;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "employeeId",
    "payPeriod"
})
@XmlRootElement(name = "getPayslipRequest", namespace = "http://example.com/payroll/soap")
public class GetPayslipRequest {

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private long employeeId;

    @XmlElement(namespace = "http://example.com/payroll/soap", required = true)
    private String payPeriod;

    public GetPayslipRequest() {
    }

    public GetPayslipRequest(long employeeId, String payPeriod) {
        this.employeeId = employeeId;
        this.payPeriod = payPeriod;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public String getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(String payPeriod) {
        this.payPeriod = payPeriod;
    }
}
