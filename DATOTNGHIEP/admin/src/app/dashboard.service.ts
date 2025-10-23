import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// Định nghĩa interface cho cấu trúc dữ liệu doanh thu trả về từ backend
// Đã loại bỏ 'compareData' vì không còn dùng tính năng so sánh
export interface RevenueChartResponse {
  labels: string[];
  data: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboardOverviewCounts(): Observable<{ totalUsers: number, totalProducts: number, totalOrders: number, totalRevenue: number, totalStock: number, pendingOrdersCount: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ totalUsers: number, totalProducts: number, totalOrders: number, totalRevenue: number, totalStock: number, pendingOrdersCount: number }>(`${this.apiUrl}/dashboards/counts`, { headers });
  }

  /**
   * Lấy dữ liệu biểu đồ doanh thu từ backend.
   * Chỉ còn hỗ trợ 'daily' và 'monthly'.
   * Không còn tham số 'compare'.
   * @param period Khoảng thời gian (daily, monthly).
   * @returns Observable với dữ liệu biểu đồ doanh thu.
   */
  getRevenueChartData(period: 'daily' | 'monthly' = 'monthly'): Observable<RevenueChartResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams()
      .set('period', period); // Chỉ gửi tham số 'period', không còn 'compare'

    return this.http.get<RevenueChartResponse>(`${this.apiUrl}/dashboards/revenue-chart-data`, { headers, params });
  }

  getOrderStatusDistribution(): Observable<{ name: string, value: number }[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ name: string, value: number }[]>(`${this.apiUrl}/dashboards/order-status-distribution`, { headers });
  }

  getTopSellingProductsChartData(): Observable<{ _id: string, totalQuantitySold: number }[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ _id: string, totalQuantitySold: number }[]>(`${this.apiUrl}/dashboards/top-selling-products-chart-data`, { headers });
  }

  getRecentOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/dashboards/recent-orders`, { headers });
  }
}
