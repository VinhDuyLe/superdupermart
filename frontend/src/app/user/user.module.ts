// superdupermart/frontend/src/app/user/user.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // For forms if needed in user module

import { UserRoutingModule } from './user-routing.module';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { WatchlistPageComponent } from './components/watchlist-page/watchlist-page.component';
import { UserOrdersPageComponent } from './components/user-orders-page/user-orders-page.component';

// Import SharedModule which exports most common Material modules and shared components
import { SharedModule } from '../shared/shared.module';

// No need to import individual Mat modules here if SharedModule exports them:
// import { MatCardModule } from '@angular/material/card';
// import { MatTableModule } from '@angular/material/table';
// ... etc.

// Specific user module Material imports if not covered by SharedModule exports or needed only here:
import { MatListModule } from '@angular/material/list'; // MatListModule is only used in UserHomeComponent


@NgModule({
  declarations: [
    UserHomeComponent,
    ProductListComponent,
    WatchlistPageComponent,
    UserOrdersPageComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule, // These were kept here because forms are a core user feature
    SharedModule, // <--- Import SharedModule here! This should resolve most Mat errors.
    MatListModule // Keep MatListModule if it's not exported by SharedModule and only used in UserModule
  ]
})
export class UserModule { }