// src/main/java/org/vinhduyle/superdupermart.controller/WatchlistController.java
package org.vinhduyle.superdupermart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.dto.ProductResponseDTO;
import org.vinhduyle.superdupermart.service.ProductService;
import org.vinhduyle.superdupermart.service.WatchlistService;
import org.vinhduyle.superdupermart.security.CustomUserDetails;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;
    private final ProductService productService;

    @GetMapping("/products/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllWatchlistProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        List<Product> products = watchlistService.getAllInStockWatchlistProducts(userId);
        List<ProductResponseDTO> dtos = products.stream()
                .map(productService::toProductResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Void> addProduct(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        watchlistService.addProductToWatchlist(userId, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> removeProduct(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        watchlistService.removeProductFromWatchlist(userId, productId);
        return ResponseEntity.noContent().build();
    }
}