// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Import LoginComponent and RegisterComponent directly
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Import all top-level components that are directly mapped in the app-routing
// These will be components that serve as the initial landing for their respective lazy modules
// e.g., UserHomeComponent, ProductListComponent, AdminHomeComponent, etc.
// For lazy loading, you typically don't import the components here if they are only used within the lazy-loaded module.
// The loadChildren approach is fine for the FIRST level of lazy loading.
// The mistake is using loadChildren for the children routes.

// Let's refine the approach:
// app-routing.module.ts should ONLY load feature modules.
// The routes *within* those modules' routing files (e.g., user-routing.module.ts) should then map to components.

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent }, // Direct component mapping for auth routes
  { path: 'register', component: RegisterComponent }, // Direct component mapping for auth routes

  // User-specific routes - Protected by AuthGuard
  {
    path: 'user', // This is the base path for all user features
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/user.module').then(m => m.UserModule) // Load UserModule for all /user/* routes
  },

  // Admin-specific routes - Protected by AuthGuard (and role check)
  {
    path: 'admin', // This is the base path for all admin features
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) // Load AdminModule for all /admin/* routes
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }