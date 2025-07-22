package org.vinhduyle.superdupermart.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

public abstract class AbstractHibernateDao<T> {

    @Autowired
    protected SessionFactory sessionFactory;

    private Class<T> clazz;

    protected void setClazz(Class<T> clazzToSet) {
        this.clazz = clazzToSet;
    }

    public Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public List<T> getAll() {
        Session session = getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(clazz);
        cq.from(clazz);
        return session.createQuery(cq).getResultList();
    }

    public T findById(Long id) {
        return getCurrentSession().get(clazz, id);
    }

    public void save(T entity) {
        getCurrentSession().save(entity);
    }

    public void update(T entity) {
        getCurrentSession().update(entity);
    }

    public void delete(T entity) {
        getCurrentSession().delete(entity);
    }
}
