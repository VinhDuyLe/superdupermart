package org.vinhduyle.superdupermart.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name ="order_id")
    @JsonBackReference
    private Order order;

    @Column(name = "product_id",nullable = false)
    private Long productId;

    @Column(name = "product_snapshot_name", nullable = false)
    private String productSnapshotName;

    @Column(name = "product_snapshot_price", nullable = false)
    private BigDecimal productSnapshotPrice;

    @Column(nullable = false)
    private Integer quantity;
}
