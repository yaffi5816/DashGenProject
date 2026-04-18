import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  username = '';
  password = '';
  firstName = '';
  lastName = '';
  errorMessage = '';
  isRegisterMode = false;
  private apiUrl = 'https://localhost:7226/api/Users';

  onSubmit(): void {
    if (this.isRegisterMode) {
      this.register();
    } else {
      this.login();
    }
  }

  private validate(isRegister: boolean): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.username)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
    if (isRegister) {
      if (!this.password) {
        this.errorMessage = 'Please fill all fields';
        return false;
      }
      const lettersOnly = /^[a-zA-Z\u0590-\u05FF]+$/;
      if (!lettersOnly.test(this.firstName)) {
        this.errorMessage = 'First name must contain letters only.';
        return false;
      }
      if (!lettersOnly.test(this.lastName)) {
        this.errorMessage = 'Last name must contain letters only.';
        return false;
      }
    }
    return true;
  }

  private registerAfterPasswordCheck(): void {
    this.http.post<any>('https://localhost:7226/api/Password', { thePassword: this.password }).subscribe({
      next: (result) => {
        if (result.level < 2) {
          this.errorMessage = 'Password is too weak. Use a mix of letters, numbers, and special characters.';
          return;
        }
        this.http.post<any>(this.apiUrl, {
          userName: this.username,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName
        }).subscribe({
          next: (user) => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', user.userName);
            localStorage.setItem('userId', user.userId.toString());
            localStorage.setItem('isAdmin', user.isAdmin.toString());
            localStorage.setItem('firstName', user.firstName);
            localStorage.setItem('lastName', user.lastName);
            this.authService['isLoggedInSubject'].next(true);
            this.router.navigate(['/home']);
          },
          error: () => { this.errorMessage = 'Registration failed. Please try again.'; }
        });
      },
      error: () => { this.errorMessage = 'Could not validate password strength.'; }
    });
  }

  login(): void {
    if (!this.validate(false)) return;
    this.http.post<any>(`${this.apiUrl}/login`, {
      userName: this.username,
      password: this.password
    }).subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', user.userName);
          localStorage.setItem('userId', user.userId.toString());
          localStorage.setItem('isAdmin', user.isAdmin.toString());
          localStorage.setItem('firstName', user.firstName);
          localStorage.setItem('lastName', user.lastName);
          this.authService['isLoggedInSubject'].next(true);
          
          // טען את הסל - אם יש ב-localStorage ישמור בשרת, אחרת יטען מהשרת
          setTimeout(() => {
            const localCart = localStorage.getItem('cart');
            if (localCart) {
              // יש סל מקומי - שמור אותו בשרת
              this.cartService.reloadCart();
            } else {
              // אין סל מקומי - טען מהשרת
              this.cartService.reloadCart();
            }
          }, 100);
          
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'User not found. Please register.';
          this.isRegisterMode = true;
        }
      },
      error: () => {
        this.errorMessage = 'User not found. Please register.';
        this.isRegisterMode = true;
      }
    });
  }

  register(): void {
    if (!this.validate(true)) return;
    this.registerAfterPasswordCheck();
  }

  switchMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }
}
