package org.vinhduyle.superdupermart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.vinhduyle.superdupermart.domain.Product;
import org.vinhduyle.superdupermart.dto.ProductResponseDTO;
import org.vinhduyle.superdupermart.service.OrderService;
import org.vinhduyle.superdupermart.service.ProductService;
import org.vinhduyle.superdupermart.security.CustomUserDetails; // Import CustomUserDetails

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final OrderService orderService;

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }
        return false;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsForUsers() {
        List<Product> products;
        List<ProductResponseDTO> dtos;

        if (isAdmin()) {
            products = productService.getAllProducts();
            dtos = products.stream()
                    .map(productService::toProductResponseDTOForAdmin)
                    .collect(Collectors.toList());
        } else {
            products = productService.getAllInStockProducts();
            dtos = products.stream()
                    .map(productService::toProductResponseDTO)
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductDetail(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        if (isAdmin()) {
            return ResponseEntity.ok(productService.toProductResponseDTOForAdmin(product));
        } else {
            return ResponseEntity.ok(productService.toProductResponseDTO(product));
        }
    }

    @GetMapping("/frequent/{x}")
    public ResponseEntity<List<ProductResponseDTO>> getMostFrequentlyPurchased(@PathVariable int x) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        List<Product> products = orderService.getMostFrequentlyPurchasedProducts(userId, x);
        List<ProductResponseDTO> dtos = products.stream()
                .map(productService::toProductResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/recent/{x}")
    public ResponseEntity<List<ProductResponseDTO>> getMostRecentlyPurchased(@PathVariable int x) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        List<Product> products = orderService.getMostRecentlyPurchasedProducts(userId, x);
        List<ProductResponseDTO> dtos = products.stream()
                .map(productService::toProductResponseDTO) // Regular DTO conversion
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ADMIN endpoints (no change, as they already deal with Product objects directly)
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