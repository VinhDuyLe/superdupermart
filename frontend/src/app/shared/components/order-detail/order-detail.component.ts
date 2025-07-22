// src/app/shared/components/order-detail/order-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../core/services/auth.service'; // To check admin role
import { Order } from 'src/app/shared//models/order.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from 'src/app/shared//models/user.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  itemDisplayedColumns: string[] = ['productSnapshotName', 'productSnapshotPrice', 'quantity', 'subtotal', 'itemActions'];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = Number(params.get('id'));
      if (orderId) {
        this.loadOrderDetail(orderId);
      } else {
        this.errorMessage = 'Order ID not provided.';
        this.isLoading = false;
      }
    });
  }

  loadOrderDetail(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load order details:', err);
        this.errorMessage = err.error?.error || 'Failed to load order details.';
        this.isLoading = false;
      }
    });
  }

  calculateOrderTotal(): number {
    if (!this.order || !this.order.items) return 0;
    return this.order.items.reduce((total, item) => total + (item.productSnapshotPrice || 0) * item.quantity, 0);
  }

  viewProductDetail(productId: number): void {
    if (this.isAdmin()) { // If admin is viewing order, go to admin product detail
      this.router.navigate(['/admin/products', productId]);
    } else { // Otherwise, go to user product detail
      this.router.navigate(['/user/products', productId]);
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  canCancelOrder(): boolean {
    if (!this.order) return false;
    const currentUserId = this.authService.getUserIdFromToken(); // Assuming you add getUserIdFromToken to AuthService
    return this.isAdmin() || (this.order.user.id === currentUserId);
  }

  cancelOrder(): void {
    if (!this.order) return;
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.order.id).subscribe({
        next: () => {
          this.loadOrderDetail(this.order!.id); // Refresh order status
          // Notification handled by service
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.snackBar.open(err.error?.error || 'Failed to cancel order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  completeOrder(): void {
    if (!this.order || !this.isAdmin()) return;
    if (confirm('Are you sure you want to complete this order?')) {
      this.orderService.completeOrder(this.order.id).subscribe({
        next: () => {
          this.loadOrderDetail(this.order!.id); // Refresh order status
          // Notification handled by service
        },
        error: (err) => {
          console.error('Failed to complete order:', err);
          this.snackBar.open(err.error?.error || 'Failed to complete order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }
}