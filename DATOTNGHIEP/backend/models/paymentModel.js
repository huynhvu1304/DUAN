const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true, unique: true }, // Mỗi order chỉ có 1 payment
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'vnpay'], required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'unpaid', 'failed', 'refunded'],
        default: 'pending'
    },
    // VNPAY specific fields
    vnp_TxnRef: { type: String, unique: true, sparse: true }, // Mã giao dịch của bạn tại VNPAY (thường là orderId)
    vnp_Amount: { type: Number },
    vnp_BankCode: { type: String },
    // vnp_CardType: { type: String },
    vnp_OrderInfo: { type: String },
    vnp_TmnCode: { type: String },
    vnp_TransactionNo: { type: String }, // Mã giao dịch bên VNPAY
    vnp_TransactionStatus: { type: String },
    vnp_SecureHash: { type: String },
    // You can add more VNPAY fields as needed
}, { timestamps: true });

const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel; 
