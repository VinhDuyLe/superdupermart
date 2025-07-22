// src/app/shared/components/shopping-cart/shopping-cart.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService, CartItem } from '../../services/shopping-cart.service';
import { OrderService } from '../../services/order.service';
import { OrderRequest } from 'src/app/shared//models/order.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'retailPrice', 'cartQuantity', 'subtotal', 'actions'];
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  isPlacingOrder = false;
  errorMessage: string | null = null;

  private cartSubscription!: Subscription;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartSubscription = this.shoppingCartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.shoppingCartService.getCartTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    this.shoppingCartService.updateItemQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.shoppingCartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.shoppingCartService.clearCart();
  }

  placeOrder(): void {
    this.errorMessage = null;
    if (this.cartItems.length === 0) {
      this.snackBar.open('Your cart is empty!', 'Dismiss', { duration: 2000 });
      return;
    }

    this.isPlacingOrder = true;
    const orderRequest: OrderRequest = {
      order: this.shoppingCartService.getCartItemsForOrder()
    };

    this.orderService.placeOrder(orderRequest).subscribe({
      next: (order) => {
        this.snackBar.open(`Order ${order.id} placed successfully!`, 'Dismiss', { duration: 3000 });
        this.shoppingCartService.clearCart(); // Clear cart after successful order
        this.isPlacingOrder = false;
        this.router.navigate(['/user/orders', order.id]); // Navigate to order detail
      },
      error: (err) => {
        console.error('Failed to place order:', err);
        this.errorMessage = err.error?.error || 'Failed to place order. Please try again.';
        // Fix 3 (Best for error messages - provides a generic fallback if null):
        this.snackBar.open(this.errorMessage || 'An unexpected error occurred.', 'Dismiss', { duration: 5000 });
 
        this.isPlacingOrder = false;
      }
    });
  }
}