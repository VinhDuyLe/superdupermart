// src/app/admin/components/admin-home/admin-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Order } from '../../../shared/models/order.model';
import { ProductResponseDTO } from '../../../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagedResponse } from '../../../shared/models/common.model';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  // Orders
  displayedColumns: string[] = ['id', 'customer', 'status', 'createdAt', 'actions'];
  orders: MatTableDataSource<Order> = new MatTableDataSource();
  isLoadingOrders = true;
  errorMessageOrders: string | null = null;

  // Products
  popularProducts: ProductResponseDTO[] = [];
  profitableProducts: ProductResponseDTO[] = [];
  isLoadingPopular = true;
  isLoadingProfitable = true;
  errorMessagePopular: string | null = null;
  errorMessageProfitable: string | null = null;

  // Total Sold Items
  totalSoldItems: number | null = null;
  isLoadingTotalSold = true; // Set to true to show spinner initially
  errorMessageTotalSold: string | null = null;


  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadRecentOrders();
    this.loadPopularProducts();
    this.loadProfitableProducts();
    this.loadTotalSoldItems(); // Uncomment this line
  }

  loadRecentOrders(): void {
    this.isLoadingOrders = true;
    this.errorMessageOrders = null;
    this.orderService.getAllOrdersPaged(0, 5).subscribe({
      next: (pagedResponse: PagedResponse<Order>) => {
        this.orders.data = pagedResponse.content;
        this.isLoadingOrders = false;
      },
      error: (err) => {
        console.error('Failed to load recent orders:', err);
        this.errorMessageOrders = err.error?.error || 'Failed to load recent orders.';
        this.isLoadingOrders = false;
        this.snackBar.open(this.errorMessageOrders || 'An error occurred loading recent orders.', 'Dismiss', { duration: 5000 });
      }
    });
  }

  loadPopularProducts(): void {
    this.isLoadingPopular = true;
    this.errorMessagePopular = null;
    this.productService.getMostPopularProducts(3).subscribe({
      next: (data) => {
        this.popularProducts = data;
        this.isLoadingPopular = false;
      },
      error: (err) => {
        console.error('Failed to load popular products:', err);
        this.errorMessagePopular = err.error?.error || 'Failed to load popular products.';
        this.isLoadingPopular = false;
        this.snackBar.open(this.errorMessagePopular || 'An error occurred loading popular products.', 'Dismiss', { duration: 5000 });
      }
    });
  }

  loadProfitableProducts(): void {
    this.isLoadingProfitable = true;
    this.errorMessageProfitable = null;
    this.productService.getMostProfitableProducts(3).subscribe({
      next: (data) => {
        this.profitableProducts = data;
        this.isLoadingProfitable = false;
      },
      error: (err) => {
        console.error('Failed to load profitable products:', err);
        this.errorMessageProfitable = err.error?.error || 'Failed to load profitable products.';
        this.isLoadingProfitable = false;
        this.snackBar.open(this.errorMessageProfitable || 'An error occurred loading profitable products.', 'Dismiss', { duration: 5000 });
      }
    });
  }

  // New method: load total sold items
  loadTotalSoldItems(): void {
    this.isLoadingTotalSold = true;
    this.errorMessageTotalSold = null;
    this.orderService.getTotalSoldItemsCount().subscribe({ // Call the new service method
      next: (count) => {
        this.totalSoldItems = count;
        this.isLoadingTotalSold = false;
      },
      error: (err) => {
        console.error('Failed to load total sold items:', err);
        this.errorMessageTotalSold = err.error?.error || 'Failed to load total sold items.';
        this.isLoadingTotalSold = false;
        this.snackBar.open(this.errorMessageTotalSold || 'An error occurred loading total sold items.', 'Dismiss', { duration: 5000 });
      }
    });
  }

  viewOrderDetail(id: number): void {
    this.router.navigate(['/admin/orders', id]);
  }

  completeOrder(id: number): void {
    if (confirm('Are you sure you want to complete this order?')) {
      this.orderService.completeOrder(id).subscribe({
        next: () => {
          this.loadRecentOrders(); // Refresh orders preview
          this.loadTotalSoldItems(); // Refresh total sold items after an order completion
        },
        error: (err) => {
          console.error('Failed to complete order:', err);
          this.snackBar.open(err.error?.error || 'Failed to complete order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  cancelOrder(id: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe({
        next: () => {
          this.loadRecentOrders(); // Refresh orders preview
          this.loadTotalSoldItems(); // Refresh total sold items after an order cancellation (as it affects count)
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.snackBar.open(err.error?.error || 'Failed to cancel order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  viewProductDetail(id: number): void {
    this.router.navigate(['/admin/products', id]);
  }
}