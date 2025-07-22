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
import { Subscription, merge } from 'rxjs'; // Import Subscription and merge
import { startWith, tap, switchMap } from 'rxjs/operators'; // Import operators

@Component({
  selector: 'app-admin-order-management',
  templateUrl: './admin-order-management.component.html',
  styleUrls: ['./admin-order-management.component.css']
})
export class AdminOrderManagementComponent implements OnInit, AfterViewInit, OnDestroy { // Implement OnDestroy
  displayedColumns: string[] = ['id', 'customer', 'status', 'createdAt', 'actions'];
  orders: MatTableDataSource<Order> = new MatTableDataSource();
  isLoading = true;
  errorMessage: string | null = null;

  totalOrders = 0;
  pageSize = 5;
  // pageSize is now primarily read from MatPaginator's state
  // currentPage is not needed as a component property, MatPaginator.pageIndex will manage it

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dataSubscription: Subscription | null = null; // To manage subscription lifecycle

  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initial setup handled in ngAfterViewInit
  }

  ngAfterViewInit(): void {
    // Connect dataSource to sort
    this.orders.sort = this.sort;

    // Combine sortChanges and paginator page events (including initial load)
    // This is the most robust way to handle external data sources with MatPaginator & MatSort
    this.dataSubscription = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}), // Emit an empty value to trigger initial load
        switchMap(() => { // switchMap unsubscribes from previous observable and subscribes to new one
          this.isLoading = true;
          this.errorMessage = null;

          // Make the API call with the current state of paginator and sort
          return this.orderService.getAllOrdersPaged(
            this.paginator.pageIndex,
            this.paginator.pageSize
            // Add sorting parameters if your backend supports it and you want sort to trigger reload
            // this.sort.active,
            // this.sort.direction
          );
        }),
        tap((pagedResponse: PagedResponse<Order>) => { // Use tap to process the response
          this.orders.data = pagedResponse.content;
          this.totalOrders = pagedResponse.totalElements;

          // MatPaginator automatically updates its pageIndex based on the event it emits.
          // No need to explicitly set this.paginator.pageIndex here unless there's an external reason.
          // However, ensure the backend's pagedResponse.currentPage is CORRECT.
          // If backend returns 0 for all pages, the bug is backend-side.
          // Assuming backend sends correct pagedResponse.currentPage, MatPaginator will sync.

          this.isLoading = false;
        }),
        // Add catchError for error handling directly in the pipe, or handle in component's subscribe
        // catchError(error => {
        //   console.error('Failed to load orders:', error);
        //   this.errorMessage = error.error?.error || 'Failed to load orders.';
        //   this.isLoading = false;
        //   this.snackBar.open(this.errorMessage, 'Dismiss', { duration: 5000 });
        //   return of([]); // Return an empty observable to prevent stream from breaking
        // })
      )
      .subscribe({ // Subscribe to finally trigger the stream
        error: (err) => { // Centralized error handling for the stream
            console.error('Failed to load orders (stream error):', err);
            this.errorMessage = err.error?.error || 'Failed to load orders.';
            this.isLoading = false;
            this.snackBar.open(this.errorMessage || 'An error occurred loading orders.', 'Dismiss', { duration: 5000 });
        }
      });
  }

  ngOnDestroy(): void { // Clean up subscription to prevent memory leaks
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // loadOrders method is now fully absorbed into the ngAfterViewInit stream.
  // We remove it from here unless other methods *must* call it directly and bypass the stream.
  // However, for completeOrder/cancelOrder, it's better to reload the *current* page by re-triggering the stream.
  // We can create a refreshCurrentPage() method for that.

  refreshCurrentPage(): void {
    // Trigger a refresh of the current page data
    // This effectively re-emits a page event for the current paginator state
    this.paginator.page.emit({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.totalOrders // Or this.paginator.length
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
          this.refreshCurrentPage(); // Refresh the current page's data
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
          this.snackBar.open(err.error?.error || 'Failed to cancel order.', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }
}