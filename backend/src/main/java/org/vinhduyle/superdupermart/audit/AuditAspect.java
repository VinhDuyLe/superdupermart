// src/main/java/org/vinhduyle/superdupermart/audit/AuditAspect.java
package org.vinhduyle.superdupermart.audit;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.vinhduyle.superdupermart.domain.Order;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.security.CustomUserDetails; // Import your CustomUserDetails

import java.util.Arrays;

@Aspect
@Component
public class AuditAspect {

    private final Logger logger = LoggerFactory.getLogger(AuditAspect.class);

    // --- Pointcuts ---
    // Pointcut for methods in ProductService related to admin actions (create, update)
    @Pointcut("execution(* org.vinhduyle.superdupermart.service.ProductService.createProduct(..)) || " +
            "execution(* org.vinhduyle.superdupermart.service.ProductService.updateProduct(..))")
    public void productAdminOperations() {}

    // Pointcut for the OrderService.completeOrder method
    @Pointcut("execution(* org.vinhduyle.superdupermart.service.OrderService.completeOrder(..))")
    public void orderCompletionOperation() {}

    // Pointcut for methods in OrderService that involve order cancellation
    @Pointcut("execution(* org.vinhduyle.superdupermart.service.OrderService.cancelOrder(..))")
    public void orderCancellationOperation() {}


    // --- Advice ---

    // @Before Advice: Log who is attempting a product admin operation
    @Before("productAdminOperations()")
    public void logProductAdminAttempt(JoinPoint joinPoint) {
        String username = getCurrentUsername();
        logger.info("[AUDIT-BEFORE] User '{}' attempting product admin operation: {}. Args: {}",
                username, joinPoint.getSignature().toShortString(), Arrays.toString(joinPoint.getArgs()));
    }

    // @AfterReturning Advice: Log successful product admin operation
    @AfterReturning(pointcut = "productAdminOperations()", returning = "result")
    public void logProductAdminSuccess(JoinPoint joinPoint, Object result) {
        String username = getCurrentUsername();
        String operation = joinPoint.getSignature().getName();
        String entityDetails = "";
        if (result instanceof Product) {
            Product product = (Product) result;
            entityDetails = "Product ID: " + product.getId() + ", Name: " + product.getName();
        }
        logger.info("[AUDIT-SUCCESS] User '{}' successfully performed product admin operation: {}. {}. Result: {}",
                username, operation, entityDetails, result != null ? result.getClass().getSimpleName() : "void");
    }

    // @AfterThrowing Advice: Log failed product admin operation
    @AfterThrowing(pointcut = "productAdminOperations()", throwing = "ex")
    public void logProductAdminFailure(JoinPoint joinPoint, Throwable ex) {
        String username = getCurrentUsername();
        logger.error("[AUDIT-FAILURE] User '{}' failed product admin operation: {}. Exception: {}",
                username, joinPoint.getSignature().toShortString(), ex.getMessage());
    }

    // @Around Advice: For Order Completion - to measure performance and log details
    @Around("orderCompletionOperation()")
    public Object auditOrderCompletion(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String username = getCurrentUsername();
        Long orderId = (Long) proceedingJoinPoint.getArgs()[0]; // Assuming orderId is the first argument

        logger.info("[AUDIT-AROUND] User '{}' starting to complete Order ID: {}. Method: {}",
                username, orderId, proceedingJoinPoint.getSignature().toShortString());

        Object result = null;
        try {
            result = proceedingJoinPoint.proceed(); // Execute the actual method
            long endTime = System.currentTimeMillis();
            logger.info("[AUDIT-AROUND] User '{}' successfully completed Order ID: {}. Execution time: {}ms",
                    username, orderId, (endTime - startTime));
        } catch (Throwable ex) {
            long endTime = System.currentTimeMillis();
            logger.error("[AUDIT-AROUND] User '{}' failed to complete Order ID: {}. Exception: {}. Execution time: {}ms",
                    username, orderId, ex.getMessage(), (endTime - startTime));
            throw ex; // Re-throw the exception so it continues to be handled
        }
        return result;
    }

    // @After Advice: Log order cancellation (regardless of success or failure)
    @After("orderCancellationOperation()")
    public void logOrderCancellation(JoinPoint joinPoint) {
        String username = getCurrentUsername();
        Long orderId = (Long) joinPoint.getArgs()[0]; // Assuming orderId is the first argument
        logger.info("[AUDIT-AFTER] User '{}' attempted/completed order cancellation for Order ID: {}",
                username, orderId);
    }


    // Helper method to get the current authenticated username
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getUsername();
        }
        return "ANONYMOUS"; // Or throw an exception if authentication is mandatory
    }
}