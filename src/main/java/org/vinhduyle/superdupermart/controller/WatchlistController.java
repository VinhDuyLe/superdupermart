package org.vinhduyle.superdupermart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.service.WatchlistService;

import java.util.List;

@RestController
@RequestMapping("/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping("/products/all")
    public ResponseEntity<List<Product>> getAllWatchlistProducts() {
        List<Product> products = watchlistService.getAllInStockWatchlistProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Void> addProduct(@PathVariable Long productId) {
        watchlistService.addProductToWatchlist(productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> removeProduct(@PathVariable Long productId) {
        watchlistService.removeProductFromWatchlist(productId);
        return ResponseEntity.noContent().build();
    }
}
