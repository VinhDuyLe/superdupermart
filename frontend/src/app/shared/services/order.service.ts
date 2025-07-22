// src/app/shared/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Order, OrderRequest } from '../models/order.model';
import { ProductResponseDTO } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { PagedResponse } from '../models/common.model'; // Import PagedResponse

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.backendBaseUrl + '/orders';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  placeOrder(orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderRequest);
  }

  getAllOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/cancel`, {}).pipe(
        tap(() => { // <--- CORRECTED: Use tap operator
            this.snackBar.open(`Order ${orderId} cancelled successfully!`, 'Dismiss', { duration: 3000 });
        })
    );
  }

  getMostFrequentlyPurchased(x: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${environment.backendBaseUrl}/products/frequent/${x}`);
  }

  getMostRecentlyPurchased(x: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${environment.backendBaseUrl}/products/recent/${x}`);
  }

  // Admin specific methods
  // Modified getAllOrdersPaged to expect PagedResponse
  getAllOrdersPaged(page: number = 0, size: number = 5): Observable<PagedResponse<Order>> {
    return this.http.get<PagedResponse<Order>>(`${this.apiUrl}/admin?page=${page}&size=${size}`);
  }

  completeOrder(orderId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/complete`, {}).pipe(
        tap(() => { // <--- CORRECTED: Use tap operator
            this.snackBar.open(`Order ${orderId} completed successfully!`, 'Dismiss', { duration: 3000 });
        })
    );
  }

  // New method for total sold items (Admin only)
  getTotalSoldItemsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/admin/total-sold-items`);
  }
}