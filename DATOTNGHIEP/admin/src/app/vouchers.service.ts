import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voucher, CreateVoucherRequest, UpdateVoucherRequest, VoucherFilter, SpinWheelVoucher, SpinWheelConfig, UpdateSpinWheelConfigRequest } from './vouchers-interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  private apiUrl = `${environment.apiUrl}/vouchers`;
  private spinWheelUrl = `${environment.apiUrl}/spin-wheel`;
  private spinWheelConfigUrl = `${environment.apiUrl}/spin-wheel-config`;

  constructor(private http: HttpClient) { }

  // Lấy tất cả voucher (chỉ voucher chưa bị xóa)
  getAllVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(this.apiUrl);
  }

  // Lấy tất cả voucher bao gồm đã xóa
  getAllVouchersWithDeleted(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${this.apiUrl}/all-with-deleted`);
  }

  // Lấy voucher với filter
  getVouchersWithFilter(filter: VoucherFilter): Observable<Voucher[]> {
    let params = new HttpParams();
    
    if (filter.code) {
      params = params.set('code', filter.code);
    }
    
    if (filter.status && filter.status !== 'all') {
      params = params.set('status', filter.status);
    }
    
    if (filter.startDate) {
      params = params.set('startDate', filter.startDate.toISOString());
    }
    
    if (filter.endDate) {
      params = params.set('endDate', filter.endDate.toISOString());
    }
    
    if (filter.isSpinWheelVoucher !== undefined) {
      params = params.set('isSpinWheelVoucher', filter.isSpinWheelVoucher.toString());
    }
    
    if (filter.isDeleted !== undefined) {
      params = params.set('isDeleted', filter.isDeleted.toString());
    }

    return this.http.get<Voucher[]>(`${this.apiUrl}/filter`, { params });
  }

  // Tạo voucher mới
  createVoucher(voucher: CreateVoucherRequest): Observable<Voucher> {
    return this.http.post<Voucher>(`${this.apiUrl}/createVoucher`, voucher);
  }

  // Cập nhật voucher
  updateVoucher(id: string, voucher: UpdateVoucherRequest): Observable<Voucher> {
    return this.http.put<Voucher>(`${this.apiUrl}/${id}`, voucher);
  }

  // Lấy voucher theo ID
  getVoucherById(id: string): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.apiUrl}/${id}`);
  }

  // Soft delete/restore voucher
  toggleDeleteVoucher(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/toggle-delete`, {});
  }

  // Lấy danh sách voucher cho vòng quay
  getSpinWheelVouchers(): Observable<{vouchers: SpinWheelVoucher[], hasVouchers: boolean, message: string}> {
    return this.http.get<{vouchers: SpinWheelVoucher[], hasVouchers: boolean, message: string}>(`${this.spinWheelUrl}/vouchers`);
  }

  // Lấy tất cả voucher có thể tham gia vòng quay
  getAllSpinWheelVouchers(): Observable<{vouchers: SpinWheelVoucher[], hasVouchers: boolean, message: string}> {
    return this.http.get<{vouchers: SpinWheelVoucher[], hasVouchers: boolean, message: string}>(`${this.spinWheelUrl}`);
  }

  // Tính xác suất trúng voucher
  calculateWinProbability(voucher: Voucher, allVouchers: Voucher[]): number {
    const spinWheelVouchers = allVouchers.filter(v => v.isSpinWheelVoucher && v.weight && v.weight > 0);
    const totalWeight = spinWheelVouchers.reduce((sum, v) => sum + (v.weight || 0), 0);
    
    if (totalWeight === 0) return 0;
    
    return ((voucher.weight || 0) / totalWeight) * 100;
  }

  // Kiểm tra trạng thái voucher
  getVoucherStatus(voucher: Voucher): 'active' | 'inactive' | 'expired' {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (!voucher.isActive) return 'inactive';
    if (now < startDate || now > endDate) return 'expired';
    return 'active';
  }

  // Kiểm tra voucher có thể sử dụng không
  isVoucherUsable(voucher: Voucher): boolean {
    const status = this.getVoucherStatus(voucher);
    return status === 'active' && voucher.used < voucher.quantity;
  }

  // Spin Wheel Config methods
  getSpinWheelConfig(): Observable<SpinWheelConfig> {
    return this.http.get<SpinWheelConfig>(this.spinWheelConfigUrl);
  }

  updateSpinWheelConfig(config: UpdateSpinWheelConfigRequest): Observable<any> {
    return this.http.put<any>(this.spinWheelConfigUrl, config);
  }

  // Helper method để chuyển đổi cooldownSeconds thành giá trị hiển thị
  convertCooldownToDisplayValue(cooldownSeconds: number, unit: string): number {
    switch (unit) {
      case 'seconds':
        return cooldownSeconds;
      case 'minutes':
        return cooldownSeconds / 60;
      case 'hours':
        return cooldownSeconds / 3600;
      case 'days':
        return cooldownSeconds / 86400;
      default:
        return cooldownSeconds;
    }
  }

  // Helper method để format thời gian cooldown
  formatCooldownTime(cooldownSeconds: number): string {
    if (cooldownSeconds < 60) {
      return `${cooldownSeconds} giây`;
    } else if (cooldownSeconds < 3600) {
      return `${Math.floor(cooldownSeconds / 60)} phút`;
    } else if (cooldownSeconds < 86400) {
      return `${Math.floor(cooldownSeconds / 3600)} giờ`;
    } else {
      return `${Math.floor(cooldownSeconds / 86400)} ngày`;
    }
  }
}
