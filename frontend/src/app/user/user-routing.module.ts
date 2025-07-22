// src/app/user/user-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all components that are part of the UserModule and its routing
import { UserHomeComponent } from './components/user-home/user-home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { WatchlistPageComponent } from './components/watchlist-page/watchlist-page.component';
import { UserOrdersPageComponent } from './components/user-orders-page/user-orders-page.component';
import { ProductDetailComponent } from '../shared/components/product-detail/product-detail.component'; // Shared component
import { OrderDetailComponent } from '../shared/components/order-detail/order-detail.component'; // Shared component
import { ShoppingCartComponent } from '../shared/components/shopping-cart/shopping-cart.component'; // Shared component


const routes: Routes = [
  // These paths are relative to the parent '/user' path
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect /user to /user/home
  { path: 'home', component: UserHomeComponent },
  { path: 'products', component: ProductListComponent }, // /user/products
  { path: 'products/:id', component: ProductDetailComponent }, // /user/products/:id
  { path: 'watchlist/products/all', component: WatchlistPageComponent }, // /user/watchlist/products/all
  { path: 'orders', component: UserOrdersPageComponent }, // /user/orders
  { path: 'orders/:id', component: OrderDetailComponent }, // /user/orders/:id
  { path: 'cart', component: ShoppingCartComponent }, // <--- ADD THIS LINE

];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild for feature modules
  exports: [RouterModule]
})
export class UserRoutingModule { }