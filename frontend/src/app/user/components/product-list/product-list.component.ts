// src/app/user/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { ProductResponseDTO } from '../../../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'retailPrice', 'actions'];
  products: MatTableDataSource<ProductResponseDTO> = new MatTableDataSource();
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private watchlistService: WatchlistService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.productService.getAllInStockProducts().subscribe({
      next: (data) => {
        this.products.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.errorMessage = err.error?.error || 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  viewProductDetail(id: number): void {
    this.router.navigate(['/user/products', id]);
  }

  addToCart(product: ProductResponseDTO): void {
    this.shoppingCartService.addToCart(product, 1); // Add 1 quantity by default
  }

  addToWatchlist(productId: number): void {
    this.watchlistService.addProduct(productId).subscribe({
      next: () => {
        // Notification handled by service now
      },
      error: (err) => {
        console.error('Failed to add to watchlist:', err);
        this.snackBar.open(err.error?.error || 'Failed to add product to watchlist.', 'Dismiss', { duration: 3000 });
      }
    });
  }
}