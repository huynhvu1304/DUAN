import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllOrders() {
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return this.http.get<{ orders: any[] }>(`${this.baseUrl}/orders/admin`, headers);
  }

  updateOrderStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status`, { status }, headers);
  }

  updatePaymentStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.baseUrl}/orders/${orderId}/payment-status`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getRevenue(): Observable<{ totalRevenue: number }> {
    return this.http.get<{ totalRevenue: number }>(`${this.baseUrl}/orders/revenue`);
  }

  adminCancelOrder(orderId: string, cancelReasonText: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.baseUrl}/orders/${orderId}/cancel-by-admin`,
      { cancelReasonText }, 
      { headers }
    );
  }
    getOrderDetail(orderId: string): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}/${orderId}`);
  }
}
