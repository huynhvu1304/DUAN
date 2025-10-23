export interface Voucher {
  _id?: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  quantity: number;
  used: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isDeleted?: boolean; // Thêm trường soft delete
  isSpinWheelVoucher?: boolean; // Voucher có thể dùng cho vòng quay
  weight?: number; // Trọng số cho vòng quay may mắn
  createdAt?: Date;
  updatedAt?: Date;
  isNoPrize: boolean; // Thêm trường để xác định voucher không có giải thưởng
}

export interface CreateVoucherRequest {
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isSpinWheelVoucher: boolean;
  weight?: number; // Trọng số cho vòng quay may mắn
}

export interface UpdateVoucherRequest {
  code?: string;
  description?: string;
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  quantity?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  isDeleted?: boolean; // Thêm trường soft delete
  isSpinWheelVoucher?: boolean; // Voucher có thể dùng cho vòng quay
  weight?: number; // Trọng số cho vòng quay may mắn
}

// Interface cho filter voucher
export interface VoucherFilter {
  code?: string;
  status?: 'active' | 'inactive' | 'expired' | 'all';
  startDate?: Date;
  endDate?: Date;
  isSpinWheelVoucher?: boolean;
  isDeleted?: boolean;
}

// Interface cho spin wheel voucher
export interface SpinWheelVoucher {
  _id: string;
  code: string;
  description: string;
  weight: number;
  remaining: number;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  endDate: Date;
}

// Interface cho cấu hình vòng quay
export interface SpinWheelConfig {
  _id?: string;
  cooldownSeconds: number;
  cooldownUnit: 'seconds' | 'minutes' | 'hours' | 'days';
  isActive: boolean;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSpinWheelConfigRequest {
  cooldownValue: number;
  cooldownUnit: 'seconds' | 'minutes' | 'hours' | 'days';
  isActive: boolean;
  description: string;
}
