import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private router = inject(Router);

  orders: Order[] = [];
  selectedOrder: Order | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.orderService.getUserOrders(parseInt(userId)).subscribe({
        next: (orders) => this.orders = orders,
        error: (err) => console.error('Error loading orders:', err)
      });
    }
  }

  getImageUrl(imgUrl: string | null): string {
    return this.productService.getImageUrl(imgUrl);
  }

  viewOrder(order: Order) {
    sessionStorage.setItem('selectedOrder', JSON.stringify(order));
    this.router.navigate(['/order-detail', order.orderId]);
  }

  approveCode(orderId: number) {
    this.orderService.approveCode(orderId).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error approving code:', err)
    });
  }

  proceedToPayment(orderId: number) {
    this.orderService.completeOrder(orderId).subscribe({
      next: () => {
        alert('התשלום בוצע בהצלחה! הקוד נשלח למייל');
        this.loadOrders();
      },
      error: (err) => console.error('Error completing order:', err)
    });
  }

  suspendOrder(orderId: number) {
    this.orderService.suspendOrder(orderId).subscribe({
      next: () => {
        alert('ההזמנה הושהתה');
        this.loadOrders();
      },
      error: (err) => console.error('Error suspending order:', err)
    });
  }

  downloadCode(orderId: number) {
    this.orderService.downloadCode(orderId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-${orderId}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.orderService.completeOrder(orderId).subscribe(() => this.loadOrders());
      },
      error: (err) => console.error('Error downloading code:', err)
    });
  }
}
