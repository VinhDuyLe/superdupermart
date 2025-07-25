// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isLoggedIn = this.authService.isLoggedIn();
    const requiredRoles = route.data['roles'] as Array<UserRole>;

    if (isLoggedIn) {
      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = this.authService.getUserRole();
        if (userRole && requiredRoles.includes(userRole)) {
          return true; 
        } else {
          if (userRole === UserRole.USER) {
            this.router.navigate(['/user/home']); 
          } else {
            this.router.navigate(['/login']); 
          }
          return false;
        }
      }
      return true; 
    } else {
      // Not logged in
      this.router.navigate(['/login']);
      return false;
    }
  }
}