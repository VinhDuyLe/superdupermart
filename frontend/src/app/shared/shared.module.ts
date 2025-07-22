// superdupermart/frontend/src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Needed for forms in shared components

// Shared Components - Ensure these files exist and their classes are correctly named
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';

// Angular Material Imports - ADD ALL THESE AND MORE AS YOU USE THEM IN SHARED COMPONENTS
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar'; // Often useful to export if header is shared


@NgModule({
  declarations: [
    ShoppingCartComponent,
    ProductDetailComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Material Modules
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule // Import here if you export it
  ],
  exports: [
    // Export common Angular modules if other modules need them when importing SharedModule
    CommonModule, // Always export CommonModule if other modules will use directives like *ngIf, *ngFor
    FormsModule,
    ReactiveFormsModule,

    // Export shared components so other feature modules can use them
    ShoppingCartComponent,
    ProductDetailComponent,
    OrderDetailComponent,

    // Export Material modules that are commonly used across feature modules
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule // Export if you want other modules to use MatToolbar via SharedModule
  ]
})
export class SharedModule { }