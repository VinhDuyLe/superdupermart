package org.vinhduyle.superdupermart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.OrderDao;
import org.vinhduyle.superdupermart.dao.OrderItemDao;
import org.vinhduyle.superdupermart.dao.ProductDao;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.vinhduyle.superdupermart.domain.Order;
import org.vinhduyle.superdupermart.domain.OrderItem;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.domain.User;
import org.vinhduyle.superdupermart.dto.OrderItemRequest;
import org.vinhduyle.superdupermart.exception.NotEnoughInventoryException;

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
            /*
○ The user should be able to purchase multiple different items within a single order.
○ If the quantity of an item that the user is purchasing is greater than the item’s stock, throw a
custom exception named NotEnoughInventoryException using Exception Handler and the order should not be placed.
            */
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
    public void cancelOrder(Long orderId) {
        Order order = orderDao.findById(orderId);
        //The user should be able to cancel an order by updating the status from Processing to Canceled.
        //However, a “Completed” order cannot be changed to “Canceled”.
        if (order == null || order.getStatus() != Order.Status.PROCESSING) {
            throw new IllegalArgumentException("Cannot cancel this order");
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
        // Initialize items
        orders.forEach(o -> o.getItems().size());
        return orders;
    }

    @Transactional
    public Order getOrderById(Long orderId) {
        Order order = orderDao.findById(orderId);
        if (order != null) {
            // Ensure items are initialized before leaving transactional boundary
            order.getItems().size();
        }
        return order;
    }

    //ADMIN
    @Transactional
    public void completeOrder(Long orderId) {
        Order order = orderDao.findById(orderId);
        /*
(PATCH) The seller should also be able to cancel an order
○ for some reasons, such as that the product is sold out locally, by updating the order status to
“Canceled”.
○ If so, [the item’s stock should be incremented accordingly] to offset the auto-deduction that took
place when the order is first placed.
○ However, a “Canceled” order cannot be completed, nor can a “Completed” order be canceled.
        * */
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


}
