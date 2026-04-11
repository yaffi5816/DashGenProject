import { Component, inject } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { OrderItem } from '../../../models/order-item.model';
import { UserUpdate } from '../../../models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private authService = inject(AuthService);
  cartService = inject(CartService);
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  isLoggedIn = false;
  username = '';
  firstName = '';
  lastName = '';
  isAdmin = false;
  cartItems: OrderItem[] = [];
  showCartSidebar = false;
  showUserModal = false;
  isCartPage = false;
  userForm: UserUpdate = {
    userName: '',
    firstName: '',
    lastName: '',
    isAdmin: false
  };

  constructor() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.username = this.authService.getUsername() || '';
        this.firstName = localStorage.getItem('firstName') || '';
        this.lastName = localStorage.getItem('lastName') || '';
        this.isAdmin = this.authService.isAdmin();
      } else {
        this.username = '';
        this.firstName = '';
        this.lastName = '';
        this.isAdmin = false;
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isCartPage = event.url === '/cart';
    });
  }

  getImageUrl(imgUrl: string | null): string {
    return this.productService.getImageUrl(imgUrl);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // שמור את הסל הנוכחי ב-localStorage לפני התנתקות
      const currentCart = this.cartService.getItems();
      localStorage.setItem('cart', JSON.stringify(currentCart));
    }
    this.authService.logout();
    setTimeout(() => this.cartService.reloadCart(), 0);
    this.router.navigate(['/home']);
  }

  navigateToOrders(){
    this.router.navigate(['/orders']);
  }

  navigateToProducts(){
    this.router.navigate(['/products']);
  }

  navigateToUsers(){
    this.router.navigate(['/users']);
  }

  toggleCartSidebar() {
    this.showCartSidebar = !this.showCartSidebar;
  }

  closeCartSidebar() {
    this.showCartSidebar = false;
  }

  goToCart() {
    this.showCartSidebar = false;
    this.router.navigate(['/cart']);
  }

  openUserProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userForm = {
        userName: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        isAdmin: this.isAdmin
      };
      this.showUserModal = true;
    }
  }

  closeUserModal() {
    this.showUserModal = false;
  }

  checkout() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const order = {
      userId: parseInt(userId),
      status: 'draft' as const,
      totalAmount: this.cartService.getTotal(),
      ordersItems: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        localStorage.setItem('currentOrderId', createdOrder.orderId!.toString());
        this.showCartSidebar = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Error creating order:', err)
    });
  }

  saveUserProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.updateUser(parseInt(userId), this.userForm).subscribe({
        next: () => {
          localStorage.setItem('username', this.userForm.userName);
          localStorage.setItem('firstName', this.userForm.firstName);
          localStorage.setItem('lastName', this.userForm.lastName);
          this.username = this.userForm.userName;
          this.firstName = this.userForm.firstName;
          this.lastName = this.userForm.lastName;
          this.closeUserModal();
          alert('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Failed to update profile');
        }
      });
    }
  }
}
