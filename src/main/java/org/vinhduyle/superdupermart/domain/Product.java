package org.vinhduyle.superdupermart.domain;

import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "wholesale_price",nullable = false)
    private BigDecimal wholesalePrice;

    @Column(name = "retail_price", nullable = false)
    private BigDecimal retailPrice;

    @Column(nullable = false)
    private Integer quantity;
}
