package org.vinhduyle.superdupermart.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.ProductDao;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.vinhduyle.superdupermart.dao.WatchlistDao;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.domain.User;
import org.vinhduyle.superdupermart.domain.Watchlist;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistDao watchlistDao;
    private final UserDao userDao;
    private final ProductDao productDao;

    private static final Long TEST_USER_ID = 1L;

    @Transactional
    public List<Product> getAllInStockWatchlistProducts() {
        Session session = watchlistDao.getCurrentSession();
        Query<Product> query = session.createQuery(
                "SELECT w.product FROM Watchlist w WHERE w.user.id = :userId AND w.product.quantity >= 0",
                Product.class
        );
        query.setParameter("userId", TEST_USER_ID);
        return query.getResultList();
    }

    @Transactional
    public void addProductToWatchlist(Long productId) {
        User user = userDao.findById(TEST_USER_ID);
        Product product = productDao.findById(productId);
        if (user == null || product == null) {
            throw new IllegalArgumentException("User or Product not found");
        }

        Watchlist existing = watchlistDao.findByUserAndProduct(TEST_USER_ID, productId);
        if (existing != null) return;  // Already in watchlist, ignore duplicate

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .product(product)
                .build();
        watchlistDao.save(watchlist);
    }

    @Transactional
    public void removeProductFromWatchlist(Long productId) {
        Watchlist watchlist = watchlistDao.findByUserAndProduct(TEST_USER_ID, productId);
        if (watchlist != null) {
            watchlistDao.delete(watchlist);
        }
    }
}
