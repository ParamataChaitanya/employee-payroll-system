package com.example.payroll.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class PayrollLoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(PayrollLoggingAspect.class);

    @Pointcut("within(com.example.payroll.service..*)")
    public void serviceMethods() {
    }

    @Pointcut("execution(* com.example.payroll.service.PayrollService.calculateAndProcessSalary(..))")
    public void payrollCalculationMethod() {
    }

    @Before("serviceMethods()")
    public void logMethodEntry(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();
        log.info("[AOP ENTRY] Entering method: {} with arguments: {}", methodName, Arrays.toString(args));
    }

    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logMethodReturn(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().toShortString();
        log.info("[AOP SUCCESS] Method completed successfully: {}. Result: {}", methodName, result);
    }

    @Around("serviceMethods()")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            log.info("[AOP METRIC] Method {} executed in {} ms", methodName, duration);
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[AOP METRIC] Method {} failed after {} ms with exception: {}", methodName, duration, ex.getMessage());
            throw ex;
        }
    }

    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logMethodException(JoinPoint joinPoint, Throwable ex) {
        String methodName = joinPoint.getSignature().toShortString();
        log.error("[AOP EXCEPTION] Exception in {}: {} - {}", methodName, ex.getClass().getSimpleName(), ex.getMessage());
    }

    @AfterReturning("payrollCalculationMethod()")
    public void auditSalaryCommit(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        log.info("[AUDIT TRAIL - COMMIT] Successfully committed payroll calculation for employee ID: {}", args.length > 0 ? args[0] : "UNKNOWN");
    }

    @AfterThrowing(pointcut = "payrollCalculationMethod()", throwing = "ex")
    public void auditSalaryRollback(JoinPoint joinPoint, Throwable ex) {
        Object[] args = joinPoint.getArgs();
        log.warn("[AUDIT TRAIL - ROLLBACK] Rolled back payroll transaction for employee ID: {} due to error: {}",
                args.length > 0 ? args[0] : "UNKNOWN", ex.getMessage());
    }
}
