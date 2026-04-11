import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  private router = inject(Router);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  cardNumber = '';
  cardName = '';
  expiryDate = '';
  cvv = '';
  processing = false;
  cartItems: any[] = [];
  totalAmount = 0;
  cardNumberError = '';
  cardNameError = '';
  expiryDateError = '';
  cvvError = '';

  constructor() {
    const savedItems = localStorage.getItem('orderItems');
    
    if (savedItems) {
      this.cartItems = JSON.parse(savedItems);
    } else {
      this.cartItems = this.cartService.getItems();
    }
    
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getImageUrl(imgUrl: string | null): string {
    return this.productService.getImageUrl(imgUrl);
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    this.cardNumber = value;
    this.validateCardNumber();
  }

  formatCardName(event: any): void {
    let value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    this.cardName = value;
    this.validateCardName();
  }

  validateCardName(): void {
    if (this.cardName.length === 0) {
      this.cardNameError = '';
    } else if (this.cardName.trim().length < 3) {
      this.cardNameError = 'Name must be at least 3 characters';
    } else {
      this.cardNameError = '';
    }
  }

  validateCardNumber(): void {
    const digits = this.cardNumber.replace(/\D/g, '');
    if (digits.length === 0) {
      this.cardNumberError = '';
    } else if (digits.length < 16) {
      this.cardNumberError = 'Card number must be 16 digits';
    } else if (digits.length > 16) {
      this.cardNumberError = 'Card number cannot exceed 16 digits';
    } else {
      this.cardNumberError = '';
    }
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
    this.validateExpiryDate();
  }

  validateExpiryDate(): void {
    if (this.expiryDate.length === 0) {
      this.expiryDateError = '';
      return;
    }
    
    if (this.expiryDate.length < 5) {
      this.expiryDateError = 'Invalid format (MM/YY)';
      return;
    }

    const [month, year] = this.expiryDate.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (monthNum < 1 || monthNum > 12) {
      this.expiryDateError = 'Invalid month (01-12)';
    } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      this.expiryDateError = 'Card has expired';
    } else {
      this.expiryDateError = '';
    }
  }

  validateCVV(): void {
    if (this.cvv.length === 0) {
      this.cvvError = '';
    } else if (this.cvv.length < 3) {
      this.cvvError = 'CVV must be 3 digits';
    } else {
      this.cvvError = '';
    }
  }

  isFormValid(): boolean {
    const cardDigits = this.cardNumber.replace(/\D/g, '');
    return cardDigits.length === 16 && 
           this.cardName.trim().length >= 3 && 
           this.expiryDate.length === 5 && 
           this.cvv.length === 3 &&
           !this.cardNumberError &&
           !this.cardNameError &&
           !this.expiryDateError &&
           !this.cvvError;
  }

  processPayment(): void {
    this.processing = true;
    
    const orderId = localStorage.getItem('currentOrderId');
    const generatedCode = localStorage.getItem('generatedCode');
    const originalSchema = localStorage.getItem('originalSchema');
    const userId = localStorage.getItem('userId');
    
    if (orderId && userId) {
      const orderUpdate = {
        orderId: parseInt(orderId),
        userId: parseInt(userId),
        currentStatus: true,
        orderDate: new Date().toISOString().split('T')[0],
        ordersSum: this.totalAmount,
        originalSchema: originalSchema || '',
        generatedCode: generatedCode || '',
        ordersItems: this.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }))
      };
      
      this.orderService.updateOrder(parseInt(orderId), orderUpdate).subscribe({
        next: () => {
          this.processing = false;
          localStorage.removeItem('orderItems');
          localStorage.removeItem('orderTotal');
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('originalSchema');
          this.cartService.clearCart();
          this.router.navigate(['/code-viewer']);
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.processing = false;
          alert('Payment processed but order update failed');
          this.router.navigate(['/code-viewer']);
        }
      });
    } else {
      this.processing = false;
      this.router.navigate(['/code-viewer']);
    }
  }
}
