// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all components that are part of the AdminModule and its routing
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AdminOrderManagementComponent } from './components/admin-order-management/admin-order-management.component';
import { ProductDetailComponent } from '../shared/components/product-detail/product-detail.component'; // Shared component
import { OrderDetailComponent } from '../shared/components/order-detail/order-detail.component'; // Shared component


const routes: Routes = [
  // These paths are relative to the parent '/admin' path
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect /admin to /admin/home
  { path: 'home', component: AdminHomeComponent },
  { path: 'products', component: ProductManagementComponent },
  { path: 'products/add', component: AddProductComponent },
  { path: 'products/edit/:id', component: EditProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'orders', component: AdminOrderManagementComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild for feature modules
  exports: [RouterModule]
})
export class AdminRoutingModule { }