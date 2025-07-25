package org.vinhduyle.superdupermart.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.ProductDao;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.dto.ProductResponseDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductDao productDao;

    @Transactional
    public List<Product> getAllInStockProducts() {
        Session session = productDao.getCurrentSession();
        Query<Product> query = session.createQuery(
                "FROM Product p WHERE p.quantity > 0", Product.class
        );
        return query.getResultList();
    }

    @Transactional
    public List<Product> getAllProducts() {
        return productDao.getAll();
    }

    @Transactional
    public Product getProductById(Long id) {
        return productDao.findById(id);
    }

    // ADMIN ROLE
    @Transactional
    public Product createProduct(Product product) {
        productDao.save(product);
        return product;
    }

    @Transactional
    public Product updateProduct(Long id, Product updated) {
        Product product = productDao.findById(id);
        if (product == null) {
            throw new IllegalArgumentException("Product not found");
        }

        product.setName(updated.getName());
        product.setDescription(updated.getDescription());
        product.setWholesalePrice(updated.getWholesalePrice());
        product.setRetailPrice(updated.getRetailPrice());
        product.setQuantity(updated.getQuantity());

        productDao.update(product);
        return product;
    }

    public ProductResponseDTO toProductResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .retailPrice(product.getRetailPrice())
                .quantity(null)
                .wholesalePrice(null)
                .build();
    }

    public ProductResponseDTO toProductResponseDTOForAdmin(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .retailPrice(product.getRetailPrice())
                .quantity(product.getQuantity())
                .wholesalePrice(product.getWholesalePrice())
                .build();
    }
}