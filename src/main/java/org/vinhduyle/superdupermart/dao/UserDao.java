package org.vinhduyle.superdupermart.dao;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.vinhduyle.superdupermart.domain.User;

@Repository
public class UserDao extends AbstractHibernateDao<User> {

    public UserDao() {
        setClazz(User.class);
    }

    public User findByUsername(String username) {
        Session session = getCurrentSession();
        Query<User> query = session.createQuery("FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        return query.uniqueResult();
    }

    public User findByEmail(String email) {
        Session session = getCurrentSession();
        Query<User> query = session.createQuery("FROM User u WHERE u.email = :email", User.class);
        query.setParameter("email", email);
        return query.uniqueResult();
    }
}
