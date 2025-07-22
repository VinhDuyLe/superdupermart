// src/app/admin/components/product-management/product-management.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductResponseDTO } from '../../../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'retailPrice', 'wholesalePrice', 'quantity', 'actions'];
  products: MatTableDataSource<ProductResponseDTO> = new MatTableDataSource();
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  ngAfterViewInit(): void {
    this.products.paginator = this.paginator;
    this.products.sort = this.sort;
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load all products:', err);
        this.errorMessage = err.error?.error || 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  viewProductDetail(id: number): void {
    this.router.navigate(['/admin/products', id]); // Admin view of product detail
  }

  editProduct(id: number): void {
    this.router.navigate(['/admin/products/edit', id]);
  }
}