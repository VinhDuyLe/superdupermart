package org.vinhduyle.superdupermart.dao;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.vinhduyle.superdupermart.domain.Order;

import java.util.List;

@Repository
public class OrderDao extends AbstractHibernateDao<Order> {

    public OrderDao() {
        setClazz(Order.class);
    }

    public List<Order> findOrdersByUser(Long userId) {
        Session session = getCurrentSession();
        Query<Order> query = session.createQuery(
                "FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC",
                Order.class
        );
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    public List<Object[]> getMostFrequentlyPurchasedProducts(Long userId, int limit) {
        Session session = getCurrentSession();
        Query<Object[]> query = session.createQuery(
                "SELECT oi.productId, SUM(oi.quantity) AS totalQty " +
                        "FROM OrderItem oi " +
                        "WHERE oi.order.user.id = :userId AND oi.order.status = 'COMPLETED' " +
                        "GROUP BY oi.productId " +
                        "ORDER BY totalQty DESC, oi.productId ASC",
                Object[].class
        );
        query.setParameter("userId", userId);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    public List<Object[]> getMostRecentlyPurchasedProducts(Long userId, int limit) {
        Session session = getCurrentSession();
        Query<Object[]> query = session.createQuery(
                "SELECT oi.productId, oi.order.createdAt " +
                        "FROM OrderItem oi " +
                        "WHERE oi.order.user.id = :userId AND oi.order.status = 'COMPLETED' " +
                        "ORDER BY oi.order.createdAt DESC, oi.productId ASC",
                Object[].class
        );
        query.setParameter("userId", userId);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    //ADMIN View
    public List<Object[]> getMostPopularProducts(int limit) {
        Session session = getCurrentSession();
        Query<Object[]> query = session.createQuery(
                "SELECT oi.productId, SUM(oi.quantity) AS totalQty " +
                        "FROM OrderItem oi " +
                        "WHERE oi.order.status = 'COMPLETED' " +
                        "GROUP BY oi.productId " +
                        "ORDER BY totalQty DESC, oi.productId ASC",
                Object[].class
        );
        query.setMaxResults(limit);
        return query.getResultList();
    }

    public List<Object[]> getMostProfitableProducts(int limit) {
        Session session = getCurrentSession();
        Query<Object[]> query = session.createQuery(
                "SELECT oi.productId, SUM((oi.productSnapshotPrice - p.wholesalePrice) * oi.quantity) AS profit " +
                        "FROM OrderItem oi JOIN Product p ON oi.productId = p.id " +
                        "WHERE oi.order.status = 'COMPLETED' " +
                        "GROUP BY oi.productId " +
                        "ORDER BY profit DESC, oi.productId ASC",
                Object[].class
        );
        query.setMaxResults(limit);
        return query.getResultList();
    }

}
