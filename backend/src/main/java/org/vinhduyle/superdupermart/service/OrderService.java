// src/main/java/org/vinhduyle/superdupermart/service/OrderService.java
package org.vinhduyle.superdupermart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.OrderDao;
import org.vinhduyle.superdupermart.dao.OrderItemDao;
import org.vinhduyle.superdupermart.dao.ProductDao;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.springframework.security.access.AccessDeniedException; // Import Spring Security's AccessDeniedException
import org.vinhduyle.superdupermart.domain.Order;
import org.vinhduyle.superdupermart.domain.OrderItem;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.domain.User;
import org.vinhduyle.superdupermart.dto.OrderItemRequest;
import org.vinhduyle.superdupermart.exception.NotEnoughInventoryException;
import org.vinhduyle.superdupermart.dto.PagedResponse; // Import PagedResponse


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderDao orderDao;
    private final OrderItemDao orderItemDao;
    private final ProductDao productDao;
    private final UserDao userDao;

    @Transactional
    public Order placeOrder(Long userId, List<OrderItemRequest> orderItems) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Order order = Order.builder()
                .user(user)
                .status(Order.Status.PROCESSING)
                .createdAt(LocalDateTime.now())
                .build();

        orderDao.save(order);

        List<OrderItem> savedItems = new ArrayList<>();
        for (OrderItemRequest itemReq : orderItems) {
            Product product = productDao.findById(itemReq.getProductId());
            if (product == null) continue;

            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new NotEnoughInventoryException("Not enough inventory for product: " + product.getName());
            }

            product.setQuantity(product.getQuantity() - itemReq.getQuantity());
            productDao.update(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .productSnapshotName(product.getName())
                    .productSnapshotPrice(product.getRetailPrice())
                    .quantity(itemReq.getQuantity())
                    .build();

            orderItemDao.save(orderItem);
            savedItems.add(orderItem);
        }

        order.setItems(savedItems);
        return order;
    }

    @Transactional
    public void cancelOrder(Long orderId, Long requestingUserId) {
        Order order = orderDao.findById(orderId);
        if (order == null || order.getStatus() != Order.Status.PROCESSING) {
            throw new IllegalArgumentException("Cannot cancel this order: Order not found or not in PROCESSING status.");
        }

        User requestingUser = userDao.findById(requestingUserId);
        if (requestingUser == null) {
            throw new IllegalArgumentException("Requesting user not found.");
        }

        // Use .getRole().name() to compare with String literal
        boolean isAdmin = requestingUser.getRole().name().equals("ADMIN");

        if (!isAdmin && !order.getUser().getId().equals(requestingUserId)) {
            // Throw Spring Security's AccessDeniedException
            throw new AccessDeniedException("User not authorized to cancel this order.");
        }

        for (OrderItem item : order.getItems()) {
            Product product = productDao.findById(item.getProductId());
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productDao.update(product);
        }

        order.setStatus(Order.Status.CANCELED);
        orderDao.update(order);
    }

    @Transactional
    public List<Order> getAllOrdersForUser(Long userId) {
        User user = userDao.findById(userId);
        if (user == null) throw new IllegalArgumentException("User not found");

        List<Order> orders = orderDao.findOrdersByUser(userId);
        orders.forEach(o -> o.getItems().size()); // Initialize items
        return orders;
    }

    @Transactional
    public List<Order> getAllOrders() {
        List<Order> orders = orderDao.getAll();
        orders.forEach(o -> o.getItems().size()); // Initialize items
        return orders;
    }

    @Transactional
    public Order getOrderById(Long orderId) {
        Order order = orderDao.findById(orderId);
        if (order != null) {
            order.getItems().size(); // Ensure items are initialized
        }
        return order;
    }

    //ADMIN
    @Transactional
    public void completeOrder(Long orderId) {
        Order order = orderDao.findById(orderId);
        if (order == null || order.getStatus() != Order.Status.PROCESSING) {
            throw new IllegalArgumentException("Cannot complete this order");
        }
        order.setStatus(Order.Status.COMPLETED);
        orderDao.update(order);
    }

    @Transactional
    public List<Product> getMostFrequentlyPurchasedProducts(Long userId, int limit) {
        List<Object[]> rows = orderDao.getMostFrequentlyPurchasedProducts(userId, limit);
        return rows.stream()
                .map(row -> productDao.findById((Long) row[0]))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Product> getMostRecentlyPurchasedProducts(Long userId, int limit) {
        List<Object[]> rows = orderDao.getMostRecentlyPurchasedProducts(userId, limit);
        return rows.stream()
                .map(row -> productDao.findById((Long) row[0]))
                .collect(Collectors.toList());
    }
    //ADMIN View
    @Transactional
    public List<Product> getMostPopularProducts(int limit) {
        List<Object[]> rows = orderDao.getMostPopularProducts(limit);
        return rows.stream()
                .map(row -> productDao.findById((Long) row[0]))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Product> getMostProfitableProducts(int limit) {
        List<Object[]> rows = orderDao.getMostProfitableProducts(limit);
        return rows.stream()
                .map(row -> productDao.findById((Long) row[0]))
                .collect(Collectors.toList());
    }

    // Modified getAllOrdersPaged to return PagedResponse
    @Transactional(readOnly = true)
    public PagedResponse<Order> getAllOrdersPaged(int page, int size) {
        List<Order> orders = orderDao.findOrdersPaged(page, size);
        orders.forEach(o -> o.getItems().size()); // Ensure items initialized

        long totalElements = orderDao.getTotalOrderCount();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return new PagedResponse<>(
                orders,
                totalElements,
                totalPages,
                page, // <-- THIS 'page' PARAMETER SHOULD BE THE CORRECT PAGE INDEX RECEIVED
                size
        );
    }

    // New method to get total sold items count
    @Transactional(readOnly = true)
    public long getTotalSoldItemsCount() {
        return orderDao.getTotalSoldItemCount();
    }
}