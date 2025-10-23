const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  voucher_id: { type: mongoose.Schema.Types.ObjectId, ref: "vouchers", required: false },
  receiverName: String,
  receiverPhone: String,
  receiverAddress: String,
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"], 
    default: "pending" 
  },
  cancelReason: {
    type: String,
    enum: ["changed_mind", "ordered_wrong", "found_cheaper", "other"],
    default: "other"
  },
  cancelReasonText: { type: String, default: "" },
}, { timestamps: true });

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;