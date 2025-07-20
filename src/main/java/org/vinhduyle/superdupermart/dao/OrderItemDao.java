package org.vinhduyle.superdupermart.dao;

import org.springframework.stereotype.Repository;
import org.vinhduyle.superdupermart.domain.OrderItem;

@Repository
public class OrderItemDao extends AbstractHibernateDao<OrderItem> {

    public OrderItemDao() {
        setClazz(OrderItem.class);
    }
}
