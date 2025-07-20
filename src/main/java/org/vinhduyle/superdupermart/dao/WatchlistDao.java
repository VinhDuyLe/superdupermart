package org.vinhduyle.superdupermart.dao;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.vinhduyle.superdupermart.domain.Watchlist;

@Repository
public class WatchlistDao extends AbstractHibernateDao<Watchlist> {

    public WatchlistDao() {
        setClazz(Watchlist.class);
    }

    public Watchlist findByUserAndProduct(Long userId, Long productId) {
        Session session = getCurrentSession();
        Query<Watchlist> query = session.createQuery(
                "FROM Watchlist w WHERE w.user.id = :userId AND w.product.id = :productId",
                Watchlist.class
        );
        query.setParameter("userId", userId);
        query.setParameter("productId", productId);
        return query.uniqueResult();
    }
}
