import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { OrderItem } from '../../../models/order-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private productService = inject(ProductService);

  cartItems: OrderItem[] = [];
  total: number = 0;

  getImageUrl(imgUrl: string | null): string {
    return this.productService.getImageUrl(imgUrl);
  }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  successOrderId: number | null = null;

  checkout() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const order = {
      userId: parseInt(userId),
      status: 'draft' as const,
      totalAmount: this.total,
      ordersItems: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        localStorage.setItem('currentOrderId', createdOrder.orderId!.toString());
        this.cartService.clearCart();
        this.successOrderId = createdOrder.orderId!;
        setTimeout(() => this.router.navigate(['/dashboard']), 3000);
      },
      error: (err) => console.error('Error creating order:', err)
    });
  }
}
