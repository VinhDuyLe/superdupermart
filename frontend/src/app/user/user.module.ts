// superdupermart/frontend/src/app/user/user.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { UserRoutingModule } from './user-routing.module';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { WatchlistPageComponent } from './components/watchlist-page/watchlist-page.component';
import { UserOrdersPageComponent } from './components/user-orders-page/user-orders-page.component';

import { SharedModule } from '../shared/shared.module';

import { MatListModule } from '@angular/material/list'; 


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
    ReactiveFormsModule, 
    SharedModule, 
    MatListModule 
  ]
})
export class UserModule { }