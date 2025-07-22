// src/app/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// No need to import LoginComponent or RegisterComponent here anymore

const routes: Routes = [
  // This module's routing is now minimal as components are mapped directly in app-routing.
  // You could leave it empty, or if you had a conceptual '/auth' path for a module entry:
  // { path: '', redirectTo: 'login', pathMatch: 'full' } // If AuthModule was loaded via a parent '/auth' route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }