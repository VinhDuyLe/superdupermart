// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models/user.model'; // Import UserRole enum

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isLoggedIn = this.authService.isLoggedIn();
    // Get roles from route data, cast to UserRole array
    const requiredRoles = route.data['roles'] as Array<UserRole>;

    if (isLoggedIn) {
      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = this.authService.getUserRole();
        if (userRole && requiredRoles.includes(userRole)) {
          return true; // User is logged in and has required role
        } else {
          // User is logged in but does not have the required role
          // Redirect based on user role or default to unauthorized
          if (userRole === UserRole.USER) {
            this.router.navigate(['/user/home']); // Regular user trying to access admin route
          } else {
            this.router.navigate(['/login']); // Fallback, e.g., if role is null/invalid
          }
          return false;
        }
      }
      return true; // User is logged in, no specific roles required for this segment
    } else {
      // Not logged in
      this.router.navigate(['/login']);
      return false;
    }
  }
}