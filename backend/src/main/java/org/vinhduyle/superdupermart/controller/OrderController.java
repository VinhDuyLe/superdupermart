// src/main/java/org/vinhduyle/superdupermart.controller/OrderController.java
package org.vinhduyle.superdupermart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.vinhduyle.superdupermart.domain.Order;
import org.vinhduyle.superdupermart.dto.OrderRequest;
import org.vinhduyle.superdupermart.dto.PagedResponse;
import org.vinhduyle.superdupermart.security.CustomUserDetails; // Import your CustomUserDetails
import org.vinhduyle.superdupermart.service.OrderService;

import javax.servlet.http.HttpServletRequest; // Still needed for other methods, but not for userId
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        Order order = orderService.placeOrder(userId, request.getOrder());
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        orderService.cancelOrder(orderId, currentUserId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            // ADMIN, return all orders
            return ResponseEntity.ok(orderService.getAllOrders());
        } else {
            // user, return only their orders
            Long userId = userDetails.getId();
            return ResponseEntity.ok(orderService.getAllOrdersForUser(userId));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        Order order = orderService.getOrderById(id);
        if (order == null) return ResponseEntity.notFound().build();

        if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ||
                order.getUser().getId().equals(currentUserId)) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @PatchMapping("/{orderId}/complete")
    public ResponseEntity<Void> completeOrder(@PathVariable Long orderId) {
        orderService.completeOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<PagedResponse<Order>> getAllOrdersPaged(@RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "5") int size) { // Added size parameter
        PagedResponse<Order> orders = orderService.getAllOrdersPaged(page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/admin/total-sold-items")
    public ResponseEntity<Long> getTotalSoldItems() {
        long totalSold = orderService.getTotalSoldItemsCount();
        return ResponseEntity.ok(totalSold);
    }
}