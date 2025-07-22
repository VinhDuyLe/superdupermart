// src/app/shared/services/watchlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // Import tap
import { ProductResponseDTO } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = environment.backendBaseUrl + '/watchlist';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  getAllWatchlistProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/all`);
  }

  addProduct(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/product/${productId}`, {}).pipe(
      tap(() => { // <--- CORRECTED: Use tap operator
        this.snackBar.open('Product added to watchlist!', 'Dismiss', { duration: 2000 });
      })
    );
  }

  removeProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${productId}`).pipe(
      tap(() => { // <--- CORRECTED: Use tap operator
        this.snackBar.open('Product removed from watchlist.', 'Dismiss', { duration: 2000 });
      })
    );
  }
}