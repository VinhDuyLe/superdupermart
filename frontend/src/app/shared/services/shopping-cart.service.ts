// src/app/shared/services/shopping-cart.service.ts
import { Injectable } from '@angular/core';
import { ProductResponseDTO } from '../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications

export interface CartItem extends ProductResponseDTO {
  cartQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

  constructor(private snackBar: MatSnackBar) {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('shopping_cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('shopping_cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: ProductResponseDTO, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.cartQuantity += quantity;
    } else {
      this.cartItems.push({ ...product, cartQuantity: quantity });
    }
    this.saveCartToLocalStorage();
    this.snackBar.open(`${product.name} added to cart!`, 'Dismiss', { duration: 2000 });
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCartToLocalStorage();
    this.snackBar.open('Item removed from cart.', 'Dismiss', { duration: 2000 });
  }

  updateItemQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(i => i.id === productId);
    if (item) {
      if (quantity > 0) {
        item.cartQuantity = quantity;
      } else {
        this.removeFromCart(productId);
      }
    }
    this.saveCartToLocalStorage();
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('shopping_cart'); // Also remove from local storage
    this.cartSubject.next(this.cartItems);
    this.snackBar.open('Shopping cart cleared.', 'Dismiss', { duration: 2000 });
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.retailPrice || 0) * item.cartQuantity, 0);
  }

  getCartItemsForOrder(): { productId: number; quantity: number }[] {
    return this.cartItems.map(item => ({ productId: item.id, quantity: item.cartQuantity }));
  }
}