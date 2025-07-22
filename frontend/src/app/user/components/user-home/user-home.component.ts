// src/app/user/components/user-home/user-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { ProductResponseDTO } from '../../../shared/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  frequentProducts: ProductResponseDTO[] = [];
  recentProducts: ProductResponseDTO[] = [];
  isLoadingFrequent = true;
  isLoadingRecent = true;
  errorMessageFrequent: string | null = null;
  errorMessageRecent: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFrequentProducts();
    this.loadRecentProducts();
  }

  loadFrequentProducts(): void {
    this.isLoadingFrequent = true;
    this.errorMessageFrequent = null;
    this.orderService.getMostFrequentlyPurchased(3).subscribe({
      next: (data) => {
        this.frequentProducts = data;
        this.isLoadingFrequent = false;
      },
      error: (err) => {
        console.error('Failed to load frequent products:', err);
        this.errorMessageFrequent = err.error?.error || 'Failed to load frequent products.';
        this.isLoadingFrequent = false;
      }
    });
  }

  loadRecentProducts(): void {
    this.isLoadingRecent = true;
    this.errorMessageRecent = null;
    this.orderService.getMostRecentlyPurchased(3).subscribe({
      next: (data) => {
        this.recentProducts = data;
        this.isLoadingRecent = false;
      },
      error: (err) => {
        console.error('Failed to load recent products:', err);
        this.errorMessageRecent = err.error?.error || 'Failed to load recent products.';
        this.isLoadingRecent = false;
      }
    });
  }

  viewProductDetail(id: number): void {
    this.router.navigate(['/user/products', id]);
  }
}