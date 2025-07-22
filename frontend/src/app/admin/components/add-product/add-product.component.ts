// src/app/admin/components/add-product/add-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      wholesalePrice: [0, [Validators.required, Validators.min(0)]],
      retailPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const newProduct: ProductRequest = this.productForm.value;
      this.productService.createProduct(newProduct).subscribe({
        next: (product) => {
          this.snackBar.open(`Product '${product.name}' added successfully!`, 'Dismiss', { duration: 3000 });
          this.isSubmitting = false;
          this.router.navigate(['/admin/products']); // Navigate back to product management
        },
        error: (err) => {
          console.error('Failed to add product:', err);
          this.errorMessage = err.error?.error || 'Failed to add product. Please try again.';
// Fix 3 (Best for error messages - provides a generic fallback if null):
          this.snackBar.open(this.errorMessage || 'An unexpected error occurred.', 'Dismiss', { duration: 5000 });          
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}