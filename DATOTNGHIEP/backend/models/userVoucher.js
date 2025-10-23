const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userVoucherSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  voucher_id: { type: Schema.Types.ObjectId, ref: "vouchers", required: true },

  // Snapshot của voucher tại thời điểm nhận
  voucherSnapshot: {
    code: { type: String, required: true },
    description: { type: String },
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscountValue: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isSpinWheelVoucher: { type: Boolean, default: false },
    weight: { type: Number, default: 0 }
  },
  received_at: { type: Date, default: Date.now },
  usedAt: { type: Date, default: null },

  status: {
    type: String,
    enum: ["received", "used", "expired", "cancelled"],
    default: "received"
  }
});

module.exports = mongoose.model("UserVouchers", userVoucherSchema);
