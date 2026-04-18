import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  orderId?: number;
  userId: number;
  orderDate?: Date;
  status: 'draft' | 'completed';
  currentStatus?: boolean;
  ordersSum?: number;
  totalAmount?: number;
  dashboardCode?: string;
  generatedCode?: string;
  codeApproved?: boolean;
  ordersItems: OrderItem[];
}

export interface OrderItem {
  orderItemId?: number;
  productId: number;
  orderId?: number;
  quantity: number;
  price?: number;
  product?: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7226/api/Orders';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  approveCode(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/approve`, {});
  }

  completeOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/complete`, {});
  }

  updateOrder(orderId: number, orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}`, orderData);
  }

  suspendOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/suspend`, {});
  }

  downloadCode(orderId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}/download`, { responseType: 'blob' });
  }
}
