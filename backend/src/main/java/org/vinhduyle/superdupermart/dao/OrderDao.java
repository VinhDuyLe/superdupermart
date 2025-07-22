package org.vinhduyle.superdupermart.dao;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.vinhduyle.superdupermart.domain.Order;
import org.hibernate.Criteria; // Import Criteria if not already present
import org.hibernate.criterion.Projections; // For counting

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
    public List<Order> findOrdersPaged(int page, int size) {
        Session session = getCurrentSession();
        Query<Order> query = session.createQuery(
                "FROM Order o ORDER BY o.createdAt DESC",
                Order.class
        );
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        return query.getResultList();
    }

    // New method to get total count of orders
    public long getTotalOrderCount() {
        Session session = getCurrentSession();
        // Using HQL for count
        Long count = session.createQuery("SELECT COUNT(o) FROM Order o", Long.class)
                .uniqueResult();
        return count != null ? count : 0;
        /*
        // Alternatively, using Criteria for count as required by backend (at least one DAO method with Criteria):
        // This method would satisfy the Criteria requirement if you didn't have one elsewhere.
        Criteria criteria = session.createCriteria(clazz); // clazz is 'Order.class' from AbstractHibernateDao
        criteria.setProjection(Projections.rowCount());
        Long count = (Long) criteria.uniqueResult();
        return count != null ? count : 0;
        */
    }

    // New method to get the total count of sold items from COMPLETED orders
    public long getTotalSoldItemCount() {
        Session session = getCurrentSession();
        Long count = session.createQuery(
                "SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.order.status = 'COMPLETED'",
                Long.class
        ).uniqueResult();
        return count != null ? count : 0;
    }


}
