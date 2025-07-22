package org.vinhduyle.superdupermart.dao;

import org.springframework.stereotype.Repository;
import org.vinhduyle.superdupermart.domain.Product;

@Repository
public class ProductDao extends AbstractHibernateDao<Product> {

    public ProductDao() {
        setClazz(Product.class);
    }
}
