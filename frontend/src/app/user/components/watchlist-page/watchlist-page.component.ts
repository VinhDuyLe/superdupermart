// src/app/user/components/watchlist-page/watchlist-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { ProductResponseDTO } from '../../../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'retailPrice', 'actions'];
  watchlistProducts: MatTableDataSource<ProductResponseDTO> = new MatTableDataSource();
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private watchlistService: WatchlistService,
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.watchlistService.getAllWatchlistProducts().subscribe({
      next: (data) => {
        this.watchlistProducts.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load watchlist:', err);
        this.errorMessage = err.error?.error || 'Failed to load watchlist.';
        this.isLoading = false;
      }
    });
  }

  viewProductDetail(id: number): void {
    this.router.navigate(['user/products', id]);
  }

  addToCart(product: ProductResponseDTO): void {
    this.shoppingCartService.addToCart(product, 1);
  }

  removeFromWatchlist(productId: number): void {
    this.watchlistService.removeProduct(productId).subscribe({
      next: () => {
        this.loadWatchlist(); // Refresh the list
        // Notification handled by service now
      },
      error: (err) => {
        console.error('Failed to remove from watchlist:', err);
        this.snackBar.open(err.error?.error || 'Failed to remove product from watchlist.', 'Dismiss', { duration: 3000 });
      }
    });
  }
}