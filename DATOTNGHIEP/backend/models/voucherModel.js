const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String },
  discountType: { type: String, enum: ['percent', 'fixed'], required: true },
  discountValue: { type: Number,min:0, required: true }, 
  minOrderValue: { type: Number, min:0 }, 
  maxDiscountValue: { type: Number, min:0 }, 
  quantity: { type: Number, default: 1 }, 
  used: { type: Number, default: 0 }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }, 
  isSpinWheelVoucher: { type: Boolean, default: false }, 
  weight: { type: Number, default: 0 },
  isNoPrize: { type: Boolean, default: false }, 
}, { timestamps: true });

const voucherModel = mongoose.model('vouchers', voucherSchema);
module.exports = voucherModel;
