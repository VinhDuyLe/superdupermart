// src/app/shared/components/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AuthService } from '../../../core/services/auth.service'; // To check admin role
import { ProductResponseDTO } from '../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: ProductResponseDTO | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      if (productId) {
        this.loadProductDetail(productId);
      } else {
        this.errorMessage = 'Product ID not provided.';
        this.isLoading = false;
      }
    });
  }

  loadProductDetail(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.productService.getProductDetail(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load product details:', err);
        this.errorMessage = err.error?.error || 'Failed to load product details.';
        this.isLoading = false;
      }
    });
  }

  addToCart(product: ProductResponseDTO): void {
    this.shoppingCartService.addToCart(product, 1);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  backToList(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/products']);
    } else {
      this.router.navigate(['user/products']);
    }
  }
}