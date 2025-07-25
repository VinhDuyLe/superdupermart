// src/app/admin/components/edit-product/edit-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest, ProductResponseDTO } from '../../../shared/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId: number | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
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

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.productId = id;
        this.loadProduct(id);
      } else {
        this.errorMessage = 'Product ID not provided for editing.';
        this.isLoading = false;
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.productService.getProductDetail(id).subscribe({
      next: (product: ProductResponseDTO) => {
        this.productForm.patchValue(product); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load product for editing:', err);
        this.errorMessage = err.error?.error || 'Failed to load product.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.productForm.valid && this.productId !== null) {
      this.isSubmitting = true;
      const updatedProduct: ProductRequest = this.productForm.value;
      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: (product) => {
          this.snackBar.open(`Product '${product.name}' updated successfully!`, 'Dismiss', { duration: 3000 });
          this.isSubmitting = false;
          this.router.navigate(['/admin/products']); 
        },
        error: (err) => {
          console.error('Failed to update product:', err);
          this.errorMessage = err.error?.error || 'Failed to update product. Please try again.';
          this.snackBar.open(this.errorMessage || 'Failed to update product.', 'Dismiss', { duration: 5000 });
           this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}