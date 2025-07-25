// superdupermart/frontend/src/app/admin/components/admin-order-management/admin-order-management.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagedResponse } from '../../../shared/models/common.model';
import { Subscription, merge } from 'rxjs'; 
import { startWith, tap, switchMap } from 'rxjs/operators'; 
@Component({
  selector: 'app-admin-order-management',
  templateUrl: './admin-order-management.component.html',
  styleUrls: ['./admin-order-management.component.css']
})
export class AdminOrderManagementComponent implements OnInit, AfterViewInit, OnDestroy { 
  displayedColumns: string[] = ['id', 'customer', 'status', 'createdAt', 'actions'];
  orders: MatTableDataSource<Order> = new MatTableDataSource();
  isLoading = true;
  errorMessage: string | null = null;

  totalOrders = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dataSubscription: Subscription | null = null; 

  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Connect dataSource to sort
    this.orders.sort = this.sort;

    this.dataSubscription = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}), 
        switchMap(() => { 
          this.isLoading = true;
          this.errorMessage = null;

          return this.orderService.getAllOrdersPaged(
            this.paginator.pageIndex,
            this.paginator.pageSize

          );
        }),
        tap((pagedResponse: PagedResponse<Order>) => { 
          this.orders.data = pagedResponse.content;
          this.totalOrders = pagedResponse.totalElements;

          this.isLoading = false;
        }),
      )
      .subscribe({ 
        error: (err) => { 
            console.error('Failed to load orders (stream error):', err);
            this.errorMessage = err.error?.error || 'Failed to load orders.';
            this.isLoading = false;
            this.snackBar.open(this.errorMessage || 'An error occurred loading orders.', 'Dismiss', { duration: 5000 });
        }
      });
  }

  ngOnDestroy(): void { 
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }


  refreshCurrentPage(): void {
    this.paginator.page.emit({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.totalOrders 
    });
  }


  viewOrderDetail(id: number): void {
    this.router.navigate(['/admin/orders', id]);
  }

  completeOrder(id: number): void {
    if (confirm('Are you sure you want to complete this order?')) {
      this.orderService.completeOrder(id).subscribe({
        next: () => {
          this.snackBar.open(`Order ${id} completed successfully!`, 'Dismiss', { duration: 3000 });
          this.refreshCurrentPage(); // Refresh the current page's data
        },
        error: (err) => {
          console.error('Failed to complete order:', err);
          this.snackBar.open(err.error?.error || 'Failed to complete order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  cancelOrder(id: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe({
        next: () => {
          this.snackBar.open(`Order ${id} cancelled successfully!`, 'Dismiss', { duration: 3000 });
          this.refreshCurrentPage(); 
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.snackBar.open(err.error?.error || 'Failed to cancel order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }
}