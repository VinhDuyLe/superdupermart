package org.vinhduyle.superdupermart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal retailPrice;
    private Integer quantity;
    // Add wholesalePrice
    private BigDecimal wholesalePrice; // New field for admins
}