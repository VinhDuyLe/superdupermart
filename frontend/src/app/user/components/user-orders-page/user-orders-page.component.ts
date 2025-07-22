// src/app/user/components/user-orders-page/user-orders-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-orders-page',
  templateUrl: './user-orders-page.component.html',
  styleUrls: ['./user-orders-page.component.css']
})
export class UserOrdersPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'status', 'createdAt', 'actions'];
  orders: MatTableDataSource<Order> = new MatTableDataSource();
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.orderService.getAllOrdersForUser().subscribe({
      next: (data) => {
        this.orders.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.errorMessage = err.error?.error || 'Failed to load orders.';
        this.isLoading = false;
      }
    });
  }

  viewOrderDetail(id: number): void {
    this.router.navigate(['/user/orders', id]);
  }

  cancelOrder(id: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe({
        next: () => {
          this.loadOrders(); // Refresh the list after cancellation
          // Notification handled by service now
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.snackBar.open(err.error?.error || 'Failed to cancel order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }
}