// src/app/shared/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponseDTO, ProductRequest } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.backendBaseUrl + '/products';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  getAllInStockProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/all`);
  }

  getProductDetail(id: number): Observable<ProductResponseDTO> {
    return this.http.get<ProductResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getAllProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/all`);
  }

  createProduct(product: ProductRequest): Observable<ProductResponseDTO> {
    return this.http.post<ProductResponseDTO>(this.apiUrl, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<ProductResponseDTO> {
    return this.http.patch<ProductResponseDTO>(`${this.apiUrl}/${id}`, product);
  }

  getMostPopularProducts(x: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/popular/${x}`);
  }

  getMostProfitableProducts(x: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/profit/${x}`);
  }

  // Helper for notifications
  showNotification(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}