// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegistrationRequest, UserResponse, UserRole } from 'src/app/shared/models/user.model'; // Import UserRole
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backendBaseUrl;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
        }
      })
    );
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id; // Assuming 'id' is in your JWT payload
      } catch (e) {
        console.error('Error decoding JWT token for user ID:', e);
        return null;
      }
    }
    return null;
  }

  register(userData: RegistrationRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/signup`, userData);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): UserRole | null { 
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role as UserRole;
      } catch (e) {
        console.error('Error decoding JWT token:', e);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === UserRole.ADMIN;
  }
}