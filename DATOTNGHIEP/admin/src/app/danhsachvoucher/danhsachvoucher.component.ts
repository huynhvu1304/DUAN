import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VouchersService } from '../vouchers.service';
import { Voucher, CreateVoucherRequest, VoucherFilter, SpinWheelVoucher } from '../vouchers-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-danhsachvoucher',
  templateUrl: './danhsachvoucher.component.html',
  styleUrls: ['./danhsachvoucher.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class DanhsachvoucherComponent implements OnInit {
  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];
  spinWheelVouchers: SpinWheelVoucher[] = [];
  loading = false;
  showAddModal = false;
  showEditModal = false;
  showFilterModal = false;
  selectedVoucher: Voucher | null = null;
  showDeleted = false;


  filter: VoucherFilter = {
    code: '',
    status: 'all',
    startDate: undefined,
    endDate: undefined,
    isSpinWheelVoucher: undefined,
    isDeleted: false
  };

  newVoucher: CreateVoucherRequest = {
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountValue: 0,
    quantity: 1,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
    isSpinWheelVoucher: false,
    weight: 0,
  };

  constructor(private vouchersService: VouchersService) { }

  ngOnInit(): void {
    this.loadVouchers();
    this.loadSpinWheelVouchers();
  }

  loadVouchers(): void {
    this.loading = true;
    const serviceCall = this.showDeleted ? 
      this.vouchersService.getAllVouchersWithDeleted() : 
      this.vouchersService.getAllVouchers();

    serviceCall.subscribe({
      next: (data) => {
        this.vouchers = data;
        this.filteredVouchers = [...this.vouchers];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vouchers:', error);
        this.loading = false;
      }
    });
  }

  loadSpinWheelVouchers(): void {
    this.vouchersService.getSpinWheelVouchers().subscribe({
      next: (data) => {
        this.spinWheelVouchers = data.vouchers;
      },
      error: (error) => {
        console.error('Error loading spin wheel vouchers:', error);
      }
    });
  }

  
  applyFilter(): void {
    this.loading = true;
    this.vouchersService.getVouchersWithFilter(this.filter).subscribe({
      next: (data) => {
        this.filteredVouchers = data;
        this.loading = false;
        this.closeFilterModal();
        this.showSuccessToast(`Tìm thấy ${data.length} voucher`);
      },
      error: (error) => {
        console.error('Error filtering vouchers:', error);
        this.loading = false;
        this.showErrorToast('Lỗi khi tìm kiếm voucher');
      }
    });
  }

  clearFilter(): void {
    this.filter = {
      code: '',
      status: 'all',
      startDate: undefined,
      endDate: undefined,
      isSpinWheelVoucher: undefined,
      isDeleted: false
    };
    this.filteredVouchers = [...this.vouchers];
    this.closeFilterModal();
  }

  openFilterModal(): void {
    this.showFilterModal = true;
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
  }

  toggleShowDeleted(): void {
    this.showDeleted = !this.showDeleted;
    this.loadVouchers();
  }

  openAddModal(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.newVoucher = {
      code: '',
      description: '',
      discountType: 'percent',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscountValue: 0,
      quantity: 1,
      startDate: now,
      endDate: tomorrow,
      isActive: true,
      isSpinWheelVoucher: false,
      weight: 0,
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(voucher: Voucher): void {
    this.selectedVoucher = {
      ...voucher,
      startDate: new Date(voucher.startDate),
      endDate: new Date(voucher.endDate)
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedVoucher = null;
  }

  createVoucher(): void {
    if (this.validateVoucher(this.newVoucher)) {
      this.showLoading('Đang tạo voucher...');
      this.vouchersService.createVoucher(this.newVoucher).subscribe({
        next: (response) => {
          Swal.close();
          this.vouchers.push(response);
          this.filteredVouchers = [...this.vouchers];
          this.closeAddModal();
          this.showSuccessToast('Tạo voucher thành công!');
          this.loadSpinWheelVouchers(); 
        },
       error: (error) => {   
  Swal.close();
  if (error.error && error.error.message) {
    this.showErrorToast(error.error.message);
  } else {
    this.showErrorToast('Có lỗi xảy ra khi tạo voucher!');
  }
}
      });
    }
  }

  updateVoucher(): void {
    if (this.selectedVoucher && this.validateVoucher(this.selectedVoucher, true)) {
      this.showLoading('Đang cập nhật voucher...');
      const { _id, ...updateData } = this.selectedVoucher;
      this.vouchersService.updateVoucher(_id!, updateData).subscribe({
        next: (response) => {
          Swal.close();
          const index = this.vouchers.findIndex(v => v._id === _id);
          if (index !== -1) {
            this.vouchers[index] = response;
          }
          this.filteredVouchers = [...this.vouchers];
          this.closeEditModal();
          this.showSuccessToast('Cập nhật voucher thành công!');
          this.loadSpinWheelVouchers(); 
        },
        error: (error) => {   
          Swal.close();
          if (error.error && error.error.message) {
            this.showErrorToast(error.error.message);
          } else {
            this.showErrorToast('Có lỗi xảy ra khi cập nhật voucher!');
          }
        }
      });
    }
  }

  toggleDeleteVoucher(voucher: Voucher): void {
    const action = voucher.isDeleted ? 'khôi phục' : 'xóa';
    const confirmText = voucher.isDeleted ? 
      'Bạn có chắc muốn khôi phục voucher này?' : 
      'Bạn có chắc muốn xóa voucher này?';

    Swal.fire({
      title: 'Xác nhận',
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading(`Đang ${action} voucher...`);
        this.vouchersService.toggleDeleteVoucher(voucher._id!).subscribe({
          next: (response) => {
            Swal.close();
            const index = this.vouchers.findIndex(v => v._id === voucher._id);
            if (index !== -1) {
              this.vouchers[index] = response.voucher;
            }
            this.filteredVouchers = [...this.vouchers];
            this.showSuccessToast(response.message);
          },
          error: (error) => {
            console.error('Error toggling voucher delete:', error);
            Swal.close();
            this.showErrorToast(`Lỗi khi ${action} voucher!`);
          }
        });
      }
    });
  }

 validateVoucher(voucher: CreateVoucherRequest | Voucher, isUpdate = false): boolean {
  if (!voucher.code || !voucher.description) {
    this.showWarningToast('Vui lòng điền đầy đủ thông tin!');
    return false;
  }

  // xác định đây có phải NO_PRIZE hay không
  const isNoPrize = (voucher as any).isNoPrize === true || (voucher as any).code === 'NO_PRIZE';

  // Nếu không phải NO_PRIZE thì kiểm tra discount bình thường
  if (!isNoPrize) {
    // bắt buộc có giá trị giảm
    if (voucher.discountValue == null || voucher.discountValue <= 0) {
      this.showWarningToast('Giá trị giảm giá phải lớn hơn 0!');
      return false;
    }

    // nếu là percent, giới hạn 1..100
    if (voucher.discountType === 'percent') {
      if (voucher.discountValue <= 0 || voucher.discountValue > 100) {
        this.showWarningToast('Phần trăm giảm phải lớn hơn 0 và nhỏ hơn hoặc bằng 100!');
        return false;
      }
    }
  } else {
    // nếu là NO_PRIZE: cho phép discountValue = 0; (nếu muốn, ẩn trường discount trên UI)
  }

  if (voucher.quantity <= 0) {
    this.showWarningToast('Số lượng voucher phải lớn hơn 0!');
    return false;
  }
  if (voucher.startDate >= voucher.endDate) {
    this.showWarningToast('Ngày kết thúc phải sau ngày bắt đầu!');
    return false;
  }

  // Kiểm tra nếu là voucher vòng quay, phải có trọng số > 0
  if (voucher.isSpinWheelVoucher && (!voucher.weight || voucher.weight <= 0)) {
    this.showWarningToast('Voucher vòng quay phải có trọng số lớn hơn 0!');
    return false;
  }

  return true;
}

  onDateChange(voucher: CreateVoucherRequest | Voucher): void {
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    if (endDate <= startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      voucher.endDate = newEndDate;
    }
  }

  
  calculateWinProbability(voucher: Voucher): number {
    return this.vouchersService.calculateWinProbability(voucher, this.vouchers);
  }


  calculateSpinWheelWinProbability(voucher: SpinWheelVoucher): number {
    const totalWeight = this.spinWheelVouchers.reduce((sum, v) => sum + v.weight, 0);
    if (totalWeight === 0) return 0;
    return (voucher.weight / totalWeight) * 100;
  }


  getVoucherStatus(voucher: Voucher): 'active' | 'inactive' | 'expired' {
    return this.vouchersService.getVoucherStatus(voucher);
  }


  isVoucherUsable(voucher: Voucher): boolean {
    return this.vouchersService.isVoucherUsable(voucher);
  }

  getMinEndDate(startDate: Date): string {
    const minDate = new Date(startDate);
    minDate.setMinutes(minDate.getMinutes() + 1);
    return this.formatDateForInput(minDate);
  }

  getMinDate(originalDate: Date): string {
    const today = new Date();
    const original = new Date(originalDate);
    return this.formatDateForInput(original > today ? original : today);
  }

  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getDiscountText(voucher: Voucher): string {
    if (voucher.discountType === 'percent') {
      return `${voucher.discountValue}%` + (voucher.maxDiscountValue ? ` (tối đa ${this.formatCurrency(voucher.maxDiscountValue)})` : '');
    } else {
      return this.formatCurrency(voucher.discountValue);
    }
  }

  getStatusClass(voucher: Voucher): string {
    const status = this.getVoucherStatus(voucher);
    if (voucher.isDeleted) return 'deleted';
    return status;
  }

  getStatusText(voucher: Voucher): string {
    const status = this.getVoucherStatus(voucher);
    if (voucher.isDeleted) return 'Đã xóa';
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'expired': return 'Đã hết hạn';
      default: return 'Không xác định';
    }
  }

  getTodayString(): string {
    return this.formatDateForInput(new Date());
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  formatDateForDisplay(date: Date): string {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isDateInPast(date: Date): boolean {
    return new Date(date) < new Date();
  }

  // Các hàm hiển thị toast message
  private showLoading(title: string): void {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }

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