package org.vinhduyle.superdupermart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.dto.ProductResponseDTO;
import org.vinhduyle.superdupermart.service.OrderService;
import org.vinhduyle.superdupermart.service.ProductService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    @Autowired
    private final ProductService productService;
    @Autowired
    private final OrderService orderService;

    // For now we assume userId=1 (until authentication is implemented)
    private static final Long TEST_USER_ID = 1L;

    @GetMapping("/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllInStockProducts() {
        List<Product> products = productService.getAllInStockProducts();
        List<ProductResponseDTO> dtos = products.stream()
                .map(productService::toProductResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductDetail(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productService.toProductResponseDTO(product));
    }

    @GetMapping("/frequent/{x}")
    public ResponseEntity<List<ProductResponseDTO>> getMostFrequentlyPurchased(@PathVariable int x) {
        List<Product> products = orderService.getMostFrequentlyPurchasedProducts(TEST_USER_ID, x);
        List<ProductResponseDTO> dtos = products.stream()
                .map(productService::toProductResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/recent/{x}")
    public ResponseEntity<List<ProductResponseDTO>> getMostRecentlyPurchased(@PathVariable int x) {
        List<Product> products = orderService.getMostRecentlyPurchasedProducts(TEST_USER_ID, x);
        List<ProductResponseDTO> dtos = products.stream()
                .map(productService::toProductResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    //ADMIN
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        productService.createProduct(product);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productRequest) {
        Product updated = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(updated);
    }

    //ADMIN
    @GetMapping("/popular/{x}")
    public ResponseEntity<List<Product>> getMostPopular(@PathVariable int x) {
        List<Product> products = orderService.getMostPopularProducts(x);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/profit/{x}")
    public ResponseEntity<List<Product>> getMostProfitable(@PathVariable int x) {
        List<Product> products = orderService.getMostProfitableProducts(x);
        return ResponseEntity.ok(products);
    }
}
