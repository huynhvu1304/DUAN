import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VouchersService } from '../vouchers.service';
import { SpinWheelConfig, UpdateSpinWheelConfigRequest } from '../vouchers-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-spin-wheel-config',
  templateUrl: './spin-wheel-config.component.html',
  styleUrls: ['./spin-wheel-config.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SpinWheelConfigComponent implements OnInit {
  config: SpinWheelConfig | null = null;
  loading = false;
  saving = false;

  // Form data
  formData: UpdateSpinWheelConfigRequest = {
    cooldownValue: 24,
    cooldownUnit: 'hours',
    isActive: true,
    description: ''
  };

  // Options cho đơn vị thời gian
  timeUnits = [
    { value: 'seconds', label: 'Giây' },
    { value: 'minutes', label: 'Phút' },
    { value: 'hours', label: 'Giờ' },
    { value: 'days', label: 'Ngày' }
  ];

  constructor(private vouchersService: VouchersService) { }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.loading = true;
    this.vouchersService.getSpinWheelConfig().subscribe({
      next: (data) => {
        this.config = data;
        this.updateFormData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading config:', error);
        this.loading = false;
        this.showErrorToast('Lỗi khi tải cấu hình');
      }
    });
  }

  updateFormData(): void {
    if (this.config) {
      this.formData.cooldownValue = this.vouchersService.convertCooldownToDisplayValue(
        this.config.cooldownSeconds, 
        this.config.cooldownUnit
      );
      this.formData.cooldownUnit = this.config.cooldownUnit;
      this.formData.isActive = this.config.isActive;
      this.formData.description = this.config.description;
    }
  }

  onUnitChange(): void {
    // Khi thay đổi đơn vị, cập nhật lại giá trị
    if (this.config) {
      this.formData.cooldownValue = this.vouchersService.convertCooldownToDisplayValue(
        this.config.cooldownSeconds, 
        this.formData.cooldownUnit
      );
    }
  }

  saveConfig(): void {
    if (this.validateForm()) {
      this.saving = true;
      this.vouchersService.updateSpinWheelConfig(this.formData).subscribe({
        next: (response) => {
          this.saving = false;
          this.showSuccessToast('Cập nhật cấu hình thành công!');
          this.loadConfig(); // Reload để lấy dữ liệu mới
        },
        error: (error) => {
          console.error('Error updating config:', error);
          this.saving = false;
          this.showErrorToast('Lỗi khi cập nhật cấu hình');
        }
      });
    }
  }

  validateForm(): boolean {
    if (this.formData.cooldownValue <= 0) {
      this.showWarningToast('Thời gian chờ phải lớn hơn 0!');
      return false;
    }
    if (!this.formData.description.trim()) {
      this.showWarningToast('Vui lòng nhập mô tả!');
      return false;
    }
    return true;
  }

  getCurrentCooldownText(): string {
    if (this.config) {
      return this.vouchersService.formatCooldownTime(this.config.cooldownSeconds);
    }
    return 'Chưa có cấu hình';
  }

  getUnitLabel(unit: string): string {
    const found = this.timeUnits.find(u => u.value === unit);
    return found ? found.label : unit;
  }

  // Toast methods
  private showSuccessToast(text: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  private showErrorToast(text: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  private showWarningToast(text: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Cảnh báo!',
      text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
}
